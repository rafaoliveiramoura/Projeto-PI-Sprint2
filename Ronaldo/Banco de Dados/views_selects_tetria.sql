USE tetria;


-- View base: última leitura e situação de cada colmeia (usando os limites da tabela configuracoes)
CREATE OR REPLACE VIEW vw_situacao_colmeias AS
SELECT
    c.fkendereco,
    c.idcolmeia,
    c.codigo,
    cd.temperatura,
    cd.umidade,
    cd.dt_hora,
    CASE
        WHEN cd.temperatura < cfg.temp_alerta_frio
          OR cd.temperatura > cfg.temp_alerta_calor
          OR cd.umidade < cfg.umid_alerta_seco
          OR cd.umidade > cfg.umid_alerta_excessiva THEN 'Risco'
        WHEN cd.temperatura < cfg.temp_min_ideal
          OR cd.temperatura > cfg.temp_max_ideal
          OR cd.umidade < cfg.umid_min_ideal
          OR cd.umidade > cfg.umid_max_ideal THEN 'Atencao'
        ELSE 'Ideal'
    END AS situacao
FROM colmeia c
JOIN sensor s ON s.fkcolmeia = c.idcolmeia
JOIN coleta_dados cd ON cd.fksensor = s.idsensor
JOIN configuracoes cfg ON cfg.fkenderecoconfiguracoes = c.fkendereco
WHERE c.statuss = 1
  AND s.tiposensor = 'interno'
  AND s.statussensor = 'ativo'
  AND cd.idcoleta = (
      SELECT MAX(cd2.idcoleta)
      FROM coleta_dados cd2
      WHERE cd2.fksensor = s.idsensor
  );

-- KPI 1: Em risco
CREATE OR REPLACE VIEW vw_kpi_em_risco AS
SELECT
    fkendereco,
    COUNT(idcolmeia) AS qtd_em_risco
FROM vw_situacao_colmeias
WHERE situacao = 'Risco'
GROUP BY fkendereco;

SELECT * FROM vw_kpi_em_risco WHERE fkendereco = 1; -- tem que colocar no model qual é o endereço

-- Lista das colmeias em risco (detalhe do card)
SELECT codigo, temperatura, umidade, dt_hora
FROM vw_situacao_colmeias
WHERE fkendereco = 1 AND situacao = 'Risco';

-- KPI 2: Em atenção
CREATE OR REPLACE VIEW vw_kpi_em_atencao AS
SELECT
    fkendereco,
    COUNT(idcolmeia) AS qtd_em_atencao
FROM vw_situacao_colmeias
WHERE situacao = 'Atencao'
GROUP BY fkendereco;

SELECT * FROM vw_kpi_em_atencao WHERE fkendereco = 1;

-- Lista das colmeias em atenção (detalhe do card)
SELECT codigo, temperatura, umidade, dt_hora
FROM vw_situacao_colmeias
WHERE fkendereco = 1 AND situacao = 'Atencao';

-- KPI 3: Apiário monitorado (total de colmeias ativas)
CREATE OR REPLACE VIEW vw_kpi_apiario_monitorado AS
SELECT
    fkendereco,
    COUNT(idcolmeia) AS total_colmeias_monitoradas
FROM colmeia
WHERE statuss = 1
GROUP BY fkendereco;

SELECT * FROM vw_kpi_apiario_monitorado WHERE fkendereco = 1;

-- KPI 4 (Card Coleta de mel): utiliza a view vw_kpi_ultima_coleta que esta criada laaaa pra baixo


-- 2. DASHBOARD DA COLMEIA INDIVIDUAL


-- KPI 1: Temperatura interna (+ externa e faixa ideal)
CREATE OR REPLACE VIEW vw_kpi_temperatura_colmeia AS
SELECT
    c.idcolmeia,
    c.codigo,
    cd_int.temperatura AS temp_interna,
    cd_ext.temperatura AS temp_externa,
    cfg.temp_min_ideal,
    cfg.temp_max_ideal,
    cd_int.dt_hora
