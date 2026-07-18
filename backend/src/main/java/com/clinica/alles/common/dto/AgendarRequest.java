package com.clinica.alles.common.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO para requisição de agendamento de atendimento.
 * Suporta ID-based (backend) e name-based (frontend) selection.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AgendarRequest {

    @NotNull(message = "ID ou nome do profissional é obrigatório")
    private Long profissionalId;

    @NotNull(message = "ID ou nome do paciente é obrigatório")
    private Long pacienteId;

    // Alternativa: name-based selection (do frontend)
    private String profissionalNome;
    private String pacienteNome;

    @NotNull(message = "Data e hora do atendimento é obrigatória")
    private java.time.LocalDateTime dataHora;

    private String tipoAtendimento;
    private String status;
    private String anotacoes;
}
