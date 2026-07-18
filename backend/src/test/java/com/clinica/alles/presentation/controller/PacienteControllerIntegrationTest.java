package com.clinica.alles.presentation.controller;

import com.clinica.alles.application.service.PacienteService;
import com.clinica.alles.common.exception.GlobalExceptionHandler;
import com.clinica.alles.domain.paciente.Paciente;
import com.clinica.alles.domain.usuario.Perfil;
import com.clinica.alles.domain.usuario.Usuario;
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
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(PacienteController.class)
@AutoConfigureMockMvc(addFilters = false)
@Import(GlobalExceptionHandler.class)
@DisplayName("PacienteController Integration Tests")
class PacienteControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private PacienteService pacienteService;

    @MockBean
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @MockBean
    private JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;

    @MockBean
    private CustomUserDetailsService customUserDetailsService;

    @Test
    @DisplayName("Should list patients with pagination")
    void shouldListPatients() throws Exception {
        Paciente paciente = new Paciente();
        paciente.setId(1L);
        paciente.setCpf("12345678901");
        Usuario usuario = new Usuario();
        usuario.setId(2L);
        usuario.setEmail("paciente@alles.com");
        usuario.setPerfil(Perfil.PACIENTE);
        paciente.setUsuario(usuario);

        when(pacienteService.findAll(PageRequest.of(0, 10))).thenReturn(new PageImpl<>(List.of(paciente)));

        mockMvc.perform(get("/api/pacientes")
                        .param("page", "0")
                        .param("size", "10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].id").value(1))
                .andExpect(jsonPath("$.content[0].cpf").value("12345678901"))
                .andExpect(jsonPath("$.content[0].usuario.email").value("paciente@alles.com"));
    }

    @Test
    @DisplayName("Should list patient names")
    void shouldListPatientNames() throws Exception {
        Paciente paciente = new Paciente();
        paciente.setId(1L);
        paciente.setCpf("12345678901");
        Usuario usuario = new Usuario();
        usuario.setEmail("paciente@alles.com");
        paciente.setUsuario(usuario);

        when(pacienteService.findAllAtivos()).thenReturn(List.of(paciente));

        mockMvc.perform(get("/api/pacientes/nomes"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[0].nome").value("paciente@alles.com"))
                .andExpect(jsonPath("$[0].cpf").value("12345678901"))
                .andExpect(jsonPath("$[0].display").value("paciente@alles.com (CPF: 12345678901)"));
    }

    @Test
    @DisplayName("Should find patient by name")
    void shouldFindPatientByName() throws Exception {
        Paciente paciente = new Paciente();
        paciente.setId(1L);
        Usuario usuario = new Usuario();
        usuario.setEmail("paciente@alles.com");
        paciente.setUsuario(usuario);

        when(pacienteService.findByUsuarioNome("paciente@alles.com")).thenReturn(paciente);

        mockMvc.perform(get("/api/pacientes/by-nome/paciente@alles.com"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.usuario.email").value("paciente@alles.com"));
    }

    @Test
    @DisplayName("Should create patient successfully")
    void shouldCreatePatient() throws Exception {
        Paciente paciente = new Paciente();
        paciente.setId(10L);
        paciente.setCpf("12345678901");
        Usuario usuario = new Usuario();
        usuario.setEmail("novo.paciente@alles.com");
        usuario.setPerfil(Perfil.PACIENTE);
        paciente.setUsuario(usuario);

        when(pacienteService.create(any(Paciente.class))).thenReturn(paciente);

        mockMvc.perform(post("/api/pacientes")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "email": "novo.paciente@alles.com",
                                  "cpf": "12345678901",
                                  "dataNascimento": "1990-05-20",
                                  "sexo": "F",
                                  "telefone": "(11) 98888-7777",
                                  "cep": "01234-567"
                                }
                                """))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(10))
                .andExpect(jsonPath("$.usuario.email").value("novo.paciente@alles.com"));
    }

    @Test
    @DisplayName("Should return 400 when create payload is invalid")
    void shouldReturnBadRequestWhenCreatePayloadIsInvalid() throws Exception {
        mockMvc.perform(post("/api/pacientes")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "email": "email-invalido",
                                  "cpf": "123",
                                  "sexo": "",
                                  "telefone": "9999"
                                }
                                """))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("Erro de Validação"));
    }
}
