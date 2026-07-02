# 🚀 GUIA DE DESENVOLVIMENTO - BACKEND ALLES

**Status**: ⏳ Em Construção  
**Stack**: Java 17 + Spring Boot 3.x + MySQL 8.x  
**Data**: 02/07/2026

---

## 📋 ÍNDICE

1. [Setup Inicial](#setup-inicial)
2. [Estrutura de Pastas](#estrutura-de-pastas)
3. [Dependências Maven](#dependências-maven)
4. [Entities e Repositories](#entities-e-repositories)
5. [Autenticação JWT](#autenticação-jwt)
6. [Testes](#testes)
7. [Troubleshooting](#troubleshooting)

---

## Setup Inicial

### Pré-requisitos
- Java 17+
- Maven 3.8+
- MySQL 8.0+
- Docker (opcional, recomendado)
- Git

### 1. Inicializar Banco de Dados (Docker)

```bash
cd /home/wsl/projetos/alles

# Iniciar MySQL
docker-compose up -d mysql

# Verificar status
docker-compose ps

# Acessar MySQL (opcional)
docker exec -it alles-mysql mysql -u root -proot alles
```

O banco estará em: `localhost:3306`  
PhpMyAdmin: `http://localhost:8081`

### 2. Clonar/Estruturar Backend

```bash
# Navegar até pasta alles
cd /home/wsl/projetos/alles

# Backend já será criado por script
```

### 3. Compilar Backend

```bash
cd backend
mvn clean install

# Ou apenas compilar
mvn compile

# Executar testes
mvn test
```

### 4. Iniciar Backend

```bash
mvn spring-boot:run

# Ou com IDE
# Right-click → Run AllesBackendApplication.java
```

Backend estará em: `http://localhost:8080/api`  
Swagger UI: `http://localhost:8080/api/swagger-ui.html`

---

## Estrutura de Pastas

```
backend/
├── src/
│   ├── main/
│   │   ├── java/com/clinica/alles/
│   │   │   ├── AllesBackendApplication.java ................... Main class
│   │   │   │
│   │   │   ├── common/
│   │   │   │   ├── config/
│   │   │   │   │   ├── SecurityConfig.java ................... Spring Security
│   │   │   │   │   ├── WebConfig.java ........................ CORS, etc
│   │   │   │   │   └── AuditorAwareConfig.java ............... Auditoria
│   │   │   │   ├── exception/
│   │   │   │   │   ├── BusinessException.java
│   │   │   │   │   ├── ResourceNotFoundException.java
│   │   │   │   │   ├── GlobalExceptionHandler.java
│   │   │   │   │   └── ErrorResponse.java
│   │   │   │   ├── security/
│   │   │   │   │   ├── JwtTokenProvider.java
│   │   │   │   │   ├── JwtAuthenticationFilter.java
│   │   │   │   │   ├── JwtProperties.java
│   │   │   │   │   └── UserDetailsServiceImpl.java
│   │   │   │   ├── dto/
│   │   │   │   │   ├── LoginRequestDTO.java
│   │   │   │   │   ├── LoginResponseDTO.java
│   │   │   │   │   └── PaginationDTO.java
│   │   │   │   ├── util/
│   │   │   │   │   └── DateUtil.java
│   │   │   │   └── constants/
│   │   │   │       └── ErrorMessages.java
│   │   │   │
│   │   │   ├── domain/
│   │   │   │   ├── usuario/
│   │   │   │   │   ├── entity/Usuario.java
│   │   │   │   │   ├── entity/Perfil.java
│   │   │   │   │   ├── entity/value/Email.java
│   │   │   │   │   └── repository/IUsuarioRepository.java
│   │   │   │   │
│   │   │   │   ├── especialidade/
│   │   │   │   │   ├── entity/Especialidade.java
│   │   │   │   │   └── repository/IEspecialidadeRepository.java
│   │   │   │   │
│   │   │   │   ├── profissional/
│   │   │   │   │   ├── entity/Profissional.java
│   │   │   │   │   ├── entity/value/CRM.java
│   │   │   │   │   ├── entity/value/DadosBancarios.java
│   │   │   │   │   ├── entity/enums/TipoPagamento.java
│   │   │   │   │   ├── repository/IProfissionalRepository.java
│   │   │   │   │   └── service/ProfissionalDomainService.java
│   │   │   │   │
│   │   │   │   ├── paciente/
│   │   │   │   │   ├── entity/Paciente.java
│   │   │   │   │   ├── entity/value/CPF.java
│   │   │   │   │   ├── repository/IPacienteRepository.java
│   │   │   │   │   └── service/PacienteDomainService.java
│   │   │   │   │
│   │   │   │   ├── planosasaude/
│   │   │   │   │   ├── entity/PlanoSaude.java
│   │   │   │   │   ├── entity/CoberturaProcedimento.java
│   │   │   │   │   ├── repository/IPlanoSaudeRepository.java
│   │   │   │   │   └── service/PlanoSaudeDomainService.java
│   │   │   │   │
│   │   │   │   └── atendimento/
│   │   │   │       ├── entity/Atendimento.java
│   │   │   │       ├── entity/Prontuario.java
│   │   │   │       ├── entity/Prescricao.java
│   │   │   │       ├── entity/enums/TipoAtendimento.java
│   │   │   │       ├── entity/enums/StatusAtendimento.java
│   │   │   │       ├── repository/IAtendimentoRepository.java
│   │   │   │       ├── event/AtendimentoCriadoEvent.java
│   │   │   │       └── service/AtendimentoDomainService.java
│   │   │   │
│   │   │   ├── application/
│   │   │   │   ├── profissional/
│   │   │   │   │   ├── dto/CadastrarProfissionalDTO.java
│   │   │   │   │   ├── dto/ProfissionalResponseDTO.java
│   │   │   │   │   └── usecase/CadastrarProfissionalUseCase.java
│   │   │   │   ├── paciente/
│   │   │   │   ├── atendimento/
│   │   │   │   └── pagamento/
│   │   │   │
│   │   │   ├── infrastructure/
│   │   │   │   ├── persistence/
│   │   │   │   │   ├── jpa/
│   │   │   │   │   │   ├── ProfissionalJpaRepository.java
│   │   │   │   │   │   └── ...
│   │   │   │   │   └── impl/
│   │   │   │   │       ├── ProfissionalRepositoryImpl.java
│   │   │   │   │       └── ...
│   │   │   │   ├── security/
│   │   │   │   ├── events/
│   │   │   │   └── audit/
│   │   │   │
│   │   │   └── presentation/
│   │   │       ├── controller/
│   │   │       │   ├── AuthController.java
│   │   │       │   ├── ProfissionalController.java
│   │   │       │   ├── PacienteController.java
│   │   │       │   ├── AtendimentoController.java
│   │   │       │   ├── PagamentoController.java
│   │   │       │   └── RelatorioController.java
│   │   │       └── dto/
│   │   │           └── ApiResponse.java
│   │   │
│   │   └── resources/
│   │       ├── application.yml
│   │       ├── application-dev.yml
│   │       ├── application-prod.yml
│   │       └── db/
│   │           ├── migration/
│   │           │   ├── V001__initial_schema.sql
│   │           │   ├── V002__add_indexes.sql
│   │           │   └── ...
│   │           └── schema.sql
│   │
│   └── test/
│       └── java/com/clinica/alles/
│           ├── domain/
│           │   ├── profissional/ProfissionalTest.java
│           │   └── ...
│           ├── application/
│           └── presentation/
│
├── pom.xml
├── Dockerfile
└── docker-compose.yml
```

---

## Dependências Maven

### pom.xml Structure

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" ...>
  
  <parent>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-parent</artifactId>
    <version>3.1.4</version>
  </parent>

  <dependencies>
    <!-- Spring Boot Web -->
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-web</artifactId>
    </dependency>

    <!-- Spring Data JPA -->
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-data-jpa</artifactId>
    </dependency>

    <!-- Spring Security -->
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-security</artifactId>
    </dependency>

    <!-- Validation -->
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-validation</artifactId>
    </dependency>

    <!-- MySQL Driver -->
    <dependency>
      <groupId>com.mysql</groupId>
      <artifactId>mysql-connector-java</artifactId>
      <version>8.0.33</version>
    </dependency>

    <!-- Lombok -->
    <dependency>
      <groupId>org.projectlombok</groupId>
      <artifactId>lombok</artifactId>
      <optional>true</optional>
    </dependency>

    <!-- JWT -->
    <dependency>
      <groupId>io.jsonwebtoken</groupId>
      <artifactId>jjwt-api</artifactId>
      <version>0.12.3</version>
    </dependency>
    <dependency>
      <groupId>io.jsonwebtoken</groupId>
      <artifactId>jjwt-impl</artifactId>
      <version>0.12.3</version>
      <scope>runtime</scope>
    </dependency>
    <dependency>
      <groupId>io.jsonwebtoken</groupId>
      <artifactId>jjwt-jackson</artifactId>
      <version>0.12.3</version>
      <scope>runtime</scope>
    </dependency>

    <!-- Springdoc (Swagger) -->
    <dependency>
      <groupId>org.springdoc</groupId>
      <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
      <version>2.1.0</version>
    </dependency>

    <!-- Testing -->
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-test</artifactId>
      <scope>test</scope>
    </dependency>
    <dependency>
      <groupId>org.springframework.security</groupId>
      <artifactId>spring-security-test</artifactId>
      <scope>test</scope>
    </dependency>
  </dependencies>

  <build>
    <plugins>
      <plugin>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-maven-plugin</artifactId>
      </plugin>
    </plugins>
  </build>
</project>
```

---

## Entities e Repositories

### Padrão de Entity

```java
@Entity
@Table(name = "profissional")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Profissional {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, unique = true)
    private String email;
    
    // Mais campos...
    
    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime dataCriacao;
    
    @UpdateTimestamp
    private LocalDateTime dataAtualizacao;
}
```

### Padrão de Repository

```java
@Repository
public interface IProfissionalRepository extends JpaRepository<Profissional, Long> {
    Optional<Profissional> findByEmail(String email);
    Optional<Profissional> findByCrm(String crm);
    List<Profissional> findByEspecialidadeIdAndAtivo(Long especialidadeId, Boolean ativo);
}
```

---

## Autenticação JWT

### Flow

```
1. POST /api/auth/login { email, password }
2. Backend valida credenciais
3. Se OK: gera JWT token
4. Cliente armazena token
5. Client envia token em header: Authorization: Bearer <token>
6. Backend valida JWT em cada request
```

### Implementação Básica

```java
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    
    private final JwtTokenProvider jwtTokenProvider;
    private final AuthenticationManager authenticationManager;
    
    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequestDTO dto) {
        try {
            Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(dto.getEmail(), dto.getSenha())
            );
            
            String token = jwtTokenProvider.gerarToken((Usuario) auth.getPrincipal());
            
            return ResponseEntity.ok(new LoginResponseDTO(token));
        } catch (AuthenticationException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(new ErrorResponse("Credenciais inválidas"));
        }
    }
}
```

---

## Testes

### Testes Unitários

```java
@SpringBootTest
@ExtendWith(MockitoExtension.class)
class ProfissionalServiceTest {
    
    @Mock
    private IProfissionalRepository profissionalRepository;
    
    @InjectMocks
    private ProfissionalService profissionalService;
    
    @Test
    @DisplayName("deve cadastrar profissional com sucesso")
    void testCadastrar() {
        // Arrange
        CadastrarProfissionalDTO dto = new CadastrarProfissionalDTO(...);
        Profissional profissional = new Profissional(...);
        
        when(profissionalRepository.save(any())).thenReturn(profissional);
        
        // Act
        Profissional resultado = profissionalService.cadastrar(dto);
        
        // Assert
        assertNotNull(resultado);
        verify(profissionalRepository, times(1)).save(any());
    }
}
```

### Executar Testes

```bash
# Todos os testes
mvn test

# Teste específico
mvn test -Dtest=ProfissionalServiceTest

# Com cobertura
mvn test jacoco:report
```

---

## Troubleshooting

### Erro: "Connection refused" para MySQL

```bash
# Verificar se MySQL está rodando
docker-compose ps

# Se não está, iniciar
docker-compose up -d mysql

# Verificar logs
docker logs alles-mysql
```

### Erro: "Table doesn't exist"

```bash
# Executar migrations (Flyway)
mvn flyway:migrate

# Ou verificar application.yml:
# spring.jpa.hibernate.ddl-auto: update
```

### Erro: "JWT token is invalid"

1. Verificar se JWT secret está configurado em application.yml
2. Verificar se token não expirou
3. Verificar se formato do header está correto: `Authorization: Bearer <token>`

---

## Próximos Passos

1. ✅ Backend Setup
2. ✅ Entities + Repositories
3. ✅ Autenticação JWT
4. ⏳ Services (Lógica de Negócio)
5. ⏳ Controllers (REST Endpoints)
6. ⏳ Testes Completos

