# ALLES Clinic Management Backend

Backend da aplicação de gerenciamento de clínica médica ALLES. Desenvolvido com Spring Boot 3.1.x, Java 17, e MySQL 8.x.

## Arquitetura

O projeto segue uma arquitetura em camadas seguindo princípios SOLID:

```
com.clinica.alles/
├── common/                  # Código compartilhado
│   ├── config/             # Configurações da aplicação
│   ├── constants/          # Constantes globais
│   ├── dto/                # Data Transfer Objects
│   ├── exception/          # Exceções customizadas e handlers
│   ├── security/           # Componentes de segurança
│   └── util/               # Utilitários
├── domain/                 # Camada de domínio (entidades)
│   ├── usuario/           # Usuário e perfis
│   ├── profissional/      # Profissional de saúde
│   ├── paciente/          # Paciente
│   ├── especialidade/     # Especialidades médicas
│   ├── planosasaude/      # Planos de saúde
│   ├── atendimento/       # Atendimentos/Consultas
│   └── pagamento/         # Pagamentos
├── infrastructure/         # Camada de infraestrutura
│   ├── persistence/       # Repositórios JPA
│   └── security/          # Componentes de segurança (JWT, etc)
├── application/           # Serviços de negócio (sera implementado)
└── presentation/          # Controladores REST (sera implementado)
```

## Tecnologias

- **Java**: 17
- **Spring Boot**: 3.1.5
- **Spring Data JPA**: Para persistência
- **Spring Security**: Com JWT
- **MySQL**: 8.x
- **Lombok**: Redução de boilerplate
- **JJWT**: Geração e validação de tokens JWT
- **Springdoc OpenAPI**: Documentação Swagger/OpenAPI 3.0

## Configuração

### Pré-requisitos

- Java 17 JDK
- Maven 3.8+
- MySQL 8.x

### Variáveis de Ambiente

Editar `src/main/resources/application.yml`:

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/alles?useSSL=false&serverTimezone=UTC
    username: root
    password: sua_senha

jwt:
  secret: sua_chave_secreta_com_256_bits_minimo
  expiration: 86400000  # 24 horas em ms
```

### Criar Banco de Dados

```sql
CREATE DATABASE alles CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### Build e Execução

#### Compilar
```bash
cd backend
mvn clean compile -DskipTests -s settings.xml
```

#### Executar testes
```bash
mvn test -s settings.xml
```

#### Empacotar (JAR)
```bash
mvn clean package -s settings.xml
```

#### Executar a aplicação
```bash
mvn spring-boot:run -s settings.xml
```

Ou após empacotar:
```bash
java -jar target/alles-backend-1.0.0.jar
```

## Endpoints Disponíveis

### Autenticação (Público)
- `POST /api/auth/login` - Fazer login
- `POST /api/auth/refresh` - Renovar token

### Documentação API
- `GET /api/swagger-ui.html` - Interface Swagger
- `GET /api/v3/api-docs` - OpenAPI JSON

## Entidades

### Usuario (Abstrata)
- email (unique)
- senha (hashed com BCrypt)
- perfil (ADMIN, PROFISSIONAL, PACIENTE, RECEPCIONISTA)
- ativo

### Especialidade
- nome (unique)
- descricao
- ativo

### Profissional
- usuario (1:1 com Usuario)
- especialidade (N:1)
- crm, crefito (documentos únicos)
- tipoPagamento
- valorConsultaParticular, valorConsultaPlano
- percentualReceita
- descontoClinicaPercentual

### Paciente
- usuario (1:1 com Usuario)
- cpf (unique)
- dataNascimento
- endereco, telefone
- alergias, antecedentes_medicos

### PlanoSaude
- nome (unique)
- descricao
- ativo

### Atendimento
- paciente (N:1)
- profissional (N:1)
- dataInicio, dataFim
- diagnostico, notasConsulta

### Pagamento
- profissional (N:1)
- atendimento (N:1)
- valor
- status (PENDENTE, PROCESSANDO, PAGO, CANCELADO, FALHA)
- data_pagamento, data_vencimento

## Segurança

### JWT (JSON Web Token)
- Gerado no login
- Refresh token para renovação
- Validação em cada requisição via `JwtAuthenticationFilter`
- Expiração configurável

### BCrypt
- Senhas hasheadas com BCrypt (salt 12)
- Configurado em `SecurityConfig`

### CSRF
- Desativado (aplicação stateless com JWT)

## Tratamento de Exceções

Exceções customizadas em `common/exception/`:

- `BusinessException` - Base para erros de negócio
- `ResourceNotFoundException` - Recurso não encontrado (404)
- `DuplicateResourceException` - Recurso duplicado (409)
- `UnauthorizedException` - Sem autorização (401)
- `ValidationException` - Erro de validação (400)

Todas retornam respostas JSON padronizadas via `GlobalExceptionHandler`.

## Desenvolvimento

### Adicionar novo repositório
1. Criar interface em `infrastructure/persistence/`
2. Estender `JpaRepository<Entity, ID>`
3. Adicionar métodos customizados

### Adicionar novo serviço
1. Criar classe em `application/`
2. Anotar com `@Service`
3. Injetar repositórios e dependências

### Adicionar novo controller
1. Criar classe em `presentation/`
2. Anotar com `@RestController`
3. Mapear endpoints com `@GetMapping`, `@PostMapping`, etc

## Próximos Passos

1. Implementar Controllers REST (presentation layer)
2. Implementar Serviços de Negócio (application layer)
3. Adicionar validações (Bean Validation)
4. Testes unitários e de integração
5. CI/CD Pipeline

## Contribuições

Seguir os princípios SOLID, clean code e padrões de projeto estabelecidos.

## Licença

Privada - ALLES Clínica
