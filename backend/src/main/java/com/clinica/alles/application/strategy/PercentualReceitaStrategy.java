package com.clinica.alles.application.strategy;

import com.clinica.alles.domain.atendimento.Atendimento;
import com.clinica.alles.domain.profissional.Profissional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;

/**
 * Estratégia de cálculo de pagamento por percentual da receita bruta.
 */
@Slf4j
@Component
public class PercentualReceitaStrategy implements CalculoPagamentoStrategy {

    /**
     * Calcula o pagamento como percentual do valor total de receita gerada.
     * Receita = valor consulta plano * quantidade de atendimentos realizados.
     * Pagamento = (Receita * Percentual do Profissional) - (Receita * Desconto Clínica)
     *
     * @param atendimentos lista de atendimentos do período
     * @param profissional dados do profissional
     * @return valor total baseado no percentual de receita
     */
    @Override
    public BigDecimal calcular(List<Atendimento> atendimentos, Profissional profissional) {
        log.debug("Calculando pagamento por percentual de receita para profissional: {}", profissional.getId());
        
        BigDecimal valorConsultaPlano = profissional.getValorConsultaPlano();
        BigDecimal percentualProfissional = profissional.getPercentualReceita();
        BigDecimal descontoClinica = profissional.getDescontoClinicaPercentual();
        
        long atendimentosRealizados = atendimentos.stream()
                .filter(a -> a.getDataFim() != null)
                .count();
        
        BigDecimal receita = valorConsultaPlano.multiply(BigDecimal.valueOf(atendimentosRealizados));
        BigDecimal pagamentoProfissional = receita.multiply(percentualProfissional).divide(BigDecimal.valueOf(100));
        BigDecimal descontoClinicaValor = receita.multiply(descontoClinica).divide(BigDecimal.valueOf(100));
        BigDecimal totalPagamento = pagamentoProfissional.subtract(descontoClinicaValor);
        
        log.debug("Pagamento percentual: receita {} x {} % - (desconto {}%) = {}", 
                receita, percentualProfissional, descontoClinica, totalPagamento);
        
        return totalPagamento;
    }
}
