CREATE DATABASE tetria;

USE tetria;

-- TABELA EMPRESA
CREATE TABLE empresa (
    idempresa INT NOT NULL AUTO_INCREMENT,
    nome_fantasia VARCHAR (100),
    razao_social VARCHAR(100) NOT NULL,
    cnpj CHAR(14) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    telefone CHAR(14) UNIQUE NOT NULL,
    dtcadastro DATETIME DEFAULT CURRENT_TIMESTAMP,
    dtatualizacao DATETIME,
    codempresa CHAR(8) NOT NULL PRIMARY KEY
);

-- TABELA USUARIO
CREATE TABLE usuario (
    idusuario INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(45) NOT NULL,
    cpf CHAR(14) UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    telefone CHAR(14) UNIQUE,
    senha VARCHAR(45) NOT NULL,
    fkempresa CHAR(8) NOT NULL,
    fkresponsavel INT,
	CONSTRAINT fk_idempresa
		FOREIGN KEY (fkempresa)
		REFERENCES empresa(codempresa),
	CONSTRAINT fkresponsavel_idusuario 
		FOREIGN KEY (fkresponsavel)
		REFERENCES usuario(idusuario)
);


-- TABELA ENDEREÇO (antes do Sensor, que depende dela)
CREATE TABLE endereco (
    idendereco INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    cep CHAR(9),
    numero VARCHAR(45),
    complemento VARCHAR(45),
    logradouro VARCHAR(100),
    bairro VARCHAR(50),
    cidade VARCHAR(50),
    estado VARCHAR(45),
    dt_ultima_atualizacao DATETIME,
    fkEnderecoEmpresa INT NOT NULL,
    CONSTRAINT fkendereco_idempresa
    FOREIGN KEY (fkEnderecoEmpresa)
    REFERENCES empresa(idempresa)
);


-- TABELA COLMEIA
CREATE TABLE colmeia (
    idcolmeia INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    codigo VARCHAR(45) NOT NULL,
    localizacao VARCHAR(45) NOT NULL,
    statuss TINYINT DEFAULT 1,
    fkendereco INT NOT NULL,
    CONSTRAINT fkcolmeia_idendereco
        FOREIGN KEY (fkendereco) REFERENCES endereco(idendereco),
    CONSTRAINT chk_status CHECK (statuss IN (0,1))
);

-- TABELA SENSOR
CREATE TABLE sensor (
    idsensor INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(45) NOT NULL,
    tiposensor VARCHAR(45) NOT NULL,
    dtinstalacao DATETIME DEFAULT CURRENT_TIMESTAMP,
    StatusSensor VARCHAR(45) DEFAULT 'Ativo',
    fkcolmeia INT UNIQUE,
    fkEndereco_sExterno INT,
    CONSTRAINT chk_StatusSensor CHECK (StatusSensor IN  ('Ativo', 'Inativo')),
    CONSTRAINT fksensor_idcolmeia
        FOREIGN KEY (fkcolmeia) REFERENCES colmeia(idcolmeia),
    CONSTRAINT fksensorExterno_idendereco
        FOREIGN KEY (fkEndereco_sExterno) REFERENCES endereco(idendereco),
    CONSTRAINT chk_tiposensor CHECK (
        (tiposensor = 'Interno' AND fkcolmeia IS NOT NULL AND fkendereco IS NULL)
        OR
        (tiposensor = 'Externo' AND fkcolmeia IS NULL AND fkendereco IS NOT NULL)
    )
);
        
-- TABELA COLETA DE DADOS
CREATE TABLE coleta_dados (
	idcoleta INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
	temperatura DECIMAL(10,2),
    umidade DECIMAL(10,2),
    dt_hora DATETIME DEFAULT CURRENT_TIMESTAMP,
    fksensor INT NOT NULL,
    CONSTRAINT fksensor_idsensor 
		FOREIGN KEY (fksensor)
        REFERENCES sensor(idsensor)
	);


