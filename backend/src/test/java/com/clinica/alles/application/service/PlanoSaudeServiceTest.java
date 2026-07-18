package com.clinica.alles.application.service;

import com.clinica.alles.common.exception.ResourceNotFoundException;
import com.clinica.alles.common.exception.ValidationException;
import com.clinica.alles.domain.planosasaude.PlanoSaude;
import com.clinica.alles.infrastructure.persistence.IPlanoSaudeRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
@DisplayName("PlanoSaudeService Unit Tests")
class PlanoSaudeServiceTest {

    @Mock
    private IPlanoSaudeRepository planoSaudeRepository;

    @InjectMocks
    private PlanoSaudeService planoSaudeService;

    @Test
    @DisplayName("Should create health plan successfully")
    void shouldCreateSuccessfully() {
        PlanoSaude plano = new PlanoSaude();
        plano.setNome("Plano A");
        plano.setAtivo(true);

        when(planoSaudeRepository.existsByNome("Plano A")).thenReturn(false);
        when(planoSaudeRepository.save(any(PlanoSaude.class))).thenReturn(plano);

        PlanoSaude result = planoSaudeService.create(plano);

        assertNotNull(result);
        assertEquals("Plano A", result.getNome());
    }

    @Test
    @DisplayName("Should fail when plan name is duplicated")
    void shouldFailOnDuplicateName() {
        PlanoSaude plano = new PlanoSaude();
        plano.setNome("Plano A");

        when(planoSaudeRepository.existsByNome("Plano A")).thenReturn(true);

        assertThrows(ValidationException.class, () -> planoSaudeService.create(plano));
    }

    @Test
    @DisplayName("Should find health plan by id")
    void shouldFindById() {
        PlanoSaude plano = new PlanoSaude();
        plano.setId(1L);
        plano.setNome("Plano A");

        when(planoSaudeRepository.findById(1L)).thenReturn(Optional.of(plano));

        PlanoSaude result = planoSaudeService.findById(1L);
        assertEquals(1L, result.getId());
    }

    @Test
    @DisplayName("Should throw when health plan is missing")
    void shouldThrowWhenMissing() {
        when(planoSaudeRepository.findById(99L)).thenReturn(Optional.empty());
        assertThrows(ResourceNotFoundException.class, () -> planoSaudeService.findById(99L));
    }

    @Test
    @DisplayName("Should list health plans")
    void shouldListWithPagination() {
        PlanoSaude plano = new PlanoSaude();
        plano.setId(1L);
        plano.setNome("Plano A");
        when(planoSaudeRepository.findAll(PageRequest.of(0, 10)))
                .thenReturn(new PageImpl<>(List.of(plano)));

        var page = planoSaudeService.findAll(PageRequest.of(0, 10));
        assertEquals(1, page.getContent().size());
    }

    @Test
    @DisplayName("Should list active health plans")
    void shouldListActiveHealthPlans() {
        PlanoSaude plano = new PlanoSaude();
        plano.setId(1L);
        plano.setNome("Plano A");
        plano.setAtivo(true);

        when(planoSaudeRepository.findByAtivoTrue()).thenReturn(List.of(plano));

        List<PlanoSaude> result = planoSaudeService.findAllAtivos();

        assertEquals(1, result.size());
        verify(planoSaudeRepository).findByAtivoTrue();
    }

    @Test
    @DisplayName("Should soft delete health plan")
    void shouldSoftDelete() {
        PlanoSaude plano = new PlanoSaude();
        plano.setId(1L);
        plano.setNome("Plano A");
        plano.setAtivo(true);
        when(planoSaudeRepository.findById(1L)).thenReturn(Optional.of(plano));

        planoSaudeService.delete(1L);

        verify(planoSaudeRepository).save(any(PlanoSaude.class));
    }
}
