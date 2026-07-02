# 🧪 TESTES - Estratégia e Setup

**Status**: 📋 Template  
**Cobertura Target**: 80%+  
**Frameworks**: JUnit 5 + Mockito + AssertJ

---

## 📊 Estratégia de Testes

```
Unit Tests (60%)
└─ Domain logic
└─ Services
└─ Repositories queries
└─ Utils/Helpers

Integration Tests (25%)
└─ Database access
└─ Spring context loading
└─ Transaction handling

E2E Tests (15%)
└─ REST endpoints
└─ Authentication flows
└─ Critical business flows
```

---

## 🏗️ Estrutura de Teste

### Test Classes Location
```
src/test/java/com/clinica/alles/
├── domain/
│   ├── usuario/
│   │   ├── entity/UsuarioTest.java
│   │   └── repository/UsuarioRepositoryTest.java
│   ├── profissional/
│   │   ├── entity/ProfissionalTest.java
│   │   ├── repository/ProfissionalRepositoryTest.java
│   │   └── service/ProfissionalDomainServiceTest.java
│   ├── paciente/
│   ├── atendimento/
│   └── pagamento/
│
├── application/
│   ├── profissional/
│   │   └── usecase/CadastrarProfissionalUseCaseTest.java
│   └── ...
│
├── presentation/
│   ├── controller/
│   │   ├── AuthControllerTest.java
│   │   ├── ProfissionalControllerTest.java
│   │   └── ...
│   └── ...
│
├── fixture/
│   ├── ProfissionalFixture.java
│   ├── PacienteFixture.java
│   ├── AtendimentoFixture.java
│   └── ...
│
└── config/
    └── TestConfig.java
```

---

## 🔨 Setup de Testes

### TestConfig (Configuração Global)

```java
@Configuration
public class TestConfig {
    
    @Bean
    public Clock clock() {
        return Clock.fixed(Instant.now(), ZoneId.of("America/Sao_Paulo"));
    }
    
    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
```

### Fixtures (Dados de Teste)

```java
public class ProfissionalFixture {
    
    public static Profissional umProfissionalValido() {
        return Profissional.builder()
            .id(1L)
            .nome("Dr. João da Silva")
            .cpf("12345678900")
            .especialidade(umEspecialidadeValida())
            .crm("CRM123456")
            .crefito("CREFITO123456")
            .bancoAgencia("0001")
            .bancoConta("123456-7")
            .tipoPagamento(TipoPagamento.FIXO_POR_CONSULTA)
            .valorConsultaParticular(new BigDecimal("150.00"))
            .valorConsultaPlano(new BigDecimal("100.00"))
            .descontoClinicaPercentual(new BigDecimal("20.00"))
            .ativo(true)
            .dataCadastro(LocalDateTime.now())
            .build();
    }
    
    public static Profissional umProfissionalComId(Long id) {
        Profissional prof = umProfissionalValido();
        prof.setId(id);
        return prof;
    }
}
```

---

## ✅ Exemplos de Testes

### Unit Test - Entity Validation

```java
@DisplayName("Profissional")
class ProfissionalTest {
    
    @Nested
    @DisplayName("validações")
    class ValidacoesTest {
        
        @Test
        @DisplayName("deve criar profissional com dados válidos")
        void deveCriarComDadosValidos() {
            // Arrange
            LocalDateTime agora = LocalDateTime.now();
            
            // Act
            Profissional prof = new Profissional(
                1L, "Dr. João", "12345678900", null, 
                "CRM123456", null, "0001", "123456-7",
                TipoPagamento.FIXO_POR_CONSULTA,
                new BigDecimal("150.00"), new BigDecimal("100.00"),
                null, new BigDecimal("20.00"), agora, agora, true
            );
            
            // Assert
            assertThat(prof)
                .isNotNull()
                .hasFieldOrPropertyWithValue("nome", "Dr. João")
                .hasFieldOrPropertyWithValue("ativo", true);
        }
        
        @Test
        @DisplayName("deve desativar profissional")
        void deveDesativar() {
            // Arrange
            Profissional prof = ProfissionalFixture.umProfissionalValido();
            
            // Act
            prof.desativar();
            
            // Assert
            assertThat(prof.getAtivo()).isFalse();
        }
    }
}
```

### Integration Test - Repository

```java
@SpringBootTest
@DataJpaTest
class ProfissionalRepositoryTest {
    
    @Autowired
    private IProfissionalRepository repository;
    
    @Autowired
    private TestEntityManager entityManager;
    
    @Test
    @DisplayName("deve encontrar profissional por CRM")
    void deveFindByCrm() {
        // Arrange
        Profissional prof = ProfissionalFixture.umProfissionalValido();
        entityManager.persistAndFlush(prof);
        
        // Act
        Optional<Profissional> resultado = repository.findByCrm("CRM123456");
        
        // Assert
        assertThat(resultado)
            .isPresent()
            .hasValueSatisfying(p -> assertThat(p.getNome()).isEqualTo("Dr. João da Silva"));
    }
    
    @Test
    @DisplayName("deve retornar vazio quando CRM não existe")
    void deveRetornarVazioQuandoCrmNaoExiste() {
        // Act
        Optional<Profissional> resultado = repository.findByCrm("INVALID");
        
        // Assert
        assertThat(resultado).isEmpty();
    }
}
```

### Controller Test - REST Endpoint

