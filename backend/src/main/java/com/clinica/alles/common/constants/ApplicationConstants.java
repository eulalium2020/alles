package com.clinica.alles.common.constants;

/**
 * Constantes gerais da aplicação.
 */
public class ApplicationConstants {

    public static final String API_PREFIX = "/api";
    public static final String AUTH_ENDPOINT = "/auth";
    public static final String LOGIN_ENDPOINT = "/login";
    public static final String REFRESH_ENDPOINT = "/refresh";

    public static final String SWAGGER_TITLE = "ALLES Clinic Management API";
    public static final String SWAGGER_DESCRIPTION = "API para gerenciamento de clínica médica ALLES";
    public static final String SWAGGER_VERSION = "1.0.0";

    private ApplicationConstants() {
        throw new AssertionError("Classe de constantes não deve ser instanciada");
    }
}
