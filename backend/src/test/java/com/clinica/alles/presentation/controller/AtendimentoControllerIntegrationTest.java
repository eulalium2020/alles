package com.clinica.alles.presentation.controller;

import com.clinica.alles.application.service.AtendimentoService;
import com.clinica.alles.common.exception.GlobalExceptionHandler;
import com.clinica.alles.domain.atendimento.Atendimento;
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

import java.time.LocalDateTime;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(AtendimentoController.class)
@AutoConfigureMockMvc(addFilters = false)
@Import(GlobalExceptionHandler.class)
@DisplayName("AtendimentoController Integration Tests")
class AtendimentoControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private AtendimentoService atendimentoService;

    @MockBean
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @MockBean
    private JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;

    @MockBean
    private CustomUserDetailsService customUserDetailsService;

    @Test
    @DisplayName("Should list appointments with pagination")
    void shouldListAppointments() throws Exception {
        Atendimento atendimento = new Atendimento();
        atendimento.setId(1L);
        atendimento.setDataInicio(LocalDateTime.of(2026, 7, 14, 14, 0));

        when(atendimentoService.findAll(PageRequest.of(0, 10))).thenReturn(new PageImpl<>(List.of(atendimento)));

        mockMvc.perform(get("/api/atendimentos")
                        .param("page", "0")
                        .param("size", "10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].id").value(1));
    }

    @Test
    @DisplayName("Should schedule appointment successfully")
    void shouldScheduleAppointment() throws Exception {
        Atendimento atendimento = new Atendimento();
        atendimento.setId(20L);
        atendimento.setDataInicio(LocalDateTime.of(2026, 7, 20, 10, 0));

        when(atendimentoService.agendar(anyLong(), anyLong(), any(LocalDateTime.class))).thenReturn(atendimento);

        mockMvc.perform(post("/api/atendimentos/agendar")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "profissionalId": 1,
                                  "pacienteId": 2,
                                  "dataHora": "2026-07-20T10:00:00"
                                }
                                """))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(20));
    }

    @Test
    @DisplayName("Should register appointment presence")
    void shouldRegisterPresence() throws Exception {
        Atendimento atendimento = new Atendimento();
        atendimento.setId(30L);
        atendimento.setNotasConsulta("Paciente estável");

        when(atendimentoService.registrarPresenca(anyLong(), anyString())).thenReturn(atendimento);

        mockMvc.perform(post("/api/atendimentos/30/registrar")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "anotacoes": "Paciente estável"
                                }
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(30))
                .andExpect(jsonPath("$.notasConsulta").value("Paciente estável"));
    }
}
