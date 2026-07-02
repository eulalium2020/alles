package com.clinica.alles.common.exception;

/**
 * Exceção lançada quando usuário não possui autorização para realizar uma ação.
 */
public class UnauthorizedException extends BusinessException {

    public UnauthorizedException(String message) {
        super(message);
    }

    public UnauthorizedException() {
        super("Acesso não autorizado");
    }
}
