package com.clinica.alles.application.service;

import com.clinica.alles.common.exception.ResourceNotFoundException;
import com.clinica.alles.common.exception.ValidationException;
import com.clinica.alles.domain.atendimento.Atendimento;
import com.clinica.alles.domain.paciente.Paciente;
import com.clinica.alles.domain.profissional.Profissional;
import com.clinica.alles.domain.usuario.Perfil;
import com.clinica.alles.domain.usuario.Usuario;
import com.clinica.alles.infrastructure.persistence.IAtendimentoRepository;
import com.clinica.alles.infrastructure.persistence.IPacienteRepository;
import com.clinica.alles.infrastructure.persistence.IProfissionalRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Collections;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("AtendimentoService Unit Tests")
class AtendimentoServiceTest {

    @Mock
    private IAtendimentoRepository atendimentoRepository;

    @Mock
    private IProfissionalRepository profissionalRepository;

    @Mock
    private IPacienteRepository pacienteRepository;

    @InjectMocks
    private AtendimentoService atendimentoService;

    private Atendimento atendimento;
    private Profissional profissional;
    private Paciente paciente;
    private Usuario usuarioProfissional;
    private Usuario usuarioPaciente;

    @BeforeEach
    void setUp() {
        usuarioProfissional = new Usuario();
        usuarioProfissional.setId(1L);
        usuarioProfissional.setEmail("prof@test.com");
        usuarioProfissional.setAtivo(true);
        usuarioProfissional.setPerfil(Perfil.PROFISSIONAL);

        usuarioPaciente = new Usuario();
        usuarioPaciente.setId(2L);
        usuarioPaciente.setEmail("paciente@test.com");
        usuarioPaciente.setAtivo(true);
        usuarioPaciente.setPerfil(Perfil.PACIENTE);

        profissional = new Profissional();
        profissional.setId(1L);
        profissional.setUsuario(usuarioProfissional);
        profissional.setAtivo(true);

        paciente = new Paciente();
        paciente.setId(1L);
        paciente.setUsuario(usuarioPaciente);
        paciente.setCpf("12345678901");
        paciente.setAtivo(true);

        atendimento = new Atendimento();
        atendimento.setId(1L);
        atendimento.setProfissional(profissional);
        atendimento.setPaciente(paciente);
        atendimento.setDataHora(LocalDateTime.now().plusDays(1));
    }

    @Test
    @DisplayName("Should find appointment by ID successfully")
    void testFindById_Success() {
        when(atendimentoRepository.findById(1L)).thenReturn(Optional.of(atendimento));

        Atendimento result = atendimentoService.findById(1L);

        assertNotNull(result);
        assertEquals(1L, result.getId());
        verify(atendimentoRepository, times(1)).findById(1L);
    }

    @Test
    @DisplayName("Should throw exception when appointment not found")
    void testFindById_NotFound() {
        when(atendimentoRepository.findById(any())).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> atendimentoService.findById(999L));
    }

    @Test
    @DisplayName("Should schedule appointment successfully")
    void testAgendar_Success() {
        LocalDateTime dataHora = LocalDateTime.now().plusDays(1);

        when(profissionalRepository.findById(1L)).thenReturn(Optional.of(profissional));
        when(pacienteRepository.findById(1L)).thenReturn(Optional.of(paciente));
        when(atendimentoRepository.findByProfissionalId(1L)).thenReturn(Collections.emptyList());
        when(atendimentoRepository.save(any(Atendimento.class))).thenReturn(atendimento);

        Atendimento result = atendimentoService.agendar(1L, 1L, dataHora);

        assertNotNull(result);
        assertEquals(profissional.getId(), result.getProfissional().getId());
        verify(atendimentoRepository, times(1)).save(any(Atendimento.class));
    }

    @Test
    @DisplayName("Should throw exception when scheduling appointment in the past")
    void testAgendar_PastDate() {
        LocalDateTime dataPassed = LocalDateTime.now().minusDays(1);

        assertThrows(ValidationException.class, 
            () -> atendimentoService.agendar(1L, 1L, dataPassed));
    }

    @Test
    @DisplayName("Should throw exception when professional is inactive")
    void testAgendar_InactiveProfessional() {
        profissional.setAtivo(false);
        LocalDateTime dataHora = LocalDateTime.now().plusDays(1);

        when(profissionalRepository.findById(1L)).thenReturn(Optional.of(profissional));
        when(pacienteRepository.findById(1L)).thenReturn(Optional.of(paciente));

        assertThrows(ValidationException.class, 
            () -> atendimentoService.agendar(1L, 1L, dataHora));
    }

    @Test
    @DisplayName("Should throw exception when patient is inactive")
    void testAgendar_InactivePatient() {
        paciente.setAtivo(false);
        LocalDateTime dataHora = LocalDateTime.now().plusDays(1);

        when(profissionalRepository.findById(1L)).thenReturn(Optional.of(profissional));
        when(pacienteRepository.findById(1L)).thenReturn(Optional.of(paciente));

        assertThrows(ValidationException.class, 
            () -> atendimentoService.agendar(1L, 1L, dataHora));
    }

    @Test
    @DisplayName("Should register appointment attendance successfully")
    void testRegistrarPresenca_Success() {
        String anotacoes = "Paciente apresentou melhora";

        when(atendimentoRepository.findById(1L)).thenReturn(Optional.of(atendimento));
        when(atendimentoRepository.save(any(Atendimento.class))).thenReturn(atendimento);

        Atendimento result = atendimentoService.registrarPresenca(1L, anotacoes);

        assertNotNull(result);
        verify(atendimentoRepository, times(1)).save(any(Atendimento.class));
    }

    @Test
    @DisplayName("Should cancel appointment successfully")
    void testCancelar_Success() {
        String motivo = "Profissional indisponível";

        when(atendimentoRepository.findById(1L)).thenReturn(Optional.of(atendimento));
        when(atendimentoRepository.save(any(Atendimento.class))).thenReturn(atendimento);

        Atendimento result = atendimentoService.cancelar(1L, motivo);

        assertNotNull(result);
        verify(atendimentoRepository, times(1)).save(any(Atendimento.class));
    }

    @Test
    @DisplayName("Should throw exception when canceling already realized appointment")
    void testCancelar_AlreadyRealized() {
        atendimento.setDataFim(LocalDateTime.now());

        when(atendimentoRepository.findById(1L)).thenReturn(Optional.of(atendimento));

        assertThrows(ValidationException.class, 
            () -> atendimentoService.cancelar(1L, "Motivo"));
    }

    @Test
    @DisplayName("Should verify professional availability")
    void testVerificarDisponibilidade() {
        when(atendimentoRepository.findByProfissionalId(1L)).thenReturn(Collections.emptyList());

        boolean result = atendimentoService.verificarDisponibilidade(1L, LocalDateTime.now().plusDays(1));

        assertTrue(result);
    }

    @Test
    @DisplayName("Should find all appointments with pagination")
    void testFindAll() {
        Page<Atendimento> page = new PageImpl<>(Arrays.asList(atendimento));
        when(atendimentoRepository.findAll(any(org.springframework.data.domain.Pageable.class))).thenReturn(page);

        Page<Atendimento> result = atendimentoService.findAll(PageRequest.of(0, 10));

        assertNotNull(result);
        assertEquals(1, result.getContent().size());
    }
}
