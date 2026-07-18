package com.clinica.alles.presentation.controller;

import com.clinica.alles.application.service.AtendimentoService;
import com.clinica.alles.common.dto.AgendarRequest;
import com.clinica.alles.common.dto.CancelarRequest;
import com.clinica.alles.common.dto.PresencaRequest;
import com.clinica.alles.domain.atendimento.Atendimento;
import com.clinica.alles.domain.atendimento.AtendimentoResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

/**
 * Controller REST para gerenciamento de atendimentos.
 */
@Slf4j
@RestController
@RequestMapping("/api/atendimentos")
@RequiredArgsConstructor
@Tag(name = "Atendimentos", description = "Operações de gerenciamento de atendimentos")
public class AtendimentoController {

    private final AtendimentoService atendimentoService;

    /**
     * Busca todos os atendimentos com paginação.
     *
     * @param page número da página (começando de 0)
     * @param size tamanho da página
     * @return página de atendimentos
     */
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'CLINICA', 'PROFISSIONAL')")
    @Operation(summary = "Listar atendimentos", description = "Retorna uma página de atendimentos")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Lista de atendimentos retornada com sucesso"),
            @ApiResponse(responseCode = "401", description = "Não autorizado"),
            @ApiResponse(responseCode = "403", description = "Acesso proibido")
    })
    public ResponseEntity<Page<AtendimentoResponse>> listar(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        log.debug("Listando atendimentos com paginação: page={}, size={}", page, size);
        Pageable pageable = PageRequest.of(page, size);
        Page<Atendimento> atendimentos = atendimentoService.findAll(pageable);
        Page<AtendimentoResponse> responses = atendimentos.map(AtendimentoResponse::fromEntity);
        return ResponseEntity.ok(responses);
    }

    /**
     * Busca um atendimento pelo ID.
     *
     * @param id ID do atendimento
     * @return dados do atendimento
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'CLINICA', 'PROFISSIONAL')")
    @Operation(summary = "Buscar atendimento por ID", description = "Retorna os dados de um atendimento específico")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Atendimento encontrado"),
            @ApiResponse(responseCode = "404", description = "Atendimento não encontrado"),
            @ApiResponse(responseCode = "401", description = "Não autorizado")
    })
    public ResponseEntity<AtendimentoResponse> buscarPorId(@PathVariable Long id) {
        log.debug("Buscando atendimento com ID: {}", id);
        Atendimento atendimento = atendimentoService.findById(id);
        return ResponseEntity.ok(AtendimentoResponse.fromEntity(atendimento));
    }

    /**
     * Atualiza um atendimento.
     *
     * @param id ID do atendimento
     * @param request novos dados do atendimento
     * @return atendimento atualizado
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'CLINICA', 'PROFISSIONAL')")
    @Operation(summary = "Atualizar atendimento", description = "Atualiza os dados de um atendimento")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Atendimento atualizado com sucesso"),
            @ApiResponse(responseCode = "400", description = "Erro de validação"),
            @ApiResponse(responseCode = "404", description = "Atendimento não encontrado"),
            @ApiResponse(responseCode = "401", description = "Não autorizado")
    })
    public ResponseEntity<AtendimentoResponse> atualizar(
            @PathVariable Long id,
            @Valid @RequestBody AgendarRequest request) {
        log.info("Atualizando atendimento: {}", id);
        Atendimento atendimento = atendimentoService.update(
                id,
                request.getProfissionalId(),
                request.getPacienteId(),
                request.getDataHora()
        );
        return ResponseEntity.ok(AtendimentoResponse.fromEntity(atendimento));
    }

    /**
     * Remove um atendimento.
     *
     * @param id ID do atendimento
     * @return sem conteúdo
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'CLINICA')")
    @Operation(summary = "Deletar atendimento", description = "Remove um atendimento pelo ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Atendimento removido com sucesso"),
            @ApiResponse(responseCode = "404", description = "Atendimento não encontrado"),
            @ApiResponse(responseCode = "401", description = "Não autorizado")
    })
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        log.info("Deletando atendimento: {}", id);
        atendimentoService.delete(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Agenda um novo atendimento.
     *
     * @param request dados do agendamento
     * @return atendimento agendado
     */
    @PostMapping("/agendar")
    @PreAuthorize("hasAnyRole('ADMIN', 'CLINICA', 'PROFISSIONAL')")
    @Operation(summary = "Agendar atendimento", description = "Agenda um novo atendimento entre profissional e paciente")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Atendimento agendado com sucesso"),
            @ApiResponse(responseCode = "400", description = "Erro de validação"),
            @ApiResponse(responseCode = "401", description = "Não autorizado"),
            @ApiResponse(responseCode = "404", description = "Profissional ou paciente não encontrado")
    })
    public ResponseEntity<AtendimentoResponse> agendar(@Valid @RequestBody AgendarRequest request) {
        log.info("Agendando atendimento para profissional {} e paciente {}", 
                request.getProfissionalId(), request.getPacienteId());
        
        Atendimento atendimento = atendimentoService.agendar(
                request.getProfissionalId(),
                request.getPacienteId(),
                request.getDataHora()
        );
        
        return ResponseEntity.status(HttpStatus.CREATED).body(AtendimentoResponse.fromEntity(atendimento));
    }

    /**
     * Registra a presença em um atendimento.
     *
     * @param id ID do atendimento
     * @param request dados da presença
     * @return atendimento atualizado
     */
    @PostMapping("/{id}/registrar")
    @PreAuthorize("hasAnyRole('ADMIN', 'CLINICA', 'PROFISSIONAL')")
    @Operation(summary = "Registrar presença", description = "Registra a presença em um atendimento")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Presença registrada com sucesso"),
            @ApiResponse(responseCode = "400", description = "Erro de validação"),
            @ApiResponse(responseCode = "404", description = "Atendimento não encontrado"),
            @ApiResponse(responseCode = "401", description = "Não autorizado")
    })
    public ResponseEntity<AtendimentoResponse> registrarPresenca(
            @PathVariable Long id,
            @Valid @RequestBody PresencaRequest request) {
        log.info("Registrando presença no atendimento: {}", id);
        
        Atendimento atendimento = atendimentoService.registrarPresenca(id, request.getAnotacoes());
        return ResponseEntity.ok(AtendimentoResponse.fromEntity(atendimento));
    }

    /**
     * Cancela um atendimento.
     *
     * @param id ID do atendimento
     * @param request motivo do cancelamento
     * @return atendimento cancelado
     */
    @PostMapping("/{id}/cancelar")
    @PreAuthorize("hasAnyRole('ADMIN', 'CLINICA', 'PROFISSIONAL')")
    @Operation(summary = "Cancelar atendimento", description = "Cancela um atendimento agendado")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Atendimento cancelado com sucesso"),
            @ApiResponse(responseCode = "400", description = "Erro na operação"),
            @ApiResponse(responseCode = "404", description = "Atendimento não encontrado"),
            @ApiResponse(responseCode = "401", description = "Não autorizado")
    })
    public ResponseEntity<AtendimentoResponse> cancelar(
            @PathVariable Long id,
            @Valid @RequestBody CancelarRequest request) {
        log.info("Cancelando atendimento: {}", id);
        
        Atendimento atendimento = atendimentoService.cancelar(id, request.getMotivo());
        return ResponseEntity.ok(AtendimentoResponse.fromEntity(atendimento));
    }
}
