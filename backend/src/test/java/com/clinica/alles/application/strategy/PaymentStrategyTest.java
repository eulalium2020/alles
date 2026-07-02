package com.clinica.alles.application.strategy;

import com.clinica.alles.domain.atendimento.Atendimento;
import com.clinica.alles.domain.profissional.Profissional;
import com.clinica.alles.domain.usuario.Usuario;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;

@DisplayName("Payment Strategy Unit Tests")
class PaymentStrategyTest {

    private FixoConsultaStrategy fixoConsultaStrategy;
    private PercentualReceitaStrategy percentualReceitaStrategy;

    private Profissional profissional;
    private List<Atendimento> atendimentos;

    @BeforeEach
    void setUp() {
        fixoConsultaStrategy = new FixoConsultaStrategy();
        percentualReceitaStrategy = new PercentualReceitaStrategy();

        Usuario usuario = new Usuario();
        usuario.setId(1L);
        usuario.setEmail("prof@test.com");

        profissional = new Profissional();
        profissional.setId(1L);
        profissional.setUsuario(usuario);
        profissional.setValorConsultaParticular(BigDecimal.valueOf(150.00));
        profissional.setValorConsultaPlano(BigDecimal.valueOf(100.00));
        profissional.setPercentualReceita(BigDecimal.valueOf(70.00));
        profissional.setDescontoClinicaPercentual(BigDecimal.valueOf(20.00));

        atendimentos = new ArrayList<>();
    }

    @Test
    @DisplayName("Should calculate payment with fixed consultation strategy")
    void testFixoConsultaStrategy() {
        for (int i = 0; i < 5; i++) {
            Atendimento atendimento = new Atendimento();
            atendimento.setId((long) i);
            atendimento.setDataInicio(LocalDateTime.now());
            atendimento.setDataFim(LocalDateTime.now().plusHours(1));
            atendimentos.add(atendimento);
        }

        BigDecimal resultado = fixoConsultaStrategy.calcular(atendimentos, profissional);
        BigDecimal esperado = BigDecimal.valueOf(750.00); // 150 * 5

        assertEquals(esperado, resultado);
    }

    @Test
    @DisplayName("Should calculate payment with revenue percentage strategy")
    void testPercentualReceitaStrategy() {
        for (int i = 0; i < 3; i++) {
            Atendimento atendimento = new Atendimento();
            atendimento.setId((long) i);
            atendimento.setDataInicio(LocalDateTime.now());
            atendimento.setDataFim(LocalDateTime.now().plusHours(1));
            atendimentos.add(atendimento);
        }

        BigDecimal resultado = percentualReceitaStrategy.calcular(atendimentos, profissional);
        
        // Receita = 100 * 3 = 300
        // Pagamento Profissional = 300 * 70% = 210
        // Desconto Clínica = 300 * 20% = 60
        // Total = 210 - 60 = 150
        BigDecimal esperado = BigDecimal.valueOf(150);

        assertEquals(0, esperado.compareTo(resultado));
    }

    @Test
    @DisplayName("Should return zero payment when no appointments")
    void testPaymentWithNoAppointments() {
        BigDecimal resultado = fixoConsultaStrategy.calcular(atendimentos, profissional);
        
        assertEquals(BigDecimal.valueOf(0.00), resultado);
    }

    @Test
    @DisplayName("Should count only realized appointments (with data_fim)")
    void testPaymentCountsOnlyRealizedAppointments() {
        // Add 3 realized appointments
        for (int i = 0; i < 3; i++) {
            Atendimento atendimento = new Atendimento();
            atendimento.setId((long) i);
            atendimento.setDataInicio(LocalDateTime.now());
            atendimento.setDataFim(LocalDateTime.now().plusHours(1));
            atendimentos.add(atendimento);
        }

        // Add 2 scheduled but not realized appointments
        for (int i = 3; i < 5; i++) {
            Atendimento atendimento = new Atendimento();
            atendimento.setId((long) i);
            atendimento.setDataInicio(LocalDateTime.now().plusDays(1));
            atendimento.setDataFim(null);
            atendimentos.add(atendimento);
        }

        BigDecimal resultado = fixoConsultaStrategy.calcular(atendimentos, profissional);
        BigDecimal esperado = BigDecimal.valueOf(450.00); // 150 * 3 (only realized)

        assertEquals(esperado, resultado);
    }
}
