package com.clinica.alles.application.service;

import com.clinica.alles.common.dto.LoginResponse;
import com.clinica.alles.common.exception.UnauthorizedException;
import com.clinica.alles.domain.usuario.Perfil;
import com.clinica.alles.domain.usuario.Usuario;
import com.clinica.alles.infrastructure.persistence.IUsuarioRepository;
import com.clinica.alles.infrastructure.security.JwtTokenProvider;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
@DisplayName("AuthService Unit Tests")
class AuthServiceTest {

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private IUsuarioRepository usuarioRepository;

    @Mock
    private JwtTokenProvider jwtTokenProvider;

    @InjectMocks
    private AuthService authService;

    @Test
    @DisplayName("Should login successfully")
    void shouldLoginSuccessfully() {
        Usuario usuario = new Usuario();
        usuario.setId(1L);
        usuario.setEmail("admin@alles.com");
        usuario.setAtivo(true);
        usuario.setPerfil(Perfil.ADMIN);

        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(null);
        when(usuarioRepository.findByEmail("admin@alles.com")).thenReturn(Optional.of(usuario));
        when(jwtTokenProvider.generateToken("admin@alles.com", "ADMIN")).thenReturn("token");
        when(jwtTokenProvider.generateRefreshToken("admin@alles.com")).thenReturn("refresh");

        LoginResponse response = authService.login("admin@alles.com", "senha");

        assertEquals("token", response.getToken());
        assertEquals("refresh", response.getRefreshToken());
        assertEquals("ADMIN", response.getPerfil());
    }

    @Test
    @DisplayName("Should throw unauthorized when credentials are invalid")
    void shouldThrowUnauthorizedWhenCredentialsAreInvalid() {
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenThrow(new BadCredentialsException("bad credentials"));

        assertThrows(UnauthorizedException.class, () -> authService.login("admin@alles.com", "errada"));
    }
}
