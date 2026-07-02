package com.clinica.alles.application.service;

import com.clinica.alles.common.exception.ResourceNotFoundException;
import com.clinica.alles.common.exception.ValidationException;
import com.clinica.alles.domain.planosasaude.PlanoSaude;
import com.clinica.alles.infrastructure.persistence.IPlanoSaudeRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class PlanoSaudeService {

    private final IPlanoSaudeRepository planoSaudeRepository;

    public Page<PlanoSaude> findAll(Pageable pageable) {
        log.debug("Buscando planos de saúde com paginação: {}", pageable);
        return planoSaudeRepository.findAll(pageable);
    }

    public List<PlanoSaude> findAllAtivos() {
        log.debug("Buscando planos de saúde ativos");
        return planoSaudeRepository.findByAtivoTrue();
    }

    public PlanoSaude findById(Long id) {
        return planoSaudeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Plano de saúde não encontrado com ID: " + id));
    }

    @Transactional
    public PlanoSaude create(PlanoSaude planoSaude) {
        validarPlano(planoSaude);

        if (planoSaudeRepository.existsByNome(planoSaude.getNome())) {
            throw new ValidationException("Já existe plano de saúde com este nome");
        }

        PlanoSaude saved = planoSaudeRepository.save(planoSaude);
        log.info("Plano de saúde criado com sucesso: ID {}", saved.getId());
        return saved;
    }

    @Transactional
    public PlanoSaude update(Long id, PlanoSaude planoAtualizado) {
        validarPlano(planoAtualizado);

        PlanoSaude atual = findById(id);
        planoSaudeRepository.findByNome(planoAtualizado.getNome())
                .ifPresent(existing -> {
                    if (!existing.getId().equals(id)) {
                        throw new ValidationException("Já existe plano de saúde com este nome");
                    }
                });

        atual.setNome(planoAtualizado.getNome());
        atual.setDescricao(planoAtualizado.getDescricao());
        atual.setAtivo(planoAtualizado.getAtivo() != null ? planoAtualizado.getAtivo() : atual.getAtivo());

        PlanoSaude saved = planoSaudeRepository.save(atual);
        log.info("Plano de saúde atualizado com sucesso: ID {}", id);
        return saved;
    }

    @Transactional
    public void delete(Long id) {
        PlanoSaude plano = findById(id);
        plano.setAtivo(false);
        planoSaudeRepository.save(plano);
        log.info("Plano de saúde desativado com sucesso: ID {}", id);
    }

    private void validarPlano(PlanoSaude planoSaude) {
        if (planoSaude.getNome() == null || planoSaude.getNome().trim().isEmpty()) {
            throw new ValidationException("Nome do plano é obrigatório");
        }
    }
}
