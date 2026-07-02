package com.clinica.alles.domain.usuario;

/**
 * Enumeração dos perfis de usuário no sistema.
 */
public enum Perfil {
    ADMIN("Administrador"),
    PROFISSIONAL("Profissional"),
    PACIENTE("Paciente"),
    RECEPCIONISTA("Recepcionista");

    private final String descricao;

    Perfil(String descricao) {
        this.descricao = descricao;
    }

    public String getDescricao() {
        return descricao;
    }
}
