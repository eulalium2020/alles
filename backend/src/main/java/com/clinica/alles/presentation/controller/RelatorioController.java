package com.clinica.alles.presentation.controller;

import com.clinica.alles.application.service.RelatorioService;
import com.clinica.alles.common.dto.RelatorioMensalResponse;
import com.clinica.alles.domain.relatorio.RelatorioMensal;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.YearMonth;
import java.util.List;

/**
 * Controller REST para gerenciamento de relatórios.
 */
@Slf4j
@RestController
@RequestMapping("/api/relatorios")
@RequiredArgsConstructor
@Tag(name = "Relatórios", description = "Operações para geração e consulta de relatórios")
public class RelatorioController {

    private final RelatorioService relatorioService;

    /**
     * Gera relatório mensal de um profissional específico.
     *
     * @param profissionalId ID do profissional
     * @param mes mês no formato YYYY-MM
     * @return relatório mensal
     */
    @GetMapping("/profissional")
    @PreAuthorize("hasAnyRole('ADMIN', 'CLINICA', 'PROFISSIONAL')")
    @Operation(summary = "Relatório mensal do profissional", 
            description = "Gera relatório mensal de atendimentos e pagamentos para um profissional")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Relatório gerado com sucesso"),
            @ApiResponse(responseCode = "400", description = "Parâmetros inválidos"),
            @ApiResponse(responseCode = "401", description = "Não autorizado"),
            @ApiResponse(responseCode = "404", description = "Profissional não encontrado")
    })
    public ResponseEntity<RelatorioMensalResponse> relatorioMensalProfissional(
            @RequestParam Long profissionalId,
            @RequestParam String mes) {
        log.debug("Gerando relatório mensal: profissionalId={}, mes={}", profissionalId, mes);
        
        YearMonth yearMonth = YearMonth.parse(mes);
        RelatorioMensal relatorio = relatorioService.gerarRelatorioProfissional(profissionalId, yearMonth);
        
        RelatorioMensalResponse response = RelatorioMensalResponse.builder()
                .profissionalId(relatorio.getProfissionalId())
                .profissionalNome(relatorio.getProfissionalNome())
                .mes(relatorio.getMes())
                .totalAtendimentos(relatorio.getTotalAtendimentos())
                .atendimentosRealizados(relatorio.getAtendimentosRealizados())
                .receita(relatorio.getReceita())
                .pagamento(relatorio.getPagamento())
                .descontoClinica(relatorio.getDescontoClinica())
                .tipoPagamento(relatorio.getTipoPagamento())
                .build();
        
        return ResponseEntity.ok(response);
    }

    /**
     * Gera relatórios gerenciais para todos os profissionais em um mês.
     *
     * @param mes mês no formato YYYY-MM
     * @return lista de relatórios mensais
     */
    @GetMapping("/gerencial")
    @PreAuthorize("hasAnyRole('ADMIN', 'CLINICA')")
    @Operation(summary = "Relatório gerencial", 
            description = "Gera relatório gerencial consolidado com todos os profissionais")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Relatório gerado com sucesso"),
            @ApiResponse(responseCode = "400", description = "Parâmetros inválidos"),
            @ApiResponse(responseCode = "401", description = "Não autorizado")
    })
    public ResponseEntity<List<RelatorioMensalResponse>> relatorioGerencial(
            @RequestParam String mes) {
        log.debug("Gerando relatório gerencial para o mês: {}", mes);
        
        YearMonth yearMonth = YearMonth.parse(mes);
        List<RelatorioMensal> relatorios = relatorioService.gerarRelatorioGerencial(yearMonth);
        
        List<RelatorioMensalResponse> responses = relatorios.stream()
                .map(r -> RelatorioMensalResponse.builder()
                        .profissionalId(r.getProfissionalId())
                        .profissionalNome(r.getProfissionalNome())
                        .mes(r.getMes())
                        .totalAtendimentos(r.getTotalAtendimentos())
                        .atendimentosRealizados(r.getAtendimentosRealizados())
                        .receita(r.getReceita())
                        .pagamento(r.getPagamento())
                        .descontoClinica(r.getDescontoClinica())
                        .tipoPagamento(r.getTipoPagamento())
                        .build())
                .toList();
        
        return ResponseEntity.ok(responses);
    }
}
