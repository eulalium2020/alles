package com.clinica.alles.presentation.controller;

import com.clinica.alles.application.service.AuthService;
import com.clinica.alles.common.dto.LoginResponse;
import com.clinica.alles.common.exception.GlobalExceptionHandler;
import com.clinica.alles.common.exception.UnauthorizedException;
import com.clinica.alles.infrastructure.security.CustomUserDetailsService;
import com.clinica.alles.infrastructure.security.JwtAuthenticationEntryPoint;
import com.clinica.alles.infrastructure.security.JwtAuthenticationFilter;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(AuthController.class)
@AutoConfigureMockMvc(addFilters = false)
@Import(GlobalExceptionHandler.class)
@DisplayName("AuthController Integration Tests")
class AuthControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private AuthService authService;

    @MockBean
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @MockBean
    private JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;

    @MockBean
    private CustomUserDetailsService customUserDetailsService;

    @Test
    @DisplayName("Should login successfully")
    void shouldLoginSuccessfully() throws Exception {
        LoginResponse response = LoginResponse.builder()
                .token("token")
                .refreshToken("refresh")
                .email("admin@alles.com")
                .perfil("ADMIN")
                .usuarioId(1L)
                .type("Bearer")
                .build();

        when(authService.login("admin@alles.com", "senha123")).thenReturn(response);

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "email": "admin@alles.com",
                                  "senha": "senha123"
                                }
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value("token"))
                .andExpect(jsonPath("$.refreshToken").value("refresh"))
                .andExpect(jsonPath("$.perfil").value("ADMIN"));
    }

    @Test
    @DisplayName("Should return 400 when login payload is invalid")
    void shouldReturnBadRequestWhenLoginPayloadIsInvalid() throws Exception {
        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "email": "email-invalido",
                                  "senha": ""
                                }
                                """))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("Erro de Validação"));
    }

    @Test
    @DisplayName("Should return 401 when refresh token is invalid")
    void shouldReturnUnauthorizedWhenRefreshTokenIsInvalid() throws Exception {
        doThrow(new UnauthorizedException("Refresh token inválido ou expirado"))
                .when(authService).refreshToken(anyString());

        mockMvc.perform(post("/api/auth/refresh")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "refreshToken": "token-invalido"
                                }
                                """))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.message").value("Refresh token inválido ou expirado"));
    }
}
