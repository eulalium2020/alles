package com.clinica.alles.application.service;

import com.clinica.alles.common.exception.ResourceNotFoundException;
import com.clinica.alles.common.exception.ValidationException;
import com.clinica.alles.domain.paciente.Paciente;
import com.clinica.alles.domain.planosasaude.PlanoSaude;
import com.clinica.alles.infrastructure.persistence.IPacienteRepository;
import com.clinica.alles.infrastructure.persistence.IPlanoSaudeRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

/**
 * Serviço para gerenciar operações de pacientes.
 * Implementa SOLID - Single Responsibility, Dependency Inversion.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class PacienteService {

    private final IPacienteRepository pacienteRepository;
    private final IPlanoSaudeRepository planoSaudeRepository;

    /**
     * Busca todos os pacientes com paginação.
     *
     * @param pageable informações de paginação
     * @return página de pacientes
     */
    public Page<Paciente> findAll(Pageable pageable) {
        log.debug("Buscando todos os pacientes com paginação: {}", pageable);
        return pacienteRepository.findAll(pageable);
    }

    /**
     * Busca todos os pacientes ativos.
     *
     * @return lista de pacientes ativos
     */
    public List<Paciente> findAllAtivos() {
        log.debug("Buscando todos os pacientes ativos");
        return pacienteRepository.findByAtivoTrue();
    }

    /**
     * Busca um paciente pelo ID.
     *
     * @param id o ID do paciente
     * @return o paciente encontrado
     * @throws ResourceNotFoundException se não encontrar
     */
    public Paciente findById(Long id) {
        log.debug("Buscando paciente por ID: {}", id);
        return pacienteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Paciente não encontrado com ID: " + id));
    }

    /**
     * Busca um paciente ativo pelo nome do usuário.
     * Atualmente o domínio utiliza o email como identificador de nome.
     *
     * @param nome o nome do usuário
     * @return o paciente encontrado
     */
    public Paciente findByUsuarioNome(String nome) {
        log.debug("Buscando paciente por nome de usuário: {}", nome);
        return pacienteRepository.findByUsuarioEmailIgnoreCaseAndAtivoTrue(nome)
                .orElseThrow(() -> new ResourceNotFoundException("Paciente não encontrado com nome: " + nome));
    }

    /**
     * Busca um paciente pelo CPF.
     *
     * @param cpf o CPF do paciente
     * @return o paciente encontrado
     * @throws ResourceNotFoundException se não encontrar
     */
    public Paciente findByCpf(String cpf) {
        log.debug("Buscando paciente por CPF: {}", cpf);
        return pacienteRepository.findByCpf(cpf)
                .orElseThrow(() -> new ResourceNotFoundException("Paciente não encontrado com CPF: " + cpf));
    }

    /**
     * Cria um novo paciente.
     *
     * @param paciente os dados do paciente
     * @return o paciente criado
     * @throws ValidationException se validações falharem
     */
    @Transactional
    public Paciente create(Paciente paciente) {
        log.info("Criando novo paciente: {}", paciente.getUsuario().getEmail());
        
        validarPaciente(paciente);
        
        if (pacienteRepository.existsByCpf(paciente.getCpf())) {
            throw new ValidationException("Já existe um paciente com este CPF");
        }
        
        Paciente saved = pacienteRepository.save(paciente);
        log.info("Paciente criado com sucesso: ID {}", saved.getId());
        return saved;
    }

    /**
     * Atualiza um paciente existente.
     *
     * @param id o ID do paciente
     * @param pacienteAtualizado os dados atualizados
     * @return o paciente atualizado
     * @throws ResourceNotFoundException se não encontrar
     */
    @Transactional
    public Paciente update(Long id, Paciente pacienteAtualizado) {
        log.info("Atualizando paciente: {}", id);
        
        Paciente paciente = findById(id);
        validarPaciente(pacienteAtualizado);
        
        paciente.setCpf(pacienteAtualizado.getCpf());
        paciente.setDataNascimento(pacienteAtualizado.getDataNascimento());
        paciente.setSexo(pacienteAtualizado.getSexo());
        paciente.setTelefone(pacienteAtualizado.getTelefone());
        paciente.setEndereco(pacienteAtualizado.getEndereco());
        paciente.setNumero(pacienteAtualizado.getNumero());
        paciente.setComplemento(pacienteAtualizado.getComplemento());
        paciente.setBairro(pacienteAtualizado.getBairro());
        paciente.setCidade(pacienteAtualizado.getCidade());
        paciente.setEstado(pacienteAtualizado.getEstado());
        paciente.setCep(pacienteAtualizado.getCep());
        paciente.setAlergias(pacienteAtualizado.getAlergias());
        paciente.setAntecedenteMedicos(pacienteAtualizado.getAntecedenteMedicos());
        
        Paciente updated = pacienteRepository.save(paciente);
        log.info("Paciente atualizado com sucesso: ID {}", updated.getId());
        return updated;
    }

    /**
     * Deleta um paciente (soft delete).
     *
     * @param id o ID do paciente
     * @throws ResourceNotFoundException se não encontrar
     */
    @Transactional
    public void delete(Long id) {
        log.info("Deletando paciente: {}", id);
        
        Paciente paciente = findById(id);
        paciente.setAtivo(false);
        pacienteRepository.save(paciente);
        
        log.info("Paciente deletado com sucesso: ID {}", id);
    }

    @Transactional
    public Set<PlanoSaude> addPlanoSaude(Long pacienteId, Long planoSaudeId) {
        Paciente paciente = findById(pacienteId);
        PlanoSaude planoSaude = planoSaudeRepository.findById(planoSaudeId)
                .orElseThrow(() -> new ResourceNotFoundException("Plano de saúde não encontrado com ID: " + planoSaudeId));

        if (!Boolean.TRUE.equals(planoSaude.getAtivo())) {
            throw new ValidationException("Não é possível vincular plano de saúde inativo");
        }

        paciente.getPlanosSaude().add(planoSaude);
        Paciente updated = pacienteRepository.save(paciente);
        return new HashSet<>(updated.getPlanosSaude());
    }

    @Transactional
    public Set<PlanoSaude> removePlanoSaude(Long pacienteId, Long planoSaudeId) {
        Paciente paciente = findById(pacienteId);
        PlanoSaude planoSaude = planoSaudeRepository.findById(planoSaudeId)
                .orElseThrow(() -> new ResourceNotFoundException("Plano de saúde não encontrado com ID: " + planoSaudeId));

        paciente.getPlanosSaude().remove(planoSaude);
        Paciente updated = pacienteRepository.save(paciente);
        return new HashSet<>(updated.getPlanosSaude());
    }

    @Transactional(readOnly = true)
    public Set<PlanoSaude> listPlanosSaude(Long pacienteId) {
        Paciente paciente = findById(pacienteId);
        return new HashSet<>(paciente.getPlanosSaude());
    }

    /**
     * Valida os dados do paciente.
     *
     * @param paciente o paciente a validar
     * @throws ValidationException se validação falhar
     */
    private void validarPaciente(Paciente paciente) {
        if (paciente.getUsuario() == null || paciente.getUsuario().getEmail() == null) {
            throw new ValidationException("Email do paciente é obrigatório");
        }
        
        if (paciente.getCpf() == null || paciente.getCpf().trim().isEmpty()) {
            throw new ValidationException("CPF do paciente é obrigatório");
        }
        
        if (paciente.getCpf().length() != 11) {
            throw new ValidationException("CPF deve ter 11 dígitos");
        }
    }
}
