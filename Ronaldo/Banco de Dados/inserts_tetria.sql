USE tetria;

INSERT INTO empresa (codempresa, nome_fantasia, razao_social, cnpj, email, telefone) VALUES
('emp00001', 'Mel do Vale Dourado', 'Vale Dourado Apicultura e Comércio de Mel Ltda', '12345678000101', 'contato@meldovaledourado.com.br', '(14)98765-0001'),
('emp00002', 'Apiário Flor de Laranjeira', 'Flor de Laranjeira Produtos Apícolas Ltda', '12345678000102', 'contato@flordelaranjeira.com.br', '(41)98765-0002'),
('emp00003', 'Favo Mineiro', 'Favo Mineiro Mel e Própolis Ltda', '12345678000103', 'contato@favomineiro.com.br', '(31)98765-0003'),
('emp00004', 'Néctar da Serra', 'Néctar da Serra Apicultura e Polinização Ltda', '12345678000104', 'contato@nectardaserra.com.br', '(15)98765-0004'),
('emp00005', 'Colmeia Real', 'Colmeia Real Geleia Real e Derivados Apícolas Ltda', '12345678000105', 'contato@colmeiareal.com.br', '(14)98765-0005');

INSERT INTO funcionario (nome, cpf, telefone, fkcodempresa, fkresponsavel) VALUES
('João Silva', '529.841.763-20', '(14)98765-1001', 'emp00001', NULL),
('Beatriz Lima', '638.215.947-01', '(14)98765-1002', 'emp00001', 1),
('Maria Santos', '741.963.852-04', '(41)98765-1003', 'emp00002', NULL),
('Rafael Costa', '852.741.963-05', '(41)98765-1004', 'emp00002', 3),
('Carlos Oliveira', '963.852.741-06', '(31)98765-1005', 'emp00003', NULL),
('Juliana Rocha', '184.726.395-07', '(31)98765-1006', 'emp00003', 5),
('Ana Souza', '295.837.416-08', '(15)98765-1007', 'emp00004', NULL),
('Lucas Ferreira', '316.948.527-09', '(15)98765-1008', 'emp00004', 7),
('Pedro Costa', '427.159.638-10', '(14)98765-1009', 'emp00005', NULL),
('Camila Alves', '538.261.749-11', '(14)98765-1010', 'emp00005', 9);

INSERT INTO login (email, senha, fkfuncionario) VALUES
('joao.silva@meldovaledourado.com.br', 'joao123', 1),
('beatriz.lima@meldovaledourado.com.br', 'bia123', 2),
('maria.santos@flordelaranjeira.com.br', 'maria123', 3),
('rafael.costa@flordelaranjeira.com.br', 'rafa123', 4),
('carlos.oliveira@favomineiro.com.br', 'carlos123', 5),
('juliana.rocha@favomineiro.com.br', 'julia123', 6),
('ana.souza@nectardaserra.com.br', 'ana123', 7),
('lucas.ferreira@nectardaserra.com.br', 'lucas123', 8),
('pedro.costa@colmeiareal.com.br', 'pedro123', 9),
('camila.alves@colmeiareal.com.br', 'cami123', 10);

INSERT INTO endereco (cep, numero, complemento, logradouro, bairro, cidade, estado, fkenderecoempresa) VALUES
('18600-000', 'km 12', 'Apiário Rio Bonito', 'Estrada Municipal José Antônio Pereira', 'Bairro Rio Bonito', 'Botucatu', 'SP', 'emp00001'),
('83750-000', 's/n', 'Apiário Água Limpa', 'Estrada Municipal João Kaminski', 'Bairro Água Limpa', 'Lapa', 'PR', 'emp00002'),
('25950-000', 'km 5', 'Apiário Cascata', 'Estrada do Bonfim', 'Bairro Cascata', 'Teresópolis', 'RJ', 'emp00002'),
('35700-000', 'km 22', 'Apiário Serra Verde', 'Rodovia MG-424', 'Zona Rural', 'Sete Lagoas', 'MG', 'emp00003'),
('18150-000', 's/n', 'Sítio Boa Vista', 'Estrada Municipal Antônio Marques', 'Bairro dos Pires', 'Ibiúna', 'SP', 'emp00004'),
('18800-000', 'km 3', 'Apiário Ribeirão Claro', 'Estrada Vicinal Manoel Ferreira', 'Bairro Ribeirão Claro', 'Piraju', 'SP', 'emp00005');

