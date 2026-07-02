package com.clinica.alles.infrastructure.persistence;

import com.clinica.alles.domain.especialidade.Especialidade;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repositório para gerenciar operações de persistência da entidade Especialidade.
 */
@Repository
public interface IEspecialidadeRepository extends JpaRepository<Especialidade, Long> {

    /**
     * Busca uma especialidade pelo nome.
     *
     * @param nome o nome da especialidade
     * @return um Optional contendo a especialidade se encontrada
     */
    Optional<Especialidade> findByNome(String nome);

    /**
     * Busca todas as especialidades ativas.
     *
     * @return lista de especialidades ativas
     */
    java.util.List<Especialidade> findByAtivoTrue();
}
