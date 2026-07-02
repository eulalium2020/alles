package com.clinica.alles.common.exception;

/**
 * Exceção lançada quando dados de entrada não passam na validação.
 */
public class ValidationException extends BusinessException {

    public ValidationException(String message) {
        super(message);
    }
}
