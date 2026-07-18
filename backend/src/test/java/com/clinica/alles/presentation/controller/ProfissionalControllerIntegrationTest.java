package com.clinica.alles.presentation.controller;

import com.clinica.alles.application.service.ProfissionalService;
import com.clinica.alles.common.exception.GlobalExceptionHandler;
import com.clinica.alles.domain.profissional.Profissional;
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
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(ProfissionalController.class)
@AutoConfigureMockMvc(addFilters = false)
@Import(GlobalExceptionHandler.class)
@DisplayName("ProfissionalController Integration Tests")
class ProfissionalControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ProfissionalService profissionalService;

    @MockBean
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @MockBean
    private JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;

    @MockBean
    private CustomUserDetailsService customUserDetailsService;

    @Test
    @DisplayName("Should list professionals with pagination")
    void shouldListProfessionals() throws Exception {
        Profissional profissional = new Profissional();
        profissional.setId(1L);
        Usuario usuario = new Usuario();
        usuario.setId(1L);
        usuario.setEmail("profissional@alles.com");
        usuario.setPerfil(Perfil.PROFISSIONAL);
        profissional.setUsuario(usuario);

        when(profissionalService.findAll(PageRequest.of(0, 10)))
                .thenReturn(new PageImpl<>(List.of(profissional)));

        mockMvc.perform(get("/api/profissionais")
                        .param("page", "0")
                        .param("size", "10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].id").value(1))
                .andExpect(jsonPath("$.content[0].usuario.email").value("profissional@alles.com"));
    }

    @Test
    @DisplayName("Should list professional names")
    void shouldListProfessionalNames() throws Exception {
        Profissional profissional = new Profissional();
        profissional.setId(1L);
        profissional.setCrm("123456");
        Usuario usuario = new Usuario();
        usuario.setEmail("profissional@alles.com");
        profissional.setUsuario(usuario);

        when(profissionalService.findAllAtivos()).thenReturn(List.of(profissional));

        mockMvc.perform(get("/api/profissionais/nomes"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[0].nome").value("profissional@alles.com"))
                .andExpect(jsonPath("$[0].crm").value("123456"))
                .andExpect(jsonPath("$[0].display").value("profissional@alles.com (CRM: 123456)"));
    }

    @Test
    @DisplayName("Should find professional by name")
    void shouldFindProfessionalByName() throws Exception {
        Profissional profissional = new Profissional();
        profissional.setId(1L);
        Usuario usuario = new Usuario();
        usuario.setEmail("profissional@alles.com");
        profissional.setUsuario(usuario);

        when(profissionalService.findByUsuarioNome("profissional@alles.com")).thenReturn(profissional);

        mockMvc.perform(get("/api/profissionais/by-nome/profissional@alles.com"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.usuario.email").value("profissional@alles.com"));
    }

    @Test
    @DisplayName("Should create professional successfully")
    void shouldCreateProfessional() throws Exception {
        Profissional profissional = new Profissional();
        profissional.setId(10L);
        Usuario usuario = new Usuario();
        usuario.setEmail("novo@alles.com");
        usuario.setPerfil(Perfil.PROFISSIONAL);
        profissional.setUsuario(usuario);

        when(profissionalService.create(any(Profissional.class))).thenReturn(profissional);

        mockMvc.perform(post("/api/profissionais")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "email": "novo@alles.com",
                                  "crm": "123456",
                                  "tipoPagamento": "FIXO_POR_CONSULTA",
                                  "valorConsultaParticular": 150.00,
                                  "valorConsultaPlano": 100.00,
                                  "percentualReceita": 60.0,
                                  "descontoClinicaPercentual": 20.0
                                }
                                """))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(10))
                .andExpect(jsonPath("$.usuario.email").value("novo@alles.com"));

        verify(profissionalService).create(any(Profissional.class));
    }

    @Test
    @DisplayName("Should return 400 when create payload is invalid")
    void shouldReturnBadRequestWhenCreatePayloadIsInvalid() throws Exception {
        mockMvc.perform(post("/api/profissionais")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "email": "invalido",
                                  "crm": "123",
                                  "tipoPagamento": "",
                                  "valorConsultaParticular": -1
                                }
                                """))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("Erro de Validação"));
    }
}
