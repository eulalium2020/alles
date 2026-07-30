package com.clinica.alles.presentation.controller;

import com.clinica.alles.application.service.UsuarioService;
import com.clinica.alles.common.dto.UsuarioRequest;
import com.clinica.alles.common.dto.UsuarioResponse;
import com.clinica.alles.domain.usuario.Perfil;
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
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.util.Arrays;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/usuarios")
@RequiredArgsConstructor
@Tag(name = "Usuários", description = "Operações de cadastro de usuários do sistema")
public class UsuarioController {

    private final UsuarioService usuarioService;

    @GetMapping
    @Operation(summary = "Listar usuários", description = "Lista usuários com paginação (somente admin)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Usuários listados com sucesso"),
            @ApiResponse(responseCode = "403", description = "Acesso proibido")
    })
    public ResponseEntity<Page<UsuarioResponse>> listar(
            Authentication authentication,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        validarAdmin(authentication);
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(usuarioService.listar(pageable));
    }

    @PostMapping
    @Operation(summary = "Criar usuário", description = "Cria um novo usuário de acesso (somente admin)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Usuário criado com sucesso"),
            @ApiResponse(responseCode = "400", description = "Erro de validação"),
            @ApiResponse(responseCode = "403", description = "Acesso proibido"),
            @ApiResponse(responseCode = "409", description = "Email/CPF já cadastrado")
    })
    public ResponseEntity<UsuarioResponse> criar(
            Authentication authentication,
            @Valid @RequestBody UsuarioRequest request) {
        validarAdmin(authentication);
        log.info("Criando usuário de acesso: {}", request.getEmail());
        return ResponseEntity.status(HttpStatus.CREATED).body(usuarioService.criar(request));
    }

    @GetMapping("/perfis")
    @Operation(summary = "Listar perfis", description = "Lista perfis disponíveis para cadastro de usuário (somente admin)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Perfis listados com sucesso"),
            @ApiResponse(responseCode = "403", description = "Acesso proibido")
    })
    public ResponseEntity<List<Perfil>> listarPerfis(Authentication authentication) {
        validarAdmin(authentication);
        return ResponseEntity.ok(Arrays.asList(Perfil.values()));
    }

    private void validarAdmin(Authentication authentication) {
        Authentication auth = authentication;
        if (auth == null) {
            auth = SecurityContextHolder.getContext().getAuthentication();
        }

        boolean isAdmin = auth != null
                && auth.getAuthorities() != null
                && auth.getAuthorities().stream()
                .anyMatch(authority -> "ROLE_ADMIN".equals(authority.getAuthority()));

        if (!isAdmin) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Apenas administradores podem acessar este recurso");
        }
    }
}
