DROP DATABASE IF EXISTS tetria;
CREATE DATABASE IF NOT EXISTS tetria;
USE tetria;

CREATE TABLE empresa (
    codempresa CHAR(8) PRIMARY KEY,
    nome_fantasia VARCHAR(100),
    razao_social VARCHAR(100) NOT NULL,
    cnpj CHAR(14) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    telefone CHAR(14) NOT NULL UNIQUE,
    dtcadastro DATETIME DEFAULT CURRENT_TIMESTAMP,
    dtatualizacao DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE funcionario (
    idfuncionario INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(45) NOT NULL,
    cpf CHAR(14) UNIQUE,
    telefone CHAR(14) UNIQUE,
    fkcodempresa CHAR(8) NOT NULL,
    fkresponsavel INT,
    CONSTRAINT fkFuncionarioEmpresa FOREIGN KEY (fkcodempresa) REFERENCES empresa(codempresa),
    CONSTRAINT fkFuncionarioResponsavel FOREIGN KEY (fkresponsavel) REFERENCES funcionario(idfuncionario)
);

CREATE TABLE login (
    email VARCHAR(100) PRIMARY KEY,
    senha VARCHAR(45) NOT NULL,
    fkfuncionario INT NOT NULL UNIQUE,
    CONSTRAINT fkLoginFuncionario FOREIGN KEY (fkfuncionario) REFERENCES funcionario(idfuncionario)
);

CREATE TABLE endereco (
    idendereco INT PRIMARY KEY AUTO_INCREMENT,
    cep CHAR(9) NOT NULL,
    numero VARCHAR(45),
    complemento VARCHAR(45) NOT NULL,
    logradouro VARCHAR(100) NOT NULL,
    bairro VARCHAR(50) NOT NULL,
    cidade VARCHAR(50) NOT NULL,
    estado VARCHAR(45) NOT NULL,
    dt_criacao DATETIME DEFAULT CURRENT_TIMESTAMP,
    dt_atualizacao DATETIME DEFAULT CURRENT_TIMESTAMP,
    fkenderecoempresa CHAR(8) NOT NULL,
    CONSTRAINT fkEnderecoEmpresa FOREIGN KEY (fkenderecoempresa) REFERENCES empresa(codempresa)
);

CREATE TABLE configuracoes (
    idconfiguracoes INT PRIMARY KEY AUTO_INCREMENT,
    temp_min_ideal DECIMAL(5,2) NOT NULL,
    temp_max_ideal DECIMAL(5,2) NOT NULL,
    temp_alerta_frio DECIMAL(5,2) NOT NULL,
    temp_alerta_calor DECIMAL(5,2) NOT NULL,
    umid_min_ideal DECIMAL(5,2) NOT NULL,
    umid_max_ideal DECIMAL(5,2) NOT NULL,
    umid_alerta_seco DECIMAL(5,2) NOT NULL,
    umid_alerta_excessiva DECIMAL(5,2) NOT NULL,
    fkenderecoconfiguracoes INT NOT NULL UNIQUE,
    CONSTRAINT fkConfiguracoesEndereco FOREIGN KEY (fkenderecoconfiguracoes) REFERENCES endereco(idendereco)
);

CREATE TABLE coleta (
    idcoleta INT PRIMARY KEY AUTO_INCREMENT,
    data_registro DATE NOT NULL,
    qtd_colhida DECIMAL(10,2) NOT NULL,
    fkcoletaendereco INT NOT NULL,
    CONSTRAINT fkColetaEndereco FOREIGN KEY (fkcoletaendereco) REFERENCES endereco(idendereco)
);

CREATE TABLE colmeia (
    idcolmeia INT PRIMARY KEY AUTO_INCREMENT,
    codigo VARCHAR(45) NOT NULL,
    localizacao VARCHAR(45) NOT NULL,
    statuss TINYINT DEFAULT 1,
    fkendereco INT NOT NULL,
    CONSTRAINT fkColmeiaEndereco FOREIGN KEY (fkendereco) REFERENCES endereco(idendereco)
);

CREATE TABLE responsavel_colmeia (
    idresponsavel_colmeia INT AUTO_INCREMENT,
    fkfuncionario INT NOT NULL,
    fkcolmeia INT NOT NULL,
    PRIMARY KEY (idresponsavel_colmeia, fkfuncionario, fkcolmeia),
    CONSTRAINT fkRespColmeiaFuncionario FOREIGN KEY (fkfuncionario) REFERENCES funcionario(idfuncionario),
    CONSTRAINT fkRespColmeiaColmeia FOREIGN KEY (fkcolmeia) REFERENCES colmeia(idcolmeia)
);

CREATE TABLE sensor (
    idsensor INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(45) NOT NULL,
    tiposensor VARCHAR(45) NOT NULL,
    dtinstalacao DATETIME DEFAULT CURRENT_TIMESTAMP,
    statussensor VARCHAR(45) NOT NULL DEFAULT 'ativo',
    fkcolmeia INT,
    fkendereco_sexterno INT,
    CONSTRAINT fkSensorColmeia FOREIGN KEY (fkcolmeia) REFERENCES colmeia(idcolmeia),
    CONSTRAINT fkSensorEnderecoExterno FOREIGN KEY (fkendereco_sexterno) REFERENCES endereco(idendereco)
);

CREATE TABLE coleta_dados (
    idcoleta INT AUTO_INCREMENT,
    temperatura DECIMAL(10,2),
    umidade DECIMAL(10,2),
    dt_hora DATETIME DEFAULT CURRENT_TIMESTAMP,
    fksensor INT NOT NULL,
    PRIMARY KEY (idcoleta, fksensor),
    CONSTRAINT fkColetaDadosSensor FOREIGN KEY (fksensor) REFERENCES sensor(idsensor)
);

CREATE TABLE contato (
    idcontato INT PRIMARY KEY AUTO_INCREMENT,
    solicitante VARCHAR(100) NOT NULL,
    empresa VARCHAR(255) NOT NULL,
    motivo VARCHAR(50) NOT NULL,
    email VARCHAR(120) NOT NULL,
    mensagem VARCHAR(1048) NOT NULL,
    dtcontato DATETIME DEFAULT CURRENT_TIMESTAMP
);
