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
    
INSERT INTO contato (solicitante, empresa, motivo, email, mensagem) VALUES
('Ana Souza', 'Tech Solutions', 'Suporte Técnico', 'ana.souza@techsolutions.com', 'Sistema apresentando instabilidade no módulo de login.'),
('Carlos Eduardo', 'Inova Varejo', 'Comercial', 'carlos.edu@inovavarejo.com.br', 'Gostaria de solicitar um orçamento para 50 licenças da plataforma.'),
('Mariana Lima', 'Consultoria Ágil', 'Parcerias', 'mariana.lima@agilconsultoria.com', 'Temos interesse em integrar nossas soluções para atendimento conjunto.'),
('Roberto Mendes', 'Logística Express', 'Financeiro', 'roberto@logexpress.com.br', 'Dúvida referente ao faturamento da nota fiscal emitida neste mês.'),
('Fernanda Costa', 'Educa Mais', 'Dúvidas', 'f.costa@educamais.org', 'Preciso de esclarecimentos sobre a compatibilidade da API com nosso LMS.');
    
    SELECT CONCAT(
        'ID:', id, 
        ' | O solicitante ', solicitante, ' da empresa ', empresa,' entrou em contato pelo motivo: ', motivo, 
        ' | E-mail: ', email, 
        ' | Data: ', DATE_FORMAT(dtContato, '%d/%m/%Y %H:%i'), -- aula3 sprint1 viviiiii
        ' | Mensagem: "', mensagem, '"' 
    ) AS 'Contatos Registrados'
FROM contato;