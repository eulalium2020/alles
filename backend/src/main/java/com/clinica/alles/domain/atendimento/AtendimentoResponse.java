package com.clinica.alles.domain.atendimento;

import com.clinica.alles.domain.paciente.Paciente;
import com.clinica.alles.domain.profissional.Profissional;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

/**
 * DTO para resposta de atendimentos com dados normalizados para o frontend.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AtendimentoResponse {
    private Long id;
    private Long profissionalId;
    private Long pacienteId;
    private String dataHora;
    private String tipoAtendimento;
    private String status;
    private String anotacoes;
    private String criadoEm;
    private String atualizadoEm;
    
    // Detalhes aninhados
    private ProfissionalSimples profissional;
    private PacienteSimples paciente;
    private Double valor;

    /**
     * Mapeia uma entidade Atendimento para AtendimentoResponse.
     */
    public static AtendimentoResponse fromEntity(Atendimento atendimento) {
        DateTimeFormatter formatter = DateTimeFormatter.ISO_DATE_TIME;

        String status = atendimento.getStatus();
        if (status == null || status.isBlank()) {
            if (atendimento.getDataFim() != null) {
                status = "REALIZADO";
            } else if (atendimento.getDiagnostico() != null && atendimento.getDiagnostico().startsWith("[CANCELADO]")) {
                status = "CANCELADO";
            } else {
                status = "AGENDADO";
            }
        }

        return AtendimentoResponse.builder()
                .id(atendimento.getId())
                .profissionalId(atendimento.getProfissional() != null ? atendimento.getProfissional().getId() : null)
                .pacienteId(atendimento.getPaciente() != null ? atendimento.getPaciente().getId() : null)
                .dataHora(atendimento.getDataHora() != null ? atendimento.getDataHora().format(formatter) : null)
                .tipoAtendimento(atendimento.getTipoAtendimento() != null ? atendimento.getTipoAtendimento() : "PRESENCIAL")
                .status(status)
                .anotacoes(atendimento.getAnotacoes() != null ? atendimento.getAnotacoes() : atendimento.getNotasConsulta())
                .criadoEm(atendimento.getDataCriacao() != null ? atendimento.getDataCriacao().format(formatter) : null)
                .atualizadoEm(atendimento.getDataAtualizacao() != null
                        ? atendimento.getDataAtualizacao().format(formatter)
                        : atendimento.getDataCriacao() != null ? atendimento.getDataCriacao().format(formatter) : null)
                .profissional(atendimento.getProfissional() != null ? ProfissionalSimples.fromEntity(atendimento.getProfissional()) : null)
                .paciente(atendimento.getPaciente() != null ? PacienteSimples.fromEntity(atendimento.getPaciente()) : null)
                .valor(0.0)
                .build();
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ProfissionalSimples {
        private Long id;
        private String nome;
        private String email;
        private String perfil;
        private Boolean ativo;
        private String criadoEm;
        private String atualizadoEm;
        private String crm;
        private String especialidade;
        private String tipoPagamento;
        private Double valorConsultaParticular;
        private Double valorConsultaPlano;
        private Double percentualReceita;
        private Double descontoClinicaPercentual;

        public static ProfissionalSimples fromEntity(Profissional prof) {
            DateTimeFormatter formatter = DateTimeFormatter.ISO_DATE_TIME;
            var usuario = prof.getUsuario();
            return ProfissionalSimples.builder()
                    .id(prof.getId())
                    .nome(usuario != null ? (usuario.getNome() != null ? usuario.getNome() : usuario.getEmail()) : null)
                    .email(usuario != null ? usuario.getEmail() : null)
                    .perfil(usuario != null && usuario.getPerfil() != null ? usuario.getPerfil().name() : null)
                    .ativo(usuario != null ? usuario.getAtivo() : null)
                    .criadoEm(usuario != null && usuario.getDataCriacao() != null ? usuario.getDataCriacao().format(formatter) : null)
                    .atualizadoEm(usuario != null && usuario.getDataAtualizacao() != null ? usuario.getDataAtualizacao().format(formatter) : null)
                    .crm(prof.getCrm())
                    .especialidade(prof.getEspecialidade() != null ? prof.getEspecialidade().getNome() : null)
                    .tipoPagamento(prof.getTipoPagamento() != null ? prof.getTipoPagamento().name() : null)
                    .valorConsultaParticular(prof.getValorConsultaParticular() != null ? prof.getValorConsultaParticular().doubleValue() : null)
                    .valorConsultaPlano(prof.getValorConsultaPlano() != null ? prof.getValorConsultaPlano().doubleValue() : null)
                    .percentualReceita(prof.getPercentualReceita() != null ? prof.getPercentualReceita().doubleValue() : null)
                    .descontoClinicaPercentual(prof.getDescontoClinicaPercentual() != null ? prof.getDescontoClinicaPercentual().doubleValue() : null)
                    .build();
        }
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PacienteSimples {
        private Long id;
        private String nome;
        private String email;
        private String perfil;
        private Boolean ativo;
        private String criadoEm;
        private String atualizadoEm;
        private String dataNascimento;
        private String cpf;
        private String telefone;
        private String endereco;
        private String numero;
        private String complemento;
        private String bairro;
        private String cidade;
        private String estado;
        private String cep;
        private String alergias;

        public static PacienteSimples fromEntity(Paciente pac) {
            DateTimeFormatter formatter = DateTimeFormatter.ISO_DATE_TIME;
            DateTimeFormatter dateFormatter = DateTimeFormatter.ISO_DATE;
            var usuario = pac.getUsuario();
            return PacienteSimples.builder()
                    .id(pac.getId())
                    .nome(usuario != null ? (usuario.getNome() != null ? usuario.getNome() : usuario.getEmail()) : null)
                    .email(usuario != null ? usuario.getEmail() : null)
                    .perfil(usuario != null && usuario.getPerfil() != null ? usuario.getPerfil().name() : null)
                    .ativo(usuario != null ? usuario.getAtivo() : null)
                    .criadoEm(usuario != null && usuario.getDataCriacao() != null ? usuario.getDataCriacao().format(formatter) : null)
                    .atualizadoEm(usuario != null && usuario.getDataAtualizacao() != null ? usuario.getDataAtualizacao().format(formatter) : null)
                    .dataNascimento(pac.getDataNascimento() != null ? pac.getDataNascimento().format(dateFormatter) : null)
                    .cpf(pac.getCpf())
                    .telefone(pac.getTelefone())
                    .endereco(pac.getEndereco())
                    .numero(pac.getNumero())
                    .complemento(pac.getComplemento())
                    .bairro(pac.getBairro())
                    .cidade(pac.getCidade())
                    .estado(pac.getEstado())
                    .cep(pac.getCep())
                    .alergias(pac.getAlergias())
                    .build();
        }
    }
}
