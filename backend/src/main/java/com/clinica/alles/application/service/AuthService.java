package com.clinica.alles.application.service;

import com.clinica.alles.common.dto.LoginResponse;
import com.clinica.alles.common.exception.UnauthorizedException;
import com.clinica.alles.infrastructure.persistence.IUsuarioRepository;
import com.clinica.alles.infrastructure.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final IUsuarioRepository usuarioRepository;
    private final JwtTokenProvider jwtTokenProvider;

    public LoginResponse login(String email, String senha) {
        try {
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(email, senha));
        } catch (BadCredentialsException ex) {
            throw new UnauthorizedException("Email ou senha inválidos");
        } catch (DisabledException ex) {
            throw new UnauthorizedException("Usuário desativado");
        }

        var usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new UnauthorizedException("Usuário não encontrado"));

        if (!Boolean.TRUE.equals(usuario.getAtivo())) {
            throw new UnauthorizedException("Usuário desativado");
        }

        String token = jwtTokenProvider.generateToken(usuario.getEmail(), usuario.getPerfil().name());
        String refreshToken = jwtTokenProvider.generateRefreshToken(usuario.getEmail());

        return LoginResponse.builder()
                .token(token)
                .refreshToken(refreshToken)
                .email(usuario.getEmail())
                .perfil(usuario.getPerfil().name())
                .usuarioId(usuario.getId())
                .type("Bearer")
                .build();
    }

    public LoginResponse refreshToken(String refreshToken) {
        if (!jwtTokenProvider.validateToken(refreshToken) || Boolean.TRUE.equals(jwtTokenProvider.isTokenExpired(refreshToken))) {
            throw new UnauthorizedException("Refresh token inválido ou expirado");
        }

        String email = jwtTokenProvider.getEmailFromToken(refreshToken);
        var usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new UnauthorizedException("Usuário não encontrado"));

        if (!Boolean.TRUE.equals(usuario.getAtivo())) {
            throw new UnauthorizedException("Usuário desativado");
        }

        String novoToken = jwtTokenProvider.generateToken(usuario.getEmail(), usuario.getPerfil().name());
        String novoRefreshToken = jwtTokenProvider.generateRefreshToken(usuario.getEmail());

        return LoginResponse.builder()
                .token(novoToken)
                .refreshToken(novoRefreshToken)
                .email(usuario.getEmail())
                .perfil(usuario.getPerfil().name())
                .usuarioId(usuario.getId())
                .type("Bearer")
                .build();
    }

    public void logout(String authorizationHeader) {
        String token = jwtTokenProvider.extractTokenFromBearerString(authorizationHeader);
        if (token == null || !jwtTokenProvider.validateToken(token)) {
            throw new UnauthorizedException("Token inválido ou não fornecido");
        }
        log.info("Logout realizado para token JWT válido");
    }
}
