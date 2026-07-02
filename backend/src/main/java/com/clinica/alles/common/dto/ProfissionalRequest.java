package com.clinica.alles.common.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * DTO para requisição de criação/atualização de profissional.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProfissionalRequest {

    @NotBlank(message = "Email é obrigatório")
    @Email(message = "Email deve ser válido")
    private String email;

    @Pattern(regexp = "^\\d{6}$", message = "CRM deve ter exatamente 6 dígitos")
    private String crm;

    private String crefito;

    private String bancoAgencia;

    private String bancoConta;

    @NotBlank(message = "Tipo de pagamento é obrigatório")
    private String tipoPagamento;

    @NotNull(message = "Valor de consulta particular é obrigatório")
    @DecimalMin(value = "0.0", inclusive = false, message = "Valor de consulta particular deve ser maior que zero")
    private BigDecimal valorConsultaParticular;

    @DecimalMin(value = "0.0", message = "Valor de consulta plano não pode ser negativo")
    private BigDecimal valorConsultaPlano;

    @DecimalMin(value = "0.0", message = "Percentual de receita não pode ser negativo")
    @DecimalMax(value = "100.0", message = "Percentual de receita não pode ser maior que 100")
    private BigDecimal percentualReceita;

    @DecimalMin(value = "0.0", message = "Desconto clínica não pode ser negativo")
    @DecimalMax(value = "100.0", message = "Desconto clínica não pode ser maior que 100")
    private BigDecimal descontoClinicaPercentual;

    private Long especialidadeId;
}