CREATE TABLE contato (
	id INT PRIMARY KEY AUTO_INCREMENT,
    solicitante VARCHAR(100),
    empresa VARCHAR(255),
    motivo VARCHAR(50),
    email VARCHAR(120),
    mensagem VARCHAR(1048),
    dtcontato DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT checkemail CHECK(email LIKE '%@%')
    );


-- DADOS EMPRESA
INSERT INTO empresa (codempresa, nome_fantasia, razao_social, cnpj, email, telefone) VALUES
('EMP00001', 'Fazenda Vale Dourado', 'Vale Dourado Apicultura Ltda', '12345678000101', 'fazendaValedourado@gmail.com', '(11)98765-0001'),
('EMP00002', 'Apiário Santa Helena', 'Santa Helena Produtos Apícolas Ltda', '12345678000102', 'apiariosantahelena@gmail.com', '(11)98765-0002'),
('EMP00003', 'Fazenda Bela Colmeia', 'Bela Colmeia Producao Apícola Ltda', '12345678000103', 'belacolmeia@gmail.com', '(11)98765-0003'),
('EMP00004', 'Apiário Monte Verde', 'Monte Verde Apicultura Ltda', '12345678000104', 'fzdApiariomonteverde@gmail.com', '(11)98765-0004'),
('EMP00005', 'Fazenda Recanto das Abelhas', 'Recanto das Abelhas Produtos Naturais Ltda', '12345678000105', 'fazendaRecantodasabelhas@gmail.com', '(11)98765-0005');

-- DADOS ENDEREÇO (antes do Sensor, que depende dele)
INSERT INTO endereco (cep, numero, complemento, logradouro, bairro, cidade, estado, dt_ultima_atualizacao, fkEnderecoEmpresa) VALUES
('01310-100', '1500', 'Sala 10', 'Av. Paulista', 'Bela Vista', 'São Paulo', 'SP', NOW(), 1),
('01311-200', '850', NULL, 'Rua Haddock Lobo', 'Cerqueira César', 'São Paulo', 'SP', NOW(), 1),
('80010-000', '450', NULL, 'Rua XV de Novembro', 'Centro', 'Curitiba', 'PR', NOW(), 2),
('22021-001', '800', 'Apto 302', 'Av. Atlântica', 'Copacabana', 'Rio de Janeiro', 'RJ', NOW(), 2),
('30130-000', '1200', NULL, 'Rua da Bahia', 'Centro', 'Belo Horizonte', 'MG', NOW(), 3),
('01426-001', '900', 'Sala 12', 'Rua Oscar Freire', 'Pinheiros', 'São Paulo', 'SP', NOW(), 4),
('13010-000', '250', 'Sala 8', 'Rua das Palmeiras', 'Centro', 'Campinas', 'SP', NOW(), 5);

-- DADOS USUARIO
INSERT INTO usuario (nome, cpf, email, telefone, senha, fkempresa, fkresponsavel) VALUES
('Joao Silva', '529.841.763-20', 'joaosilva@gmail.com', '(11)98765-1001', 'joao123', 'EMP00001', NULL),
('Beatriz Lima', '638.215.947-01', 'beatrizlima@gmail.com', '(11)98765-1002', 'bia123', 'EMP00001', 1),
('Maria Santos', '741.963.852-04', 'mariasantos@gmail.com', '(11)98765-1003', 'maria123', 'EMP00002', NULL),
('Rafael Costa', '852.741.963-05', 'rafaelcosta@gmail.com', '(11)98765-1004', 'rafa123', 'EMP00002', 3),
('Carlos Oliveira', '963.852.741-06', 'carlosoliveira@gmail.com', '(11)98765-1005', 'carlos123', 'EMP00003', NULL),
('Juliana Rocha', '184.726.395-07', 'julianarocha@gmail.com', '(11)98765-1006', 'julia123', 'EMP00003', 5),
('Ana Souza', '295.837.416-08', 'anasouza@gmail.com', '(11)98765-1007', 'ana123', 'EMP00004', NULL),
('Lucas Ferreira', '316.948.527-09', 'lucasferreira@gmail.com', '(11)98765-1008', 'lucas123', 'EMP00004', 7),
('Pedro Costa', '427.159.638-10', 'pedrocosta@gmail.com', '(11)98765-1009', 'pedro123', 'EMP00005', NULL),
('Camila Alves', '538.261.749-11', 'camilaalves@gmail.com', '(11)98765-1010', 'cami123', 'EMP00005', 9);

