package com.clinica.alles.presentation.controller;

import com.clinica.alles.application.service.ProfissionalService;
import com.clinica.alles.common.dto.ProfissionalRequest;
import com.clinica.alles.domain.profissional.Profissional;
import com.clinica.alles.domain.usuario.Usuario;
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
 * Controller REST para gerenciamento de profissionais de saúde.
 */
@Slf4j
@RestController
@RequestMapping("/api/profissionais")
@RequiredArgsConstructor
@Tag(name = "Profissionais", description = "Operações de gerenciamento de profissionais de saúde")
public class ProfissionalController {

    private final ProfissionalService profissionalService;

    /**
     * Busca todos os profissionais com paginação.
     *
     * @param page número da página (começando de 0)
     * @param size tamanho da página
     * @return página de profissionais
     */
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'CLINICA')")
    @Operation(summary = "Listar profissionais", description = "Retorna uma página de profissionais")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Lista de profissionais retornada com sucesso"),
            @ApiResponse(responseCode = "401", description = "Não autorizado"),
            @ApiResponse(responseCode = "403", description = "Acesso proibido")
    })
    public ResponseEntity<Page<Profissional>> listar(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        log.debug("Listando profissionais com paginação: page={}, size={}", page, size);
        Pageable pageable = PageRequest.of(page, size);
        Page<Profissional> profissionais = profissionalService.findAll(pageable);
        return ResponseEntity.ok(profissionais);
    }

    /**
     * Busca um profissional pelo ID.
     *
     * @param id ID do profissional
     * @return dados do profissional
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'CLINICA', 'PROFISSIONAL')")
    @Operation(summary = "Buscar profissional por ID", description = "Retorna os dados de um profissional específico")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Profissional encontrado"),
            @ApiResponse(responseCode = "404", description = "Profissional não encontrado"),
            @ApiResponse(responseCode = "401", description = "Não autorizado")
    })
    public ResponseEntity<Profissional> buscarPorId(@PathVariable Long id) {
        log.debug("Buscando profissional com ID: {}", id);
        Profissional profissional = profissionalService.findById(id);
        return ResponseEntity.ok(profissional);
    }

    /**
     * Cria um novo profissional.
     *
     * @param request dados do profissional
     * @return profissional criado
     */
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Criar profissional", description = "Cria um novo profissional de saúde")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Profissional criado com sucesso"),
            @ApiResponse(responseCode = "400", description = "Erro de validação"),
            @ApiResponse(responseCode = "401", description = "Não autorizado"),
            @ApiResponse(responseCode = "403", description = "Acesso proibido")
    })
    public ResponseEntity<Profissional> criar(@Valid @RequestBody ProfissionalRequest request) {
        log.info("Criando novo profissional: {}", request.getEmail());
        
        Profissional profissional = new Profissional();
        Usuario usuario = new Usuario();
        usuario.setEmail(request.getEmail());
        profissional.setUsuario(usuario);
        profissional.setCrm(request.getCrm());
        profissional.setCrefito(request.getCrefito());
        profissional.setBancoAgencia(request.getBancoAgencia());
        profissional.setBancoConta(request.getBancoConta());
        profissional.setValorConsultaParticular(request.getValorConsultaParticular());
        profissional.setValorConsultaPlano(request.getValorConsultaPlano());
        profissional.setPercentualReceita(request.getPercentualReceita());
        profissional.setDescontoClinicaPercentual(request.getDescontoClinicaPercentual());
        
        Profissional criado = profissionalService.create(profissional);
        return ResponseEntity.status(HttpStatus.CREATED).body(criado);
    }

    /**
     * Atualiza um profissional existente.
     *
     * @param id ID do profissional
     * @param request dados atualizados
     * @return profissional atualizado
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Atualizar profissional", description = "Atualiza os dados de um profissional existente")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Profissional atualizado com sucesso"),
            @ApiResponse(responseCode = "400", description = "Erro de validação"),
            @ApiResponse(responseCode = "404", description = "Profissional não encontrado"),
            @ApiResponse(responseCode = "401", description = "Não autorizado")
    })
    public ResponseEntity<Profissional> atualizar(
            @PathVariable Long id,
            @Valid @RequestBody ProfissionalRequest request) {
        log.info("Atualizando profissional com ID: {}", id);
        
        Profissional profissional = new Profissional();
        Usuario usuario = new Usuario();
        usuario.setEmail(request.getEmail());
        profissional.setUsuario(usuario);
        profissional.setCrm(request.getCrm());
        profissional.setCrefito(request.getCrefito());
        profissional.setBancoAgencia(request.getBancoAgencia());
        profissional.setBancoConta(request.getBancoConta());
        profissional.setValorConsultaParticular(request.getValorConsultaParticular());
        profissional.setValorConsultaPlano(request.getValorConsultaPlano());
        profissional.setPercentualReceita(request.getPercentualReceita());
        profissional.setDescontoClinicaPercentual(request.getDescontoClinicaPercentual());
        
        Profissional atualizado = profissionalService.update(id, profissional);
        return ResponseEntity.ok(atualizado);
    }

    /**
     * Deleta um profissional (soft delete).
     *
     * @param id ID do profissional
     * @return resposta vazia
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Deletar profissional", description = "Deleta um profissional (soft delete)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Profissional deletado com sucesso"),
            @ApiResponse(responseCode = "404", description = "Profissional não encontrado"),
            @ApiResponse(responseCode = "401", description = "Não autorizado")
    })
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        log.info("Deletando profissional com ID: {}", id);
        profissionalService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
