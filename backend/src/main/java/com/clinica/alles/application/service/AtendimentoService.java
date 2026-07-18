package com.clinica.alles.application.service;

import com.clinica.alles.common.exception.ResourceNotFoundException;
import com.clinica.alles.common.exception.ValidationException;
import com.clinica.alles.domain.atendimento.Atendimento;
import com.clinica.alles.domain.paciente.Paciente;
import com.clinica.alles.domain.profissional.Profissional;
import com.clinica.alles.infrastructure.persistence.IAtendimentoRepository;
import com.clinica.alles.infrastructure.persistence.IPacienteRepository;
import com.clinica.alles.infrastructure.persistence.IProfissionalRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

/**
 * Serviço para gerenciar operações de atendimentos.
 * Implementa SOLID - Single Responsibility, Dependency Inversion.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class AtendimentoService {

    private final IAtendimentoRepository atendimentoRepository;
    private final IProfissionalRepository profissionalRepository;
    private final IPacienteRepository pacienteRepository;

    /**
     * Busca todos os atendimentos com paginação.
     *
     * @param pageable informações de paginação
     * @return página de atendimentos
     */
    public Page<Atendimento> findAll(Pageable pageable) {
        log.debug("Buscando todos os atendimentos com paginação: {}", pageable);
        return atendimentoRepository.findAll(pageable);
    }

    /**
     * Busca um atendimento pelo ID.
     *
     * @param id o ID do atendimento
     * @return o atendimento encontrado
     * @throws ResourceNotFoundException se não encontrar
     */
    public Atendimento findById(Long id) {
        log.debug("Buscando atendimento por ID: {}", id);
        return atendimentoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Atendimento não encontrado com ID: " + id));
    }

    /**
     * Agenda um novo atendimento.
     *
     * @param profId o ID do profissional
     * @param pacId o ID do paciente
     * @param dataHora a data e hora do atendimento
     * @return o atendimento agendado
     * @throws ResourceNotFoundException se profissional ou paciente não forem encontrados
     * @throws ValidationException se validações falharem
     */
    @Transactional
    public Atendimento agendar(Long profId, Long pacId, LocalDateTime dataHora) {
        log.info("Agendando atendimento: profissional {}, paciente {}, data {}", profId, pacId, dataHora);
        
        if (dataHora == null || dataHora.isBefore(LocalDateTime.now())) {
            throw new ValidationException("Data e hora do atendimento deve ser no futuro");
        }
        
        Profissional profissional = profissionalRepository.findById(profId)
                .orElseThrow(() -> new ResourceNotFoundException("Profissional não encontrado com ID: " + profId));
        
        Paciente paciente = pacienteRepository.findById(pacId)
                .orElseThrow(() -> new ResourceNotFoundException("Paciente não encontrado com ID: " + pacId));
        
        if (!profissional.getAtivo()) {
            throw new ValidationException("Profissional não está ativo");
        }
        
        if (!paciente.getAtivo()) {
            throw new ValidationException("Paciente não está ativo");
        }
        
        if (!verificarDisponibilidade(profId, dataHora)) {
            throw new ValidationException("Profissional não está disponível nesta data e hora");
        }
        
        Atendimento atendimento = new Atendimento();
        atendimento.setProfissional(profissional);
        atendimento.setPaciente(paciente);
        atendimento.setDataHora(dataHora);
        
        Atendimento saved = atendimentoRepository.save(atendimento);
        log.info("Atendimento agendado com sucesso: ID {}", saved.getId());
        return saved;
    }

    /**
     * Registra a presença em um atendimento.
     *
     * @param id o ID do atendimento
     * @param anotacoes as anotações da consulta
     * @return o atendimento atualizado
     * @throws ResourceNotFoundException se não encontrar
     */
    @Transactional
    public Atendimento registrarPresenca(Long id, String anotacoes) {
        log.info("Registrando presença do atendimento: {}", id);
        
        Atendimento atendimento = findById(id);
        atendimento.setDataFim(LocalDateTime.now());
        atendimento.setNotasConsulta(anotacoes);
        
        Atendimento updated = atendimentoRepository.save(atendimento);
        log.info("Presença registrada com sucesso: ID {}", updated.getId());
        return updated;
    }

    /**
     * Cancela um atendimento.
     *
     * @param id o ID do atendimento
     * @param motivo o motivo do cancelamento
     * @return o atendimento atualizado
     * @throws ResourceNotFoundException se não encontrar
     */
    @Transactional
    public Atendimento cancelar(Long id, String motivo) {
        log.info("Cancelando atendimento: {}", id);
        
        Atendimento atendimento = findById(id);
        
        if (atendimento.getDataFim() != null) {
            throw new ValidationException("Não é possível cancelar um atendimento que já foi realizado");
        }
        
        atendimento.setDiagnostico("[CANCELADO] " + (motivo != null ? motivo : "Sem motivo especificado"));
        
        Atendimento updated = atendimentoRepository.save(atendimento);
        log.info("Atendimento cancelado com sucesso: ID {}", updated.getId());
        return updated;
    }

    /**
     * Remove um atendimento pelo ID.
     *
     * @param id o ID do atendimento
     * @throws ResourceNotFoundException se não encontrar
     */
    @Transactional
    public void delete(Long id) {
        log.info("Deletando atendimento: {}", id);
        if (!atendimentoRepository.existsById(id)) {
            throw new ResourceNotFoundException("Atendimento não encontrado com ID: " + id);
        }
        atendimentoRepository.deleteById(id);
    }

    /**
     * Atualiza os dados de um atendimento.
     *
     * @param id o ID do atendimento
     * @param profId novo ID do profissional (ou null para manter)
     * @param pacId novo ID do paciente (ou null para manter)
     * @param dataHora nova data/hora (ou null para manter)
     * @return o atendimento atualizado
     */
    @Transactional
    public Atendimento update(Long id, Long profId, Long pacId, LocalDateTime dataHora) {
        log.info("Atualizando atendimento: {}", id);

        Atendimento atendimento = findById(id);

        if (dataHora != null && dataHora.isBefore(LocalDateTime.now())) {
            throw new ValidationException("Data e hora do atendimento deve ser no futuro");
        }

        if (profId != null && !profId.equals(atendimento.getProfissional().getId())) {
            Profissional profissional = profissionalRepository.findById(profId)
                    .orElseThrow(() -> new ResourceNotFoundException("Profissional não encontrado com ID: " + profId));
            if (!profissional.getAtivo()) {
                throw new ValidationException("Profissional não está ativo");
            }
            atendimento.setProfissional(profissional);
        }

        if (pacId != null && !pacId.equals(atendimento.getPaciente().getId())) {
            Paciente paciente = pacienteRepository.findById(pacId)
                    .orElseThrow(() -> new ResourceNotFoundException("Paciente não encontrado com ID: " + pacId));
            if (!paciente.getAtivo()) {
                throw new ValidationException("Paciente não está ativo");
            }
            atendimento.setPaciente(paciente);
        }

        if (dataHora != null) {
            atendimento.setDataHora(dataHora);
        }

        Atendimento updated = atendimentoRepository.save(atendimento);
        log.info("Atendimento atualizado com sucesso: ID {}", updated.getId());
        return updated;
    }

    /**
     * Verifica se um profissional está disponível em uma data e hora específicas.
     * A disponibilidade é definida como não ter outro atendimento agendado no mesmo horário.
     *
     * @param profId o ID do profissional
     * @param dataHora a data e hora a verificar
     * @return true se disponível, false caso contrário
     */
    public boolean verificarDisponibilidade(Long profId, LocalDateTime dataHora) {
        log.debug("Verificando disponibilidade do profissional {} em {}", profId, dataHora);
        
        var atendimentosProfissional = atendimentoRepository.findByProfissionalId(profId);
        
        LocalDateTime inicioJanela = dataHora.minusHours(1);
        LocalDateTime fimJanela = dataHora.plusHours(1);
        
        return atendimentosProfissional.stream()
                .filter(a -> a.getDataHora() != null && a.getDataFim() == null)
                .noneMatch(a -> !a.getDataHora().isBefore(inicioJanela) && !a.getDataHora().isAfter(fimJanela));
    }
}
