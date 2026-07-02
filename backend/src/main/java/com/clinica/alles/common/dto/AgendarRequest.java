package com.clinica.alles.common.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * DTO para requisição de agendamento de atendimento.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AgendarRequest {

    @NotNull(message = "ID do profissional é obrigatório")
    private Long profissionalId;

    @NotNull(message = "ID do paciente é obrigatório")
    private Long pacienteId;

    @NotNull(message = "Data e hora do atendimento é obrigatória")
    private LocalDateTime dataHora;
}