INSERT INTO configuracoes (
    temp_min_ideal, temp_max_ideal, temp_alerta_frio, temp_alerta_calor,
    umid_min_ideal, umid_max_ideal, umid_alerta_seco, umid_alerta_excessiva,
    fkenderecoconfiguracoes
) VALUES
(33.00, 36.00, 32.00, 38.00, 50.00, 75.00, 40.00, 85.00, 1),
(33.00, 36.00, 32.00, 38.00, 50.00, 75.00, 40.00, 85.00, 2),
(33.00, 36.00, 32.00, 38.00, 50.00, 75.00, 40.00, 85.00, 3),
(33.00, 36.00, 32.00, 38.00, 50.00, 75.00, 40.00, 85.00, 4),
(33.00, 36.00, 32.00, 38.00, 50.00, 75.00, 40.00, 85.00, 5),
(33.00, 36.00, 32.00, 38.00, 50.00, 75.00, 40.00, 85.00, 6);

INSERT INTO coleta (data_registro, qtd_colhida, fkcoletaendereco) VALUES
(CONCAT(YEAR(CURDATE()) - 1, '-11-20'), 95.00, 1),
(CONCAT(YEAR(CURDATE()), '-02-10'), 110.50, 1),
(CONCAT(YEAR(CURDATE()), '-04-15'), 125.00, 1),
(CONCAT(YEAR(CURDATE()), '-06-20'), 118.00, 1),
(CONCAT(YEAR(CURDATE()), '-08-25'), 142.50, 1),
(CONCAT(YEAR(CURDATE()), '-03-12'), 80.00, 2),
(CONCAT(YEAR(CURDATE()), '-07-18'), 96.00, 2);


INSERT INTO colmeia (codigo, localizacao, statuss, fkendereco) VALUES
('Colmeia 01', 'Fileira A - posição 1', 1, 1),
('Colmeia 02', 'Fileira A - posição 2', 1, 1),
('Colmeia 03', 'Fileira A - posição 3', 1, 1),
('Colmeia 04', 'Fileira A - posição 4', 1, 1),
('Colmeia 05', 'Fileira A - posição 5', 1, 1),
('Colmeia 06', 'Fileira B - posição 1', 1, 1),
('Colmeia 07', 'Fileira B - posição 2', 1, 1),
('Colmeia 08', 'Fileira B - posição 3', 1, 1),
('Colmeia 09', 'Fileira B - posição 4', 1, 1),
('Colmeia 10', 'Fileira B - posição 5', 1, 1),
('Colmeia 11', 'Setor Sul - posição 1', 1, 2),
('Colmeia 12', 'Setor Sul - posição 2', 1, 2);

INSERT INTO responsavel_colmeia (fkfuncionario, fkcolmeia) VALUES
(1, 1),
(2, 1),
(1, 2),
(1, 3),
(1, 4),
(1, 5),
(2, 6),
(2, 7),
(2, 8),
(2, 9),
(2, 10),
(3, 11),
(4, 12);

INSERT INTO sensor (nome, tiposensor, dtinstalacao, statussensor, fkcolmeia, fkendereco_sexterno) VALUES
('DHT11 - Colmeia 01', 'interno', '2026-01-10 08:00:00', 'ativo', 1, NULL),
('DHT11 - Colmeia 02', 'interno', '2026-01-10 08:05:00', 'ativo', 2, NULL),
('DHT11 - Colmeia 03', 'interno', '2026-01-10 08:10:00', 'ativo', 3, NULL),
('DHT11 - Colmeia 04', 'interno', '2026-01-10 08:15:00', 'ativo', 4, NULL),
('DHT11 - Colmeia 05', 'interno', '2026-01-10 08:20:00', 'ativo', 5, NULL),
('DHT11 - Colmeia 06', 'interno', '2026-01-10 08:25:00', 'ativo', 6, NULL),
('DHT11 - Colmeia 07', 'interno', '2026-01-10 08:30:00', 'ativo', 7, NULL),
('DHT11 - Colmeia 08', 'interno', '2026-01-10 08:35:00', 'ativo', 8, NULL),
('DHT11 - Colmeia 09', 'interno', '2026-01-10 08:40:00', 'ativo', 9, NULL),
('DHT11 - Colmeia 10', 'interno', '2026-01-10 08:45:00', 'ativo', 10, NULL),
('DHT11 - Externo Apiário 1', 'externo', '2026-01-10 08:50:00', 'ativo', NULL, 1),
('DHT11 - Colmeia 11', 'interno', '2026-01-12 09:00:00', 'ativo', 11, NULL),
('DHT11 - Colmeia 12', 'interno', '2026-01-12 09:05:00', 'ativo', 12, NULL),
('DHT11 - Externo Apiário 2', 'externo', '2026-01-12 09:10:00', 'ativo', NULL, 2);

