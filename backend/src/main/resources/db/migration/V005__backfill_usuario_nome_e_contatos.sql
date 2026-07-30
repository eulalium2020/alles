-- ============================================
-- ALLES - Migração V005: Backfill de nomes/contatos em usuarios
-- ============================================
-- Objetivo:
-- 1) Garantir que usuarios.nome não fique vazio para registros já existentes
-- 2) Popular usuarios.cpf/telefone quando possível a partir de pacientes

UPDATE usuarios u
LEFT JOIN pacientes p ON p.usuario_id = u.id
SET
  u.nome = CASE
    WHEN TRIM(COALESCE(u.nome, '')) <> '' THEN u.nome
    WHEN u.perfil = 'PACIENTE' THEN CONCAT('Paciente ', u.id)
    WHEN u.perfil = 'PROFISSIONAL' THEN CONCAT('Profissional ', u.id)
    WHEN u.perfil = 'GERENTE' THEN 'Gerente'
    WHEN u.perfil = 'ADMIN' THEN 'Administrador'
    ELSE SUBSTRING_INDEX(u.email, '@', 1)
  END,
  u.cpf = CASE
    WHEN TRIM(COALESCE(u.cpf, '')) <> '' THEN u.cpf
    WHEN p.cpf IS NOT NULL THEN p.cpf
    ELSE u.cpf
  END,
  u.telefone = CASE
    WHEN TRIM(COALESCE(u.telefone, '')) <> '' THEN u.telefone
    WHEN p.telefone IS NOT NULL THEN p.telefone
    ELSE u.telefone
  END;
