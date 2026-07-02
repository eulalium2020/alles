package com.clinica.alles.common.exception;

/**
 * Exceção lançada quando tenta-se criar um recurso que já existe.
 */
public class DuplicateResourceException extends BusinessException {

    public DuplicateResourceException(String message) {
        super(message);
    }

    public DuplicateResourceException(String resource, String field, String value) {
        super(String.format("%s com %s '%s' já existe", resource, field, value));
    }
}