```java
@WebMvcTest(ProfissionalController.class)
@WithMockUser(roles = "ADMIN")
class ProfissionalControllerTest {
    
    @Autowired
    private MockMvc mockMvc;
    
    @MockBean
    private ProfissionalService profissionalService;
    
    @Test
    @DisplayName("deve retornar lista de profissionais")
    void deveListarProfissionais() throws Exception {
        // Arrange
        List<ProfissionalDTO> profissionais = List.of(
            new ProfissionalDTO(1L, "Dr. João", "Psicologia"),
            new ProfissionalDTO(2L, "Dr. Maria", "Fisioterapia")
        );
        
        when(profissionalService.listar()).thenReturn(profissionais);
        
        // Act & Assert
        mockMvc.perform(get("/api/profissionais"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$", hasSize(2)))
            .andExpect(jsonPath("$[0].nome", is("Dr. João")))
            .andExpect(jsonPath("$[1].nome", is("Dr. Maria")));
        
        verify(profissionalService).listar();
    }
    
    @Test
    @DisplayName("deve retornar 400 quando dados inválidos")
    void deveFalharComDadosInvalidos() throws Exception {
        // Act & Assert
        mockMvc.perform(post("/api/profissionais")
            .contentType(MediaType.APPLICATION_JSON)
            .content("{}"))
            .andExpect(status().isBadRequest());
    }
}
```

### Service Test - Business Logic

```java
@SpringBootTest
class ProfissionalServiceTest {
    
    @MockBean
    private IProfissionalRepository profissionalRepository;
    
    @MockBean
    private ApplicationEventPublisher eventPublisher;
    
    @Autowired
    private ProfissionalService profissionalService;
    
    @Test
    @DisplayName("deve cadastrar profissional e publicar evento")
    void deveCadastrarEPublicarEvento() {
        // Arrange
        CadastrarProfissionalDTO dto = new CadastrarProfissionalDTO(
            "Dr. João", "12345678900", 1L, "CRM123456", "CREFITO123456",
            new BigDecimal("150.00")
        );
        
        Profissional profissionalSalvo = ProfissionalFixture.umProfissionalComId(1L);
        
        when(profissionalRepository.save(any(Profissional.class)))
            .thenReturn(profissionalSalvo);
        
        // Act
        Profissional resultado = profissionalService.cadastrar(dto);
        
        // Assert
        assertThat(resultado).isNotNull();
        assertThat(resultado.getId()).isEqualTo(1L);
        
        verify(profissionalRepository, times(1)).save(any(Profissional.class));
        verify(eventPublisher, times(1)).publishEvent(any());
    }
    
    @Test
    @DisplayName("deve falhar se especialidade não existe")
    void deveFalharSeEspecialidadeInexistente() {
        // Arrange
        CadastrarProfissionalDTO dto = new CadastrarProfissionalDTO(
            "Dr. João", "12345678900", 999L, "CRM123456", "CREFITO123456",
            new BigDecimal("150.00")
        );
        
        when(especialidadeRepository.findById(999L))
            .thenReturn(Optional.empty());
        
        // Act & Assert
        assertThatThrownBy(() -> profissionalService.cadastrar(dto))
            .isInstanceOf(ResourceNotFoundException.class)
            .hasMessageContaining("Especialidade");
    }
}
```

---

## 🔄 Test Data Builders

```java
public class ProfissionalDTOBuilder {
    
    private String nome = "Dr. João";
    private String cpf = "12345678900";
    private Long especialidadeId = 1L;
    private String crm = "CRM123456";
    private String crefito = "CREFITO123456";
    private BigDecimal valorConsulta = new BigDecimal("150.00");
    
    public ProfissionalDTOBuilder withNome(String nome) {
        this.nome = nome;
        return this;
    }
    
    public CadastrarProfissionalDTO build() {
        return new CadastrarProfissionalDTO(
            nome, cpf, especialidadeId, crm, crefito, valorConsulta
        );
    }
}

// Uso:
CadastrarProfissionalDTO dto = new ProfissionalDTOBuilder()
    .withNome("Dra. Maria")
    .build();
```

---

## 📊 Cobertura de Testes

### Comando para Gerar Relatório

```bash
# Com JaCoCo
mvn clean test jacoco:report

# Relatório em: target/site/jacoco/index.html

# Com IDE (IntelliJ)
Run → Run with Coverage
```

### Requisito de Cobertura

- **Domain Layer**: 100%
- **Services**: 85%+
- **Controllers**: 80%+
- **Repositories**: 80%+
- **Overall**: 80%+

---

## 🚀 Executar Testes

```bash
# Todos os testes
mvn test

# Com output detalhado
mvn test -X

# Teste específico
mvn test -Dtest=ProfissionalServiceTest

# Sem rodar testes (skip)
mvn clean install -DskipTests

# Com falha rápida (fail at end)
mvn test -ff

# Paralelo (faster)
mvn test -T 1C
```

---

## 🎯 Checklist de Testes

- [ ] Unit tests para cada Entity
- [ ] Unit tests para cada Service
- [ ] Integration tests para Repositories
- [ ] Controller tests para todos os endpoints
- [ ] Testes de autenticação/autorização
- [ ] Testes de validação de entrada
- [ ] Testes de exceções customizadas
- [ ] Cobertura > 80%
- [ ] Testes de integrações (JWT, BD)
- [ ] Testes E2E dos fluxos críticos

