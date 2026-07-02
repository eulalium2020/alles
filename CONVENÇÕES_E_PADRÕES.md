# 📐 CONVENÇÕES E PADRÕES DE CÓDIGO

**Status**: ✅ Aprovado  
**Data**: 02/07/2026  
**Válido para**: Backend (Java) + Frontend (TypeScript/React)

---

## 🏛️ PRINCÍPIOS

1. **Código é um documento** → Nomes claros, sem comentários desnecessários
2. **SOLID é mandatório** → Não há exceção
3. **Testes acompanham código** → Test-first quando possível
4. **Código é para humanos** → Máquinas executam
5. **Simplicidade > Complexidade** → Sem over-engineering

---

## 🔤 NOMENCLATURA

### Java/Backend

#### Pacotes
```java
// ✅ CORRETO
com.clinica.alles.domain.profissional
com.clinica.alles.application.agendamento
com.clinica.alles.infrastructure.security
com.clinica.alles.presentation.controller

// ❌ INCORRETO
com.clinica.util
com.alles.prof
package1.package2
```

#### Classes
```java
// ✅ CORRETO - PascalCase
ProfissionalService
ProfissionalRepository
ProfissionalController
ProfissionalDTO
CadastrarProfissionalUseCase
ProfissionalDomainService

// ❌ INCORRETO
profissionalService
Profissional_Service
ProfissionalServ
Service
```

#### Métodos e Variáveis
```java
// ✅ CORRETO - camelCase
public Profissional buscarProfissionalPorId(Long id)
public void registrarAtendimento(Atendimento atendimento)
private BigDecimal calcularValorConsulta(Profissional prof)
private List<Atendimento> atendimentosRealizados;

// ❌ INCORRETO
public Profissional BuscarProfissionalPorId(Long id)
public void registrar_atendimento(Atendimento atendimento)
private void calc_valor()
```

#### Constantes
```java
// ✅ CORRETO - UPPER_SNAKE_CASE
public static final BigDecimal DESCONTO_CLINICA_PERCENTUAL = new BigDecimal("20.00");
public static final String MES_REFERENCIA_FORMAT = "yyyy-MM";
public static final int MAX_RETRIES = 3;
public static final String API_BASE_URL = "http://localhost:8080/api";

// ❌ INCORRETO
public static final BigDecimal descontoClinica = new BigDecimal("20.00");
public static final String mesReferencia = "yyyy-MM";
```

#### Interfaces
```java
// ✅ CORRETO - Começa com I (opcional) ou descreve capacidade
public interface IProfissionalRepository { ... }
public interface CalculoPagamentoStrategy { ... }
public interface AtendimentoRepositoryCustom { ... }

// ❌ INCORRETO
public interface Profissional { ... }
public interface ProfissionalImpl { ... }
```

#### Exceções
```java
// ✅ CORRETO - Sufixo Exception
public class ProfissionalNaoEncontradoException extends RuntimeException { }
public class AtendimentoComConflitoDehoras Exception extends BusinessException { }

// ❌ INCORRETO
public class ProfissionalNotFound extends Exception { }
public class ErroAtendimento extends Throwable { }
```

---

### TypeScript/React

#### Arquivos
```typescript
// ✅ CORRETO
src/components/ProfissionalCard.tsx
src/services/profissionalService.ts
src/hooks/useProfissional.ts
src/types/profissional.ts

// ❌ INCORRETO
src/components/profissional-card.tsx
src/services/professionalService.ts
src/Profissional.ts
```

#### Componentes
```typescript
// ✅ CORRETO
export const ProfissionalCard: React.FC<Props> = (props) => { ... }
export const AgendamentoForm: React.FC<Props> = (props) => { ... }

// ❌ INCORRETO
export const profissional_card = (props) => { ... }
export const CardProfissional = (props) => { ... }
```

#### Tipos/Interfaces
```typescript
// ✅ CORRETO
interface Profissional {
  id: number;
  nome: string;
}

type PagamentoStatus = 'PENDENTE' | 'PAGO' | 'FALHOU';

// ❌ INCORRETO
interface IProfissional { ... } // Redundante em TS
type profissional = { ... } // Não, type também é PascalCase
```

---

## 📁 ESTRUTURA DE CÓDIGO

### Backend - Classe de Service (Exemplo)

