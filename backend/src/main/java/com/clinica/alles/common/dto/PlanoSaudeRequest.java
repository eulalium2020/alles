package com.clinica.alles.common.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO para criação/atualização de plano de saúde.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PlanoSaudeRequest {

    @NotBlank(message = "Nome do plano é obrigatório")
    @Size(max = 100, message = "Nome do plano deve ter no máximo 100 caracteres")
    private String nome;

    @Size(max = 1000, message = "Descrição deve ter no máximo 1000 caracteres")
    private String descricao;
}
