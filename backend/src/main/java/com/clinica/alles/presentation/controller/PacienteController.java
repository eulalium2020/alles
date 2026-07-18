package com.clinica.alles.presentation.controller;

import com.clinica.alles.application.service.PacienteService;
import com.clinica.alles.common.dto.PacienteRequest;
import com.clinica.alles.domain.paciente.Paciente;
import com.clinica.alles.domain.planosasaude.PlanoSaude;
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

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

/**
 * Controller REST para gerenciamento de pacientes.
 */
@Slf4j
@RestController
@RequestMapping("/api/pacientes")
@RequiredArgsConstructor
@Tag(name = "Pacientes", description = "Operações de gerenciamento de pacientes")
public class PacienteController {

    private final PacienteService pacienteService;

    /**
     * Busca todos os pacientes com paginação.
     *
     * @param page número da página (começando de 0)
     * @param size tamanho da página
     * @return página de pacientes
     */
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'CLINICA', 'PROFISSIONAL')")
    @Operation(summary = "Listar pacientes", description = "Retorna uma página de pacientes")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Lista de pacientes retornada com sucesso"),
            @ApiResponse(responseCode = "401", description = "Não autorizado"),
            @ApiResponse(responseCode = "403", description = "Acesso proibido")
    })
    public ResponseEntity<Page<Paciente>> listar(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        log.debug("Listando pacientes com paginação: page={}, size={}", page, size);
        Pageable pageable = PageRequest.of(page, size);
        Page<Paciente> pacientes = pacienteService.findAll(pageable);
        return ResponseEntity.ok(pacientes);
    }

    @GetMapping("/nomes")
    @PreAuthorize("hasAnyRole('ADMIN', 'CLINICA', 'PROFISSIONAL')")
    @Operation(summary = "Listar nomes de pacientes", description = "Retorna nomes e identificadores de pacientes ativos")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Lista de nomes retornada com sucesso"),
            @ApiResponse(responseCode = "401", description = "Não autorizado"),
            @ApiResponse(responseCode = "403", description = "Acesso proibido")
    })
    public ResponseEntity<List<Map<String, Object>>> listarNomes() {
        log.debug("Listando nomes de pacientes ativos");
        List<Map<String, Object>> pacientes = pacienteService.findAllAtivos().stream()
                .map(paciente -> {
                    String nome = paciente.getUsuario() != null ? paciente.getUsuario().getEmail() : "";
                    String cpf = paciente.getCpf();
                    Map<String, Object> item = new LinkedHashMap<>();
                    item.put("id", paciente.getId());
                    item.put("nome", nome);
                    item.put("cpf", cpf);
                    item.put("display", "%s (CPF: %s)".formatted(nome, cpf != null ? cpf : ""));
                    return item;
                })
                .toList();
        return ResponseEntity.ok(pacientes);
    }

    @GetMapping("/by-nome/{nome}")
    @PreAuthorize("hasAnyRole('ADMIN', 'CLINICA', 'PROFISSIONAL')")
    @Operation(summary = "Buscar paciente por nome", description = "Retorna os dados de um paciente pelo nome do usuário")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Paciente encontrado"),
            @ApiResponse(responseCode = "404", description = "Paciente não encontrado"),
            @ApiResponse(responseCode = "401", description = "Não autorizado")
    })
    public ResponseEntity<Paciente> buscarPorNome(@PathVariable String nome) {
        log.debug("Buscando paciente por nome: {}", nome);
        Paciente paciente = pacienteService.findByUsuarioNome(nome);
        return ResponseEntity.ok(paciente);
    }

    /**
     * Busca um paciente pelo ID.
     *
     * @param id ID do paciente
     * @return dados do paciente
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'CLINICA', 'PROFISSIONAL')")
    @Operation(summary = "Buscar paciente por ID", description = "Retorna os dados de um paciente específico")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Paciente encontrado"),
            @ApiResponse(responseCode = "404", description = "Paciente não encontrado"),
            @ApiResponse(responseCode = "401", description = "Não autorizado")
    })
    public ResponseEntity<Paciente> buscarPorId(@PathVariable Long id) {
        log.debug("Buscando paciente com ID: {}", id);
        Paciente paciente = pacienteService.findById(id);
        return ResponseEntity.ok(paciente);
    }

    /**
     * Cria um novo paciente.
     *
     * @param request dados do paciente
     * @return paciente criado
     */
    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'CLINICA')")
    @Operation(summary = "Criar paciente", description = "Cria um novo paciente")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Paciente criado com sucesso"),
            @ApiResponse(responseCode = "400", description = "Erro de validação"),
            @ApiResponse(responseCode = "401", description = "Não autorizado"),
            @ApiResponse(responseCode = "403", description = "Acesso proibido")
    })
    public ResponseEntity<Paciente> criar(@Valid @RequestBody PacienteRequest request) {
        log.info("Criando novo paciente: {}", request.getEmail());
        
        Paciente paciente = new Paciente();
        Usuario usuario = new Usuario();
        usuario.setEmail(request.getEmail());
        paciente.setUsuario(usuario);
        paciente.setCpf(request.getCpf());
        paciente.setDataNascimento(request.getDataNascimento());
        paciente.setSexo(request.getSexo() != null ? request.getSexo().charAt(0) : null);
        paciente.setTelefone(request.getTelefone());
        paciente.setEndereco(request.getEndereco());
        paciente.setNumero(request.getNumero());
        paciente.setComplemento(request.getComplemento());
        paciente.setBairro(request.getBairro());
        paciente.setCidade(request.getCidade());
        paciente.setEstado(request.getEstado());
        paciente.setCep(request.getCep());
        paciente.setAlergias(request.getAlergias());
        paciente.setAntecedenteMedicos(request.getAntecedenteMedicos());
        
        Paciente criado = pacienteService.create(paciente);
        return ResponseEntity.status(HttpStatus.CREATED).body(criado);
    }

    /**
     * Atualiza um paciente existente.
     *
     * @param id ID do paciente
     * @param request dados atualizados
     * @return paciente atualizado
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'CLINICA')")
    @Operation(summary = "Atualizar paciente", description = "Atualiza os dados de um paciente existente")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Paciente atualizado com sucesso"),
            @ApiResponse(responseCode = "400", description = "Erro de validação"),
            @ApiResponse(responseCode = "404", description = "Paciente não encontrado"),
            @ApiResponse(responseCode = "401", description = "Não autorizado")
    })
    public ResponseEntity<Paciente> atualizar(
            @PathVariable Long id,
            @Valid @RequestBody PacienteRequest request) {
        log.info("Atualizando paciente com ID: {}", id);
        
        Paciente paciente = new Paciente();
        Usuario usuario = new Usuario();
        usuario.setEmail(request.getEmail());
        paciente.setUsuario(usuario);
        paciente.setCpf(request.getCpf());
        paciente.setDataNascimento(request.getDataNascimento());
        paciente.setSexo(request.getSexo() != null ? request.getSexo().charAt(0) : null);
        paciente.setTelefone(request.getTelefone());
        paciente.setEndereco(request.getEndereco());
        paciente.setNumero(request.getNumero());
        paciente.setComplemento(request.getComplemento());
        paciente.setBairro(request.getBairro());
        paciente.setCidade(request.getCidade());
        paciente.setEstado(request.getEstado());
        paciente.setCep(request.getCep());
        paciente.setAlergias(request.getAlergias());
        paciente.setAntecedenteMedicos(request.getAntecedenteMedicos());
        
        Paciente atualizado = pacienteService.update(id, paciente);
        return ResponseEntity.ok(atualizado);
    }

    /**
     * Deleta um paciente (soft delete).
     *
     * @param id ID do paciente
     * @return resposta vazia
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Deletar paciente", description = "Deleta um paciente (soft delete)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Paciente deletado com sucesso"),
            @ApiResponse(responseCode = "404", description = "Paciente não encontrado"),
            @ApiResponse(responseCode = "401", description = "Não autorizado")
    })
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        log.info("Deletando paciente com ID: {}", id);
        pacienteService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/planos/{planoSaudeId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'GERENTE')")
    @Operation(summary = "Vincular plano de saúde", description = "Vincula um plano de saúde ao paciente")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Plano vinculado com sucesso"),
            @ApiResponse(responseCode = "404", description = "Paciente ou plano não encontrado")
    })
    public ResponseEntity<Set<PlanoSaude>> vincularPlanoSaude(
            @PathVariable Long id,
            @PathVariable Long planoSaudeId) {
        log.info("Vinculando plano {} ao paciente {}", planoSaudeId, id);
        return ResponseEntity.ok(pacienteService.addPlanoSaude(id, planoSaudeId));
    }

    @DeleteMapping("/{id}/planos/{planoSaudeId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'GERENTE')")
    @Operation(summary = "Desvincular plano de saúde", description = "Desvincula um plano de saúde do paciente")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Plano desvinculado com sucesso"),
            @ApiResponse(responseCode = "404", description = "Paciente ou plano não encontrado")
    })
    public ResponseEntity<Set<PlanoSaude>> desvincularPlanoSaude(
            @PathVariable Long id,
            @PathVariable Long planoSaudeId) {
        log.info("Desvinculando plano {} do paciente {}", planoSaudeId, id);
        return ResponseEntity.ok(pacienteService.removePlanoSaude(id, planoSaudeId));
    }

    @GetMapping("/{id}/planos")
    @PreAuthorize("hasAnyRole('ADMIN', 'GERENTE', 'PROFISSIONAL')")
    @Operation(summary = "Listar planos do paciente", description = "Retorna planos de saúde vinculados ao paciente")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Planos retornados com sucesso"),
            @ApiResponse(responseCode = "404", description = "Paciente não encontrado")
    })
    public ResponseEntity<Set<PlanoSaude>> listarPlanosSaude(@PathVariable Long id) {
        return ResponseEntity.ok(pacienteService.listPlanosSaude(id));
    }
}
