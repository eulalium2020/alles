package com.clinica.alles.presentation.controller;

import com.clinica.alles.application.service.PagamentoService;
import com.clinica.alles.common.dto.PagamentoResponse;
import com.clinica.alles.domain.pagamento.Pagamento;
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
import java.util.stream.Collectors;

/**
 * Controller REST para gerenciamento de pagamentos.
 */
@Slf4j
@RestController
@RequestMapping("/api/pagamentos")
@RequiredArgsConstructor
@Tag(name = "Pagamentos", description = "Operações de gerenciamento de pagamentos de profissionais")
public class PagamentoController {

    private final PagamentoService pagamentoService;

    /**
     * Lista pagamentos de um profissional em um período específico.
     *
     * @param profissionalId ID do profissional
     * @param mes mês no formato YYYY-MM
     * @return lista de pagamentos
     */
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'CLINICA')")
    @Operation(summary = "Listar pagamentos", description = "Retorna pagamentos de um profissional em um período")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Lista de pagamentos retornada com sucesso"),
            @ApiResponse(responseCode = "400", description = "Parâmetros inválidos"),
            @ApiResponse(responseCode = "401", description = "Não autorizado"),
            @ApiResponse(responseCode = "404", description = "Profissional não encontrado")
    })
    public ResponseEntity<List<PagamentoResponse>> listarPeriodo(
            @RequestParam Long profissionalId,
            @RequestParam String mes) {
        log.debug("Listando pagamentos: profissionalId={}, mes={}", profissionalId, mes);
        
        YearMonth yearMonth = YearMonth.parse(mes);
        List<Pagamento> pagamentos = pagamentoService.findByPeriodo(profissionalId, yearMonth);
        
        List<PagamentoResponse> responses = pagamentos.stream()
                .map(p -> PagamentoResponse.builder()
                        .id(p.getId())
                        .profissionalId(p.getProfissional().getId())
                        .profissionalNome(p.getProfissional().getUsuario().getEmail())
                        .valor(p.getValor())
                        .dataPagamento(p.getDataPagamento())
                        .dataVencimento(p.getDataVencimento())
                        .status(p.getStatus().toString())
                        .build())
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(responses);
    }

    /**
     * Processa um pagamento.
     *
     * @param id ID do pagamento
     * @return pagamento processado
     */
    @PostMapping("/{id}/processar")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Processar pagamento", description = "Processa um pagamento pendente")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Pagamento processado com sucesso"),
            @ApiResponse(responseCode = "400", description = "Erro na operação"),
            @ApiResponse(responseCode = "404", description = "Pagamento não encontrado"),
            @ApiResponse(responseCode = "401", description = "Não autorizado")
    })
    public ResponseEntity<PagamentoResponse> processar(@PathVariable Long id) {
        log.info("Processando pagamento: {}", id);
        
        Pagamento pagamento = pagamentoService.processarPagamento(id);
        
        PagamentoResponse response = PagamentoResponse.builder()
                .id(pagamento.getId())
                .profissionalId(pagamento.getProfissional().getId())
                .profissionalNome(pagamento.getProfissional().getUsuario().getEmail())
                .valor(pagamento.getValor())
                .dataPagamento(pagamento.getDataPagamento())
                .dataVencimento(pagamento.getDataVencimento())
                .status(pagamento.getStatus().toString())
                .build();
        
        return ResponseEntity.ok(response);
    }
}
