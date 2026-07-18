package com.clinica.alles.common.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO para resposta de nomes/display strings.
 * Usado pelos endpoints /nomes para listar profissionais, pacientes, especialidades, etc.
 * Permite que o frontend use names em formulários instead of IDs.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NomeResponse {

    private Long id;
    private String nome;
    private String display; // "Nome (CPF/CRM/etc)" - formatted display string

    // Optional fields depending on type
    private String crm; // Para profissionais
    private String cpf; // Para pacientes
    private String operadora; // Para planos de saúde
}
