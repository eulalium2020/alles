package com.clinica.alles.domain.profissional;

import com.clinica.alles.domain.especialidade.Especialidade;
import com.clinica.alles.domain.usuario.Usuario;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Entidade que representa um profissional de saúde.
 * Estende a entidade Usuario com informações específicas de profissionais.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "profissionais")
@EqualsAndHashCode(exclude = {"usuario", "especialidade"})
public class Profissional {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "usuario_id", nullable = false, unique = true)
    private Usuario usuario;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "especialidade_id")
    private Especialidade especialidade;

    @Column(unique = true, length = 20)
    private String crm;

    @Column(unique = true, length = 20)
    private String crefito;

    @Column(name = "banco_agencia", length = 20)
    private String bancoAgencia;

    @Column(name = "banco_conta", length = 30)
    private String bancoConta;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_pagamento")
    private TipoPagamento tipoPagamento;

    @Column(name = "valor_consulta_particular", precision = 10, scale = 2)
    private BigDecimal valorConsultaParticular;

    @Column(name = "valor_consulta_plano", precision = 10, scale = 2)
    private BigDecimal valorConsultaPlano;

    @Column(name = "percentual_receita", precision = 5, scale = 2)
    private BigDecimal percentualReceita;

    @Column(name = "desconto_clinica_percentual", precision = 5, scale = 2, nullable = false)
    private BigDecimal descontoClinicaPercentual = new BigDecimal("20.00");

    @Column(name = "data_cadastro", nullable = false, updatable = false)
    private LocalDateTime dataCadastro;

    @Column(nullable = false)
    private Boolean ativo = true;

    @PrePersist
    protected void onCreate() {
        dataCadastro = LocalDateTime.now();
    }
}