```java
@Service
@Transactional
public class ProfissionalService {
    
    private final IProfissionalRepository profissionalRepository;
    private final EspecialidadeRepository especialidadeRepository;
    private final ApplicationEventPublisher eventPublisher;
    private final CalculoPagamentoFactory calculoPagamentoFactory;
    
    // Constructor Injection (preferido)
    public ProfissionalService(
        IProfissionalRepository profissionalRepository,
        EspecialidadeRepository especialidadeRepository,
        ApplicationEventPublisher eventPublisher,
        CalculoPagamentoFactory calculoPagamentoFactory) {
        
        this.profissionalRepository = profissionalRepository;
        this.especialidadeRepository = especialidadeRepository;
        this.eventPublisher = eventPublisher;
        this.calculoPagamentoFactory = calculoPagamentoFactory;
    }
    
    /**
     * Cadastra um novo profissional.
     *
     * @param comando comando com dados do profissional
     * @return profissional cadastrado
     * @throws EspecialidadeNaoEncontradaException se especialidade não existe
     */
    public Profissional cadastrar(CadastrarProfissionalComando comando) {
        // 1. Validações
        validarComando(comando);
        
        // 2. Verificar especialidade
        Especialidade especialidade = especialidadeRepository
            .findById(comando.getEspecialidadeId())
            .orElseThrow(() -> new EspecialidadeNaoEncontradaException(
                comando.getEspecialidadeId()
            ));
        
        // 3. Criar entidade
        Profissional profissional = new Profissional(
            comando.getNome(),
            comando.getCpf(),
            especialidade,
            comando.getCRM(),
            comando.getCREFITO()
        );
        
        // 4. Persistir
        Profissional salvo = profissionalRepository.save(profissional);
        
        // 5. Publicar evento de domínio
        eventPublisher.publishEvent(
            new ProfissionalCadastradoEvent(salvo)
        );
        
        // 6. Log
        log.info("Profissional cadastrado: id={}, especialidade={}", 
                 salvo.getId(), salvo.getEspecialidade().getNome());
        
        return salvo;
    }
    
    // Método auxiliar
    private void validarComando(CadastrarProfissionalComando comando) {
        if (comando.getNome() == null || comando.getNome().isBlank()) {
            throw new IllegalArgumentException("Nome é obrigatório");
        }
        // Mais validações...
    }
}
```

### Backend - Classe DTO

```java
@Data  // Lombok: gera getter, setter, equals, hashCode, toString
@NoArgsConstructor
@AllArgsConstructor
@Validated
public class CadastrarProfissionalDTO {
    
    @NotBlank(message = "Nome é obrigatório")
    @Size(min = 3, max = 150, message = "Nome deve ter entre 3 e 150 caracteres")
    private String nome;
    
    @NotBlank(message = "CPF é obrigatório")
    @Pattern(regexp = "\\d{11}", message = "CPF deve ter 11 dígitos")
    private String cpf;
    
    @NotNull(message = "Especialidade é obrigatória")
    private Long especialidadeId;
    
    @NotBlank(message = "CRM é obrigatório")
    @Size(min = 5, max = 20)
    private String crm;
    
    @NotBlank(message = "CREFITO é obrigatório (ou deixe em branco se não aplicável)")
    private String crefito;
    
    @DecimalMin(value = "50.00", message = "Valor mínimo de consulta é R$ 50,00")
    @DecimalMax(value = "1000.00", message = "Valor máximo de consulta é R$ 1.000,00")
    private BigDecimal valorConsulta;
}
```

### Backend - Classe Entity

```java
@Entity
@Table(name = "profissional", uniqueConstraints = {
    @UniqueConstraint(columnNames = "crm"),
    @UniqueConstraint(columnNames = "crefito")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Profissional {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, length = 150)
    private String nome;
    
    @Column(nullable = false, length = 11, unique = true)
    private String cpf;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "especialidade_id", nullable = false)
    private Especialidade especialidade;
    
    @Column(nullable = false, length = 20, unique = true)
    private String crm;
    
    @Column(length = 20, unique = true)
    private String crefito;
    
    // Value Objects (se criar classes customizadas)
    @Embedded
    private DadosBancarios dadosBancarios;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TipoPagamento tipoPagamento;
    
    @Column(precision = 10, scale = 2)
    private BigDecimal valorConsultaParticular;
    
    @Column(precision = 10, scale = 2)
    private BigDecimal valorConsultaPlano;
    
    @Column(precision = 5, scale = 2)
    private BigDecimal percentualReceita;
    
    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime dataCadastro;
    
    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime dataAtualizacao;
    
    @Column(nullable = false)
    private Boolean ativo = true;
    
    // Métodos de negócio (não apenas getters/setters)
    public void desativar() {
        this.ativo = false;
        this.dataAtualizacao = LocalDateTime.now();
    }
    
    public void ativar() {
        this.ativo = true;
        this.dataAtualizacao = LocalDateTime.now();
    }
    
    public boolean podeCadastrarHorario(LocalTime inicio, LocalTime fim) {
        return inicio != null && fim != null && inicio.isBefore(fim);
    }
}
```

