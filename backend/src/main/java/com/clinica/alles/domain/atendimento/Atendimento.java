package com.clinica.alles.domain.atendimento;

import com.clinica.alles.domain.paciente.Paciente;
import com.clinica.alles.domain.profissional.Profissional;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.time.LocalDateTime;

/**
 * Entidade que representa um atendimento de paciente por profissional.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "atendimentos")
@EqualsAndHashCode(exclude = {"paciente", "profissional"})
@JsonIgnoreProperties(ignoreUnknown = true, value = {"hibernateLazyInitializer", "handler"})
public class Atendimento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "paciente_id", nullable = false)
    private Paciente paciente;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "profissional_id", nullable = false)
    private Profissional profissional;

    @Column(name = "tipo_atendimento", nullable = false, length = 50)
    private String tipoAtendimento = "PRESENCIAL"; // PRESENCIAL, TELEMEDICINA

    @Column(nullable = false, length = 50)
    private String status = "AGENDADO"; // AGENDADO, REALIZADO, CANCELADO, NAO_COMPARECEU

    @Column(name = "data_hora", nullable = false)
    private LocalDateTime dataHora;

    @Column(name = "data_fim")
    private LocalDateTime dataFim;

    @Column(columnDefinition = "TEXT")
    private String diagnostico;

    @Column(name = "notas_consulta", columnDefinition = "TEXT")
    private String notasConsulta;

    @Column(columnDefinition = "TEXT")
    private String anotacoes;

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
