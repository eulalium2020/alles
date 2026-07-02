package com.clinica.alles.common.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * DTO para resposta de pagamento.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PagamentoResponse {

    private Long id;
    private Long profissionalId;
    private String profissionalNome;
    private BigDecimal valor;
    private LocalDate dataPagamento;
    private LocalDate dataVencimento;
    private String status;
}
