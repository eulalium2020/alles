package com.clinica.alles.domain.profissional;

/**
 * Enumeração dos tipos de pagamento para profissionais.
 */
public enum TipoPagamento {
    FIXO_POR_CONSULTA("Fixo por consulta"),
    PERCENTUAL_RECEITA("Percentual da receita"),
    AMBOS("Ambos");

    private final String descricao;

    TipoPagamento(String descricao) {
        this.descricao = descricao;
    }

    public String getDescricao() {
        return descricao;
    }
}
