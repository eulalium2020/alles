package com.clinica.alles.application.service;

import com.clinica.alles.common.exception.ResourceNotFoundException;
import com.clinica.alles.common.exception.ValidationException;
import com.clinica.alles.domain.especialidade.Especialidade;
import com.clinica.alles.domain.profissional.Profissional;
import com.clinica.alles.domain.profissional.TipoPagamento;
import com.clinica.alles.infrastructure.persistence.IEspecialidadeRepository;
import com.clinica.alles.infrastructure.persistence.IProfissionalRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

/**
 * Serviço para gerenciar operações de profissionais de saúde.
 * Implementa SOLID - Single Responsibility, Dependency Inversion.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class ProfissionalService {

    private final IProfissionalRepository profissionalRepository;
    private final IEspecialidadeRepository especialidadeRepository;

    /**
     * Busca todos os profissionais com paginação.
     *
     * @param pageable informações de paginação
     * @return página de profissionais
     */
    public Page<Profissional> findAll(Pageable pageable) {
        log.debug("Buscando todos os profissionais com paginação: {}", pageable);
        return profissionalRepository.findAll(pageable);
    }

    /**
     * Busca um profissional pelo ID.
     *
     * @param id o ID do profissional
     * @return o profissional encontrado
     * @throws ResourceNotFoundException se não encontrar
     */
    public Profissional findById(Long id) {
        log.debug("Buscando profissional por ID: {}", id);
        return profissionalRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Profissional não encontrado com ID: " + id));
    }

    /**
     * Cria um novo profissional.
     *
     * @param profissional os dados do profissional
     * @return o profissional criado
     * @throws ValidationException se validações falharem
     */
    @Transactional
    public Profissional create(Profissional profissional) {
        log.info("Criando novo profissional: {}", profissional.getUsuario().getEmail());
        
        validarProfissional(profissional);
        
        if (profissional.getEspecialidade() != null && profissional.getEspecialidade().getId() != null) {
            Especialidade esp = especialidadeRepository.findById(profissional.getEspecialidade().getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Especialidade não encontrada"));
            profissional.setEspecialidade(esp);
        }
        
        Profissional saved = profissionalRepository.save(profissional);
        log.info("Profissional criado com sucesso: ID {}", saved.getId());
        return saved;
    }

    /**
     * Atualiza um profissional existente.
     *
     * @param id o ID do profissional
     * @param profissionalAtualizado os dados atualizados
     * @return o profissional atualizado
     * @throws ResourceNotFoundException se não encontrar
     */
    @Transactional
    public Profissional update(Long id, Profissional profissionalAtualizado) {
        log.info("Atualizando profissional: {}", id);
        
        Profissional profissional = findById(id);
        validarProfissional(profissionalAtualizado);
        
        if (profissionalAtualizado.getEspecialidade() != null && profissionalAtualizado.getEspecialidade().getId() != null) {
            Especialidade esp = especialidadeRepository.findById(profissionalAtualizado.getEspecialidade().getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Especialidade não encontrada"));
            profissional.setEspecialidade(esp);
        }
        
        profissional.setCrm(profissionalAtualizado.getCrm());
        profissional.setCrefito(profissionalAtualizado.getCrefito());
        profissional.setBancoAgencia(profissionalAtualizado.getBancoAgencia());
        profissional.setBancoConta(profissionalAtualizado.getBancoConta());
        profissional.setTipoPagamento(profissionalAtualizado.getTipoPagamento());
        profissional.setValorConsultaParticular(profissionalAtualizado.getValorConsultaParticular());
        profissional.setValorConsultaPlano(profissionalAtualizado.getValorConsultaPlano());
        profissional.setPercentualReceita(profissionalAtualizado.getPercentualReceita());
        profissional.setDescontoClinicaPercentual(profissionalAtualizado.getDescontoClinicaPercentual());
        
        Profissional updated = profissionalRepository.save(profissional);
        log.info("Profissional atualizado com sucesso: ID {}", updated.getId());
        return updated;
    }

    /**
     * Deleta um profissional (soft delete).
     *
     * @param id o ID do profissional
     * @throws ResourceNotFoundException se não encontrar
     */
    @Transactional
    public void delete(Long id) {
        log.info("Deletando profissional: {}", id);
        
        Profissional profissional = findById(id);
        profissional.setAtivo(false);
        profissionalRepository.save(profissional);
        
        log.info("Profissional deletado com sucesso: ID {}", id);
    }

    /**
     * Calcula o valor de consulta baseado no tipo de pagamento.
     *
     * @param profId o ID do profissional
     * @param tipo o tipo de pagamento
     * @return o valor da consulta
     * @throws ResourceNotFoundException se não encontrar
     */
    public BigDecimal calcularValorConsulta(Long profId, TipoPagamento tipo) {
        log.debug("Calculando valor de consulta: profissional {}, tipo {}", profId, tipo);
        
        Profissional profissional = findById(profId);
        
        return switch (tipo) {
            case FIXO_POR_CONSULTA -> profissional.getValorConsultaParticular();
            case PERCENTUAL_RECEITA -> profissional.getValorConsultaPlano();
            case AMBOS -> profissional.getValorConsultaParticular();
        };
    }

    /**
     * Busca todos os profissionais de uma especialidade específica.
     *
     * @param especId o ID da especialidade
     * @return lista de profissionais da especialidade
     */
    public List<Profissional> findByEspecialidade(Long especId) {
        log.debug("Buscando profissionais por especialidade: {}", especId);
        
        Especialidade especialidade = especialidadeRepository.findById(especId)
                .orElseThrow(() -> new ResourceNotFoundException("Especialidade não encontrada com ID: " + especId));
        
        return profissionalRepository.findByEspecialidadeIdAndAtivoTrue(especId);
    }

    /**
     * Valida os dados do profissional.
     *
     * @param profissional o profissional a validar
     * @throws ValidationException se validação falhar
     */
    private void validarProfissional(Profissional profissional) {
        if (profissional.getUsuario() == null || profissional.getUsuario().getEmail() == null) {
            throw new ValidationException("Email do profissional é obrigatório");
        }
        
        if (profissional.getTipoPagamento() == null) {
            throw new ValidationException("Tipo de pagamento é obrigatório");
        }
        
        if (profissional.getValorConsultaParticular() == null || 
            profissional.getValorConsultaParticular().compareTo(BigDecimal.ZERO) <= 0) {
            throw new ValidationException("Valor de consulta particular deve ser maior que zero");
        }
    }
}
