package com.clinica.alles.application.strategy;

import com.clinica.alles.domain.atendimento.Atendimento;
import com.clinica.alles.domain.profissional.Profissional;

import java.math.BigDecimal;
import java.util.List;

/**
 * Interface para estratégia de cálculo de pagamento de profissionais.
 * Implementa o padrão Strategy para permitir diferentes formas de cálculo.
 */
public interface CalculoPagamentoStrategy {

    /**
     * Calcula o pagamento do profissional baseado em seus atendimentos.
     *
     * @param atendimentos lista de atendimentos do período
     * @param profissional dados do profissional
     * @return valor total a pagar
     */
    BigDecimal calcular(List<Atendimento> atendimentos, Profissional profissional);
}
