package com.clinica.alles.application.service;

import com.clinica.alles.application.strategy.StrategyFactory;
import com.clinica.alles.common.exception.ResourceNotFoundException;
import com.clinica.alles.common.exception.ValidationException;
import com.clinica.alles.domain.atendimento.Atendimento;
import com.clinica.alles.domain.pagamento.Pagamento;
import com.clinica.alles.domain.pagamento.StatusPagamento;
import com.clinica.alles.domain.profissional.Profissional;
import com.clinica.alles.infrastructure.persistence.IAtendimentoRepository;
import com.clinica.alles.infrastructure.persistence.IPagamentoRepository;
import com.clinica.alles.infrastructure.persistence.IProfissionalRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;

/**
 * Serviço para gerenciar operações de pagamento de profissionais.
 * Implementa SOLID - Single Responsibility, Dependency Inversion.
 * Utiliza Strategy Pattern para cálculo flexível de pagamentos.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class PagamentoService {

    private final IPagamentoRepository pagamentoRepository;
    private final IProfissionalRepository profissionalRepository;
    private final IAtendimentoRepository atendimentoRepository;
    private final StrategyFactory strategyFactory;

    /**
     * Calcula o pagamento de um profissional para um mês específico.
     * Utiliza a estratégia de cálculo configurada para o profissional.
     *
     * @param profId o ID do profissional
     * @param mes o mês para cálculo (ano-mês)
     * @return o valor total a pagar
     * @throws ResourceNotFoundException se profissional não for encontrado
     */
    public BigDecimal calcularPagamento(Long profId, YearMonth mes) {
        log.info("Calculando pagamento do profissional {} para o mês {}", profId, mes);
        
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
        
        var strategy = strategyFactory.getStrategy(profissional.getTipoPagamento());
        BigDecimal valor = strategy.calcular(atendimentosMes, profissional);
        
        log.info("Pagamento calculado: {} para profissional {} no mês {}", valor, profId, mes);
        return valor;
    }

    /**
     * Processa o pagamento de um profissional, atualizando seu status.
     *
     * @param pagamentoId o ID do pagamento
     * @return o pagamento processado
     * @throws ResourceNotFoundException se pagamento não for encontrado
     */
    @Transactional
    public Pagamento processarPagamento(Long pagamentoId) {
        log.info("Processando pagamento: {}", pagamentoId);
        
        Pagamento pagamento = pagamentoRepository.findById(pagamentoId)
                .orElseThrow(() -> new ResourceNotFoundException("Pagamento não encontrado com ID: " + pagamentoId));
        
        if (pagamento.getStatus() == StatusPagamento.PAGO) {
            throw new ValidationException("Este pagamento já foi processado");
        }
        
        pagamento.setStatus(StatusPagamento.PAGO);
        Pagamento processado = pagamentoRepository.save(pagamento);
        
        log.info("Pagamento processado com sucesso: ID {}", processado.getId());
        return processado;
    }

    /**
     * Busca pagamentos de um profissional em um período específico.
     *
     * @param profId o ID do profissional
     * @param mes o mês para busca
     * @return lista de pagamentos no período
     */
    public List<Pagamento> findByPeriodo(Long profId, YearMonth mes) {
        log.debug("Buscando pagamentos do profissional {} para o mês {}", profId, mes);
        
        LocalDate dataInicio = mes.atDay(1);
        LocalDate dataFim = mes.atEndOfMonth();
        
        List<Pagamento> pagamentos = pagamentoRepository.findByDataPagamentoBetween(dataInicio, dataFim);
        
        return pagamentos.stream()
                .filter(p -> p.getProfissional().getId().equals(profId))
                .toList();
    }

    /**
     * Busca um pagamento pelo ID.
     *
     * @param id o ID do pagamento
     * @return o pagamento encontrado
     * @throws ResourceNotFoundException se não encontrar
     */
    public Pagamento findById(Long id) {
        log.debug("Buscando pagamento por ID: {}", id);
        return pagamentoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Pagamento não encontrado com ID: " + id));
    }

    /**
     * Busca pagamentos de um profissional com status específico.
     *
     * @param profId o ID do profissional
     * @param status o status do pagamento
     * @return lista de pagamentos com o status especificado
     */
    public List<Pagamento> findByProfissionalEStatus(Long profId, StatusPagamento status) {
        log.debug("Buscando pagamentos do profissional {} com status {}", profId, status);
        return pagamentoRepository.findByProfissionalIdAndStatus(profId, status);
    }

    /**
     * Cria um novo registro de pagamento.
     *
     * @param pagamento os dados do pagamento
     * @return o pagamento criado
     * @throws ValidationException se validações falharem
     */
    @Transactional
    public Pagamento create(Pagamento pagamento) {
        log.info("Criando novo pagamento para profissional: {}", pagamento.getProfissional().getId());
        
        if (pagamento.getValor() == null || pagamento.getValor().compareTo(BigDecimal.ZERO) <= 0) {
            throw new ValidationException("Valor do pagamento deve ser maior que zero");
        }
        
        if (pagamento.getStatus() == null) {
            pagamento.setStatus(StatusPagamento.PENDENTE);
        }
        
        Pagamento saved = pagamentoRepository.save(pagamento);
        log.info("Pagamento criado com sucesso: ID {}", saved.getId());
        return saved;
    }
}
