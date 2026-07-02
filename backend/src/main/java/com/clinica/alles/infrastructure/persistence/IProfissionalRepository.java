package com.clinica.alles.infrastructure.persistence;

import com.clinica.alles.domain.profissional.Profissional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repositório para gerenciar operações de persistência da entidade Profissional.
 */
@Repository
public interface IProfissionalRepository extends JpaRepository<Profissional, Long> {

    /**
     * Busca um profissional pelo CRM.
     *
     * @param crm o CRM do profissional
     * @return um Optional contendo o profissional se encontrado
     */
    Optional<Profissional> findByCrm(String crm);

    /**
     * Busca um profissional pelo CREFITO.
     *
     * @param crefito o CREFITO do profissional
     * @return um Optional contendo o profissional se encontrado
     */
    Optional<Profissional> findByCrefito(String crefito);

    /**
     * Busca um profissional pelo ID do usuário.
     *
     * @param usuarioId o ID do usuário
     * @return um Optional contendo o profissional se encontrado
     */
    Optional<Profissional> findByUsuarioId(Long usuarioId);

    /**
     * Busca todos os profissionais ativos.
     *
     * @return lista de profissionais ativos
     */
    java.util.List<Profissional> findByAtivoTrue();

    /**
     * Busca profissionais ativos por especialidade.
     *
     * @param especialidadeId o ID da especialidade
     * @return lista de profissionais ativos
     */
    java.util.List<Profissional> findByEspecialidadeIdAndAtivoTrue(Long especialidadeId);
}