-- DADOS COLMEIA
INSERT INTO colmeia (codigo, localizacao, statuss, fkendereco) VALUES
('COL001', 'Área Leste', 1, 1),
('COL002', 'Área Norte', 1, 1),
('COL003', 'Área Leste', 1, 3),
('COL004', 'Área Sul', 0, 3),
('COL005', 'Área Sul', 1, 5),
('COL006', 'Área Oeste', 1, 5),
('COL007', 'Área Oeste', 0, 6),
('COL008', 'Área Oeste', 1, 6),
('COL009', 'Área Leste', 1, 7),
('COL010', 'Área Central', 0, 7);

-- DADOS SENSOR
-- DADOS SENSOR
INSERT INTO sensor (nome, tiposensor, dtinstalacao, fkcolmeia, fkEndereco_sExterno, statussensor) VALUES
('DHT11 01', 'Interno', '2025-06-01 08:00:00', 1, NULL, 'Ativo'),
('DHT11 02', 'Interno', '2025-06-01 08:10:00', 2, NULL, 'Ativo'),
('DHT11 01', 'Externo', '2025-06-01 08:20:00', NULL, 1, 'Ativo'),
('DHT11 03', 'Interno', '2025-06-01 09:00:00', 3, NULL, 'Ativo'),
('DHT11 04', 'Interno', '2025-06-01 09:10:00', 4, NULL, 'Ativo'),
('DHT11 02', 'Externo', '2025-06-01 09:20:00', NULL, 3, 'Inativo'),
('DHT11 05', 'Interno', '2025-06-01 10:00:00', 5, NULL, 'Ativo'),
('DHT11 06', 'Interno', '2025-06-01 10:10:00', 6, NULL, 'Ativo'),
('DHT11 03', 'Externo', '2025-06-01 10:20:00', NULL, 5, 'Ativo'),
('DHT11 07', 'Interno', '2025-06-01 11:00:00', 7, NULL, 'Ativo'),
('DHT11 08', 'Interno', '2025-06-01 11:10:00', 8, NULL, 'Ativo'),
('DHT11 04', 'Externo', '2025-06-01 11:20:00', NULL, 6, 'Inativo'),
('DHT11 09', 'Interno', '2025-06-01 12:00:00', 9, NULL, 'Ativo'),
('DHT11 10', 'Interno', '2025-06-01 12:10:00', 10, NULL, 'Ativo'),
('DHT11 05', 'Externo', '2025-06-01 12:20:00', NULL, 7, 'Ativo');


-- DADOS COLETA (valores do dashboard; colunas: temperatura, umidade, dt_hora, fkSensor)
INSERT INTO coleta_dados (temperatura, umidade, dt_hora, fksensor) VALUES
-- 5 colmeias em estado ideal
(35.0, 60.0, '2026-10-24 08:00:00', 1),
(35.5, 65.0, '2026-10-24 08:00:00', 4),
(34.5, 55.0, '2026-10-24 08:00:00', 7),
(36.0, 70.0, '2026-10-24 08:00:00', 10),
(34.0, 50.0, '2026-10-24 08:00:00', 13),

-- 2 colmeias em estado de atenção
(32.0, 60.0, '2026-10-24 08:00:00', 5),
(35.0, 80.0, '2026-10-24 08:00:00', 8),

