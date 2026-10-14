<h1 align="center">🐝 TETRIA</h1>
<h3 align="center">Monitorando colmeias</h3>

<p align="center">
  <b>Colmeia Conectada:</b> um sistema de alerta por temperatura e umidade para a criação de abelhas <i>Apis mellifera</i>
</p>

<p align="center">
  <img alt="Status" src="https://img.shields.io/badge/status-em%20desenvolvimento-FFC800?style=for-the-badge&labelColor=1F1A14">
  <img alt="Versão" src="https://img.shields.io/badge/vers%C3%A3o-01-FFC800?style=for-the-badge&labelColor=1F1A14">
  <img alt="SPTech School" src="https://img.shields.io/badge/SPTech-School-FFC800?style=for-the-badge&labelColor=1F1A14">
  <img alt="Curso" src="https://img.shields.io/badge/curso-ADS-FFC800?style=for-the-badge&labelColor=1F1A14">
  <img alt="Espécie" src="https://img.shields.io/badge/esp%C3%A9cie-Apis%20mellifera-FFC800?style=for-the-badge&labelColor=1F1A14">
</p>

---

## 📑 Sumário

- [Sobre o projeto](#-sobre-o-projeto)
- [Contexto](#-contexto)
- [Objetivos](#-objetivos)
- [Justificativa](#-justificativa)
- [Escopo](#-escopo)
- [Como o sistema funciona](#-como-o-sistema-funciona)
- [Tecnologias](#-tecnologias)
- [Metodologia Scrum](#-metodologia-scrum)
- [Equipe](#-equipe)
- [Referências](#-referências)

---

## 🍯 Sobre o projeto

O **Tetria** é um sistema de monitoramento remoto de variáveis ambientais para colônias de ***Apis mellifera***. Sensores **DHT11** medem **temperatura** e **umidade** no interior da colmeia e, em um segundo ponto, na área externa, e os dados aparecem em um **dashboard** para o apicultor acompanhar o estado das colônias e perceber variações que representem risco.

O projeto nasce de um problema concreto: a instabilidade climática torna o ambiente menos previsível, e a colônia precisa manter a área de cria numa faixa térmica estreita para se desenvolver bem.

O sistema **monitora e informa**: não controla a colmeia nem diagnostica a saúde das abelhas. A interpretação dos dados e as decisões de manejo continuam com o apicultor.

> Projeto acadêmico desenvolvido no curso de **Análise e Desenvolvimento de Sistemas** da **SPTech School** (Turma 1 ADS A, 2026), na disciplina de Tecnologia da Informação, sob orientação do Prof. Cláudio Frizzarini.

---

## 🌎 Contexto

### O mercado de mel e a apicultura no Brasil

- A apicultura combina geração de renda, produção de alimentos e serviço ambiental de polinização. A produção comercial se baseia na abelha-europeia *Apis mellifera* L., criada em sua forma africanizada.
- Em 2023, o Brasil foi o **7º maior produtor de mel** do mundo, com **64.189 t** (cerca de 3% da produção mundial), atrás de China, Turquia e Irã ([EMDAGRO, 2025](https://emdagro.se.gov.br/wp-content/uploads/2026/04/APICULTURA.pdf); [Rosendo, 2026](https://www.canalrural.com.br/agricultura/brasil-produz-67-mil-toneladas-de-mel-exporta-56-e-tem-eua-como-principal-destino/)).
- Em 2024, o IBGE registrou **67,3 mil toneladas** (alta de 4,9%, o maior volume da série histórica) e valor de produção de **R$ 1,01 bilhão** (alta de 11,4%). Paraná, Piauí e Rio Grande do Sul lideram ([IBGE, 2025a](https://agenciadenoticias.ibge.gov.br/media/com_mediaibge/arquivos/b9bced330ec7ddf7a65eb47965090988.pdf); [IBGE, 2025b](https://anda.ibge.gov.br/en/agencia-news/2184-news-agency/news/44539-valor-da-producao-da-pecuaria-e-da-aquicultura-chega-a-r-132-8-bilhoes-em-2024-com-recorde-nas-producoes-de-leite-ovos-de-galinha-e-mel-2)).
- A atividade é **pulverizada**: mais de **100 mil estabelecimentos** e cerca de **2,16 milhões de colmeias**, o que dá média inferior a **22 colmeias por estabelecimento** ([Rosendo, 2026](https://www.canalrural.com.br/agricultura/brasil-produz-67-mil-toneladas-de-mel-exporta-56-e-tem-eua-como-principal-destino/)).
- Cerca de **56% da produção é exportada**. Em 2025, foram **34.468 t** e **US$ 116,5 milhões**, com os Estados Unidos concentrando **84,2%** do volume ([Agrolink, 2026](https://www.agrolink.com.br/noticias/exportacoes-de-mel-caem-em-volume-e-sobem-em-receita_510603.html)).
- Além do mel, a colmeia fornece própolis, cera, geleia real, pólen e apitoxina ([Sebrae Goiás, 2024](https://polosebraeagro.sebrae.com.br/wp-content/uploads/2024/05/subprodutos-do-mel-boletim-de-tendencias-sebrae-goias.pdf)). A polinização por todos os polinizadores contribui com cerca de **R$ 43 bilhões** (ano-base 2018) para a agricultura ([Money Times, 2019](https://www.moneytimes.com.br/estudo-estima-em-r-43-bi-a-contribuicao-economica-dos-polinizadores/)).

A **apicultura de precisão** usa sensores e sistemas de apoio à decisão para monitorar colônias individuais ([Zacepins et al., 2015](https://doi.org/10.1016/j.biosystemseng.2014.12.001)). As variáveis acompanhadas incluem peso, temperatura, umidade, som, gases e atividade de voo ([Danieli et al., 2024](https://dx.doi.org/10.3390/ani14010070)).

### A abelha *Apis mellifera*

- É uma abelha social da família Apidae, que vive em colônias perenes formadas por uma rainha, operárias e zangões.
- É conhecida como **abelha-europeia** (ou abelha-do-mel), porque as raças trazidas ao Brasil para a criação eram europeias. A espécie ocorre naturalmente na Europa, na África e no Oriente Médio, e tem cerca de **31 subespécies**, agrupadas em quatro linhagens: africana (A), europeia do noroeste (M), europeia do sudeste (C) e do Oriente Médio (O) ([Wikipedia, *Western honey bee*](https://en.wikipedia.org/wiki/Western_honey_bee)).
- Entre as subespécies europeias estão a **italiana** (*A. m. ligustica*), a **carniola** (*A. m. carnica*) e a **ibérica** (*A. m. iberiensis*, da Península Ibérica).
- No Brasil, a introdução da africana *A. m. scutellata* em 1956, pelo biólogo Warwick Kerr, e a fuga de 26 enxames em 1957 (Rio Claro, SP) levaram ao cruzamento com colônias europeias, entre elas a italiana e a ibérica. O resultado é a abelha **africanizada**, que predomina no país, conhecida pela rusticidade, pela alta produtividade e pela defensividade ([Wikipedia, *Africanized bee*](https://en.wikipedia.org/wiki/Africanized_bee)).
- Uma colônia forte no verão pode ter de **40 mil a 80 mil abelhas**: uma rainha fértil (que põe todos os ovos), muitas operárias e poucos zangões. A rainha vive em média de 3 a 5 anos, e as operárias de verão, poucas semanas ([Wikipedia, *Western honey bee*](https://en.wikipedia.org/wiki/Western_honey_bee)).
- A criação racional usa caixas de favos móveis, como o modelo **Langstroth**.
- A produtividade é de dezenas de quilos por colmeia (estimativa dos autores: cerca de **31 kg por ano** e **R$ 470 por colmeia**, como ordem de grandeza), então o retorno depende mais do volume e da manutenção do plantel. Perder colônias pesa muito.

### O clima e a criação de abelhas

- A área de cria é mantida entre **34 e 35 °C** ([Oliveira, s.d.](https://www.cpt.com.br/cursos-criacaodeabelhas/artigos/abelhas-termorregulacao-da-colmeia)), e [Yoder et al. (2017)](https://link.springer.com/article/10.1007/s13592-016-0461-7) citam cerca de **35 °C** o ano todo. [Lopes et al. (2011)](https://www.redalyc.org/pdf/2530/253020125008.pdf), com base em Winston (2003), indicam **30 a 35 °C** como faixa ótima, e acima de **36 °C** por muito tempo a metamorfose da cria pode ser afetada severamente. Segundo essa mesma fonte, excessos de apenas 1–2 °C já podem causar anomalias de desenvolvimento.
- A colônia regula a temperatura com mecanismos ativos: no calor, ventila com as asas, espalha gotas de água e se aglomera fora da caixa; no frio, forma cachos e gera calor por vibração muscular.
- Esses mecanismos têm limite: em colmeias expostas ao sol, foram registradas temperaturas internas **acima de 39 °C** ([Lopes et al., 2011](https://www.redalyc.org/pdf/2530/253020125008.pdf)).
- Os valores de referência de umidade variam na literatura porque medem pontos diferentes: cerca de **40%** para a colmeia como um todo ([Oliveira, s.d.](https://www.cpt.com.br/cursos-criacaodeabelhas/artigos/abelhas-termorregulacao-da-colmeia)) e **60 a 70%** para o interior do ninho ([Yoder et al., 2017](https://link.springer.com/article/10.1007/s13592-016-0461-7)). Entre os favos de cria a umidade pode cair para 40–60% e chegar a 75–80% dentro de uma célula operculada. Por isso, os limites de alerta serão definidos com o responsável pelo apiário.
- Umidade elevada está associada à **cria giz** (*chalkbrood*), causada pelo fungo *Ascosphaera apis* ([Castagnino et al., 2020](http://old.scielo.br/scielo.php?pid=S1519-99402020000100803&script=sci_arttext&tlng=en)), que prospera na periferia do ninho (25 a 30 °C). O fungo cresce a partir de atividade de água de 0,90 e precisa de pelo menos **0,95** para produzir esporos ([Yoder et al., 2017](https://link.springer.com/article/10.1007/s13592-016-0461-7)).

### Instabilidade climática

- A Embrapa projeta aumento de temperatura de até **6 °C até 2100** se as emissões permanecerem altas, e destaca que eventos extremos desafiam a sobrevivência das colmeias ([Canal Rural, 2025](https://www.canalrural.com.br/sustentabilidade/aumento-de-6c-nos-termometros-ate-2100-pode-eliminar-colmeias-e-alimentos-mostra-embrapa/)).
- Nas enchentes de 2024 no Rio Grande do Sul, a Emater/RS-Ascar contabilizou **16 mil colmeias perdidas** até 24 de maio, e a Câmara Setorial da Apicultura projetou perdas de **35 mil a 60 mil** (incluindo abelhas sem ferrão) ([Brasil de Fato, 2024](https://www.brasildefato.com.br/2024/06/17/apicultores-estimam-perda-de-ate-60-mil-colmeias-nas-enchentes-do-rs/)).

O acompanhamento contínuo registra variações que verificações pontuais não percebem e cria um histórico para o responsável.

---

## 🎯 Objetivos

### Objetivo geral

Desenvolver um sistema de monitoramento remoto para colônias de *Apis mellifera*, capaz de coletar e transmitir, em tempo real, dados de **temperatura** e **umidade** das colmeias e disponibilizá-los por meio de uma interface de visualização (**dashboard**), permitindo o acompanhamento contínuo das condições ambientais e de suas variações ao longo do tempo.

### Objetivos específicos

- [ ] Implementar um sistema de sensoriamento eletrônico para captura contínua de temperatura e umidade nas proximidades e no interior da colmeia, conforme a configuração definida para o protótipo.
- [ ] Processar e transmitir os dados coletados, armazenando-os de forma estruturada em um banco de dados.
- [ ] Manter um histórico organizado das medições, permitindo consultar e analisar a variação dos parâmetros ao longo do tempo.
- [ ] Desenvolver um dashboard com gráficos e indicadores de temperatura e umidade, de leitura clara.
- [ ] Identificar alterações relevantes nos valores monitorados que indiquem condições diferentes das esperadas, auxiliando o responsável na observação da colônia.

---

## 💡 Justificativa

- **Muitos produtores de pequeno porte.** Com média inferior a 22 colmeias por estabelecimento, perder colônias tem impacto financeiro proporcionalmente grande.
- **Valor da colmeia.** O valor bruto médio estimado é de cerca de R$ 470 por colmeia ao ano (cálculo dos autores a partir de IBGE e Rosendo). Perder uma colônia significa perder a safra, o plantel e o custo e o tempo de recompor a colmeia.
- **Riscos de temperatura e umidade.** Calor excessivo aumenta a demanda por ventilação e coleta de água, e umidade alta com temperaturas amenas na periferia do ninho favorece a cria giz. O problema está nos padrões ao longo do tempo, não só em um valor isolado.
- **Limites do acompanhamento tradicional.** Inspeções presenciais mostram só o momento da visita, apiários afastados são visitados ainda menos, e abrir a colmeia com frequência estressa a colônia.
- **Lacuna de mercado.** Sistemas comerciais existem, mas o custo elevado e a falta de experiência dos operadores limitam a adoção ([Danieli et al., 2024](https://dx.doi.org/10.3390/ani14010070)). Há espaço para uma solução simples e de baixo custo.
- **Público-alvo.** Pequenos e médios apicultores de *Apis mellifera*, com dezenas ou centenas de colmeias, que precisam acompanhar suas colônias de forma mais sistemática.

---

## 📐 Escopo

O projeto é um protótipo de monitoramento remoto de temperatura e umidade em colônias de Apis mellifera. Dois sensores DHT11, um dentro da colmeia e outro na área externa, enviam as leituras a um microcontrolador, que as grava em um banco de dados e as exibe em um dashboard com gráficos e histórico. O sistema só monitora e informa: não controla a colmeia, não faz diagnóstico automático e não substitui o manejo do apicultor. Peso, gases, ruído e atividade de voo ficam fora desta versão.

### Resultado esperado

Um **protótipo funcional** que leia temperatura e umidade de uma colônia de *Apis mellifera* com o DHT11, processe os dados, os armazene em um histórico e os apresente em um dashboard para acompanhamento remoto, demonstrando a viabilidade do uso de sensores, microcontroladores, comunicação de dados e programação nesse monitoramento.

---

## ⚙️ Como o sistema funciona

1. **Sensoriamento:** um DHT11 dentro da colmeia e outro na área externa medem temperatura e umidade continuamente. O sensor externo tende a indicar a variação antes.
2. **Processamento:** um microcontrolador lê os sensores, processa os dados e os envia ao sistema de monitoramento.
3. **Armazenamento:** as leituras são guardadas de forma estruturada, o que permite consultar o histórico.
4. **Visualização:** o dashboard mostra os dados em gráficos e indicadores de leitura simples.
5. **Alerta:** variações relevantes são identificadas para avisar o apicultor. Os limites serão definidos com o cliente.

---

## 🛠️ Tecnologias

| Camada | Tecnologia |
| --- | --- |
| Sensoriamento | _Sensor DHT11 (interno e externo)_ |
| Microcontrolador | _Arduino UNO R3_ |
| Banco de dados | _MySQL_ |
| Back-end / API | _Web-Data-Viz e Dat-acqu-ino_ |
| Dashboard (front-end) | _HTML, CSS e JS_ |

---

## 🔄 Metodologia Scrum

O projeto adota o **Scrum** de forma adaptada ao contexto acadêmico e ao trabalho em equipe.

1. **Product Backlog:** requisitos e funcionalidades planejados, incluindo páginas institucionais, integração com o banco de dados e dashboard de monitoramento.
2. **Priorização:** tarefas ordenadas por importância, complexidade e tempo disponível.
3. **Ciclos semanais:** inspirados nas Sprints, com metas e entregas definidas para cada período semanal discutido com professor.
4. **Revisão:** ao fim de cada ciclo, a equipe avalia os resultados, identifica dificuldades e reorganiza as tarefas para a proxima semana.

---

## 👥 Equipe

| Nome | RA |
| --- | --- |
| Gabriela Ferreira Camargo Marcelino | 01262007 |
| Giovanna Silva Carneiro | 01262055 |
| Rafael Oliveira de Moura | 01262040 |
| Renan de Souza Gonçalves Passos | 01262124 |
| Ronaldo Minéro Júnior | 01262122 |
| Vitor Hiroyuky Tsumura | 01262065 |

**Instituição:** [SPTech School](https://www.sptech.school/) · **Curso:** Análise e Desenvolvimento de Sistemas · **Turma:** 1 ADS A · **São Paulo, 2026**

---

## 📚 Referências

- AGROLINK. [Exportações de mel caem em volume e sobem em receita](https://www.agrolink.com.br/noticias/exportacoes-de-mel-caem-em-volume-e-sobem-em-receita_510603.html). Agrolink, 5 fev. 2026.
- AGROLINK. [Paraná lidera produção nacional de mel em 2024](https://www.agrolink.com.br/noticias/parana-lidera-producao-nacional-de-mel-em-2024_506576.html). Agrolink, 2025.
- BRASIL DE FATO. [Apicultores estimam perda de até 60 mil colmeias nas enchentes do RS](https://www.brasildefato.com.br/2024/06/17/apicultores-estimam-perda-de-ate-60-mil-colmeias-nas-enchentes-do-rs/). Brasil de Fato, 17 jun. 2024.
- CANAL RURAL. [Aumento de 6 °C nos termômetros até 2100 pode eliminar colmeias e alimentos, mostra Embrapa](https://www.canalrural.com.br/sustentabilidade/aumento-de-6c-nos-termometros-ate-2100-pode-eliminar-colmeias-e-alimentos-mostra-embrapa/). Canal Rural, 14 jun. 2025.
- CASTAGNINO, G. L. B. et al. [Etiology, symptoms and prevention of chalkbrood disease: a literature review](http://old.scielo.br/scielo.php?pid=S1519-99402020000100803&script=sci_arttext&tlng=en). *Revista Brasileira de Saúde e Produção Animal*, Salvador, v. 21, e210332020, 2020.
- DANIELI, P. P. et al. [Precision beekeeping systems: state of the art, pros and cons, and their application as tools for advancing the beekeeping sector](https://dx.doi.org/10.3390/ani14010070). *Animals*, Basel, v. 14, n. 1, art. 70, 2024.
- DIÁRIO X. [O aquecido mercado de própolis no Brasil](https://www.diariox.com.br/economia/o-aquecido-mercado-de-propolis-no-brasil/18875/). Diário X, 21 mar. 2019.
- INFOBEE. [Exportações de mel brasileiro recuam em volume, mas receita cresce com valorização no mercado internacional](https://www.infobeebr.com.br/noticias/exportacoes-de-mel-brasileiro-recuam-em-volume-mas-receita-cresce-com-valorizacao-no-mercado-internacional/). InfoBee, 29 dez. 2025.
- IBGE. [Pesquisa da Pecuária Municipal: resultados 2024](https://agenciadenoticias.ibge.gov.br/media/com_mediaibge/arquivos/b9bced330ec7ddf7a65eb47965090988.pdf). Rio de Janeiro: IBGE, 2025a.
- IBGE. [Valor da produção da pecuária e da aquicultura chega a R$ 132,8 bilhões em 2024, com recorde nas produções de leite, ovos de galinha e mel](https://anda.ibge.gov.br/en/agencia-news/2184-news-agency/news/44539-valor-da-producao-da-pecuaria-e-da-aquicultura-chega-a-r-132-8-bilhoes-em-2024-com-recorde-nas-producoes-de-leite-ovos-de-galinha-e-mel-2). Agência de Notícias, 18 set. 2025b.
- LOPES, M. T. do R. et al. [Alternativas de sombreamento para apiários](https://www.redalyc.org/pdf/2530/253020125008.pdf). *Pesquisa Agropecuária Tropical*, Goiânia, v. 41, n. 3, p. 299-305, 2011.
- MONEY TIMES. [Estudo estima em R$ 43 bi a contribuição econômica dos polinizadores](https://www.moneytimes.com.br/estudo-estima-em-r-43-bi-a-contribuicao-economica-dos-polinizadores/). Money Times, 6 fev. 2019.
- OLIVEIRA, A. [Abelhas: termorregulação da colmeia](https://www.cpt.com.br/cursos-criacaodeabelhas/artigos/abelhas-termorregulacao-da-colmeia). CPT Cursos Online, [s.d.].
- ROSENDO, V. [Brasil produz 67 mil toneladas de mel, exporta 56% e tem EUA como principal destino](https://www.canalrural.com.br/agricultura/brasil-produz-67-mil-toneladas-de-mel-exporta-56-e-tem-eua-como-principal-destino/). Canal Rural, 20 maio 2026.
- SEBRAE GOIÁS. [Subprodutos do mel: boletim de tendências](https://polosebraeagro.sebrae.com.br/wp-content/uploads/2024/05/subprodutos-do-mel-boletim-de-tendencias-sebrae-goias.pdf). Goiânia: Sebrae, 2024.
- SOUZA NETO, J. V. de et al. [Análise conjuntural sobre apicultura](https://emdagro.se.gov.br/wp-content/uploads/2026/04/APICULTURA.pdf). Aracaju: EMDAGRO, 2025.
- VIANA, A. L. de P.; VOLTOLINI, M. [Mercado de mel orgânico nos Estados Unidos](https://www.gov.br/agricultura/pt-br/assuntos/relacoes-internacionais/adidos-agricolas/estados-unidos/ESTADOSUNIDOSMERCADODEMELORGNICONOSESTADOSUNIDOS.pdf). Brasília, DF: Ministério da Agricultura e Pecuária, 15 jul. 2025.
- YODER, J. A. et al. [Water activity of the bee fungal pathogen *Ascosphaera apis* in relation to colony conditions](https://link.springer.com/article/10.1007/s13592-016-0461-7). *Apidologie*, v. 48, n. 2, p. 159-167, 2017.
- ZACEPINS, A. et al. [Challenges in the development of precision beekeeping](https://doi.org/10.1016/j.biosystemseng.2014.12.001). *Biosystems Engineering*, v. 130, p. 60-71, 2015.

---

<p align="center">Feito com 🍯 pela equipe Tetria · SPTech School · 2026</p>
