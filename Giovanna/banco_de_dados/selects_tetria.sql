use tetria;

select * from empresa;
select * from endereco;
select * from usuario;
select * from colmeia;
select * from sensor;
select * from coleta_dados;


-- select dashboard 

-- select ação e informações das colmeias - sem filtro

select c.codigo, c.localizacao, cole.temperatura, cole.umidade,
	case 
		when cole.temperatura < 32 or cole.temperatura > 38 or cole.umidade >= 85 then 'risco'
		when cole.temperatura >= 33 and cole.temperatura <= 36 and cole.umidade >= 50 and cole.umidade <= 75
		then 'Ideal'
    else 'Atenção'
    end situacao
from colmeia c join sensor s
	on idColmeia  = fkColmeia 
join coleta_dados cole	
	on idColmeia = fkSensor
where tiposensor = 'Interno' and statussensor = 'Ativo';


-- select quantidade de colmeias em cada estado (ideal, atenção e risco) 

select count(*) as quantidade,
	case 
    when cole.temperatura < 32 or cole.temperatura > 38 then 'Risco'
        when cole.temperatura < 33 or cole.temperatura > 36
          or cole.umidade < 50 or cole.umidade > 75 then 'Atenção'
        else 'Ideal'
        end as situacao
	from colmeia c join sensor s
		on idcolmeia = fkcolmeia
	join coleta_dados cole 
		on idsensor = fksensor 
where tiposensor = 'Interno' and statussensor = 'Ativo'
group by situacao;


-- select colmeias em risco
select
concat('colmeia: ', c.codigo, ' - localizada: ', localizacao, '  - temperatura: ' ,col.temperatura, '  umidade ', col.umidade, '%  ' ,  s.tiposensor) status_colmeias
from colmeia c join sensor s
on c.idcolmeia = s.fkcolmeia
join coleta_dados col
on s.idsensor = col.fksensor
	where s.tiposensor = 'interno' and s.statussensor = 'ativo'
  and (col.temperatura < 32 or col.temperatura > 38 or col.umidade >= 85);
  
    
-- select sensores ativos e inativos
select statussensor, count(*) as qtd_sensor
from sensor
group by statussensor; 

select count(*) from coleta_dados;


-- 1 situação de cada colmeia
select col.codigo, c.temperatura, c.umidade,
    case
        when c.temperatura < 32 or c.temperatura > 38 then 'Risco'
        when c.temperatura < 33 or c.temperatura > 36
          or c.umidade < 50 or c.umidade > 75 then 'Atenção'
        else 'Ideal'
    end as situacao
from coleta_dados c
join sensor s on c.fksensor = s.idsensor
join colmeia col on s.fkcolmeia = col.idcolmeia
order by col.idcolmeia;


-- 2 cards: quantidade por situação -> Risco 3 | Atenção 2 | Ideal 5
select
    case
        when c.temperatura < 32 or c.temperatura > 38 then 'Risco'
        when c.temperatura < 33 or c.temperatura > 36
          or c.umidade < 50 or c.umidade > 75 then 'Atenção'
        else 'Ideal'
    end as situacao,
    count(*) as quantidade
from coleta_dados c
join sensor s on c.fksensor = s.idsensor
join colmeia col on s.fkcolmeia = col.idcolmeia
group by situacao;


-- 3 tabela de alertas (risco primeiro) -> 02, 04, 08 | 03, 06
select col.codigo, c.temperatura, c.umidade,
    case
        when c.temperatura < 32 or c.temperatura > 38 then 'Risco'
        else 'Atenção'
    end as situacao
from coleta_dados c
join sensor s on c.fksensor = s.idsensor
join colmeia col on s.fkcolmeia = col.idcolmeia
where not (c.temperatura between 33 and 36 and c.umidade between 50 and 75)
order by situacao desc, col.idcolmeia;


-- 4 gráfico de barras -> Muito quente 2 | Quente 1 | Ideal 6 | Muito fria 1
select
    case
        when c.temperatura > 38 then 'Muito quente'
        when c.temperatura > 36 then 'Quente'
        when c.temperatura >= 33 then 'Ideal'
        when c.temperatura >= 32 then 'Fria'
        else 'Muito fria'
    end as faixa,
    count(*) as quantidade
from coleta_dados c
join sensor s on c.fksensor = s.idsensor
join colmeia col on s.fkcolmeia = col.idcolmeia
group by faixa;


-- 5 gráfico de rosca -> Úmida 1 | Ideal 9
select
    case
        when c.umidade > 75 then 'Úmida'
        when c.umidade >= 50 then 'Ideal'
        else 'Seca'
    end as faixa,
    count(*) as quantidade
from coleta_dados c
join sensor s on c.fksensor = s.idsensor
join colmeia col on s.fkcolmeia = col.idcolmeia
group by faixa;


-- 6 página colmeias: interno x externo
select col.codigo,
    c.temperatura    as temp_interna,
    cext.temperatura as temp_externa,
    c.umidade        as umid_interna,
    cext.umidade     as umid_externa
from coleta_dados c
join sensor s on c.fksensor = s.idsensor
join colmeia col on s.fkcolmeia = col.idcolmeia
join sensor sext on sext.fkendereco_sexterno = col.fkendereco
join coleta_dados cext on cext.fksensor = sext.idsensor
order by col.idcolmeia;


-- 7 colmeia individual (ex.: Colmeia 02) com o externo -> 38.9 °C | 71% | 30.3 °C | 70%
select col.codigo, c.temperatura, c.umidade,
    cext.temperatura as temp_externa, cext.umidade as umid_externa
from coleta_dados c
join sensor s on c.fksensor = s.idsensor
join colmeia col on s.fkcolmeia = col.idcolmeia
join sensor sext on sext.fkendereco_sexterno = col.fkendereco
join coleta_dados cext on cext.fksensor = sext.idsensor
where col.idcolmeia = 2;

-- select fora da dash

-- 1. exiba o nome de cada usuário e o nome da fazenda à qual pertence.
select usuario.nome as usuario,
	empresa.nome_fantasia as fazenda
from usuario
join empresa
    on usuario.fkcodempresa = empresa.codempresa;

-- 2. exiba todas as fazendas e seus endereços,
-- incluindo as fazendas sem endereço.
select empresa.nome_fantasia as empresa,
	endereco.logradouro,
	endereco.cidade,
	endereco.estado
from empresa left join endereco
    on empresa.codempresa = endereco.fkenderecoempresa;


-- 3. exiba o código e a localização de cada colmeia em uma única coluna.
select concat(codigo, ' - ', localizacao) as localizacao_colmeia
from colmeia;

-- 4. exiba o código de cada colmeia e sua situação: ativa ou inativa.
select codigo, localizacao,
	case
		when statuss = 1 then 'ativa'
		else 'inativa'
	end as situacao
from colmeia;

-- 5. conte quantas colmeias cada fazenda possui,
select e.nome_fantasia as fazenda,
	count(c.idcolmeia) as quantidade_colmeias
from empresa as e
left join endereco as en
    on e.codempresa = en.fkenderecoempresa
left join colmeia as c
    on en.idendereco = c.fkendereco
group by e.codempresa, e.nome_fantasia;


-- select contato 
select solicitante, empresa, email, motivo, date_format(dtcontato, '%d/%m/%y %h:%i') as dataa, mensagem
from contato;

