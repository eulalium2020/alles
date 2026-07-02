package com.clinica.alles.application.service;

import com.clinica.alles.common.exception.ResourceNotFoundException;
import com.clinica.alles.common.exception.ValidationException;
import com.clinica.alles.domain.especialidade.Especialidade;
import com.clinica.alles.domain.profissional.Profissional;
import com.clinica.alles.domain.profissional.TipoPagamento;
import com.clinica.alles.domain.usuario.Perfil;
import com.clinica.alles.domain.usuario.Usuario;
import com.clinica.alles.infrastructure.persistence.IEspecialidadeRepository;
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

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("ProfissionalService Unit Tests")
class ProfissionalServiceTest {

    @Mock
    private IProfissionalRepository profissionalRepository;

    @Mock
    private IEspecialidadeRepository especialidadeRepository;

    @InjectMocks
    private ProfissionalService profissionalService;

    private Profissional profissional;
    private Usuario usuario;
    private Especialidade especialidade;

    @BeforeEach
    void setUp() {
        usuario = new Usuario();
        usuario.setId(1L);
        usuario.setEmail("prof@test.com");
        usuario.setAtivo(true);
        usuario.setPerfil(Perfil.PROFISSIONAL);

        especialidade = new Especialidade();
        especialidade.setId(1L);
        especialidade.setNome("Psicologia");

        profissional = new Profissional();
        profissional.setId(1L);
        profissional.setUsuario(usuario);
        profissional.setEspecialidade(especialidade);
        profissional.setCrm("CRP12345");
        profissional.setTipoPagamento(TipoPagamento.FIXO_POR_CONSULTA);
        profissional.setValorConsultaParticular(BigDecimal.valueOf(150.00));
        profissional.setValorConsultaPlano(BigDecimal.valueOf(120.00));
        profissional.setAtivo(true);
        profissional.setDataCadastro(LocalDateTime.now());
    }

    @Test
    @DisplayName("Should find professional by ID successfully")
    void testFindById_Success() {
        when(profissionalRepository.findById(1L)).thenReturn(Optional.of(profissional));

        Profissional result = profissionalService.findById(1L);

        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals("prof@test.com", result.getUsuario().getEmail());
        verify(profissionalRepository, times(1)).findById(1L);
    }

    @Test
    @DisplayName("Should throw exception when professional not found by ID")
    void testFindById_NotFound() {
        when(profissionalRepository.findById(anyLong())).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> profissionalService.findById(999L));
        verify(profissionalRepository, times(1)).findById(999L);
    }

    @Test
    @DisplayName("Should create professional successfully")
    void testCreate_Success() {
        when(profissionalRepository.save(any(Profissional.class))).thenReturn(profissional);
        when(especialidadeRepository.findById(1L)).thenReturn(Optional.of(especialidade));

        Profissional result = profissionalService.create(profissional);

        assertNotNull(result);
        assertEquals("prof@test.com", result.getUsuario().getEmail());
        verify(profissionalRepository, times(1)).save(any(Profissional.class));
    }

    @Test
    @DisplayName("Should throw exception when creating professional without email")
    void testCreate_WithoutEmail() {
        profissional.getUsuario().setEmail(null);

        assertThrows(ValidationException.class, () -> profissionalService.create(profissional));
    }

    @Test
    @DisplayName("Should calculate consultation value by payment type")
    void testCalcularValorConsulta() {
        when(profissionalRepository.findById(1L)).thenReturn(Optional.of(profissional));

        BigDecimal result = profissionalService.calcularValorConsulta(1L, TipoPagamento.FIXO_POR_CONSULTA);

        assertEquals(BigDecimal.valueOf(150.00), result);
    }

    @Test
    @DisplayName("Should find professionals by speciality")
    void testFindByEspecialidade() {
        when(especialidadeRepository.findById(1L)).thenReturn(Optional.of(especialidade));
        when(profissionalRepository.findByEspecialidadeIdAndAtivoTrue(1L))
                .thenReturn(Arrays.asList(profissional));

        var result = profissionalService.findByEspecialidade(1L);

        assertNotNull(result);
        assertEquals(1, result.size());
        verify(profissionalRepository, times(1)).findByEspecialidadeIdAndAtivoTrue(1L);
    }

    @Test
    @DisplayName("Should find all professionals with pagination")
    void testFindAll() {
        Page<Profissional> page = new PageImpl<>(Arrays.asList(profissional));
        when(profissionalRepository.findAll(any(org.springframework.data.domain.Pageable.class))).thenReturn(page);

        Page<Profissional> result = profissionalService.findAll(PageRequest.of(0, 10));

        assertNotNull(result);
        assertEquals(1, result.getContent().size());
    }

    @Test
    @DisplayName("Should delete professional (soft delete)")
    void testDelete() {
        when(profissionalRepository.findById(1L)).thenReturn(Optional.of(profissional));
        when(profissionalRepository.save(any(Profissional.class))).thenReturn(profissional);

        profissionalService.delete(1L);

        verify(profissionalRepository, times(1)).save(any(Profissional.class));
    }
}
