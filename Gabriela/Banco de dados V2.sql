CREATE DATABASE Tetria;
USE Tetria;

CREATE TABLE Empresa (
    idEmpresa INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(45) NOT NULL,
    cnpj VARCHAR(45) NOT NULL,
    email VARCHAR(45) NOT NULL,
    telefone VARCHAR(45),
    dtCadastro DATETIME DEFAULT CURRENT_TIMESTAMP);

CREATE TABLE Usuario (
    idUsuario INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(45) NOT NULL,
    cpf VARCHAR(45) NOT NULL,
    email VARCHAR(45) NOT NULL,
    senha VARCHAR(45) NOT NULL,
    fkEmpresa INT NOT NULL,
    CONSTRAINT fk_usuario_empresa
        FOREIGN KEY (fkEmpresa)
        REFERENCES Empresa(idEmpresa));

CREATE TABLE Colmeia (
    idColmeia INT NOT NULL AUTO_INCREMENT  PRIMARY KEY,
    codigo VARCHAR(45) NOT NULL,
    localizacao VARCHAR(45) NOT NULL,
    dtInstalacao VARCHAR(45),
    statuss VARCHAR(45),
    fkEmpresa INT NOT NULL,     
    CONSTRAINT fk_colmeia_empresa
        FOREIGN KEY (fkEmpresa)
        REFERENCES Empresa(idEmpresa));

CREATE TABLE Sensor (
    idSensor INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(45) NOT NULL,
    temperatura DECIMAL(10,2),
    umidade DECIMAL(10,2),
    dt_hora DATETIME,
    fkColmeia INT NOT NULL,
    CONSTRAINT fk_sensor_colmeia
        FOREIGN KEY (fkColmeia)
        REFERENCES Colmeia(idColmeia));
        
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
    Empresa_idEmpresa INT NOT NULL,
    CONSTRAINT fk_endereco_empresa
    FOREIGN KEY (Empresa_idEmpresa)
    REFERENCES Empresa(idEmpresa)
);



INSERT INTO Empresa VALUES
(default, 'Melipona Tech', '12.345.678/0001-01', 'contato@meliponatech.com', '(11) 99999-0001', '2025-01-10'),
(default,'Apis Brasil', '12.345.678/0001-02', 'contato@apisbrasil.com', '(11) 99999-0002', '2025-01-15'),
(default,'BeeSmart', '12.345.678/0001-03', 'contato@beesmart.com', '(11) 99999-0003', '2025-02-05'),
(default,'Colmeia Digital', '12.345.678/0001-04', 'contato@colmeiadigital.com', '(11) 99999-0004', '2025-02-20'),
(default,'ApiTech', '12.345.678/0001-05', 'contato@apitech.com', '(11) 99999-0005', '2025-03-01'),
(default,'BeeMonitor', '12.345.678/0001-06', 'contato@beemonitor.com', '(11) 99999-0006', '2025-03-12'),
(default,'Abelha Viva', '12.345.678/0001-07', 'contato@abelhaviva.com', '(11) 99999-0007', '2025-04-01'),
(default,'HoneyTech', '12.345.678/0001-08', 'contato@honeytech.com', '(11) 99999-0008', '2025-04-15'),
(default,'Apis Monitoramento', '12.345.678/0001-09', 'contato@apismonitoramento.com', '(11) 99999-0009', '2025-05-01'),
(default,'Bee Control', '12.345.678/0001-10', 'contato@beecontrol.com', '(11) 99999-0010', '2025-05-20');

INSERT INTO Usuario VALUES
(default,'Joao Silva', '111.111.111-01', 'joao@meliponatech.com', 'senha123', 1),
(default,'Maria Santos', '111.111.111-02', 'maria@apisbrasil.com', 'senha123', 2),
(default,'Carlos Oliveira', '111.111.111-03', 'carlos@beesmart.com', 'senha123', 3),
(default,'Ana Souza', '111.111.111-04', 'ana@colmeiadigital.com', 'senha123', 4),
(default,'Pedro Costa', '111.111.111-05', 'pedro@apitech.com', 'senha123', 5),
(default,'Julia Lima', '111.111.111-06', 'juliana@beemonitor.com', 'senha123', 6),
(default,'Lucas Ferreira', '111.111.111-07', 'lucas@abelhaviva.com', 'senha123', 7),
(default,'Mariana Alves', '111.111.111-08', 'mariana@honeytech.com', 'senha123', 8),
(default,'Rafael Gomes', '111.111.111-09', 'rafael@apismonitoramento.com', 'senha123', 9),
(default,'Camila Rocha', '111.111.111-10', 'camila@beecontrol.com', 'senha123', 10);

