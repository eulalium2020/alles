package com.clinica.alles.application.service;

import com.clinica.alles.common.exception.ResourceNotFoundException;
import com.clinica.alles.domain.especialidade.Especialidade;
import com.clinica.alles.infrastructure.persistence.IEspecialidadeRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Serviço para gerenciar operações de especialidades.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class EspecialidadeService {

    private final IEspecialidadeRepository especialidadeRepository;

    /**
     * Busca todas as especialidades com paginação.
     */
    public Page<Especialidade> findAll(Pageable pageable) {
        log.debug("Buscando todas as especialidades com paginação");
        return especialidadeRepository.findAll(pageable);
    }

    /**
     * Busca uma especialidade pelo ID.
     */
    public Especialidade findById(Long id) {
        log.debug("Buscando especialidade por ID: {}", id);
        return especialidadeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Especialidade não encontrada com ID: " + id));
    }

    /**
     * Cria uma nova especialidade.
     */
    @Transactional
    public Especialidade create(Especialidade especialidade) {
        log.info("Criando nova especialidade: {}", especialidade.getNome());
        return especialidadeRepository.save(especialidade);
    }

    /**
     * Atualiza uma especialidade existente.
     */
    @Transactional
    public Especialidade update(Long id, Especialidade especialidadeData) {
        log.info("Atualizando especialidade: {}", id);
        Especialidade especialidade = findById(id);
        
        if (especialidadeData.getNome() != null) {
            especialidade.setNome(especialidadeData.getNome());
        }
        if (especialidadeData.getDescricao() != null) {
            especialidade.setDescricao(especialidadeData.getDescricao());
        }
        if (especialidadeData.getAtivo() != null) {
            especialidade.setAtivo(especialidadeData.getAtivo());
        }
        
        return especialidadeRepository.save(especialidade);
    }

    /**
     * Deleta uma especialidade.
     */
    @Transactional
    public void delete(Long id) {
        log.info("Deletando especialidade: {}", id);
        if (!especialidadeRepository.existsById(id)) {
            throw new ResourceNotFoundException("Especialidade não encontrada com ID: " + id);
        }
        especialidadeRepository.deleteById(id);
    }
}
