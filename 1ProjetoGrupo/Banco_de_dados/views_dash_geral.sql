USE tetria;

CREATE OR REPLACE VIEW vw_kpi_apiario_monitorado AS
SELECT
    fkendereco,
    COUNT(idcolmeia) AS total_colmeias_monitoradas
FROM colmeia
WHERE statuss = 1
GROUP BY fkendereco;

SELECT * FROM vw_kpi_apiario_monitorado WHERE fkendereco = 1;


CREATE OR REPLACE VIEW vw_leituras_classificadas AS
SELECT
    c.fkendereco,
    c.idcolmeia,
    c.codigo,
    cd.idcoleta,
    cd.dt_hora,
    cd.temperatura,
    cd.umidade,
    CASE
        WHEN cd.temperatura < COALESCE(cfg.temp_alerta_frio, 32)
          OR cd.temperatura > COALESCE(cfg.temp_alerta_calor, 38)
          OR cd.umidade < COALESCE(cfg.umid_alerta_seco, 40)
          OR cd.umidade >= COALESCE(cfg.umid_alerta_excessiva, 85) THEN 'Risco'
        WHEN cd.temperatura < COALESCE(cfg.temp_min_ideal, 33)
          OR cd.temperatura > COALESCE(cfg.temp_max_ideal, 36)
          OR cd.umidade < COALESCE(cfg.umid_min_ideal, 50)
          OR cd.umidade > COALESCE(cfg.umid_max_ideal, 75) THEN 'Atencao'
        ELSE 'Ideal'
    END AS situacao
FROM colmeia c
JOIN sensor s ON s.fkcolmeia = c.idcolmeia
             AND s.tiposensor = 'interno'
             AND s.statussensor = 'ativo'
JOIN coleta_dados cd ON cd.fksensor = s.idsensor
LEFT JOIN configuracoes cfg ON cfg.fkenderecoconfiguracoes = c.fkendereco
WHERE c.statuss = 1;

SELECT * FROM vw_leituras_classificadas WHERE idcolmeia = 2 ORDER BY dt_hora DESC LIMIT 5;


CREATE OR REPLACE VIEW vw_alertas_colmeias AS
WITH marcadas AS (
    SELECT
        l.*,
        SUM(l.situacao = 'Ideal') OVER (
            PARTITION BY l.idcolmeia ORDER BY l.dt_hora, l.idcoleta
        ) AS bloco,
        MAX(l.dt_hora) OVER (PARTITION BY l.idcolmeia) AS ultima_leitura
    FROM vw_leituras_classificadas l
),
alertas AS (
    SELECT
        m.*,
        MIN(m.dt_hora) OVER (PARTITION BY m.idcolmeia, m.bloco) AS inicio,
        MAX(m.situacao = 'Risco') OVER (PARTITION BY m.idcolmeia, m.bloco) AS teve_risco,
        ROW_NUMBER() OVER (
            PARTITION BY m.idcolmeia, m.bloco ORDER BY m.dt_hora DESC, m.idcoleta DESC
        ) AS ordem
    FROM marcadas m
    WHERE m.situacao <> 'Ideal'
)
SELECT
    a.fkendereco,
    a.idcolmeia,
    a.codigo,
    IF(a.teve_risco = 1, 'Risco', 'Atencao') AS situacao,
    a.inicio,
    a.dt_hora AS fim,
    IF(a.dt_hora = a.ultima_leitura, 1, 0) AS em_andamento,
    TIMESTAMPDIFF(
        MINUTE,
        a.inicio,
        IF(a.dt_hora = a.ultima_leitura, NOW(), a.dt_hora)
    ) AS duracao_min,
    a.temperatura,
    a.umidade
FROM alertas a
WHERE a.ordem = 1;

SELECT * FROM vw_alertas_colmeias WHERE fkendereco = 1 ORDER BY inicio DESC;


CREATE OR REPLACE VIEW vw_ultima_leitura AS
SELECT
    leituras.fkendereco,
    MAX(leituras.dt_hora) AS ultima_leitura
FROM (
    SELECT c.fkendereco, cd.dt_hora
    FROM coleta_dados cd
    JOIN sensor s ON s.idsensor = cd.fksensor
    JOIN colmeia c ON c.idcolmeia = s.fkcolmeia
    UNION ALL
    SELECT s.fkendereco_sexterno AS fkendereco, cd.dt_hora
    FROM coleta_dados cd
    JOIN sensor s ON s.idsensor = cd.fksensor
    WHERE s.fkendereco_sexterno IS NOT NULL
) AS leituras
GROUP BY leituras.fkendereco;

SELECT * FROM vw_ultima_leitura WHERE fkendereco = 1;


CREATE OR REPLACE VIEW vw_colmeias_atuais AS
SELECT
    c.fkendereco,
    c.idcolmeia,
    c.codigo,
    l.dt_hora,
    l.temperatura AS temp_interna,
    l.umidade AS umid_interna,
    l.situacao,
    ext.temperatura AS temp_externa,
    ext.umidade AS umid_externa
FROM colmeia c
JOIN vw_leituras_classificadas l
     ON l.idcolmeia = c.idcolmeia
    AND l.idcoleta = (
        SELECT MAX(l2.idcoleta)
        FROM vw_leituras_classificadas l2
        WHERE l2.idcolmeia = c.idcolmeia
    )
LEFT JOIN sensor se ON se.fkendereco_sexterno = c.fkendereco
                   AND se.tiposensor = 'externo'
LEFT JOIN coleta_dados ext
     ON ext.fksensor = se.idsensor
    AND ext.idcoleta = (
        SELECT MAX(e2.idcoleta)
        FROM coleta_dados e2
        WHERE e2.fksensor = se.idsensor
    )
WHERE c.statuss = 1;

SELECT * FROM vw_colmeias_atuais WHERE fkendereco = 1 ORDER BY idcolmeia;
