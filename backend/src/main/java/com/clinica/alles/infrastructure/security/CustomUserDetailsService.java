package com.clinica.alles.infrastructure.security;

import com.clinica.alles.infrastructure.persistence.IUsuarioRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;

/**
 * Implementação customizada de UserDetailsService para carregar usuários do banco de dados.
 */
@Slf4j
@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private IUsuarioRepository usuarioRepository;

    /**
     * Carrega um usuário pelo email.
     *
     * @param username email do usuário (usado como username)
     * @return UserDetails
     * @throws UsernameNotFoundException se usuário não encontrado
     */
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        var usuario = usuarioRepository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado com email: " + username));

        if (!usuario.getAtivo()) {
            throw new UsernameNotFoundException("Usuário desativado: " + username);
        }

        log.debug("Usuário carregado: {}", username);

        SimpleGrantedAuthority authority = new SimpleGrantedAuthority("ROLE_" + usuario.getPerfil().name());

        return User.builder()
                .username(usuario.getEmail())
                .password(usuario.getSenha())
                .authorities(Collections.singletonList(authority))
                .accountLocked(false)
                .disabled(!usuario.getAtivo())
                .build();
    }
}
