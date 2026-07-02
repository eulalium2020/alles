package com.clinica.alles.infrastructure.persistence;

import com.clinica.alles.domain.usuario.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repositório para gerenciar operações de persistência da entidade Usuario.
 */
@Repository
public interface IUsuarioRepository extends JpaRepository<Usuario, Long> {

    /**
     * Busca um usuário pelo email.
     *
     * @param email o email do usuário
     * @return um Optional contendo o usuário se encontrado
     */
    Optional<Usuario> findByEmail(String email);

    /**
     * Verifica se existe um usuário com o email informado.
     *
     * @param email o email a verificar
     * @return true se existe, false caso contrário
     */
    boolean existsByEmail(String email);
}
