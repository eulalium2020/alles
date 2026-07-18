package com.clinica.alles.application.service;

import com.clinica.alles.application.strategy.StrategyFactory;
import com.clinica.alles.common.exception.ResourceNotFoundException;
import com.clinica.alles.domain.atendimento.Atendimento;
import com.clinica.alles.domain.profissional.Profissional;
import com.clinica.alles.domain.relatorio.RelatorioMensal;
import com.clinica.alles.infrastructure.persistence.IAtendimentoRepository;
import com.clinica.alles.infrastructure.persistence.IProfissionalRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;

/**
 * Serviço para gerenciar geração de relatórios de profissionais.
 * Implementa SOLID - Single Responsibility, Dependency Inversion.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class RelatorioService {

    private final IProfissionalRepository profissionalRepository;
    private final IAtendimentoRepository atendimentoRepository;
    private final StrategyFactory strategyFactory;

    /**
     * Gera um relatório mensal para um profissional específico.
     *
     * @param profId o ID do profissional
     * @param mes o mês do relatório
     * @return relatório mensal com dados do profissional
     * @throws ResourceNotFoundException se profissional não for encontrado
     */
    public RelatorioMensal gerarRelatorioProfissional(Long profId, YearMonth mes) {
        log.info("Gerando relatório mensal do profissional {} para {}", profId, mes);
        
        Profissional profissional = profissionalRepository.findById(profId)
                .orElseThrow(() -> new ResourceNotFoundException("Profissional não encontrado com ID: " + profId));
        
        LocalDate dataInicio = mes.atDay(1);
        LocalDate dataFim = mes.atEndOfMonth();
        
        List<Atendimento> atendimentosMes = atendimentoRepository.findByDataHoraBetween(
                dataInicio.atStartOfDay(),
                dataFim.atTime(23, 59, 59)
        ).stream()
                .filter(a -> a.getProfissional().getId().equals(profId))
                .toList();
        
        int totalAtendimentos = atendimentosMes.size();
        int atendimentosRealizados = (int) atendimentosMes.stream()
                .filter(a -> a.getDataFim() != null)
                .count();
        
        BigDecimal receita = calcularReceita(atendimentosMes, profissional);
        
        var strategy = strategyFactory.getStrategy(profissional.getTipoPagamento());
        BigDecimal pagamento = strategy.calcular(atendimentosMes, profissional);
        
        BigDecimal descontoClinica = receita
                .multiply(profissional.getDescontoClinicaPercentual())
                .divide(BigDecimal.valueOf(100));
        
        RelatorioMensal relatorio = RelatorioMensal.builder()
                .profissionalId(profissional.getId())
                .profissionalNome(profissional.getUsuario().getEmail())
                .mes(mes)
                .totalAtendimentos(totalAtendimentos)
                .atendimentosRealizados(atendimentosRealizados)
                .receita(receita)
                .pagamento(pagamento)
                .descontoClinica(descontoClinica)
                .tipoPagamento(profissional.getTipoPagamento().toString())
                .build();
        
        log.info("Relatório gerado com sucesso para profissional {}", profId);
        return relatorio;
    }

    /**
     * Gera relatórios gerenciais para todos os profissionais em um mês específico.
     *
     * @param mes o mês para os relatórios
     * @return lista de relatórios mensais para todos os profissionais
     */
    public List<RelatorioMensal> gerarRelatorioGerencial(YearMonth mes) {
        log.info("Gerando relatórios gerenciais para o mês {}", mes);
        
        List<Profissional> profissionais = profissionalRepository.findByAtivoTrue();
        
        return profissionais.stream()
                .map(prof -> gerarRelatorioProfissional(prof.getId(), mes))
                .toList();
    }

    /**
     * Calcula a receita total de um profissional em um período.
     * Considera valor de consulta plano para atendimentos realizados.
     *
     * @param atendimentos lista de atendimentos
     * @param profissional dados do profissional
     * @return valor total de receita
     */
    private BigDecimal calcularReceita(List<Atendimento> atendimentos, Profissional profissional) {
        BigDecimal valorConsultaPlano = profissional.getValorConsultaPlano();
        
        long atendimentosRealizados = atendimentos.stream()
                .filter(a -> a.getDataFim() != null)
                .count();
        
        return valorConsultaPlano.multiply(BigDecimal.valueOf(atendimentosRealizados));
    }
}
