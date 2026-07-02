package com.clinica.alles.infrastructure.persistence;

import com.clinica.alles.domain.pagamento.Pagamento;
import com.clinica.alles.domain.pagamento.StatusPagamento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

/**
 * Repositório para gerenciar operações de persistência da entidade Pagamento.
 */
@Repository
public interface IPagamentoRepository extends JpaRepository<Pagamento, Long> {

    /**
     * Busca pagamentos de um profissional específico.
     *
     * @param profissionalId o ID do profissional
     * @return lista de pagamentos do profissional
     */
    List<Pagamento> findByProfissionalId(Long profissionalId);

    /**
     * Busca pagamentos de um profissional com status específico.
     *
     * @param profissionalId o ID do profissional
     * @param status o status do pagamento
     * @return lista de pagamentos
     */
    List<Pagamento> findByProfissionalIdAndStatus(Long profissionalId, StatusPagamento status);

    /**
     * Busca pagamentos por período.
     *
     * @param dataInicio data inicial
     * @param dataFim data final
     * @return lista de pagamentos
     */
    List<Pagamento> findByDataPagamentoBetween(LocalDate dataInicio, LocalDate dataFim);

    /**
     * Busca um pagamento pela referência.
     *
     * @param referencia a referência do pagamento
     * @return um Optional contendo o pagamento se encontrado
     */
    Optional<Pagamento> findByReferencia(String referencia);
}
