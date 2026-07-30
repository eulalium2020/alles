package com.clinica.alles.application.service;

import com.clinica.alles.common.dto.UsuarioRequest;
import com.clinica.alles.common.dto.UsuarioResponse;
import com.clinica.alles.common.exception.DuplicateResourceException;
import com.clinica.alles.domain.usuario.Perfil;
import com.clinica.alles.domain.usuario.Usuario;
import com.clinica.alles.infrastructure.persistence.IUsuarioRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
@DisplayName("UsuarioService Unit Tests")
class UsuarioServiceTest {

    @Mock
    private IUsuarioRepository usuarioRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UsuarioService usuarioService;

    @Test
    @DisplayName("Should create user successfully")
    void shouldCreateUserSuccessfully() {
        UsuarioRequest request = UsuarioRequest.builder()
                .nome("Administrador")
                .email("Admin@Alles.com")
                .senha("senha123")
                .cpf("12345678901")
                .telefone("81999999999")
                .perfil(Perfil.ADMIN)
                .ativo(true)
                .build();

        when(usuarioRepository.existsByEmail("admin@alles.com")).thenReturn(false);
        when(usuarioRepository.existsByCpf("12345678901")).thenReturn(false);
        when(passwordEncoder.encode("senha123")).thenReturn("senha-criptografada");
        when(usuarioRepository.save(any(Usuario.class))).thenAnswer(invocation -> {
            Usuario usuario = invocation.getArgument(0);
            usuario.setId(1L);
            return usuario;
        });

        UsuarioResponse response = usuarioService.criar(request);

        assertEquals(1L, response.getId());
        assertEquals("Administrador", response.getNome());
        assertEquals("admin@alles.com", response.getEmail());
        assertEquals(Perfil.ADMIN, response.getPerfil());
    }

    @Test
    @DisplayName("Should throw conflict when email already exists")
    void shouldThrowConflictWhenEmailAlreadyExists() {
        UsuarioRequest request = UsuarioRequest.builder()
                .nome("Usuário")
                .email("admin@alles.com")
                .senha("senha123")
                .perfil(Perfil.ADMIN)
                .build();

        when(usuarioRepository.existsByEmail("admin@alles.com")).thenReturn(true);

        assertThrows(DuplicateResourceException.class, () -> usuarioService.criar(request));
        verify(usuarioRepository, never()).save(any(Usuario.class));
    }
}