### Frontend - Hook Customizado

```typescript
// ✅ CORRETO
import { useState, useEffect, useCallback } from 'react';
import { profissionalService } from '../services/profissionalService';
import { Profissional } from '../types/profissional';

interface UseProfissionalResult {
  profissionais: Profissional[];
  loading: boolean;
  error: string | null;
  buscar: (filtros?: Filtros) => Promise<void>;
  deletar: (id: number) => Promise<void>;
}

export const useProfissional = (): UseProfissionalResult => {
  const [profissionais, setProfissionais] = useState<Profissional[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Carrega profissionais ao montar
  useEffect(() => {
    buscar();
  }, []);
  
  // useCallback: evita re-render desnecessário
  const buscar = useCallback(async (filtros?: Filtros) => {
    try {
      setLoading(true);
      setError(null);
      const dados = await profissionalService.listar(filtros);
      setProfissionais(dados);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao buscar');
    } finally {
      setLoading(false);
    }
  }, []);
  
  const deletar = useCallback(async (id: number) => {
    try {
      await profissionalService.deletar(id);
      setProfissionais(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao deletar');
      throw err;
    }
  }, []);
  
  return { profissionais, loading, error, buscar, deletar };
};
```

### Frontend - Componente React

```typescript
// ✅ CORRETO
import React, { useEffect, useState } from 'react';
import { Profissional } from '../types/profissional';
import { useProfissional } from '../hooks/useProfissional';
import { ProfissionalCard } from './ProfissionalCard';
import styles from './ProfissionalList.module.css';

interface Props {
  especialidadeId?: number;
  onSelect?: (profissional: Profissional) => void;
}

export const ProfissionalList: React.FC<Props> = ({ 
  especialidadeId, 
  onSelect 
}) => {
  const { profissionais, loading, error, buscar } = useProfissional();
  const [filtro, setFiltro] = useState('');
  
  useEffect(() => {
    buscar({ especialidadeId });
  }, [especialidadeId]);
  
  // Filtro local (rápido)
  const profissionaisFiltrados = profissionais.filter(p =>
    p.nome.toLowerCase().includes(filtro.toLowerCase())
  );
  
  if (loading) return <div className={styles.loading}>Carregando...</div>;
  if (error) return <div className={styles.error}>{error}</div>;
  
  return (
    <div className={styles.container}>
      <input
        type="text"
        placeholder="Buscar profissional..."
        value={filtro}
        onChange={(e) => setFiltro(e.target.value)}
        className={styles.searchInput}
      />
      
      <div className={styles.grid}>
        {profissionaisFiltrados.length === 0 ? (
          <p>Nenhum profissional encontrado</p>
        ) : (
          profissionaisFiltrados.map(prof => (
            <ProfissionalCard
              key={prof.id}
              profissional={prof}
              onClick={() => onSelect?.(prof)}
            />
          ))
        )}
      </div>
    </div>
  );
};
```

---

## ✅ TESTES

### Padrão de Teste - Backend