-- Histórico do dia para Colmeia 01 (Sensor 1) - gera picos e gráfico
INSERT INTO coleta_dados (temperatura, umidade, dt_hora, fksensor) VALUES
(34.20, 65.00, TIMESTAMP(CURDATE(), '00:00:00'), 1),
(33.90, 66.00, TIMESTAMP(CURDATE(), '03:00:00'), 1),
(33.60, 67.00, TIMESTAMP(CURDATE(), '06:00:00'), 1),
(34.30, 64.00, TIMESTAMP(CURDATE(), '09:00:00'), 1),
(35.20, 61.00, TIMESTAMP(CURDATE(), '12:00:00'), 1),
(35.60, 60.00, TIMESTAMP(CURDATE(), '15:00:00'), 1),
(35.10, 62.00, TIMESTAMP(CURDATE(), '18:00:00'), 1),
(34.90, 63.00, TIMESTAMP(CURDATE(), '20:42:00'), 1);

-- Histórico do dia para Sensor Externo do Apiário 1 (Sensor 11)
INSERT INTO coleta_dados (temperatura, umidade, dt_hora, fksensor) VALUES
(29.20, 74.00, TIMESTAMP(CURDATE(), '00:00:00'), 11),
(28.60, 76.00, TIMESTAMP(CURDATE(), '03:00:00'), 11),
(28.00, 78.00, TIMESTAMP(CURDATE(), '06:00:00'), 11),
(30.40, 71.00, TIMESTAMP(CURDATE(), '09:00:00'), 11),
(32.60, 64.00, TIMESTAMP(CURDATE(), '12:00:00'), 11),
(33.80, 60.00, TIMESTAMP(CURDATE(), '15:00:00'), 11),
(32.10, 65.00, TIMESTAMP(CURDATE(), '18:00:00'), 11),
(30.50, 70.00, TIMESTAMP(CURDATE(), '20:42:00'), 11);

-- Leituras das demais colmeias do Apiário 1 (3 em Risco, 2 em Atenção, 5 Ideal contando Colmeia 01)
INSERT INTO coleta_dados (temperatura, umidade, dt_hora, fksensor) VALUES
(38.90, 71.00, TIMESTAMP(CURDATE(), '20:42:00'), 2),   -- Colmeia 02 - Risco
(36.90, 62.00, TIMESTAMP(CURDATE(), '20:42:00'), 3),   -- Colmeia 03 - Atenção
(31.50, 55.00, TIMESTAMP(CURDATE(), '20:42:00'), 4),   -- Colmeia 04 - Risco
(34.10, 58.00, TIMESTAMP(CURDATE(), '20:42:00'), 5),   -- Colmeia 05 - Ideal
(34.70, 79.00, TIMESTAMP(CURDATE(), '20:42:00'), 6),   -- Colmeia 06 - Atenção
(35.60, 69.00, TIMESTAMP(CURDATE(), '20:42:00'), 7),   -- Colmeia 07 - Ideal
(38.90, 78.00, TIMESTAMP(CURDATE(), '20:42:00'), 8),   -- Colmeia 08 - Risco
(34.20, 54.00, TIMESTAMP(CURDATE(), '20:42:00'), 9),   -- Colmeia 09 - Ideal
(35.50, 73.00, TIMESTAMP(CURDATE(), '20:42:00'), 10);  -- Colmeia 10 - Ideal

-- Leituras do Apiário 2 (Sensores 12, 13 e 14)
INSERT INTO coleta_dados (temperatura, umidade, dt_hora, fksensor) VALUES
(34.50, 64.00, TIMESTAMP(CURDATE(), '20:42:00'), 12),
(37.20, 68.00, TIMESTAMP(CURDATE(), '20:42:00'), 13),
(29.80, 72.00, TIMESTAMP(CURDATE(), '20:42:00'), 14);

INSERT INTO contato (solicitante, empresa, motivo, email, mensagem) VALUES
('Fernanda Costa', 'Apiário Bom Néctar', 'Orçamento', 'fernanda@bomnectar.com.br', 'Gostaria de um orçamento para monitorar 40 colmeias em dois apiários.'),
('Roberto Mendes', 'Mel Puro Sul', 'Dúvidas', 'roberto@melpurosul.com.br', 'O sensor aguenta ficar dentro da colmeia com a umidade alta do inverno?'),
('Mariana Lima', 'Cooperativa Apícola Paraná', 'Parceria', 'mariana@coopapicolapr.org.br', 'Temos interesse em oferecer o sistema para os apicultores da cooperativa.'),
('Eduardo Ramos', 'Sítio Abelha Rainha', 'Suporte técnico', 'eduardo@abelharainha.com.br', 'A colmeia 03 parou de enviar leituras desde ontem à noite.'),
('Patrícia Nunes', 'Própolis Verde Minas', 'Financeiro', 'patricia@propolisverde.com.br', 'Preciso da segunda via do boleto referente a este mês.');
