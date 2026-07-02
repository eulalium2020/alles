package com.clinica.alles.common.exception;

/**
 * Exceção base para erros de negócio da aplicação.
 */
public class BusinessException extends RuntimeException {

    public BusinessException(String message) {
        super(message);
    }

    public BusinessException(String message, Throwable cause) {
        super(message, cause);
    }
}