```java
@SpringBootTest
@DisplayName("ProfissionalService")
class ProfissionalServiceTest {
    
    @Mock
    private IProfissionalRepository profissionalRepository;
    
    @InjectMocks
    private ProfissionalService profissionalService;
    
    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }
    
    @Nested
    @DisplayName("cadastrar")
    class CadastrarTests {
        
        @Test
        @DisplayName("deve cadastrar profissional com sucesso")
        void deveC cadastrarComSucesso() {
            // Arrange
            CadastrarProfissionalDTO dto = new CadastrarProfissionalDTO(
                "Dr. João",
                "12345678900",
                1L,
                "CRM123456",
                "CREFITO123456",
                new BigDecimal("150.00")
            );
            
            Especialidade especialidade = new Especialidade(1L, "Psicologia");
            Profissional profissionalEsperado = new Profissional(
                1L,
                "Dr. João",
                "12345678900",
                especialidade,
                "CRM123456",
                "CREFITO123456"
            );
            
            when(especialidadeRepository.findById(1L))
                .thenReturn(Optional.of(especialidade));
            when(profissionalRepository.save(any()))
                .thenReturn(profissionalEsperado);
            
            // Act
            Profissional resultado = profissionalService.cadastrar(dto);
            
            // Assert
            assertNotNull(resultado);
            assertEquals("Dr. João", resultado.getNome());
            verify(profissionalRepository, times(1)).save(any());
            verify(eventPublisher, times(1)).publishEvent(any());
        }
        
        @Test
        @DisplayName("deve lançar exceção se especialidade não existe")
        void deveLancarExcecaoSeEspecialidadeNaoExiste() {
            // Arrange
            CadastrarProfissionalDTO dto = new CadastrarProfissionalDTO(
                "Dr. João", "12345678900", 999L, "CRM123456", "CREFITO123456",
                new BigDecimal("150.00")
            );
            
            when(especialidadeRepository.findById(999L))
                .thenReturn(Optional.empty());
            
            // Act & Assert
            assertThrows(EspecialidadeNaoEncontradaException.class, () ->
                profissionalService.cadastrar(dto)
            );
        }
    }
}
```

### Padrão de Teste - Frontend

```typescript
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { ProfissionalList } from './ProfissionalList';
import * as profissionalService from '../services/profissionalService';

jest.mock('../services/profissionalService');

describe('ProfissionalList', () => {
  
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  it('deve renderizar lista de profissionais', async () => {
    // Arrange
    const profissionais = [
      { id: 1, nome: 'Dr. João', especialidade: 'Psicologia' },
      { id: 2, nome: 'Dra. Maria', especialidade: 'Fisioterapia' }
    ];
    
    (profissionalService.listar as jest.Mock).resolveValue(profissionais);
    
    // Act
    render(<ProfissionalList />);
    
    // Assert
    await waitFor(() => {
      expect(screen.getByText('Dr. João')).toBeInTheDocument();
      expect(screen.getByText('Dra. Maria')).toBeInTheDocument();
    });
  });
  
  it('deve filtrar profissionais ao digitar', async () => {
    // Arrange
    const profissionais = [
      { id: 1, nome: 'Dr. João' },
      { id: 2, nome: 'Dra. Maria' }
    ];
    
    (profissionalService.listar as jest.Mock).resolveValue(profissionais);
    render(<ProfissionalList />);
    
    await waitFor(() => {
      expect(screen.getByText('Dr. João')).toBeInTheDocument();
    });
    
    // Act
    const input = screen.getByPlaceholderText('Buscar profissional...');
    fireEvent.change(input, { target: { value: 'Maria' } });
    
    // Assert
    expect(screen.getByText('Dra. Maria')).toBeInTheDocument();
    expect(screen.queryByText('Dr. João')).not.toBeInTheDocument();
  });
});
```

---

## 🎯 CHECKLIST PRÉ-COMMIT

- [ ] Código segue convenções de nomenclatura
- [ ] Implementa SOLID principles
- [ ] Testes unitários passam
- [ ] Não há código comentado (comentários explicam POR QUÊ, não O QUÊ)
- [ ] Sem console.log() ou System.out.println()
- [ ] Sem magic numbers (usar constantes)
- [ ] Métodos têm 1 responsabilidade
- [ ] Métodos com < 30 linhas
- [ ] Sem null checks excessivos (usar Optional/nullsafe)
- [ ] DTOs com @Valid annotations
- [ ] Exceções customizadas (não genéricas)
- [ ] Logging apropriado
- [ ] Performance aceitável
- [ ] Segurança verificada (inputs validados, dados sensíveis protegidos)

---

## 📝 EXEMPLO DE COMMIT

```bash
git commit -m "feat: adicionar endpoint para cadastrar profissional

- Criar ProfissionalController.cadastrar()
- Implementar CadastrarProfissionalUseCase
- Validar especialidade e dados bancários
- Publicar evento ProfissionalCadastradoEvent
- Adicionar testes unitários

Closes #123"
```

