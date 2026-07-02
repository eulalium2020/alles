package com.clinica.alles;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

/**
 * Classe principal da aplicação ALLES Clinic Management Backend.
 * Spring Boot 3.1.x com Java 17.
 */
@SpringBootApplication
@ComponentScan(basePackages = "com.clinica.alles")
public class AllesBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(AllesBackendApplication.class, args);
    }
}
