package com.clinica.alles.presentation.controller;

import com.clinica.alles.application.service.PlanoSaudeService;
import com.clinica.alles.common.dto.PlanoSaudeRequest;
import com.clinica.alles.domain.planosasaude.PlanoSaude;
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

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/planos-saude")
@RequiredArgsConstructor
@Tag(name = "Planos de Saúde", description = "Operações de gerenciamento de planos de saúde")
public class PlanoSaudeController {

    private final PlanoSaudeService planoSaudeService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'GERENTE', 'PROFISSIONAL')")
    @Operation(summary = "Listar planos", description = "Retorna planos de saúde com paginação")
    @ApiResponse(responseCode = "200", description = "Lista retornada com sucesso")
    public ResponseEntity<Page<PlanoSaude>> listar(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(planoSaudeService.findAll(pageable));
    }

    @GetMapping("/ativos")
    @PreAuthorize("hasAnyRole('ADMIN', 'GERENTE', 'PROFISSIONAL')")
    @Operation(summary = "Listar planos ativos", description = "Retorna apenas planos ativos")
    @ApiResponse(responseCode = "200", description = "Lista retornada com sucesso")
    public ResponseEntity<List<PlanoSaude>> listarAtivos() {
        return ResponseEntity.ok(planoSaudeService.findAllAtivos());
    }

    @GetMapping("/nomes")
    @PreAuthorize("hasAnyRole('ADMIN', 'GERENTE', 'PROFISSIONAL')")
    @Operation(summary = "Listar nomes de planos", description = "Retorna nomes e identificadores de planos ativos")
    @ApiResponse(responseCode = "200", description = "Lista retornada com sucesso")
    public ResponseEntity<List<Map<String, Object>>> listarNomes() {
        log.debug("Listando nomes de planos de saúde ativos");
        List<Map<String, Object>> planos = planoSaudeService.findAllAtivos().stream()
                .map(plano -> {
                    Map<String, Object> item = new LinkedHashMap<>();
                    item.put("id", plano.getId());
                    item.put("nome", plano.getNome());
                    return item;
                })
                .toList();
        return ResponseEntity.ok(planos);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'GERENTE', 'PROFISSIONAL')")
    @Operation(summary = "Buscar plano por ID", description = "Retorna plano de saúde específico")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Plano encontrado"),
            @ApiResponse(responseCode = "404", description = "Plano não encontrado")
    })
    public ResponseEntity<PlanoSaude> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(planoSaudeService.findById(id));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'GERENTE')")
    @Operation(summary = "Criar plano", description = "Cria um novo plano de saúde")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Plano criado com sucesso"),
            @ApiResponse(responseCode = "400", description = "Erro de validação")
    })
    public ResponseEntity<PlanoSaude> criar(@Valid @RequestBody PlanoSaudeRequest request) {
        PlanoSaude planoSaude = new PlanoSaude();
        planoSaude.setNome(request.getNome());
        planoSaude.setDescricao(request.getDescricao());
        planoSaude.setAtivo(true);

        PlanoSaude criado = planoSaudeService.create(planoSaude);
        return ResponseEntity.status(HttpStatus.CREATED).body(criado);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'GERENTE')")
    @Operation(summary = "Atualizar plano", description = "Atualiza dados de um plano de saúde")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Plano atualizado com sucesso"),
            @ApiResponse(responseCode = "404", description = "Plano não encontrado")
    })
    public ResponseEntity<PlanoSaude> atualizar(
            @PathVariable Long id,
            @Valid @RequestBody PlanoSaudeRequest request) {
        PlanoSaude planoSaude = new PlanoSaude();
        planoSaude.setNome(request.getNome());
        planoSaude.setDescricao(request.getDescricao());

        return ResponseEntity.ok(planoSaudeService.update(id, planoSaude));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Desativar plano", description = "Desativa um plano de saúde (soft delete)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Plano desativado com sucesso"),
            @ApiResponse(responseCode = "404", description = "Plano não encontrado")
    })
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        planoSaudeService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
