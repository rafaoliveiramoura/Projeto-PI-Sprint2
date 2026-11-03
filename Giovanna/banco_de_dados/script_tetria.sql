create database tetria;

use tetria;

-- tabela empresa
create table empresa (
    nome_fantasia varchar (100),
    razao_social varchar(100) not null,
    cnpj char(14) not null unique,
    email varchar(100) not null unique,
    telefone char(14) unique not null,
    dtcadastro datetime default current_timestamp,
    dtatualizacao datetime default current_timestamp,
    codempresa char(8) not null primary key
);

-- dados empresa
insert into empresa (codempresa, nome_fantasia, razao_social, cnpj, email, telefone) values
('emp00001', 'Mel do Vale Dourado', 'Vale Dourado Apicultura e Comércio de Mel Ltda', '12345678000101', 'contato@meldovaledourado.com.br', '(14)98765-0001'),
('emp00002', 'Apiário Flor de Laranjeira', 'Flor de Laranjeira Produtos Apícolas Ltda', '12345678000102', 'contato@flordelaranjeira.com.br', '(41)98765-0002'),
('emp00003', 'Favo Mineiro', 'Favo Mineiro Mel e Própolis Ltda', '12345678000103', 'contato@favomineiro.com.br', '(31)98765-0003'),
('emp00004', 'Néctar da Serra', 'Néctar da Serra Apicultura e Polinização Ltda', '12345678000104', 'contato@nectardaserra.com.br', '(15)98765-0004'),
('emp00005', 'Colmeia Real', 'Colmeia Real Geleia Real e Derivados Apícolas Ltda', '12345678000105', 'contato@colmeiareal.com.br', '(14)98765-0005');


-- tabela usuario
create table usuario (
    idusuario int not null auto_increment primary key,
    nome varchar(45) not null,
    cpf char(14) unique,
    email varchar(100) not null unique,
    telefone char(14) unique,
    senha varchar(45) not null,
    fkcodempresa char(8) not null,
    fkresponsavel int,
	constraint fk_idempresa
		foreign key (fkcodempresa) references empresa(codempresa),
	constraint fkresponsavel_idusuario 
		foreign key (fkresponsavel) references usuario(idusuario)
);

-- dados usuario
insert into usuario (nome, cpf, email, telefone, senha, fkcodempresa, fkresponsavel) values
('João Silva', '529.841.763-20', 'joao.silva@meldovaledourado.com.br', '(14)98765-1001', 'joao123', 'emp00001', null),
('Beatriz Lima', '638.215.947-01', 'beatriz.lima@meldovaledourado.com.br', '(14)98765-1002', 'bia123', 'emp00001', 1),
('Maria Santos', '741.963.852-04', 'maria.santos@flordelaranjeira.com.br', '(41)98765-1003', 'maria123', 'emp00002', null),
('Rafael Costa', '852.741.963-05', 'rafael.costa@flordelaranjeira.com.br', '(41)98765-1004', 'rafa123', 'emp00002', 3),
('Carlos Oliveira', '963.852.741-06', 'carlos.oliveira@favomineiro.com.br', '(31)98765-1005', 'carlos123', 'emp00003', null),
('Juliana Rocha', '184.726.395-07', 'juliana.rocha@favomineiro.com.br', '(31)98765-1006', 'julia123', 'emp00003', 5),
('Ana Souza', '295.837.416-08', 'ana.souza@nectardaserra.com.br', '(15)98765-1007', 'ana123', 'emp00004', null),  
('Lucas Ferreira', '316.948.527-09', 'lucas.ferreira@nectardaserra.com.br', '(15)98765-1008', 'lucas123', 'emp00004', 7),
('Pedro Costa', '427.159.638-10', 'pedro.costa@colmeiareal.com.br', '(14)98765-1009', 'pedro123', 'emp00005', null),  
('Camila Alves', '538.261.749-11', 'camila.alves@colmeiareal.com.br', '(14)98765-1010', 'cami123', 'emp00005', 9);


-- tabela endereço 
create table endereco (
    idendereco int not null primary key auto_increment,
    cep char(9) not null,
    numero varchar(45),
    complemento varchar(45) not null,
    logradouro varchar(100) not null,
    bairro varchar(50) not null,
    cidade varchar(50) not null,
    estado varchar(45) not null,
    dt_criacao datetime default current_timestamp,
    dt_atualizacao datetime default current_timestamp,
    fkenderecoempresa char(8) not null,
    constraint fkendereco_idempresa
		foreign key (fkenderecoempresa) references empresa(codempresa)
);

-- dados endereço 
insert into endereco (cep, numero, complemento, logradouro, bairro, cidade, estado, fkenderecoempresa) values
('18600-000', 'km 12', 'Apiário Rio Bonito', 'Estrada Municipal José Antônio Pereira', 'Bairro Rio Bonito', 'Botucatu', 'SP', 'emp00001'),
('83750-000', 's/n', 'Apiário Água Limpa', 'Estrada Municipal João Kaminski', 'Bairro Água Limpa', 'Lapa', 'PR', 'emp00002'),
('25950-000', 'km 5', 'Apiário Cascata', 'Estrada do Bonfim', 'Bairro Cascata', 'Teresópolis', 'RJ', 'emp00002'), 
('35700-000', 'km 22', 'Apiário Serra Verde', 'Rodovia MG-424', 'Zona Rural', 'Sete Lagoas', 'MG', 'emp00003'),     
('18150-000', 's/n', 'Sítio Boa Vista', 'Estrada Municipal Antônio Marques', 'Bairro dos Pires', 'Ibiúna', 'SP', 'emp00004'),
('18800-000', 'km 3', 'Apiário Ribeirão Claro', 'Estrada Vicinal Manoel Ferreira', 'Bairro Ribeirão Claro', 'Piraju', 'SP', 'emp00005'); 


