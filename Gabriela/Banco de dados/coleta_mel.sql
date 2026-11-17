-- =============================================================
-- Tabela de coletas (extrações) de mel - Dashboard Tetria
-- Rodar DEPOIS do script principal (script_tetria.sql), pois
-- depende da tabela "endereco" (cada endereço é um apiário).
-- =============================================================

use tetria;

create table coleta_mel (
    idcoleta_mel int not null auto_increment primary key,
    dt_coleta date not null,
    quantidade_kg decimal(7,2) not null,
    dt_registro datetime default current_timestamp,
    fkendereco int not null,
    constraint fkcoletamel_idendereco
        foreign key (fkendereco) references endereco(idendereco),
    constraint chk_quantidade_kg check (quantidade_kg > 0)
);

-- dados iniciais: safra 2026 do Apiário Rio Bonito (endereço 1)
insert into coleta_mel (dt_coleta, quantidade_kg, fkendereco) values
('2026-06-15',  95.0, 1),
('2026-07-10', 110.0, 1),
('2026-08-05', 102.5, 1),
('2026-08-28', 125.0, 1),
('2026-09-20', 118.0, 1),
('2026-10-22', 122.5, 1),
('2026-11-14', 145.0, 1);

-- conferência
select * from coleta_mel order by dt_coleta;

-- drop table coleta_mel;