FROM colmeia c
JOIN configuracoes cfg ON cfg.fkenderecoconfiguracoes = c.fkendereco
JOIN sensor s_int ON s_int.fkcolmeia = c.idcolmeia AND s_int.tiposensor = 'interno'
JOIN coleta_dados cd_int ON cd_int.fksensor = s_int.idsensor
LEFT JOIN sensor s_ext ON s_ext.fkendereco_sexterno = c.fkendereco AND s_ext.tiposensor = 'externo'
LEFT JOIN coleta_dados cd_ext ON cd_ext.fksensor = s_ext.idsensor
    AND cd_ext.idcoleta = (
        SELECT MAX(cd2.idcoleta)
        FROM coleta_dados cd2
        WHERE cd2.fksensor = s_ext.idsensor
    )
WHERE cd_int.idcoleta = (
    SELECT MAX(cd1.idcoleta)
    FROM coleta_dados cd1
    WHERE cd1.fksensor = s_int.idsensor
);

SELECT * FROM vw_kpi_temperatura_colmeia WHERE idcolmeia = 1;

-- KPI 2: Umidade interna (+ externa e faixa ideal)
CREATE OR REPLACE VIEW vw_kpi_umidade_colmeia AS
SELECT
    c.idcolmeia,
    c.codigo,
    cd_int.umidade AS umid_interna,
    cd_ext.umidade AS umid_externa,
    cfg.umid_min_ideal,
    cfg.umid_max_ideal,
    cd_int.dt_hora
FROM colmeia c
JOIN configuracoes cfg ON cfg.fkenderecoconfiguracoes = c.fkendereco
JOIN sensor s_int ON s_int.fkcolmeia = c.idcolmeia AND s_int.tiposensor = 'interno'
JOIN coleta_dados cd_int ON cd_int.fksensor = s_int.idsensor
LEFT JOIN sensor s_ext ON s_ext.fkendereco_sexterno = c.fkendereco AND s_ext.tiposensor = 'externo'
LEFT JOIN coleta_dados cd_ext ON cd_ext.fksensor = s_ext.idsensor
    AND cd_ext.idcoleta = (
        SELECT MAX(cd2.idcoleta)
        FROM coleta_dados cd2
        WHERE cd2.fksensor = s_ext.idsensor
    )
WHERE cd_int.idcoleta = (
    SELECT MAX(cd1.idcoleta)
    FROM coleta_dados cd1
    WHERE cd1.fksensor = s_int.idsensor
);

SELECT * FROM vw_kpi_umidade_colmeia WHERE idcolmeia = 1;

-- KPI 3: Picos de temperatura (máxima, mínima e horários do dia)
CREATE OR REPLACE VIEW vw_kpi_picos_temperatura AS
SELECT
    c.idcolmeia,
    c.codigo,
    DATE(cd.dt_hora) AS dia,
    MAX(cd.temperatura) AS temp_maxima,
    (
        SELECT TIME_FORMAT(cd2.dt_hora, '%H:%i')
        FROM coleta_dados cd2
        WHERE cd2.fksensor = s.idsensor
          AND DATE(cd2.dt_hora) = DATE(cd.dt_hora)
        ORDER BY cd2.temperatura DESC, cd2.dt_hora DESC
        LIMIT 1
    ) AS hora_maxima,
    MIN(cd.temperatura) AS temp_minima,
    (
        SELECT TIME_FORMAT(cd3.dt_hora, '%H:%i')
        FROM coleta_dados cd3
        WHERE cd3.fksensor = s.idsensor
          AND DATE(cd3.dt_hora) = DATE(cd.dt_hora)
        ORDER BY cd3.temperatura ASC, cd3.dt_hora DESC
        LIMIT 1
    ) AS hora_minima
FROM colmeia c
JOIN sensor s ON s.fkcolmeia = c.idcolmeia AND s.tiposensor = 'interno'
JOIN coleta_dados cd ON cd.fksensor = s.idsensor
GROUP BY c.idcolmeia, c.codigo, s.idsensor, DATE(cd.dt_hora);

SELECT * FROM vw_kpi_picos_temperatura
WHERE idcolmeia = 1 AND dia = CURDATE();