-- 3 colmeias em estado crítico
(30.0, 60.0, '2026-10-24 08:00:00', 2),
(39.5, 65.0, '2026-10-24 08:00:00', 11),
(35.0, 90.0, '2026-10-24 08:00:00', 14);


INSERT INTO contato (solicitante, empresa, motivo, email, mensagem) VALUES
('Ana Souza', 'Tech Solutions', 'Suporte Técnico', 'ana.souza@techsolutions.com', 'Sistema apresentando instabilidade no módulo de login.'),
('Carlos Eduardo', 'Inova Varejo', 'Comercial', 'carlos.edu@inovavarejo.com.br', 'Gostaria de solicitar um orçamento para 50 licenças da plataforma.'),
('Mariana Lima', 'Consultoria Ágil', 'Parcerias', 'mariana.lima@agilconsultoria.com', 'Temos interesse em integrar nossas soluções para atendimento conjunto.'),
('Roberto Mendes', 'Logística Express', 'Financeiro', 'roberto@logexpress.com.br', 'Dúvida referente ao faturamento da nota fiscal emitida neste mês.'),
('Fernanda Costa', 'Educa Mais', 'Dúvidas', 'f.costa@educamais.org', 'Preciso de esclarecimentos sobre a compatibilidade da API com nosso LMS.');
 
SELECT * FROM empresa;
SELECT * FROM endereco;
SELECT * FROM usuario;
SELECT * FROM colmeia;
SELECT * FROM sensor;
SELECT * FROM coleta_dados;

-- 1. Exiba o nome dos usuários em ordem alfabética.
SELECT nome AS nome_usuario
FROM usuario
ORDER BY nome ASC;

-- 2. Liste as colmeias inativas.
SELECT codigo, localizacao
FROM colmeia
WHERE statuss = 0;

-- 3. Exiba os tipos de sensores cadastrados, sem repetir.
SELECT DISTINCT tiposensor
FROM sensor;

-- 4. Exiba o nome de cada usuário e o nome da fazenda à qual pertence.
SELECT usuario.nome AS usuario,
       empresa.nome_fantasia AS fazenda
FROM usuario
JOIN empresa
    ON usuario.fkempresa = empresa.codempresa;

-- 5. Exiba todas as fazendas e seus endereços,
-- incluindo as fazendas sem endereço.
SELECT empresa.nome_fantasia AS empresa,
       endereco.logradouro,
       endereco.cidade,
       endereco.estado
FROM empresa
LEFT JOIN endereco
    ON empresa.idempresa = endereco.fkEnderecoEmpresa;

-- 6. Liste as colmeias inativas e o nome da fazenda à qual pertencem.
SELECT c.codigo,
       e.nome_fantasia AS fazenda
FROM colmeia AS c
JOIN endereco AS en
    ON c.fkendereco = en.idendereco
JOIN empresa AS e
    ON en.fkEnderecoEmpresa = e.idempresa
WHERE c.statuss = 0;


-- 7. Exiba o código e a localização de cada colmeia em uma única coluna.
SELECT CONCAT(codigo, ' - ', localizacao) AS identificacao
FROM colmeia;

-- 8. Exiba o código de cada colmeia e sua situação: ativa ou inativa.
SELECT codigo,
       CASE
           WHEN statuss = 1 THEN 'Ativa'
           ELSE 'Inativa'
       END AS situacao
FROM colmeia;

-- 9. Conte quantas colmeias cada fazenda possui,
-- incluindo as fazendas sem colmeias.
SELECT e.nome_fantasia AS fazenda,
       COUNT(c.idcolmeia) AS quantidade_colmeias
FROM empresa AS e
LEFT JOIN endereco AS en
    ON e.idempresa = en.fkEnderecoEmpresa
LEFT JOIN colmeia AS c
    ON en.idendereco = c.fkendereco
GROUP BY e.idempresa, e.nome_fantasia;

-- 10. Exiba a fazenda, o código da colmeia e os sensores internos associados.
SELECT e.nome_fantasia AS fazenda,
       c.codigo AS colmeia,
       s.nome AS sensor
