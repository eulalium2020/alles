# ALLES Backend

Backend da aplicação ALLES, desenvolvido com **Java 17 + Spring Boot 3.1.x**.

## Status atual

**Atualizado em 08/07/2026:** camada de API, serviços e persistência implementadas para os módulos principais, com segurança JWT e migrações Flyway.

## Stack

- Spring Boot Web
- Spring Data JPA
- Spring Security (JWT)
- Flyway
- MySQL 8
- Springdoc OpenAPI
- JUnit 5 / Mockito

## Estrutura

```
com.clinica.alles/
├── common/           # Configurações, DTOs, exceptions, utilidades
├── domain/           # Entidades e regras de domínio
├── infrastructure/   # Persistência e segurança
├── application/      # Serviços de negócio
└── presentation/     # Controllers REST
```

## Módulos disponíveis

- Auth
- Profissional
- Paciente
- PlanoSaude
- Atendimento
- Pagamento
- Relatorio

## Migrações de banco

- `src/main/resources/db/migration/V001__initial_schema.sql`
- `src/main/resources/db/migration/V002__seed_data.sql`

## Executar localmente

### Pré-requisitos
- Java 17+
- Maven 3.8+
- MySQL 8+

### Comandos

```bash
cd backend
mvn clean install
mvn spring-boot:run
```

### Testes

```bash
mvn test
```

## API e documentação

- Base URL local: `http://localhost:8080`
- Swagger UI: `http://localhost:8080/api/swagger-ui.html`
- OpenAPI JSON: `http://localhost:8080/api/v3/api-docs`
