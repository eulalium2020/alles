package com.clinica.alles.infrastructure.persistence;

import com.clinica.alles.domain.paciente.Paciente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repositório para gerenciar operações de persistência da entidade Paciente.
 */
@Repository
public interface IPacienteRepository extends JpaRepository<Paciente, Long> {

    /**
     * Busca um paciente pelo CPF.
     *
     * @param cpf o CPF do paciente
     * @return um Optional contendo o paciente se encontrado
     */
    Optional<Paciente> findByCpf(String cpf);

    /**
     * Busca um paciente pelo ID do usuário.
     *
     * @param usuarioId o ID do usuário
     * @return um Optional contendo o paciente se encontrado
     */
    Optional<Paciente> findByUsuarioId(Long usuarioId);

    /**
     * Busca um paciente ativo pelo email do usuário.
     *
     * @param email o email do usuário
     * @return um Optional contendo o paciente se encontrado
     */
    Optional<Paciente> findByUsuarioEmailIgnoreCaseAndAtivoTrue(String email);

    /**
     * Busca todos os pacientes ativos.
     *
     * @return lista de pacientes ativos
     */
    java.util.List<Paciente> findByAtivoTrue();

    /**
     * Verifica se existe um paciente com o CPF informado.
     *
     * @param cpf o CPF a verificar
     * @return true se existe, false caso contrário
     */
    boolean existsByCpf(String cpf);
}
