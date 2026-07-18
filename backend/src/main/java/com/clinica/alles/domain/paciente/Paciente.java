package com.clinica.alles.domain.paciente;

import com.clinica.alles.domain.planosasaude.PlanoSaude;
import com.clinica.alles.domain.usuario.Usuario;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.util.HashSet;
import java.util.Set;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Entidade que representa um paciente.
 * Estende a entidade Usuario com informações específicas de pacientes.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "pacientes")
@EqualsAndHashCode(exclude = "usuario")
@JsonIgnoreProperties(ignoreUnknown = true, value = {"hibernateLazyInitializer", "handler"})
public class Paciente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "usuario_id", nullable = false, unique = true)
    private Usuario usuario;

    @Column(unique = true, nullable = false, length = 11)
    private String cpf;

    @Column(name = "data_nascimento")
    private LocalDate dataNascimento;

    @Column(length = 1)
    private Character sexo;

    @Column(length = 20)
    private String telefone;

    @Column(length = 150)
    private String endereco;

    @Column(length = 10)
    private String numero;

    @Column(length = 100)
    private String complemento;

    @Column(length = 50)
    private String bairro;

    @Column(length = 50)
    private String cidade;

    @Column(length = 2)
    private String estado;

    @Column(length = 10)
    private String cep;

    @Column(columnDefinition = "TEXT")
    private String alergias;

    @Column(name = "antecedentes_medicos", columnDefinition = "TEXT")
    private String antecedenteMedicos;

    @ManyToMany
    @JoinTable(
            name = "pacientes_planos_saude",
            joinColumns = @JoinColumn(name = "paciente_id"),
            inverseJoinColumns = @JoinColumn(name = "plano_saude_id")
    )
    private Set<PlanoSaude> planosSaude = new HashSet<>();

    @Column(name = "data_cadastro", nullable = false, updatable = false)
    private LocalDateTime dataCadastro;

    @Column(name = "data_atualizacao")
    private LocalDateTime dataAtualizacao;

    @Column(nullable = false)
    private Boolean ativo = true;

    @PrePersist
    protected void onCreate() {
        dataCadastro = LocalDateTime.now();
        dataAtualizacao = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        dataAtualizacao = LocalDateTime.now();
    }
}
