package com.clinica.alles.presentation.controller;

import com.clinica.alles.application.service.AuthService;
import com.clinica.alles.common.dto.LoginRequest;
import com.clinica.alles.common.dto.LoginResponse;
import com.clinica.alles.common.dto.RefreshTokenRequest;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Controller REST para operações de autenticação.
 */
@Slf4j
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "Autenticação", description = "Operações de autenticação e autorização")
public class AuthController {

    private final AuthService authService;

    /**
     * Realiza login do usuário.
     *
     * @param request dados de login (email e senha)
     * @return token de acesso e informações do usuário
     */
    @PostMapping("/login")
    @Operation(summary = "Login", description = "Realiza autenticação do usuário e retorna tokens de acesso")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Login realizado com sucesso"),
            @ApiResponse(responseCode = "400", description = "Credenciais inválidas"),
            @ApiResponse(responseCode = "401", description = "Email ou senha incorretos")
    })
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        log.info("Tentativa de login do usuário: {}", request.getEmail());

        LoginResponse response = authService.login(request.getEmail(), request.getSenha());
        return ResponseEntity.ok(response);
    }

    /**
     * Atualiza o token de acesso usando um refresh token.
     *
     * @param request refresh token
     * @return novo token de acesso
     */
    @PostMapping("/refresh")
    @Operation(summary = "Atualizar token", description = "Obtém um novo token de acesso usando um refresh token válido")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Token atualizado com sucesso"),
            @ApiResponse(responseCode = "400", description = "Refresh token inválido"),
            @ApiResponse(responseCode = "401", description = "Refresh token expirado")
    })
    public ResponseEntity<LoginResponse> refresh(@Valid @RequestBody RefreshTokenRequest request) {
        log.info("Requisição de atualização de token");

        LoginResponse response = authService.refreshToken(request.getRefreshToken());
        return ResponseEntity.ok(response);
    }

    /**
     * Realiza logout do usuário.
     *
     * @param token token de autorização
     * @return resposta vazia
     */
    @PostMapping("/logout")
    @Operation(summary = "Logout", description = "Realiza logout do usuário invalidando o token")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Logout realizado com sucesso"),
            @ApiResponse(responseCode = "401", description = "Token inválido ou não fornecido")
    })
    public ResponseEntity<Void> logout(@RequestHeader("Authorization") String token) {
        log.info("Logout do usuário");
        authService.logout(token);
        return ResponseEntity.noContent().build();
    }
}
