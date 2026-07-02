package com.clinica.alles.infrastructure.persistence;

import com.clinica.alles.domain.planosasaude.PlanoSaude;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repositório para gerenciar operações de persistência da entidade PlanoSaude.
 */
@Repository
public interface IPlanoSaudeRepository extends JpaRepository<PlanoSaude, Long> {

    /**
     * Busca um plano de saúde pelo nome.
     *
     * @param nome o nome do plano de saúde
     * @return um Optional contendo o plano se encontrado
     */
    Optional<PlanoSaude> findByNome(String nome);

    /**
     * Verifica se existe plano de saúde com nome informado.
     *
     * @param nome nome do plano
     * @return true se existir
     */
    boolean existsByNome(String nome);

    /**
     * Busca todos os planos de saúde ativos.
     *
     * @return lista de planos ativos
     */
    java.util.List<PlanoSaude> findByAtivoTrue();
}
