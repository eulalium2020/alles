package com.clinica.alles.common.dto;

import jakarta.validation.constraints.NotBlank;
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

    @NotBlank(message = "Anotações da consulta não podem estar vazias")
    private String anotacoes;
}
