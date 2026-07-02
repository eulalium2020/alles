package com.clinica.alles.application.service;

import com.clinica.alles.common.exception.ResourceNotFoundException;
import com.clinica.alles.common.exception.ValidationException;
import com.clinica.alles.domain.paciente.Paciente;
import com.clinica.alles.domain.planosasaude.PlanoSaude;
import com.clinica.alles.domain.usuario.Perfil;
import com.clinica.alles.domain.usuario.Usuario;
import com.clinica.alles.infrastructure.persistence.IPacienteRepository;
import com.clinica.alles.infrastructure.persistence.IPlanoSaudeRepository;
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

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("PacienteService Unit Tests")
class PacienteServiceTest {

    @Mock
    private IPacienteRepository pacienteRepository;

    @Mock
    private IPlanoSaudeRepository planoSaudeRepository;

    @InjectMocks
    private PacienteService pacienteService;

    private Paciente paciente;
    private Usuario usuario;
    private PlanoSaude planoSaude;

    @BeforeEach
    void setUp() {
        usuario = new Usuario();
        usuario.setId(1L);
        usuario.setEmail("paciente@test.com");
        usuario.setAtivo(true);
        usuario.setPerfil(Perfil.PACIENTE);

        paciente = new Paciente();
        paciente.setId(1L);
        paciente.setUsuario(usuario);
        paciente.setCpf("12345678901");
        paciente.setDataNascimento(LocalDate.of(1990, 1, 15));
        paciente.setAtivo(true);
        paciente.setDataCadastro(LocalDateTime.now());

        planoSaude = new PlanoSaude();
        planoSaude.setId(1L);
        planoSaude.setNome("Plano Premium");
        planoSaude.setAtivo(true);
    }

    @Test
    @DisplayName("Should find patient by ID successfully")
    void testFindById_Success() {
        when(pacienteRepository.findById(1L)).thenReturn(Optional.of(paciente));

        Paciente result = pacienteService.findById(1L);

        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals("paciente@test.com", result.getUsuario().getEmail());
        verify(pacienteRepository, times(1)).findById(1L);
    }

    @Test
    @DisplayName("Should throw exception when patient not found by ID")
    void testFindById_NotFound() {
        when(pacienteRepository.findById(any())).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> pacienteService.findById(999L));
    }

    @Test
    @DisplayName("Should find patient by CPF successfully")
    void testFindByCpf_Success() {
        when(pacienteRepository.findByCpf("12345678901")).thenReturn(Optional.of(paciente));

        Paciente result = pacienteService.findByCpf("12345678901");

        assertNotNull(result);
        assertEquals("12345678901", result.getCpf());
        verify(pacienteRepository, times(1)).findByCpf("12345678901");
    }

    @Test
    @DisplayName("Should create patient successfully")
    void testCreate_Success() {
        when(pacienteRepository.existsByCpf("12345678901")).thenReturn(false);
        when(pacienteRepository.save(any(Paciente.class))).thenReturn(paciente);

        Paciente result = pacienteService.create(paciente);

        assertNotNull(result);
        assertEquals("12345678901", result.getCpf());
        verify(pacienteRepository, times(1)).save(any(Paciente.class));
    }

    @Test
    @DisplayName("Should throw exception when creating patient without email")
    void testCreate_WithoutEmail() {
        paciente.getUsuario().setEmail(null);

        assertThrows(ValidationException.class, () -> pacienteService.create(paciente));
    }

    @Test
    @DisplayName("Should throw exception when creating patient with duplicate CPF")
    void testCreate_DuplicateCpf() {
        when(pacienteRepository.existsByCpf("12345678901")).thenReturn(true);

        assertThrows(ValidationException.class, () -> pacienteService.create(paciente));
    }

    @Test
    @DisplayName("Should throw exception when creating patient without CPF")
    void testCreate_WithoutCpf() {
        paciente.setCpf(null);

        assertThrows(ValidationException.class, () -> pacienteService.create(paciente));
    }

    @Test
    @DisplayName("Should throw exception when creating patient with invalid CPF length")
    void testCreate_InvalidCpfLength() {
        paciente.setCpf("123");

        assertThrows(ValidationException.class, () -> pacienteService.create(paciente));
    }

    @Test
    @DisplayName("Should update patient successfully")
    void testUpdate_Success() {
        Paciente pacienteAtualizado = new Paciente();
        pacienteAtualizado.setUsuario(usuario);
        pacienteAtualizado.setCpf("12345678901");
        pacienteAtualizado.setDataNascimento(LocalDate.of(1990, 1, 15));
        pacienteAtualizado.setTelefone("11999999999");

        when(pacienteRepository.findById(1L)).thenReturn(Optional.of(paciente));
        when(pacienteRepository.save(any(Paciente.class))).thenReturn(paciente);

        Paciente result = pacienteService.update(1L, pacienteAtualizado);

        assertNotNull(result);
        verify(pacienteRepository, times(1)).save(any(Paciente.class));
    }

    @Test
    @DisplayName("Should delete patient (soft delete)")
    void testDelete() {
        when(pacienteRepository.findById(1L)).thenReturn(Optional.of(paciente));
        when(pacienteRepository.save(any(Paciente.class))).thenReturn(paciente);

        pacienteService.delete(1L);

        verify(pacienteRepository, times(1)).save(any(Paciente.class));
    }

    @Test
    @DisplayName("Should find all patients with pagination")
    void testFindAll() {
        Page<Paciente> page = new PageImpl<>(Arrays.asList(paciente));
        when(pacienteRepository.findAll(any(org.springframework.data.domain.Pageable.class))).thenReturn(page);

        Page<Paciente> result = pacienteService.findAll(PageRequest.of(0, 10));

        assertNotNull(result);
        assertEquals(1, result.getContent().size());
    }

    @Test
    @DisplayName("Should add health plan to patient")
    void testAddPlanoSaude() {
        when(pacienteRepository.findById(1L)).thenReturn(Optional.of(paciente));
        when(planoSaudeRepository.findById(1L)).thenReturn(Optional.of(planoSaude));
        when(pacienteRepository.save(any(Paciente.class))).thenReturn(paciente);

        var result = pacienteService.addPlanoSaude(1L, 1L);

        assertNotNull(result);
        verify(pacienteRepository).save(any(Paciente.class));
    }
}
