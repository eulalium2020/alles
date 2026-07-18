package com.clinica.alles.infrastructure.persistence;

import com.clinica.alles.domain.atendimento.Atendimento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Repositório para gerenciar operações de persistência da entidade Atendimento.
 */
@Repository
public interface IAtendimentoRepository extends JpaRepository<Atendimento, Long> {

    /**
     * Busca atendimentos de um paciente específico.
     *
     * @param pacienteId o ID do paciente
     * @return lista de atendimentos do paciente
     */
    List<Atendimento> findByPacienteId(Long pacienteId);

    /**
     * Busca atendimentos de um profissional específico.
     *
     * @param profissionalId o ID do profissional
     * @return lista de atendimentos do profissional
     */
    List<Atendimento> findByProfissionalId(Long profissionalId);

    /**
     * Busca atendimentos em um período de tempo.
     *
     * @param dataHoraInicio data inicial
     * @param dataFim data final
     * @return lista de atendimentos no período
     */
    List<Atendimento> findByDataHoraBetween(LocalDateTime dataHoraInicio, LocalDateTime dataFim);
}
