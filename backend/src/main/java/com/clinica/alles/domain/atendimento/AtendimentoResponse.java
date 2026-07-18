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

        String status;
        if (atendimento.getDataFim() != null) {
            status = "REALIZADO";
        } else if (atendimento.getDiagnostico() != null && atendimento.getDiagnostico().startsWith("[CANCELADO]")) {
            status = "CANCELADO";
        } else {
            status = "AGENDADO";
        }

        return AtendimentoResponse.builder()
                .id(atendimento.getId())
                .profissionalId(atendimento.getProfissional().getId())
                .pacienteId(atendimento.getPaciente().getId())
                .dataHora(atendimento.getDataHora().format(formatter))
                .tipoAtendimento("PRESENCIAL")
                .status(status)
                .anotacoes(atendimento.getNotasConsulta())
                .criadoEm(atendimento.getDataCriacao().format(formatter))
                .atualizadoEm(atendimento.getDataCriacao().format(formatter))
                .profissional(ProfissionalSimples.fromEntity(atendimento.getProfissional()))
                .paciente(PacienteSimples.fromEntity(atendimento.getPaciente()))
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
            return ProfissionalSimples.builder()
                    .id(prof.getId())
                    .nome(prof.getUsuario().getEmail()) // Usa email como nome até ter campo nome no Usuario
                    .email(prof.getUsuario().getEmail())
                    .perfil(prof.getUsuario().getPerfil().name())
                    .ativo(prof.getUsuario().getAtivo())
                    .criadoEm(prof.getUsuario().getDataCriacao().format(formatter))
                    .atualizadoEm(prof.getUsuario().getDataAtualizacao().format(formatter))
                    .crm(prof.getCrm())
                    .especialidade(prof.getEspecialidade().getNome())
                    .tipoPagamento(prof.getTipoPagamento().name())
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
            return PacienteSimples.builder()
                    .id(pac.getId())
                    .nome(pac.getUsuario().getEmail()) // Usa email como nome até ter campo nome no Usuario
                    .email(pac.getUsuario().getEmail())
                    .perfil(pac.getUsuario().getPerfil().name())
                    .ativo(pac.getUsuario().getAtivo())
                    .criadoEm(pac.getUsuario().getDataCriacao().format(formatter))
                    .atualizadoEm(pac.getUsuario().getDataAtualizacao().format(formatter))
                    .dataNascimento(pac.getDataNascimento().format(dateFormatter))
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
