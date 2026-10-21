CREATE DATABASE Tetria;

USE Tetria;

-- TABELA EMPRESA
CREATE TABLE Empresa (
    idEmpresa INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    nome_fantasia VARCHAR(45) NOT NULL,
    razao_social VARCHAR(45) NOT NULL,
    cnpj CHAR(14) NOT NULL,
    email VARCHAR(45) NOT NULL UNIQUE,
    telefone CHAR(14) UNIQUE,
    dtCadastro DATETIME DEFAULT CURRENT_TIMESTAMP,
    dtAtualizacao DATE
);

-- TABELA USUARIO
CREATE TABLE Usuario (
    idUsuario INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(45) NOT NULL,
    cpf CHAR(14) NOT NULL UNIQUE,
    email VARCHAR(45) NOT NULL UNIQUE,
    telefone CHAR(14) NOT NULL UNIQUE,
    senha VARCHAR(45) NOT NULL,
    fkEmpresa INT NOT NULL,
    Responsavel TINYINT DEFAULT 0,
	CONSTRAINT fk_idEmpresa
		FOREIGN KEY (fkEmpresa)
		REFERENCES Empresa(idEmpresa),
	CONSTRAINT chk_Responsavel 
		CHECK (Responsavel IN (0,1))
);

-- TABELA COLMEIA
CREATE TABLE Colmeia (
    idColmeia INT NOT NULL AUTO_INCREMENT  PRIMARY KEY,
    codigo VARCHAR(45) NOT NULL,
    localizacao VARCHAR(45) NOT NULL,
    quadrante VARCHAR(45),
	statuss TINYINT DEFAULT 1,
    fkEmpresa INT NOT NULL,   
    CONSTRAINT fkColmeia_idEmpresa
		FOREIGN KEY (fkEmpresa)
		REFERENCES Empresa(idEmpresa),
	CONSTRAINT chk_status 
		CHECK (statuss IN (0,1))
);

-- TABELA SENSOR
CREATE TABLE Sensor (
    idSensor INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(45) NOT NULL,
    tipoSensor VARCHAR(45) NOT NULL,
    dtInstalacao DATETIME DEFAULT CURRENT_TIMESTAMP,
    fkColmeia INT,
    fkEmpresa INT NOT NULL,
    CONSTRAINT fkSensor_idColmeia
        FOREIGN KEY (fkColmeia) REFERENCES Colmeia(idColmeia),
    CONSTRAINT fkSensor_idEmpresa
        FOREIGN KEY (fkEmpresa) REFERENCES Empresa(idEmpresa),
    CONSTRAINT chk_tipoSensor
        CHECK (
            (tipoSensor = 'Interno' AND fkColmeia IS NOT NULL)
            OR
            (tipoSensor = 'Externo' AND fkColmeia IS NULL)
        )
);
        
-- TABELA COLETA DE DADOS
CREATE TABLE Coleta_Dados (
	idColeta INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
	temperatura DECIMAL(10,2),
    umidade DECIMAL(10,2),
    dt_hora DATETIME DEFAULT CURRENT_TIMESTAMP,
    fkSensor INT NOT NULL,
    CONSTRAINT fkSensor_idSensor 
		FOREIGN KEY (fkSensor)
        REFERENCES Sensor(idSensor)
	);
    
-- TABELA ENDEREÇO
CREATE TABLE Endereco (
    idEndereco INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    cep CHAR(9),
    numero VARCHAR(45),
    complemento VARCHAR(45),
    logradouro VARCHAR(45),
    bairro VARCHAR(45),
    cidade VARCHAR(45),
    estado VARCHAR(45),
    dt_ultima_atualizacao DATETIME,
    fkEnderecoEmpresa INT NOT NULL,
    CONSTRAINT fkEndereco_idEmpresa
    FOREIGN KEY (fkEnderecoEmpresa)
    REFERENCES Empresa(idEmpresa)
);