INSERT INTO Colmeia VALUES
(default, 'COL001', 'Sao Paulo', '2025-01-20', 'Ativa', 1),
(default, 'COL002', 'Campinas', '2025-01-25', 'Ativa', 2),
(default, 'COL003', 'Sorocaba', '2025-02-10', 'Ativa', 3),
(default, 'COL004', 'Jundiai', '2025-02-25', 'Manutencao', 4),
(default, 'COL005', 'Santos', '2025-03-05', 'Ativa', 5),
(default, 'COL006', 'Ribeirao Preto', '2025-03-20', 'Ativa', 6),
(default, 'COL007', 'Bauru', '2025-04-05', 'Inativa', 7),
(default, 'COL008', 'Piracicaba', '2025-04-20', 'Ativa', 8),
(default, 'COL009', 'Mogi das Cruzes', '2025-05-05', 'Ativa', 9),
(default, 'COL010', 'Taubate', '2025-05-25', 'Manutencao', 10);


INSERT INTO Sensor VALUES
(default, 'Sensor Temperatura 01', 32.50, 65.20, '2025-06-01 08:00:00', 1),
(default, 'Sensor Temperatura 02', 31.80, 67.40, '2025-06-01 09:00:00', 2),
(default, 'Sensor Temperatura 03', 34.10, 62.80, '2025-06-01 10:00:00', 3),
(default, 'Sensor Temperatura 04', 36.70, 58.50, '2025-06-01 11:00:00', 4),
(default, 'Sensor Temperatura 05', 30.90, 70.10, '2025-06-01 12:00:00', 5),
(default, 'Sensor Temperatura 06', 33.20, 64.30, '2025-06-01 13:00:00', 6),
(default, 'Sensor Temperatura 07', 29.80, 72.60, '2025-06-01 14:00:00', 7),
(default, 'Sensor Temperatura 08', 35.40, 60.20, '2025-06-01 15:00:00', 8),
(default, 'Sensor Temperatura 09', 37.80, 55.90, '2025-06-01 16:00:00', 9),
(default, 'Sensor Temperatura 10', 32.10, 68.70, '2025-06-01 17:00:00', 10);


INSERT INTO Endereco VALUES
('01310-100', '1500', 'Sala 10', 'Av. Paulista', 'Bela Vista', 'São Paulo', 'SP', NOW(), 1),
('01311-200', '850', DEFAULT, 'Rua Haddock Lobo', 'Cerqueira César', 'São Paulo', 'SP', NOW(), 1),
('80010-000', '450', DEFAULT, 'Rua XV de Novembro', 'Centro', 'Curitiba', 'PR',  NOW(), 2),
('22021-001', '800', 'Apto 302', 'Av. Atlântica', 'Copacabana', 'Rio de Janeiro', 'RJ', NOW(), 2),
('30130-000', '1200', DEFAULT, 'Rua da Bahia', 'Centro', 'Belo Horizonte', 'MG', NOW(), 3),
('60165-121', '500', 'Loja 2', 'Av. Beira Mar', 'Meireles', 'Fortaleza', 'CE', NOW(), 3),
('01426-001', '900', 'Sala 12', 'Rua Oscar Freire', 'Pinheiros', 'São Paulo', 'SP', NOW(), 4),
('90010-150', '700', DEFAULT, 'Av. Ipiranga', 'Centro Histórico', 'Porto Alegre', 'RS', NOW(), 4),
('13010-000', '250', 'Sala 8', 'Rua das Palmeiras', 'Centro', 'Campinas', 'SP', NOW(), 5),
('70040-010', '1000', DEFAULT, 'Av. Brasil', 'Asa Sul', 'Brasília', 'DF',  NOW(), 5);

SELECT * FROM Empresa;
SELECT * FROM Endereco;
SELECT * FROM Usuario;
SELECT * FROM Colmeia;
SELECT * FROM Sensor;
