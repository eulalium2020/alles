package com.clinica.alles.application.strategy;

import com.clinica.alles.common.exception.ValidationException;
import com.clinica.alles.domain.profissional.TipoPagamento;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

/**
 * Factory para criação e seleção de estratégias de cálculo de pagamento.
 * Implementa o padrão Factory Method para centralizar a lógica de criação.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class StrategyFactory {

    private final FixoConsultaStrategy fixoConsultaStrategy;
    private final PercentualReceitaStrategy percentualReceitaStrategy;

    /**
     * Retorna a estratégia apropriada baseada no tipo de pagamento.
     *
     * @param tipo o tipo de pagamento
     * @return a estratégia de cálculo correspondente
     * @throws ValidationException se o tipo não for suportado
     */
    public CalculoPagamentoStrategy getStrategy(TipoPagamento tipo) {
        log.debug("Obtendo estratégia de pagamento para tipo: {}", tipo);
        
        if (tipo == null) {
            throw new ValidationException("Tipo de pagamento não pode ser nulo");
        }
        
        return switch (tipo) {
            case FIXO_POR_CONSULTA -> fixoConsultaStrategy;
            case PERCENTUAL_RECEITA -> percentualReceitaStrategy;
            case AMBOS -> {
                log.debug("Tipo AMBOS utiliza estratégia de FIXO_POR_CONSULTA");
                yield fixoConsultaStrategy;
            }
        };
    }
}