-- KPI 4: Picos de umidade (máxima, mínima e horários do dia)
CREATE OR REPLACE VIEW vw_kpi_picos_umidade AS
SELECT
    c.idcolmeia,
    c.codigo,
    DATE(cd.dt_hora) AS dia,
    MAX(cd.umidade) AS umid_maxima,
    (
        SELECT TIME_FORMAT(cd2.dt_hora, '%H:%i')
        FROM coleta_dados cd2
        WHERE cd2.fksensor = s.idsensor
          AND DATE(cd2.dt_hora) = DATE(cd.dt_hora)
        ORDER BY cd2.umidade DESC, cd2.dt_hora DESC
        LIMIT 1
    ) AS hora_maxima,
    MIN(cd.umidade) AS umid_minima,
    (
        SELECT TIME_FORMAT(cd3.dt_hora, '%H:%i')
        FROM coleta_dados cd3
        WHERE cd3.fksensor = s.idsensor
          AND DATE(cd3.dt_hora) = DATE(cd.dt_hora)
        ORDER BY cd3.umidade ASC, cd3.dt_hora DESC
        LIMIT 1
    ) AS hora_minima
FROM colmeia c
JOIN sensor s ON s.fkcolmeia = c.idcolmeia AND s.tiposensor = 'interno'
JOIN coleta_dados cd ON cd.fksensor = s.idsensor
GROUP BY c.idcolmeia, c.codigo, s.idsensor, DATE(cd.dt_hora);

SELECT * FROM vw_kpi_picos_umidade
WHERE idcolmeia = 1 AND dia = CURDATE();



-- 3. HISTÓRICO DE COLETAS DE MEL

-- KPI 1: Última coleta (quantidade coletada e data)
CREATE OR REPLACE VIEW vw_kpi_ultima_coleta AS
SELECT
    c.fkcoletaendereco,
    c.qtd_colhida AS ultima_qtd_kg,
    c.data_registro AS data_ultima_coleta
FROM coleta c
WHERE c.idcoleta = (
    SELECT c2.idcoleta
    FROM coleta c2
    WHERE c2.fkcoletaendereco = c.fkcoletaendereco
    ORDER BY c2.data_registro DESC, c2.idcoleta DESC
    LIMIT 1
);

SELECT * FROM vw_kpi_ultima_coleta WHERE fkcoletaendereco = 1;

-- KPI 2: Crescimento de produção (% e diferença em kg comparado à coleta anterior)
CREATE OR REPLACE VIEW vw_kpi_crescimento_producao AS
SELECT
    fkcoletaendereco,
    qtd_atual,
    qtd_anterior,
    ROUND(qtd_atual - qtd_anterior, 2) AS diferenca_kg,
    CASE
        WHEN qtd_anterior IS NULL OR qtd_anterior = 0 THEN 0.00
        ELSE ROUND(((qtd_atual - qtd_anterior) / qtd_anterior) * 100, 2)
    END AS percentual_crescimento
FROM (
    SELECT
        fkcoletaendereco,
        qtd_colhida AS qtd_atual,
        LAG(qtd_colhida) OVER (PARTITION BY fkcoletaendereco ORDER BY data_registro, idcoleta) AS qtd_anterior,
        ROW_NUMBER() OVER (PARTITION BY fkcoletaendereco ORDER BY data_registro DESC, idcoleta DESC) AS ordem
    FROM coleta
) AS historico
WHERE ordem = 1;

SELECT * FROM vw_kpi_crescimento_producao WHERE fkcoletaendereco = 1;

-- KPI 3: Total da safra (soma de todas as coletas do ano)
CREATE OR REPLACE VIEW vw_kpi_total_safra AS
SELECT
    fkcoletaendereco,
    YEAR(data_registro) AS ano_safra,
    SUM(qtd_colhida) AS total_safra_kg,
    COUNT(idcoleta) AS qtd_coletas
FROM coleta
GROUP BY fkcoletaendereco, YEAR(data_registro);

SELECT * FROM vw_kpi_total_safra
WHERE fkcoletaendereco = 1 AND ano_safra = YEAR(CURDATE());

-- KPI 4: Média por coleta (total coletado dividido pela quantidade de coletas)
CREATE OR REPLACE VIEW vw_kpi_media_coleta AS
SELECT
    fkcoletaendereco,
    YEAR(data_registro) AS ano_safra,
    COUNT(idcoleta) AS qtd_coletas,
    ROUND(SUM(qtd_colhida) / COUNT(idcoleta), 2) AS media_por_coleta_kg
FROM coleta
GROUP BY fkcoletaendereco, YEAR(data_registro);

SELECT * FROM vw_kpi_media_coleta
WHERE fkcoletaendereco = 1 AND ano_safra = YEAR(CURDATE());