FROM empresa AS e
JOIN endereco AS en
    ON e.idempresa = en.fkEnderecoEmpresa
JOIN colmeia AS c
    ON en.idendereco = c.fkendereco
JOIN sensor AS s
    ON c.idcolmeia = s.fkcolmeia
WHERE s.tiposensor = 'Interno';


-- SELECT CONTATO
SELECT CONCAT(
        'ID:', id,
        ' | O solicitante ', solicitante, ' da empresa ', empresa, ' entrou em contato pelo motivo: ', motivo,
        ' | E-mail: ', email,
        ' | Data: ', DATE_FORMAT(dtcontato, '%d/%m/%Y %H:%i'),
        ' | Mensagem: "', mensagem, '"'
    ) AS 'Contatos Registrados'
FROM contato;

-- SELECT DASHBOARD 

-- SELECT AÇÃO E INFORMAÇÕES DAS COLMEIAS
SELECT
CONCAT('Colmeia: ', c.codigo, ' - Localizada: ', localizacao, '  - Temperatura: ' ,col.temperatura, '  Umidade ', col.umidade, '%  ' ,  s.tiposensor) status_colmeias,
CASE
	WHEN col.temperatura < 32 OR col.temperatura > 38 OR col.umidade >= 85 THEN 'Risco'
	WHEN col.temperatura >= 33 AND col.temperatura <= 36
		AND col.umidade >= 50 AND col.umidade <= 75 THEN 'Ideal'
			ELSE 'Atenção'
END AS 'Precisam de ação'
FROM colmeia c JOIN sensor s
ON c.idcolmeia = s.fkcolmeia
JOIN coleta_dados col
ON s.idsensor = col.fksensor; 	

-- SELECT QUANTIDADE DE COLMEIAS EM CADA ESTADO (IDEAL, ATENÇÃO E RISCO)

SELECT classificacao, 
 COUNT(*) AS qtd_colmeias
FROM (
SELECT c.idcolmeia,
	CASE
		WHEN col.temperatura < 32 OR col.temperatura > 38 OR col.umidade >= 85 THEN 'Risco'
		WHEN col.temperatura >= 33 AND col.temperatura <= 36
			AND col.umidade >= 50 AND col.umidade <= 75 THEN 'Ideal'
               ELSE 'Atenção'
	END classificacao
	FROM colmeia AS c
    JOIN sensor AS s
        ON c.idcolmeia = s.fkcolmeia
    JOIN coleta_dados AS col
        ON s.idsensor = col.fksensor
    WHERE tiposensor = 'Interno'
) AS status_colmeia 
GROUP BY classificacao;


-- SELECT COLMEIAS EM RISCO
SELECT
CONCAT('Colmeia: ', c.codigo, ' - Localizada: ', localizacao, '  - Temperatura: ' ,col.temperatura, '  Umidade ', col.umidade, '%  ' ,  s.tiposensor) status_colmeias,
CASE
	WHEN col.temperatura < 32 OR col.temperatura > 38 OR col.umidade >= 85 THEN 'Risco'
	WHEN col.temperatura >= 33 AND col.temperatura <= 36
		AND col.umidade >= 50 AND col.umidade <= 75 THEN 'Ideal'
			ELSE 'Atenção'
END AS 'acao'
FROM colmeia c JOIN sensor s
ON c.idcolmeia = s.fkcolmeia
JOIN coleta_dados col
ON s.idsensor = col.fksensor
	WHERE col.temperatura < 32 OR col.temperatura > 38 OR col.umidade >= 85; 	
    
-- SELECT SENSORES ATIVOS E INATIVOS
SELECT statusSensor, COUNT(*) as qtd_sensor
FROM sensor
GROUP BY statusSensor; 

-- SELECT SENSORES INATIVOS
SELECT idSensor, statusSensor, tipoSensor
FROM Sensor
WHERE statusSensor = 'Inativo';

-- DROP DATABASE Tetria;
