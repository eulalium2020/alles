package com.clinica.alles.domain.relatorio;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.YearMonth;

/**
 * DTO que representa um relatório mensal de atendimentos e pagamentos.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RelatorioMensal {

    private Long profissionalId;
    private String profissionalNome;
    private YearMonth mes;
    private Integer totalAtendimentos;
    private Integer atendimentosRealizados;
    private BigDecimal receita;
    private BigDecimal pagamento;
    private BigDecimal descontoClinica;
    private String tipoPagamento;
}
