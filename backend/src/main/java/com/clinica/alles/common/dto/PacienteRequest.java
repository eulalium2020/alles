package com.clinica.alles.common.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

/**
 * DTO para requisição de criação/atualização de paciente.
 * Suporta ID-based (planosSaudeIds) e name-based (planosSaudeNomes) selection.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PacienteRequest {

    @NotBlank(message = "Nome é obrigatório")
    private String nome;

    @NotBlank(message = "Email é obrigatório")
    @Email(message = "Email deve ser válido")
    private String email;

    @NotBlank(message = "CPF é obrigatório")
    @Pattern(regexp = "^\\d{11}$", message = "CPF deve ter exatamente 11 dígitos")
    private String cpf;

    @PastOrPresent(message = "Data de nascimento não pode ser no futuro")
    private LocalDate dataNascimento;

    @NotBlank(message = "Sexo é obrigatório")
    private String sexo;

    @NotBlank(message = "Telefone é obrigatório")
    @Pattern(regexp = "^\\(\\d{2}\\)\\s?9?\\d{4}-\\d{4}$", message = "Telefone deve estar em formato válido")
    private String telefone;

    private String endereco;
    private String numero;
    private String complemento;
    private String bairro;
    private String cidade;
    private String estado;
    
    @Pattern(regexp = "^\\d{5}-\\d{3}$", message = "CEP deve estar em formato XXXXX-XXX")
    private String cep;

    private String alergias;
    private String antecedenteMedicos;

    // Planos de saúde: pode vir como IDs ou como nomes
    private List<Long> planosSaudeIds;
    private List<String> planosSaudeNomes; // Nomes dos planos (name-based)

    private boolean ativo = true;
}
