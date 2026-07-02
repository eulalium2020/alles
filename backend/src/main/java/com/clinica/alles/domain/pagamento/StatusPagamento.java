package com.clinica.alles.domain.pagamento;

/**
 * Enumeração dos status possíveis de um pagamento.
 */
public enum StatusPagamento {
    PENDENTE("Pendente"),
    PROCESSANDO("Processando"),
    PAGO("Pago"),
    CANCELADO("Cancelado"),
    FALHA("Falha");

    private final String descricao;

    StatusPagamento(String descricao) {
        this.descricao = descricao;
    }

    public String getDescricao() {
        return descricao;
    }
}
