package com.clinica.alles.presentation.controller;

import com.clinica.alles.application.service.UsuarioService;
import com.clinica.alles.common.dto.UsuarioResponse;
import com.clinica.alles.common.exception.GlobalExceptionHandler;
import com.clinica.alles.domain.usuario.Perfil;
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
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.TestingAuthenticationToken;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(UsuarioController.class)
@AutoConfigureMockMvc(addFilters = false)
@Import(GlobalExceptionHandler.class)
@DisplayName("UsuarioController Integration Tests")
class UsuarioControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UsuarioService usuarioService;

    @MockBean
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @MockBean
    private JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;

    @MockBean
    private CustomUserDetailsService customUserDetailsService;

    @Test
    @DisplayName("Should create user when authenticated as admin")
    void shouldCreateUserWhenAuthenticatedAsAdmin() throws Exception {
        UsuarioResponse response = UsuarioResponse.builder()
                .id(1L)
                .nome("Novo Admin")
                .email("novo.admin@alles.com")
                .perfil(Perfil.ADMIN)
                .ativo(true)
                .build();

        when(usuarioService.criar(any())).thenReturn(response);

        TestingAuthenticationToken adminAuth =
                new TestingAuthenticationToken("admin@alles.com", null, "ROLE_ADMIN");
        adminAuth.setAuthenticated(true);

        mockMvc.perform(post("/api/usuarios")
                        .principal(adminAuth)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "nome": "Novo Admin",
                                  "email": "novo.admin@alles.com",
                                  "senha": "senha123",
                                  "perfil": "ADMIN",
                                  "telefone": "81999999999"
                                }
                                """))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.email").value("novo.admin@alles.com"))
                .andExpect(jsonPath("$.perfil").value("ADMIN"));
    }

    @Test
    @DisplayName("Should return forbidden when non-admin tries to create user")
    void shouldReturnForbiddenWhenNonAdminTriesToCreateUser() throws Exception {
        TestingAuthenticationToken profissionalAuth =
                new TestingAuthenticationToken("profissional@alles.com", null, "ROLE_PROFISSIONAL");
        profissionalAuth.setAuthenticated(true);

        mockMvc.perform(post("/api/usuarios")
                        .principal(profissionalAuth)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "nome": "Novo Usuário",
                                  "email": "novo@alles.com",
                                  "senha": "senha123",
                                  "perfil": "RECEPCIONISTA"
                                }
                                """))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("Should list users when authenticated as admin")
    void shouldListUsersWhenAuthenticatedAsAdmin() throws Exception {
        UsuarioResponse usuario = UsuarioResponse.builder()
                .id(1L)
                .nome("Admin")
                .email("admin@alles.com")
                .perfil(Perfil.ADMIN)
                .ativo(true)
                .build();

        when(usuarioService.listar(PageRequest.of(0, 10))).thenReturn(new PageImpl<>(List.of(usuario)));

        TestingAuthenticationToken adminAuth =
                new TestingAuthenticationToken("admin@alles.com", null, "ROLE_ADMIN");
        adminAuth.setAuthenticated(true);

        mockMvc.perform(get("/api/usuarios")
                        .principal(adminAuth)
                        .param("page", "0")
                        .param("size", "10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].email").value("admin@alles.com"))
                .andExpect(jsonPath("$.content[0].perfil").value("ADMIN"));
    }
}