-- DADOS EMPRESA
INSERT INTO Empresa(nome_fantasia,razao_social, cnpj, email, telefone) VALUES 
('Fazenda Vale Dourado', 'Vale Dourado Apicultura Ltda', '12345678000101', 'fazendaValedourado@gmail.com', '(11)98765-0001'),
('Apiário Santa Helena', 'Santa Helena Produtos Apícolas Ltda', '12345678000102', 'apiariosantahelena@gmail.com', '(11)98765-0002'),
('Fazenda Bela Colmeia', 'Bela Colmeia Producao Apícola Ltda', '12345678000103', 'belacolmeia@gmailcom', '(11)98765-0003' ),
('Apiário Monte Verde', 'Monte Verde Apicultura Ltda', '12345678000104', 'fzdApiariomonteverde@gmail.com', '(11)98765-0004' ),
('Fazenda Recanto das Abelhas', 'Recanto das Abelhas Produtos Naturais Ltda', '12345678000105', 'fazendaRecantodasabelhas@gmail.com', '(11)98765-0005');

-- DADOS USUARIO
INSERT INTO Usuario(nome, cpf, email, telefone, senha, fkEmpresa, Responsavel) VALUES
('Joao Silva', '529.841.763-20', 'joaosilva@gmail.com', '(11)98765-1001', 'joao123', 1, 1),
('Beatriz Lima', '638.215.947-01', 'beatrizlima@gmail.com', '(11)98765-1002', 'bia123', 1, 0),
('Maria Santos', '741.963.852-04', 'mariasantos@gmail.com', '(11)98765-1003', 'maria123', 2, 1),
('Rafael Costa', '852.741.963-05', 'rafaelcosta@gmail.com', '(11)98765-1004', 'rafa123', 2, 0),
('Carlos Oliveira', '963.852.741-06', 'carlosoliveira@gmail.com', '(11)98765-1005', 'carlos123', 3, 1),
('Juliana Rocha', '184.726.395-07', 'julianarocha@gmail.com', '(11)98765-1006', 'julia123', 3, 0),
('Ana Souza', '295.837.416-08', 'anasouza@gmail.com', '(11)98765-1007', 'ana123', 4, 1),
('Lucas Ferreira', '316.948.527-09', 'lucasferreira@gmail.com', '(11)98765-1008', 'lucas123', 4, 0),
('Pedro Costa', '427.159.638-10', 'pedrocosta@gmail.com', '(11)98765-1009', 'pedro123', 5, 1),
('Camila Alves', '538.261.749-11', 'camilaalves@gmail.com', '(11)98765-1010', 'cami123', 5, 0);

-- DADOS COLMEIA
INSERT INTO Colmeia (codigo, localizacao, quadrante, statuss, fkEmpresa) VALUES
('COL001', 'Área Leste', 'A1', 1, 1),
('COL002', 'Área Norte', 'A2', 1, 1),
('COL003', 'Área Leste', 'A1', 1, 2),
('COL004', 'Área Sul', 'A2', 0, 2),
('COL005', 'Área Sul', 'A1', 1, 3),
('COL006', 'Área Oeste', 'A2', 1, 3),
('COL007', 'Área Oeste', 'A1', 0, 4),
('COL008', 'Área Oeste', 'A2', 1, 4),
('COL009', 'Área Leste', 'A1', 1, 5),
('COL010', 'Área Central', 'A2', 0, 5);

-- DADOS SENSOR
INSERT INTO Sensor (nome, tipoSensor, dtInstalacao, fkColmeia, fkEmpresa) VALUES
('DHT11 01', 'Interno', '2025-06-01 08:00:00', 1, 1),
('DHT11 02', 'Interno', '2025-06-01 08:10:00', 2, 1),
('DHT11 01', 'Externo', '2025-06-01 08:20:00', NULL, 1),
('DHT11 03', 'Interno', '2025-06-01 09:00:00', 3, 2),
('DHT11 04', 'Interno', '2025-06-01 09:10:00', 4, 2),
('DHT11 02', 'Externo', '2025-06-01 09:20:00', NULL, 2),
('DHT11 05', 'Interno', '2025-06-01 10:00:00', 5, 3),
('DHT11 06', 'Interno', '2025-06-01 10:10:00', 6, 3),
('DHT11 03', 'Externo', '2025-06-01 10:20:00', NULL, 3),
('DHT11 07', 'Interno', '2025-06-01 11:00:00', 7, 4),
('DHT11 08', 'Interno', '2025-06-01 11:10:00', 8, 4),
('DHT11 04', 'Externo', '2025-06-01 11:20:00', NULL, 4),
('DHT11 09', 'Interno', '2025-06-01 12:00:00', 9, 5),
('DHT11 10', 'Interno', '2025-06-01 12:10:00', 10, 5),
('DHT11 05', 'Externo', '2025-06-01 12:20:00', NULL, 5);

