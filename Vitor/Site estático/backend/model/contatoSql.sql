CREATE DATABASE tetria;

USE tetria;

CREATE TABLE contato (
	id INT PRIMARY KEY AUTO_INCREMENT,
    solicitante VARCHAR(100),
    empresa VARCHAR(255),
    motivo VARCHAR(50),
    email VARCHAR(120),
    mensagem VARCHAR(1048),
    dtContato DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT checkEmail CHECK(email LIKE '%@%')
    );
    
    SELECT * FROM contato;