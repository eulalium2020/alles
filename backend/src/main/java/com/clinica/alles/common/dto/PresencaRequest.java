package com.clinica.alles.common.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO para requisição de registro de presença em atendimento.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PresencaRequest {

    private String anotacoes; // opcional
}
