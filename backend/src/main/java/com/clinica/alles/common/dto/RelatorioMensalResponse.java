package com.clinica.alles.common.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.YearMonth;

/**
 * DTO para resposta de relatório mensal.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RelatorioMensalResponse {

    @JsonProperty("profissional_id")
    private Long profissionalId;

    @JsonProperty("profissional_nome")
    private String profissionalNome;

    private YearMonth mes;

    @JsonProperty("total_atendimentos")
    private Integer totalAtendimentos;

    @JsonProperty("atendimentos_realizados")
    private Integer atendimentosRealizados;

    private BigDecimal receita;
    private BigDecimal pagamento;

    @JsonProperty("desconto_clinica")
    private BigDecimal descontoClinica;

    @JsonProperty("tipo_pagamento")
    private String tipoPagamento;
}
