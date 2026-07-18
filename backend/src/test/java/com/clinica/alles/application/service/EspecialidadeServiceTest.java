package com.clinica.alles.application.service;

import com.clinica.alles.domain.especialidade.Especialidade;
import com.clinica.alles.infrastructure.persistence.IEspecialidadeRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
@DisplayName("EspecialidadeService Unit Tests")
class EspecialidadeServiceTest {

    @Mock
    private IEspecialidadeRepository especialidadeRepository;

    @InjectMocks
    private EspecialidadeService especialidadeService;

    @Test
    @DisplayName("Should list active specialities")
    void shouldListActiveSpecialities() {
        Especialidade especialidade = new Especialidade();
        especialidade.setId(1L);
        especialidade.setNome("Psicologia");

        when(especialidadeRepository.findByAtivoTrue()).thenReturn(List.of(especialidade));

        List<Especialidade> result = especialidadeService.findAllAtivos();

        assertEquals(1, result.size());
        verify(especialidadeRepository).findByAtivoTrue();
    }

    @Test
    @DisplayName("Should find speciality by name")
    void shouldFindSpecialityByName() {
        Especialidade especialidade = new Especialidade();
        especialidade.setId(1L);
        especialidade.setNome("Psicologia");

        when(especialidadeRepository.findByNome("Psicologia")).thenReturn(Optional.of(especialidade));

        Especialidade result = especialidadeService.findByNome("Psicologia");

        assertEquals(1L, result.getId());
        verify(especialidadeRepository).findByNome("Psicologia");
    }
}
