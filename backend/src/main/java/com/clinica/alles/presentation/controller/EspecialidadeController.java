package com.clinica.alles.presentation.controller;

import com.clinica.alles.application.service.EspecialidadeService;
import com.clinica.alles.domain.especialidade.Especialidade;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

/**
 * Controller REST para gerenciamento de especialidades.
 */
@Slf4j
@RestController
@RequestMapping("/api/especialidades")
@RequiredArgsConstructor
@Tag(name = "Especialidades", description = "Operações de gerenciamento de especialidades")
public class EspecialidadeController {

    private final EspecialidadeService especialidadeService;

    /**
     * Busca todas as especialidades com paginação.
     */
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'CLINICA', 'PROFISSIONAL')")
    @Operation(summary = "Listar especialidades", description = "Retorna uma página de especialidades")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Lista de especialidades retornada com sucesso"),
            @ApiResponse(responseCode = "401", description = "Não autorizado")
    })
    public ResponseEntity<Page<Especialidade>> listar(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        log.debug("Listando especialidades com paginação: page={}, size={}", page, size);
        Pageable pageable = PageRequest.of(page, size);
        Page<Especialidade> especialidades = especialidadeService.findAll(pageable);
        return ResponseEntity.ok(especialidades);
    }

    /**
     * Busca uma especialidade pelo ID.
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'CLINICA', 'PROFISSIONAL')")
    @Operation(summary = "Buscar especialidade por ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Especialidade encontrada"),
            @ApiResponse(responseCode = "404", description = "Especialidade não encontrada")
    })
    public ResponseEntity<Especialidade> buscarPorId(@PathVariable Long id) {
        log.debug("Buscando especialidade com ID: {}", id);
        Especialidade especialidade = especialidadeService.findById(id);
        return ResponseEntity.ok(especialidade);
    }

    /**
     * Cria uma nova especialidade.
     */
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Criar especialidade")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Especialidade criada com sucesso"),
            @ApiResponse(responseCode = "400", description = "Erro de validação"),
            @ApiResponse(responseCode = "401", description = "Não autorizado")
    })
    public ResponseEntity<Especialidade> criar(@Valid @RequestBody Especialidade especialidade) {
        log.info("Criando nova especialidade: {}", especialidade.getNome());
        Especialidade criada = especialidadeService.create(especialidade);
        return ResponseEntity.status(HttpStatus.CREATED).body(criada);
    }

    /**
     * Atualiza uma especialidade existente.
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Atualizar especialidade")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Especialidade atualizada com sucesso"),
            @ApiResponse(responseCode = "404", description = "Especialidade não encontrada"),
            @ApiResponse(responseCode = "401", description = "Não autorizado")
    })
    public ResponseEntity<Especialidade> atualizar(
            @PathVariable Long id,
            @Valid @RequestBody Especialidade especialidade) {
        log.info("Atualizando especialidade: {}", id);
        Especialidade atualizada = especialidadeService.update(id, especialidade);
        return ResponseEntity.ok(atualizada);
    }

    /**
     * Deleta uma especialidade.
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Deletar especialidade")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Especialidade deletada com sucesso"),
            @ApiResponse(responseCode = "404", description = "Especialidade não encontrada"),
            @ApiResponse(responseCode = "401", description = "Não autorizado")
    })
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        log.info("Deletando especialidade: {}", id);
        especialidadeService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
