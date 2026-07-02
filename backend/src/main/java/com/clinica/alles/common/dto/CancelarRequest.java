package com.clinica.alles.common.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO para requisição de cancelamento de atendimento.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CancelarRequest {

    private String motivo;
}
