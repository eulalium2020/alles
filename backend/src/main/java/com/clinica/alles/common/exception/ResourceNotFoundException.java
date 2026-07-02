package com.clinica.alles.common.exception;

/**
 * Exceção lançada quando um recurso não é encontrado.
 */
public class ResourceNotFoundException extends BusinessException {

    public ResourceNotFoundException(String message) {
        super(message);
    }

    public ResourceNotFoundException(String resource, Long id) {
        super(String.format("%s com ID %d não encontrado", resource, id));
    }

    public ResourceNotFoundException(String resource, String value) {
        super(String.format("%s '%s' não encontrado", resource, value));
    }
}
