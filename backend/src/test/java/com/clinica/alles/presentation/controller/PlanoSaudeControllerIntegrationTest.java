package com.clinica.alles.presentation.controller;

import com.clinica.alles.application.service.PlanoSaudeService;
import com.clinica.alles.common.exception.GlobalExceptionHandler;
import com.clinica.alles.domain.planosasaude.PlanoSaude;
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

@WebMvcTest(PlanoSaudeController.class)
@AutoConfigureMockMvc(addFilters = false)
@Import(GlobalExceptionHandler.class)
@DisplayName("PlanoSaudeController Integration Tests")
class PlanoSaudeControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private PlanoSaudeService planoSaudeService;

    @MockBean
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @MockBean
    private JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;

    @MockBean
    private CustomUserDetailsService customUserDetailsService;

    @Test
    @DisplayName("Should list health plans")
    void shouldListHealthPlans() throws Exception {
        PlanoSaude plano = new PlanoSaude();
        plano.setId(1L);
        plano.setNome("Plano A");
        plano.setDescricao("Descrição A");
        plano.setAtivo(true);

        when(planoSaudeService.findAll(PageRequest.of(0, 10)))
                .thenReturn(new PageImpl<>(List.of(plano)));

        mockMvc.perform(get("/api/planos-saude")
                        .param("page", "0")
                        .param("size", "10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].id").value(1))
                .andExpect(jsonPath("$.content[0].nome").value("Plano A"));
    }

    @Test
    @DisplayName("Should create health plan")
    void shouldCreateHealthPlan() throws Exception {
        PlanoSaude plano = new PlanoSaude();
        plano.setId(10L);
        plano.setNome("Plano Novo");
        plano.setDescricao("Descrição");
        plano.setAtivo(true);

        when(planoSaudeService.create(any(PlanoSaude.class))).thenReturn(plano);

        mockMvc.perform(post("/api/planos-saude")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "nome": "Plano Novo",
                                  "descricao": "Descrição"
                                }
                                """))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(10))
                .andExpect(jsonPath("$.nome").value("Plano Novo"));
    }
}
