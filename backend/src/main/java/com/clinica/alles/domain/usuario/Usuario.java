package com.clinica.alles.domain.usuario;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.time.LocalDateTime;

/**
 * Entidade abstrata que representa um usuário do sistema.
 * Serve como base para Profissional, Paciente e outros usuários.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "usuarios")
@Inheritance(strategy = InheritanceType.JOINED)
@JsonIgnoreProperties(ignoreUnknown = true, value = {"hibernateLazyInitializer", "handler"})
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String nome;

    @Column(unique = true, nullable = false, length = 150)
    private String email;

    @Column(length = 11)
    private String cpf;

    @Column(length = 20)
    private String telefone;

    @Column(nullable = false)
    private String senha;

    @Column(nullable = false)
    private Boolean ativo = true;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Perfil perfil;

    @Column(name = "data_criacao", nullable = false, updatable = false)
    private LocalDateTime dataCriacao;

    @Column(name = "data_atualizacao")
    private LocalDateTime dataAtualizacao;

    @PrePersist
    protected void onCreate() {
        dataCriacao = LocalDateTime.now();
        dataAtualizacao = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        dataAtualizacao = LocalDateTime.now();
    }
}
