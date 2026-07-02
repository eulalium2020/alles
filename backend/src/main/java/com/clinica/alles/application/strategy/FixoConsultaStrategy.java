package com.clinica.alles.application.strategy;

import com.clinica.alles.domain.atendimento.Atendimento;
import com.clinica.alles.domain.profissional.Profissional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;

/**
 * Estratégia de cálculo de pagamento por valor fixo por consulta.
 */
@Slf4j
@Component
public class FixoConsultaStrategy implements CalculoPagamentoStrategy {

    /**
     * Calcula o pagamento como valor fixo multiplicado pelo número de atendimentos realizados.
     *
     * @param atendimentos lista de atendimentos do período
     * @param profissional dados do profissional
     * @return valor total (valor consulta * quantidade de atendimentos com data de fim registrada)
     */
    @Override
    public BigDecimal calcular(List<Atendimento> atendimentos, Profissional profissional) {
        log.debug("Calculando pagamento por valor fixo para profissional: {}", profissional.getId());
        
        BigDecimal valorConsulta = profissional.getValorConsultaParticular();
        
        long atendimentosRealizados = atendimentos.stream()
                .filter(a -> a.getDataFim() != null)
                .count();
        
        BigDecimal totalConsultas = BigDecimal.valueOf(atendimentosRealizados);
        BigDecimal total = valorConsulta.multiply(totalConsultas);
        
        log.debug("Pagamento fixo: {} consultas x {} = {}", atendimentosRealizados, valorConsulta, total);
        return total;
    }
}
