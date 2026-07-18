package com.clinica.alles.presentation.controller;

import com.clinica.alles.application.service.EspecialidadeService;
import com.clinica.alles.common.exception.GlobalExceptionHandler;
import com.clinica.alles.domain.especialidade.Especialidade;
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
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(EspecialidadeController.class)
@AutoConfigureMockMvc(addFilters = false)
@Import(GlobalExceptionHandler.class)
@DisplayName("EspecialidadeController Integration Tests")
class EspecialidadeControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private EspecialidadeService especialidadeService;

    @MockBean
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @MockBean
    private JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;

    @MockBean
    private CustomUserDetailsService customUserDetailsService;

    @Test
    @DisplayName("Should list speciality names")
    void shouldListSpecialityNames() throws Exception {
        Especialidade especialidade = new Especialidade();
        especialidade.setId(1L);
        especialidade.setNome("Psicologia");

        when(especialidadeService.findAllAtivos()).thenReturn(List.of(especialidade));

        mockMvc.perform(get("/api/especialidades/nomes"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[0].nome").value("Psicologia"));
    }

    @Test
    @DisplayName("Should find speciality by name")
    void shouldFindSpecialityByName() throws Exception {
        Especialidade especialidade = new Especialidade();
        especialidade.setId(1L);
        especialidade.setNome("Psicologia");

        when(especialidadeService.findByNome("Psicologia")).thenReturn(especialidade);

        mockMvc.perform(get("/api/especialidades/by-nome/Psicologia"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.nome").value("Psicologia"));
    }
}
