package com.clinica.alles.common.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO para requisição de criação/atualização de profissional.
 * Suporta ID-based (especialidadeId) e name-based (especialidade) selection.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProfissionalRequest {

    @NotBlank(message = "Nome é obrigatório")
    private String nome;

    @NotBlank(message = "Email é obrigatório")
    @Email(message = "Email deve ser válido")
    private String email;

    @NotBlank(message = "CPF é obrigatório")
    @Pattern(regexp = "^\\d{11}$", message = "CPF deve ter exatamente 11 dígitos")
    private String cpf;

    @NotBlank(message = "Telefone é obrigatório")
    @Pattern(regexp = "^\\(\\d{2}\\)\\s?9?\\d{4}-\\d{4}$", message = "Telefone deve estar em formato válido")
    private String telefone;

    @NotBlank(message = "Órgão de classe é obrigatório")
    private String crm;

    // Especialidade: pode vir como ID ou como nome
    private Long especialidadeId;
    private String especialidade; // Nome da especialidade (name-based)

    private String crefito;
    private String bancoAgencia;
    private String bancoConta;

    @NotBlank(message = "Tipo de pagamento é obrigatório")
    private String tipoPagamento;

    @NotNull(message = "Valor fixo por consulta é obrigatório")
    @DecimalMin(value = "0.0", inclusive = false, message = "Valor de consulta particular deve ser maior que zero")
    private java.math.BigDecimal valorFixo;

    @DecimalMin(value = "0.0", message = "Valor de consulta plano não pode ser negativo")
    private java.math.BigDecimal valorConsultaParticular;

    @DecimalMin(value = "0.0", message = "Valor de consulta plano não pode ser negativo")
    private java.math.BigDecimal valorConsultaPlano;

    @DecimalMin(value = "0.0", message = "Percentual de receita não pode ser negativo")
    @DecimalMax(value = "100.0", message = "Percentual de receita não pode ser maior que 100")
    private java.math.BigDecimal percentualReceita;

    @DecimalMin(value = "0.0", message = "Desconto clínica não pode ser negativo")
    @DecimalMax(value = "100.0", message = "Desconto clínica não pode ser maior que 100")
    private java.math.BigDecimal descontoClinicaPercentual;

    private String horariosAtendimento;

    private boolean ativo = true;
}