-- DADOS ENDEREÇO
INSERT INTO Endereco (cep, numero, complemento, logradouro, bairro, cidade, estado, dt_ultima_atualizacao, fkEnderecoEmpresa) VALUES
('01310-100', '1500', 'Sala 10', 'Av. Paulista', 'Bela Vista', 'São Paulo', 'SP', NOW(), 1),
('01311-200', '850', NULL, 'Rua Haddock Lobo', 'Cerqueira César', 'São Paulo', 'SP', NOW(), 1),
('80010-000', '450', NULL, 'Rua XV de Novembro', 'Centro', 'Curitiba', 'PR', NOW(), 2),
('22021-001', '800', 'Apto 302', 'Av. Atlântica', 'Copacabana', 'Rio de Janeiro', 'RJ', NOW(), 2),
('30130-000', '1200', NULL, 'Rua da Bahia', 'Centro', 'Belo Horizonte', 'MG', NOW(), 3),
('01426-001', '900', 'Sala 12', 'Rua Oscar Freire', 'Pinheiros', 'São Paulo', 'SP', NOW(), 4),
('13010-000', '250', 'Sala 8', 'Rua das Palmeiras', 'Centro', 'Campinas', 'SP', NOW(), 5);

SELECT * FROM Empresa;
SELECT * FROM Endereco;
SELECT * FROM Usuario;
SELECT * FROM Colmeia;
SELECT * FROM Sensor;

-- 1. Exiba o nome dos usuários em ordem alfabética.
SELECT nome AS Nome_Usuario
FROM Usuario
ORDER BY nome ASC;

-- 2. Liste as colmeias inativas.
SELECT codigo, localizacao
FROM Colmeia
WHERE statuss = 0;

-- 3. Exiba os tipos de sensores cadastrados, sem repetir.
SELECT DISTINCT tipoSensor
FROM Sensor;

-- 4. Exiba o nome de cada usuário e o nome da fazenda à qual pertence.
SELECT Usuario.nome AS Usuario,
       Empresa.nome_fantasia AS Fazenda
FROM Usuario
JOIN Empresa
    ON Usuario.fkEmpresa = Empresa.idEmpresa;

-- 5. Exiba todas as fazendas e seus endereços,
-- incluindo as fazendas sem endereço.
SELECT Empresa.nome_fantasia AS Fazenda,
       Endereco.logradouro,
       Endereco.cidade,
       Endereco.estado
FROM Empresa
LEFT JOIN Endereco
    ON Empresa.idEmpresa = Endereco.fkEnderecoEmpresa;

-- 6. Liste as colmeias inativas e o nome da fazenda à qual pertencem.
SELECT Colmeia.codigo,
       Empresa.nome_fantasia AS Fazenda
FROM Colmeia
JOIN Empresa
    ON Colmeia.fkEmpresa = Empresa.idEmpresa
WHERE Colmeia.statuss = 0;

-- 7. Exiba o código e a localização de cada colmeia em uma única coluna.
SELECT CONCAT(codigo, ' - ', localizacao) AS identificacao
FROM Colmeia;

-- 8. Exiba o código de cada colmeia e sua situação: ativa ou inativa.
SELECT codigo,
       CASE
           WHEN statuss = 1 THEN 'Ativa'
           ELSE 'Inativa'
       END AS situacao
FROM Colmeia;

-- 9. Conte quantas colmeias cada fazenda possui,
-- incluindo as fazendas sem colmeias.
SELECT Empresa.nome_fantasia AS Fazenda,
       COUNT(Colmeia.idColmeia) AS Quantidade_Colmeias
FROM Empresa
LEFT JOIN Colmeia
    ON Empresa.idEmpresa = Colmeia.fkEmpresa
GROUP BY Empresa.idEmpresa, Empresa.nome_fantasia;

-- 10. Exiba a fazenda, o código da colmeia e os sensores internos associados.
SELECT Empresa.nome_fantasia AS Fazenda,
       Colmeia.codigo AS Colmeia,
       Sensor.nome AS Sensor
FROM Empresa
JOIN Colmeia
    ON Empresa.idEmpresa = Colmeia.fkEmpresa
JOIN Sensor
    ON Colmeia.idColmeia = Sensor.fkColmeia
WHERE Sensor.tipoSensor = 'Interno';