-- tabela colmeia
create table colmeia (
    idcolmeia int not null auto_increment primary key,
    codigo varchar(45) not null,
    localizacao varchar(45) not null,
    statuss tinyint default 1,
    fkendereco int not null,
    constraint fkcolmeia_idendereco
        foreign key (fkendereco) references endereco(idendereco),
    constraint chk_status check (statuss in (0,1)) -- 0 desativa
);

-- dados colmeia
insert into colmeia (codigo, localizacao, statuss, fkendereco) values
('Colmeia 01', 'Fileira A - posição 1', 1, 1),
('Colmeia 02', 'Fileira A - posição 2', 1, 1),
('Colmeia 03', 'Fileira A - posição 3', 1, 1),
('Colmeia 04', 'Fileira A - posição 4', 1, 1),
('Colmeia 05', 'Fileira A - posição 5', 1, 1),
('Colmeia 06', 'Fileira B - posição 1', 1, 1),
('Colmeia 07', 'Fileira B - posição 2', 1, 1),
('Colmeia 08', 'Fileira B - posição 3', 1, 1),
('Colmeia 09', 'Fileira B - posição 4', 1, 1),
('Colmeia 10', 'Fileira B - posição 5', 1, 1);


-- tabela sensor
create table sensor (
    idsensor int not null auto_increment primary key,
    nome varchar(45) not null,
    tiposensor varchar(45) not null,
    dtinstalacao datetime default current_timestamp,
    statussensor varchar(45) not null default 'ativo',
    fkcolmeia int unique,
    fkendereco_sexterno int unique,
    constraint chk_statussensor check (statussensor in  ('ativo', 'inativo')),
    constraint fksensor_idcolmeia
        foreign key (fkcolmeia) references colmeia(idcolmeia),
    constraint fksensorexterno_idendereco
        foreign key (fkendereco_sexterno) references endereco(idendereco),
    constraint chk_tiposensor check (
        (tiposensor = 'interno' and fkcolmeia is not null and fkendereco_sexterno is null)
        or
        (tiposensor = 'externo' and fkcolmeia is null and fkendereco_sexterno is not null))
);

-- dados sensor
insert into sensor (nome, tiposensor, dtinstalacao, fkcolmeia, fkendereco_sexterno, statussensor) values
('DHT11 - Colmeia 01', 'interno', '2026-06-01 08:00:00', 1, null, 'ativo'),
('DHT11 - Colmeia 02', 'interno', '2026-06-01 08:05:00', 2, null, 'ativo'),
('DHT11 - Colmeia 03', 'interno', '2026-06-01 08:10:00', 3, null, 'ativo'),
('DHT11 - Colmeia 04', 'interno', '2026-06-01 08:15:00', 4, null, 'ativo'),
('DHT11 - Colmeia 05', 'interno', '2026-06-01 08:20:00', 5, null, 'ativo'),
('DHT11 - Colmeia 06', 'interno', '2026-06-01 08:25:00', 6, null, 'ativo'),
('DHT11 - Colmeia 07', 'interno', '2026-06-01 08:30:00', 7, null, 'ativo'),
('DHT11 - Colmeia 08', 'interno', '2026-06-01 08:35:00', 8, null, 'ativo'),
('DHT11 - Colmeia 09', 'interno', '2026-06-01 08:40:00', 9, null, 'ativo'),
('DHT11 - Colmeia 10', 'interno', '2026-06-01 08:45:00', 10, null, 'ativo'),
('DHT11 - Externo', 'externo', '2026-06-01 08:50:00', null, 1, 'ativo');    
       
       
-- tabela coleta de dados (entidade fraca: só existe ligada a um sensor)
create table coleta_dados (
  idcoleta int not null auto_increment,
  temperatura decimal(10,2),
  umidade decimal(10,2),
  dt_hora datetime default current_timestamp,
  fksensor int not null,
  primary key (idcoleta, fksensor),
  constraint fksensor_idsensor 
	foreign key (fksensor) references sensor(idsensor)
	);


create table contato (
	idcontato int primary key auto_increment,
    solicitante varchar(100)not null,
    empresa varchar(255) not null,
    motivo varchar(50) not null,
    email varchar(120) not null,
    mensagem varchar(1048) not null,
    dtcontato datetime default current_timestamp,
    constraint checkemail check(email like '%@%')
    );
    
insert into contato (solicitante, empresa, motivo, email, mensagem) values
('Fernanda Costa', 'Apiário Bom Néctar', 'orçamento', 'fernanda@bomnectar.com.br', 'gostaria de um orçamento para monitorar 40 colmeias em dois apiários.'),
('Roberto Mendes', 'Mel Puro Sul', 'dúvidas', 'roberto@melpurosul.com.br', 'o sensor aguenta ficar dentro da colmeia com a umidade alta do inverno?'),
('Mariana Lima', 'Cooperativa Apícola Paraná', 'parceria', 'mariana@coopapicolapr.org.br', 'temos interesse em oferecer o sistema para os apicultores da cooperativa.'),
('Eduardo Ramos', 'Sítio Abelha Rainha', 'suporte técnico', 'eduardo@abelharainha.com.br', 'a colmeia 03 parou de enviar leituras desde ontem à noite.'),
('Patrícia Nunes', 'Própolis Verde Minas', 'financeiro', 'patricia@propolisverde.com.br', 'preciso da segunda via do boleto referente a este mês.');


-- drop database tetria;