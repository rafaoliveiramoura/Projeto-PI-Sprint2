// =====================================================================
//  Dashboard Tetria — todos os dados vêm do banco (tabela coleta_dados)
//  Rotas usadas (src/routes/dashboard.js):
//    GET /dashboard/colmeias/:idEndereco         -> última leitura de cada colmeia + sensor externo
//    GET /dashboard/medidas/:idColmeia?data=...  -> leituras do dia (gráficos e picos)
//    GET /dashboard/leituras/:idEndereco?dias=N  -> leituras do período (histórico de alertas)
//    GET /dashboard/config/:idEndereco           -> limites configurados
// =====================================================================

const ID_ENDERECO = sessionStorage.getItem("ID_ENDERECO") || 1;

const INTERVALO_ATUALIZACAO = 2 * 1000;    // busca leituras novas a cada 2 s (mesmo ritmo do sensor)
const INTERVALO_PICOS = 10 * 1000;         // picos do dia (consulta mais pesada) a cada 10 s
const INTERVALO_ALERTAS = 60 * 1000;       // recalcula o histórico de alertas a cada 1 min
const PONTOS_TEMPO_REAL = 30;              // gráfico ao vivo mostra as últimas 30 leituras (~1 min)
const MINUTOS_POR_BLOCO = 10;              // o back-end agrupa as leituras em blocos de 10 min
const MINUTOS_SEM_LEITURA = 30;            // depois disso sem leitura o alerta é encerrado
const tempoMinimoAlerta = 60;              // só vira alerta no histórico se durar mais que isso

let tempMin = 33;
let tempMax = 36;
let tempFrio = 32;
let tempCalor = 38;
let umidMin = 50;
let umidMax = 75;
let umidRisco = 85;
let umidSeca = 40;

let qtdDias = 7;

let colmeias = [];          // [{ id, nome, temp, umid, dtHora }]
let externo = null;         // { temp, umid, dtHora }
let situacoes = [];         // situação atual de cada colmeia (mesma ordem de "colmeias")
let leiturasPeriodo = [];   // leituras usadas no histórico de alertas
let historicoAlertas = [];
let minutosEmAlerta = {};   // por id da colmeia
let ultimaLeitura = null;
let requisicaoMedidas = 0;  // evita que uma resposta antiga sobrescreva a mais nova
let carregandoColmeias = false;
let picosCarregados = { chave: null, quando: 0 }; // qual colmeia/dia já teve os picos buscados

// ---------------------------------------------------------------------
//  Utilitários
// ---------------------------------------------------------------------

function numero(valor) {
  if (valor === null || valor === undefined || valor === "") return null;
  return Number(valor);
}

function buscarJson(url) {
  return fetch(url).then(function (resposta) {
    if (resposta.status === 204) return null;
    if (!resposta.ok) throw new Error(url + " -> HTTP " + resposta.status);
    return resposta.json();
  });
}

function doisDigitos(n) {
  return (n < 10 ? "0" : "") + n;
}

function dataDoDia(d) {
  let data = new Date();
  data.setHours(0, 0, 0, 0);
  data.setDate(data.getDate() - d);
  return data;
}

function dataISO(data) {
  return data.getFullYear() + "-" + doisDigitos(data.getMonth() + 1) + "-" + doisDigitos(data.getDate());
}

function formatarHora(data) {
  return doisDigitos(data.getHours()) + ":" + doisDigitos(data.getMinutes());
}

function formatar(valor) {
  if (valor === null || valor === undefined || isNaN(valor)) return "--";
  return Number(valor).toFixed(1).replace(".", ",");
}

function formatarUmid(valor) {
  if (valor === null || valor === undefined || isNaN(valor)) return "--";
  return Math.round(valor);
}

function formatarTempo(minutos) {
  minutos = Math.round(minutos);
  if (minutos >= 24 * 60) {
    let dias = Math.floor(minutos / (24 * 60));
    return dias == 1 ? "1 dia" : dias + " dias";
  }
  let horas = Math.floor(minutos / 60);
  let resto = minutos % 60;
  if (horas == 0) return resto + " min";
  if (resto < 10) return horas + "h0" + resto;
  return horas + "h" + resto;
}

function nomeDia(d) {
  if (d == 0) return "Hoje";
  if (d == 1) return "Ontem";
  let data = dataDoDia(d);
  let semana = data.toLocaleDateString("pt-BR", { weekday: "short" });
  let diaMes = data.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
  return semana + " " + diaMes;
}

function preencherSelectDia() {
  let html = "";
  for (let d = 0; d < qtdDias; d++) {
    html += `<option value="${d}">${nomeDia(d)}</option>`;
  }
  select_dia.innerHTML = html;
}

function buscarColmeia(id) {
  return colmeias.find(function (c) { return c.id == id; });
}

function nomeColmeia(id) {
  let colmeia = buscarColmeia(id);
  return colmeia ? colmeia.nome : "Colmeia " + id;
}

function classeCss(situacao) {
  if (situacao == "Risco") return "risco";
  if (situacao == "Atenção") return "atencao";
  if (situacao == "Sem dados") return "";
  return "estavel";
}

function classificar(temp, umid) {
  if (temp === null || umid === null) return "Sem dados";
  if (temp < tempFrio || temp > tempCalor || umid >= umidRisco || umid < umidSeca) return "Risco";
  if (temp < tempMin || temp > tempMax || umid < umidMin || umid > umidMax) return "Atenção";
  return "Ideal";
}

// ---------------------------------------------------------------------
//  Busca no banco
// ---------------------------------------------------------------------

function carregarColmeias() {
  if (carregandoColmeias) return Promise.resolve(); // a anterior ainda não respondeu
  carregandoColmeias = true;

  return buscarJson(`/dashboard/colmeias/${ID_ENDERECO}`)
    .then(function (dados) {
      colmeias = (dados ? dados.colmeias : []).map(function (c) {
        return {
          id: c.idcolmeia,
          nome: c.codigo,
          temp: numero(c.temperatura),
          umid: numero(c.umidade),
          dtHora: c.dt_hora ? new Date(c.dt_hora) : null
        };
      });

      externo = dados && dados.externo ? {
        temp: numero(dados.externo.temperatura),
        umid: numero(dados.externo.umidade),
        dtHora: new Date(dados.externo.dt_hora)
      } : null;

      ultimaLeitura = null;
      colmeias.concat(externo ? [externo] : []).forEach(function (c) {
        if (c.dtHora && (!ultimaLeitura || c.dtHora > ultimaLeitura)) ultimaLeitura = c.dtHora;
      });

      calcularSituacoes();
      atualizarUltimaLeitura();
      listarColmeias();
      filtrarColmeias();
    })
    .catch(function (erro) {
      console.error("Erro ao buscar as colmeias:", erro);
    })
    .finally(function () {
      carregandoColmeias = false;
    });
}

function diasDoPeriodo() {
  let diasPeriodo = { dia: 1, semana: 7, mes: 30, ano: 365 };
  return diasPeriodo[select_periodo.value] || 7;
}

function carregarAlertas() {
  return buscarJson(`/dashboard/leituras/${ID_ENDERECO}?dias=${diasDoPeriodo()}`)
    .then(function (leituras) {
      leiturasPeriodo = leituras || [];
      calcularHistoricoAlertas();
      if (select_colmeia.value == "todas") mostrarVisaoGeral();
    })
    .catch(function (erro) {
      console.error("Erro ao buscar o histórico de alertas:", erro);
    });
}

function carregarConfiguracoesDoBanco() {
  return buscarJson(`/dashboard/config/${ID_ENDERECO}`)
    .then(function (config) {
      if (!config) return;
      const valores = {
        tempMin: Number(config.temp_min_ideal),
        tempMax: Number(config.temp_max_ideal),
        tempFrio: Number(config.temp_alerta_frio),
        tempCalor: Number(config.temp_alerta_calor),
        umidMin: Number(config.umid_min_ideal),
        umidMax: Number(config.umid_max_ideal),
        umidSeca: Number(config.umid_alerta_seco),
        umidRisco: Number(config.umid_alerta_excessiva)
      };
      if (validarConfiguracoes(valores)) return;
      localStorage.setItem("tetria_configuracoes", JSON.stringify(valores));
      carregarConfiguracoes();
    })
    .catch(function (erro) {
      console.warn("Configurações do banco indisponíveis, usando as salvas no navegador.", erro);
    });
}

// ---------------------------------------------------------------------
//  Situação e alertas
// ---------------------------------------------------------------------

function calcularSituacoes() {
  situacoes = colmeias.map(function (c) {
    return classificar(c.temp, c.umid);
  });
}

function calcularHistoricoAlertas() {
  historicoAlertas = [];
  minutosEmAlerta = {};
  let agora = Date.now();

  let porColmeia = {};
  leiturasPeriodo.forEach(function (l) {
    if (!porColmeia[l.idcolmeia]) porColmeia[l.idcolmeia] = [];
    porColmeia[l.idcolmeia].push(l);
  });

  Object.keys(porColmeia).forEach(function (id) {
    let aberto = null;
    let anterior = null;

    porColmeia[id].forEach(function (l) {
      let inicio = new Date(l.bloco);
      let temp = numero(l.temperatura);
      let umid = numero(l.umidade);
      let situacao = classificar(temp, umid);

      // buraco grande sem leituras: encerra o alerta que estava aberto
      if (aberto && anterior && (inicio - anterior) / 60000 > MINUTOS_POR_BLOCO + MINUTOS_SEM_LEITURA) {
        fecharAlerta(aberto, false);
        aberto = null;
      }
      anterior = inicio;

      if (situacao == "Ideal" || situacao == "Sem dados") {
        fecharAlerta(aberto, false);
        aberto = null;
        return;
      }

      if (!aberto) {
        aberto = { colmeia: Number(id), inicio: inicio, situacao: situacao, temp: temp, umid: umid };
      }
      aberto.fim = new Date(inicio.getTime() + MINUTOS_POR_BLOCO * 60000);
      aberto.ultimaSituacao = situacao;
      aberto.ultimaTemp = temp;
      aberto.ultimaUmid = umid;
      if (situacao == "Risco" && aberto.situacao != "Risco") {
        aberto.situacao = "Risco";
        aberto.temp = temp;
        aberto.umid = umid;
      }
    });

    let aindaAtivo = aberto && (agora - aberto.fim) / 60000 <= MINUTOS_SEM_LEITURA;
    fecharAlerta(aberto, aindaAtivo);
  });

  historicoAlertas.sort(function (a, b) {
    return b.inicio - a.inicio;
  });
}

function fecharAlerta(periodo, emAndamento) {
  if (!periodo) return;
  let fim = emAndamento ? new Date() : periodo.fim;
  periodo.duracao = (fim - periodo.inicio) / 60000;
  periodo.emAndamento = emAndamento;
  if (emAndamento) {
    periodo.situacao = periodo.ultimaSituacao;
    periodo.temp = periodo.ultimaTemp;
    periodo.umid = periodo.ultimaUmid;
    minutosEmAlerta[periodo.colmeia] = periodo.duracao;
  }
  if (periodo.duracao <= tempoMinimoAlerta) return;
  historicoAlertas.push(periodo);
}

function formatarInicio(alerta) {
  let hora = formatarHora(alerta.inicio);
  let dia = new Date(alerta.inicio);
  dia.setHours(0, 0, 0, 0);
  let diasAtras = Math.round((dataDoDia(0) - dia) / 86400000);
  if (diasAtras == 0) return "Hoje, " + hora;
  if (diasAtras == 1) return "Ontem, " + hora;
  return alerta.inicio.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" }) + ", " + hora;
}

// ---------------------------------------------------------------------
//  Telas
// ---------------------------------------------------------------------

function mostrarPagina(pagina) {
  ["dashboard", "colmeias", "configuracoes"].forEach((nome) => {
    const secao = document.getElementById(nome);
    const link = document.getElementById("nav_" + nome);
    if (secao) secao.classList.toggle("hidden", nome !== pagina);
    if (link) link.classList.toggle("active", nome === pagina);
  });

  const ehDashboard = pagina === "dashboard";
  area_select.classList.toggle("hidden", !ehDashboard);
  if (!ehDashboard) {
    badge_situacao.classList.add("hidden");
    btn_voltar.classList.add("hidden");
    document.body.classList.remove("sem-rolagem");
    titulo_pagina.textContent = pagina === "colmeias" ? "Colmeias" : "Configurações";
  } else {
    mostrarDashboard();
  }
}

function verColmeias(filtro) {
  select_status.value = filtro;
  listarColmeias();
  mostrarPagina("colmeias");
}

function listarColmeias() {
  let filtro = select_status.value;
  let html = "";

  for (let i = 0; i < colmeias.length; i++) {
    if (filtro == "todas" || situacoes[i] == filtro) {
      let c = colmeias[i];
      html += `<tr class="linha-clicavel" onclick="abrirColmeia(${c.id})">
          <td class="hive-name">${c.nome}</td>
          <td>${formatar(c.temp)} °C</td>
          <td>${formatar(externo ? externo.temp : null)} °C</td>
          <td>${formatarUmid(c.umid)}%</td>
          <td>${formatarUmid(externo ? externo.umid : null)}%</td>
          <td><span class="status-badge ${classeCss(situacoes[i])}">${situacoes[i]}</span></td>
        </tr>`;
    }
  }
  tabela_colmeias.innerHTML = html;
}

function filtrarColmeias() {
  let selecaoAnterior = select_colmeia.value;
  let html = '<option value="todas">Todas as colmeias</option>';

  let grupos = [
    ["Risco", "Em risco"],
    ["Atenção", "Em atenção"],
    ["Ideal", "Ideal"],
    ["Sem dados", "Sem leituras"]
  ];
  for (let g = 0; g < grupos.length; g++) {
    let opcoes = "";
    for (let i = 0; i < colmeias.length; i++) {
      if (situacoes[i] == grupos[g][0]) {
        opcoes += `<option value="${colmeias[i].id}">${colmeias[i].nome}</option>`;
      }
    }
    if (opcoes != "") html += `<optgroup label="${grupos[g][1]}">${opcoes}</optgroup>`;
  }

  // só redesenha o select se algo mudou (senão ele fecharia sozinho a cada atualização)
  if (select_colmeia.dataset.html !== html) {
    select_colmeia.dataset.html = html;
    select_colmeia.innerHTML = html;
    select_colmeia.value = selecaoAnterior || "todas";
    if (select_colmeia.value == "") select_colmeia.value = "todas";
  }
  mostrarDashboard();
}

function abrirColmeia(id) {
  filtrarColmeias();
  select_colmeia.value = id;
  mostrarPagina("dashboard");
}

function voltarVisaoGeral() {
  select_colmeia.value = "todas";
  mostrarDashboard();
}

function mostrarDashboard() {
  let selecao = select_colmeia.value;

  if (selecao == "todas") {
    visao_geral.classList.remove("hidden");
    visao_individual.classList.add("hidden");
    filtro_dia.classList.add("hidden");
    badge_situacao.classList.add("hidden");
    btn_voltar.classList.add("hidden");
    document.body.classList.remove("sem-rolagem");
    titulo_pagina.innerHTML = "Colmeias em estado de risco e atenção";
    mostrarVisaoGeral();
  } else {
    visao_geral.classList.add("hidden");
    visao_individual.classList.remove("hidden");
    filtro_dia.classList.remove("hidden");
    btn_voltar.classList.remove("hidden");
    badge_situacao.classList.remove("hidden");
    document.body.classList.add("sem-rolagem");
    mostrarColmeia(Number(selecao));
  }
}

function mostrarVisaoGeral() {
  let qtdRisco = 0;
  let qtdAtencao = 0;
  let htmlRisco = "";
  let htmlAtencao = "";

  let ordem = ["Risco", "Atenção"];
  for (let o = 0; o < ordem.length; o++) {
    for (let i = 0; i < colmeias.length; i++) {
      if (situacoes[i] != ordem[o]) continue;

      let c = colmeias[i];
      let leitura = formatar(c.temp) + " °C · " + formatarUmid(c.umid) + "%";
      let tempo = minutosEmAlerta[c.id] ? "há " + formatarTempo(minutosEmAlerta[c.id]) : "agora";
      let linhaCard = `<button class="alert-row" onclick="abrirColmeia(${c.id})">
          <strong>${c.nome}</strong><span>${leitura}</span><time>${tempo}</time>
        </button>`;

      if (ordem[o] == "Risco") {
        qtdRisco++;
        if (qtdRisco <= 3) htmlRisco += linhaCard;
      } else {
        qtdAtencao++;
        if (qtdAtencao <= 3) htmlAtencao += linhaCard;
      }
    }
  }

  lista_risco.innerHTML = htmlRisco;
  lista_atencao.innerHTML = htmlAtencao;
  mostrarHistoricoAlertas();

  qtd_risco.innerHTML = qtdRisco;
  qtd_atencao.innerHTML = qtdAtencao;
  qtd_total3.innerHTML = colmeias.length;
}

function mostrarHistoricoAlertas() {
  let filtroAlertas = select_alertas.value;
  let limite = Date.now() - diasDoPeriodo() * 24 * 60 * 60000;

  let html = "";
  for (let a = 0; a < historicoAlertas.length; a++) {
    let alerta = historicoAlertas[a];
    if (filtroAlertas != "todos" && filtroAlertas != alerta.situacao) continue;
    if (!alerta.emAndamento && alerta.inicio.getTime() < limite) continue;

    html += `<tr class="linha-clicavel" onclick="abrirColmeia(${alerta.colmeia})">
        <td class="hive-name">${nomeColmeia(alerta.colmeia)}</td>
        <td><span class="status-badge ${classeCss(alerta.situacao)}">${alerta.situacao}</span></td>
        <td>${formatarInicio(alerta)}</td>
        <td>${formatarTempo(alerta.duracao)}${alerta.emAndamento ? " (em andamento)" : ""}</td>
        <td>${formatar(alerta.temp)} °C</td>
        <td>${formatarUmid(alerta.umid)}%</td>
      </tr>`;
  }

  if (html == "") {
    html = `<tr><td colspan="6" class="sem-alertas">Nenhum alerta neste filtro.</td></tr>`;
  }
  tabela_alertas.innerHTML = html;
}

function mostrarColmeia(id) {
  let colmeia = buscarColmeia(id);
  if (!colmeia) return;

  let indice = colmeias.indexOf(colmeia);
  titulo_pagina.innerHTML = colmeia.nome;
  badge_situacao.innerHTML = situacoes[indice];
  badge_situacao.className = "status-badge " + classeCss(situacoes[indice]);

  // KPIs de leitura atual (última leitura gravada)
  kpi_temp.innerHTML = formatar(colmeia.temp);
  kpi_umid.innerHTML = formatarUmid(colmeia.umid);
  kpi_temp_ext.innerHTML = formatar(externo ? externo.temp : null) + " °C";
  kpi_umid_ext.innerHTML = formatarUmid(externo ? externo.umid : null) + "%";
  kpi_temp_ideal.innerHTML = tempMin + " °C a " + tempMax + " °C";
  kpi_umid_ideal.innerHTML = umidMin + "% a " + umidMax + "%";

  let diasAtras = Number(select_dia.value) || 0;
  let data = dataISO(dataDoDia(diasAtras));
  let chave = id + "|" + data;
  let minhaRequisicao = ++requisicaoMedidas;

  // picos do dia: consulta agregada, não precisa rodar a cada 2 s
  let precisaPicos = picosCarregados.chave !== chave ||
    (diasAtras == 0 && Date.now() - picosCarregados.quando >= INTERVALO_PICOS);

  if (diasAtras == 0) {
    // HOJE: gráfico ao vivo com as últimas leituras, atualizado a cada 2 s
    buscarJson(`/dashboard/tempo-real/${id}?limite=${PONTOS_TEMPO_REAL}`)
      .then(function (linhas) {
        if (minhaRequisicao !== requisicaoMedidas) return; // chegou uma mais nova
        linhas = linhas || [];
        desenharGrafico(
          linhas.map(function (l) { return l.horario; }),
          linhas.map(function (l) { return numero(l.temperatura); }),
          linhas.map(function (l) { return numero(l.temp_externa); }),
          linhas.map(function (l) { return numero(l.umidade); }),
          linhas.map(function (l) { return numero(l.umid_externa); })
        );
      })
      .catch(function (erro) {
        console.error("Erro ao buscar as leituras em tempo real:", erro);
      });
  }

  if (!precisaPicos) return;
  picosCarregados = { chave: chave, quando: Date.now() };

  buscarJson(`/dashboard/medidas/${id}?data=${data}`)
    .then(function (linhas) {
      if (picosCarregados.chave !== chave) return; // usuário já trocou de colmeia/dia
      desenharDia(linhas || [], diasAtras > 0);
    })
    .catch(function (erro) {
      picosCarregados = { chave: null, quando: 0 }; // tenta de novo na próxima
      console.error("Erro ao buscar as medidas da colmeia:", erro);
    });
}

// dias anteriores: gráfico do dia inteiro em blocos de 10 min; em todos os dias: picos
function desenharDia(linhas, desenharGraficoDoDia) {
  let interno = {};
  let externoDia = {};
  let horariosSet = {};

  linhas.forEach(function (l) {
    horariosSet[l.horario] = true;
    if (l.tipo == "externo") externoDia[l.horario] = l;
    else interno[l.horario] = l;
  });

  let horarios = Object.keys(horariosSet).sort();
  let valor = function (mapa, h, campo) {
    return mapa[h] ? numero(mapa[h][campo]) : null;
  };

  if (desenharGraficoDoDia) {
    desenharGrafico(
      horarios,
      horarios.map(function (h) { return valor(interno, h, "temperatura"); }),
      horarios.map(function (h) { return valor(externoDia, h, "temperatura"); }),
      horarios.map(function (h) { return valor(interno, h, "umidade"); }),
      horarios.map(function (h) { return valor(externoDia, h, "umidade"); })
    );
  }

  // picos do dia (usando o máximo/mínimo real de cada bloco)
  let picoTemp = null, baixaTemp = null, picoUmid = null, baixaUmid = null;
  horarios.forEach(function (h) {
    let l = interno[h];
    if (!l) return;
    if (!picoTemp || numero(l.temp_max) > picoTemp.v) picoTemp = { v: numero(l.temp_max), h: h };
    if (!baixaTemp || numero(l.temp_min) < baixaTemp.v) baixaTemp = { v: numero(l.temp_min), h: h };
    if (!picoUmid || numero(l.umid_max) > picoUmid.v) picoUmid = { v: numero(l.umid_max), h: h };
    if (!baixaUmid || numero(l.umid_min) < baixaUmid.v) baixaUmid = { v: numero(l.umid_min), h: h };
  });

  kpi_pico_alto.innerHTML = picoTemp ? formatar(picoTemp.v) + " °C" : "--";
  kpi_hora_alto.innerHTML = picoTemp ? picoTemp.h : "--:--";
  kpi_pico_baixo.innerHTML = baixaTemp ? formatar(baixaTemp.v) + " °C" : "--";
  kpi_hora_baixo.innerHTML = baixaTemp ? baixaTemp.h : "--:--";
  kpi_umid_alta.innerHTML = picoUmid ? formatarUmid(picoUmid.v) + "%" : "--";
  kpi_hora_umid_alta.innerHTML = picoUmid ? picoUmid.h : "--:--";
  kpi_umid_baixa.innerHTML = baixaUmid ? formatarUmid(baixaUmid.v) + "%" : "--";
  kpi_hora_umid_baixa.innerHTML = baixaUmid ? baixaUmid.h : "--:--";

}

function desenharGrafico(horarios, tempInterna, tempExterna, umidInterna, umidExterna) {
  let reta = function (v) {
    return horarios.map(function () { return v; });
  };

  graficoTemperatura.data.labels = horarios;
  graficoTemperatura.data.datasets[0].data = tempInterna;
  graficoTemperatura.data.datasets[1].data = tempExterna;
  graficoTemperatura.data.datasets[2].data = reta(tempMin);
  graficoTemperatura.data.datasets[3].data = reta(tempMax);
  graficoTemperatura.data.datasets[4].data = reta(tempFrio);
  graficoTemperatura.data.datasets[5].data = reta(tempCalor);
  graficoTemperatura.update();

  graficoUmidade.data.labels = horarios;
  graficoUmidade.data.datasets[0].data = umidInterna;
  graficoUmidade.data.datasets[1].data = umidExterna;
  graficoUmidade.data.datasets[2].data = reta(umidMin);
  graficoUmidade.data.datasets[3].data = reta(umidMax);
  graficoUmidade.data.datasets[4].data = reta(umidSeca);
  graficoUmidade.data.datasets[5].data = reta(umidRisco);
  graficoUmidade.update();
}

// ---------------------------------------------------------------------
//  Gráficos
// ---------------------------------------------------------------------

Chart.defaults.font.family = "Inter";
Chart.defaults.color = "#857a70";

let corVerde = "#2f8045";
let corAmarela = "#e0ad17";
let corVermelha = "#cf3329";
let corColmeia = "#f08c00";
let corExterno = "#495057";

function criarGraficoLinha(idCanvas, minimo, maximo) {
  let unidade = idCanvas === "graficoTemperatura" ? " °C" : "%";

  return new Chart(document.getElementById(idCanvas), {
    type: "line",

    data: {
      labels: [],
      datasets: [
        {
          label: "Interna",
          data: [],
          borderColor: corColmeia,
          backgroundColor: "#ffffff",
          borderWidth: 2.5,
          tension: 0.35,
          fill: false,
          spanGaps: true,
          pointRadius: 2,
          pointBackgroundColor: "#ffffff",
          pointBorderColor: corColmeia,
          pointBorderWidth: 2
        },

        {
          label: "Externa",
          data: [],
          borderColor: corExterno,
          backgroundColor: "#ffffff",
          borderWidth: 2,
          tension: 0.35,
          fill: false,
          spanGaps: true,
          pointRadius: 1.5,
          pointBackgroundColor: "#ffffff",
          pointBorderColor: corExterno,
          pointBorderWidth: 1.5
        },

        {
          label: "Ideal",
          data: [],
          borderColor: corVerde,
          borderWidth: 1,
          pointRadius: 0,
          fill: false
        },

        {
          label: "",
          data: [],
          borderColor: corVerde,
          backgroundColor: "rgba(47, 128, 69, 0.13)",
          borderWidth: 1,
          pointRadius: 0,
          fill: {
            target: 2,
            above: "rgba(47, 128, 69, 0.13)"
          }
        },

        {
          label: "Risco",
          data: [],
          borderColor: corVermelha,
          borderDash: [4, 4],
          borderWidth: 1,
          pointRadius: 0,
          fill: false
        },

        {
          label: "",
          data: [],
          borderColor: corVermelha,
          borderDash: [4, 4],
          borderWidth: 1,
          pointRadius: 0,
          fill: false
        }
      ]
    },

    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: false,

      interaction: {
        mode: "index",
        intersect: false
      },

      plugins: {
        legend: {
          display: true,
          position: "top",
          align: "center",

          labels: {
            usePointStyle: false,
            boxWidth: 20,
            boxHeight: 8,
            padding: 10,
            color: "#716b63",

            font: {
              family: "Inter",
              size: 10
            },

            filter: function (item) {
              return item.text !== "";
            }
          }
        },

        tooltip: {
          backgroundColor: "#2b1e17",
          titleFont: {
            family: "Inter"
          },
          bodyFont: {
            family: "Inter"
          },
          padding: 10,
          cornerRadius: 6,
          filter: function (item) {
            return item.datasetIndex < 2;
          }
        }
      },

      scales: {
        x: {
          grid: {
            display: false
          },

          ticks: {
            color: "#716b63",
            maxTicksLimit: 12,
            font: {
              family: "Inter",
              size: 11
            },

            callback: function(value) {
              // "14:00" -> "14h" (visão do dia); "14:03:22" (tempo real) fica como está
              let rotulo = this.getLabelForValue(value);
              return /^\d{2}:00$/.test(rotulo) ? rotulo.replace(":00", "h") : rotulo;
            }
          }
        },

        y: {
          // "suggested": a escala aumenta sozinha se a leitura passar desses valores
          suggestedMin: minimo,
          suggestedMax: maximo,

          grid: {
            color: "#f0e8dd"
          },

          ticks: {
            color: "#716b63",
            font: {
              family: "Inter",
              size: 11
            },

            callback: function(value) {
              return value + unidade;
            }
          }
        }
      }
    }
  });
}

let graficoTemperatura = criarGraficoLinha("graficoTemperatura", 26, 42);
let graficoUmidade = criarGraficoLinha("graficoUmidade", 40, 90);

// ---------------------------------------------------------------------
//  Configurações (limites ideais / de risco)
// ---------------------------------------------------------------------

const configuracaoPadrao = {
  tempMin: 33, tempMax: 36, tempFrio: 32, tempCalor: 38,
  umidMin: 50, umidMax: 75, umidSeca: 40, umidRisco: 85
};

const camposConfiguracao = {
  tempMin: "ipt_temp_min",
  tempMax: "ipt_temp_max",
  tempFrio: "ipt_temp_frio",
  tempCalor: "ipt_temp_calor",
  umidMin: "ipt_umid_min",
  umidMax: "ipt_umid_max",
  umidSeca: "ipt_umid_seca",
  umidRisco: "ipt_umid_risco"
};

function obterConfiguracoesSalvas() {
  try {
    const salvas = JSON.parse(localStorage.getItem("tetria_configuracoes") || "null");
    if (!salvas || typeof salvas !== "object") return { ...configuracaoPadrao };
    return {
      ...configuracaoPadrao,
      ...salvas,
      umidRisco: Number(salvas.umidRisco ?? salvas.umidUmida ?? configuracaoPadrao.umidRisco)
    };
  } catch (erro) {
    console.warn("Não foi possível ler as configurações salvas.", erro);
    return { ...configuracaoPadrao };
  }
}

function preencherCamposConfiguracao(valores) {
  Object.entries(camposConfiguracao).forEach(([chave, id]) => {
    const campo = document.getElementById(id);
    if (campo) campo.value = valores[chave];
  });
}

function carregarConfiguracoes() {
  const valores = obterConfiguracoesSalvas();

  tempMin = Number(valores.tempMin);
  tempMax = Number(valores.tempMax);
  tempFrio = Number(valores.tempFrio);
  tempCalor = Number(valores.tempCalor);
  umidMin = Number(valores.umidMin);
  umidMax = Number(valores.umidMax);
  umidSeca = Number(valores.umidSeca);
  umidRisco = Number(valores.umidRisco);

  preencherCamposConfiguracao(valores);
}

function lerCamposConfiguracao() {
  const valores = {};
  for (const [chave, id] of Object.entries(camposConfiguracao)) {
    const campo = document.getElementById(id);
    if (!campo || campo.value.trim() === "") return null;
    valores[chave] = Number(campo.value);
  }
  return valores;
}

function validarConfiguracoes(valores) {
  if (!valores || Object.values(valores).some(v => !Number.isFinite(v))) {
    return "Preencha todos os campos com números válidos.";
  }

  if (!(valores.tempFrio < valores.tempMin &&
        valores.tempMin < valores.tempMax &&
        valores.tempMax < valores.tempCalor)) {
    return "Temperatura: risco frio < mínimo ideal < máximo ideal < risco calor.";
  }

  if (!(valores.umidSeca >= 0 &&
        valores.umidSeca < valores.umidMin &&
        valores.umidMin < valores.umidMax &&
        valores.umidMax < valores.umidRisco &&
        valores.umidRisco <= 100)) {
    return "Umidade: ar seco < mínimo ideal < máximo ideal < umidade excessiva (até 100%).";
  }

  if (valores.tempFrio < -20 || valores.tempCalor > 80 ||
      valores.tempMin < -20 || valores.tempMax > 80) {
    return "Informe temperaturas entre -20 °C e 80 °C.";
  }

  return "";
}

function atualizarMonitoramentoComConfiguracoes() {
  picosCarregados = { chave: null, quando: 0 }; // redesenha o gráfico com as novas faixas
  calcularSituacoes();
  calcularHistoricoAlertas();
  listarColmeias();
  filtrarColmeias();
}

function salvarConfiguracoesNoBanco(valores) {
  return fetch("/dashboard/config", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      idEndereco: ID_ENDERECO,
      TempMin: valores.tempMin,
      TempMax: valores.tempMax,
      AlertaFrio: valores.tempFrio,
      AlertaCalor: valores.tempCalor,
      UmiMin: valores.umidMin,
      UmiMax: valores.umidMax,
      AlertaSeco: valores.umidSeca,
      AlertaUmi: valores.umidRisco
    })
  }).catch(function (erro) {
    console.warn("Não foi possível salvar as configurações no banco.", erro);
  });
}

function salvarConfiguracoes() {
  const novo = lerCamposConfiguracao();
  const erro = validarConfiguracoes(novo);

  if (erro) {
    alert(erro);
    return;
  }

  try {
    localStorage.setItem("tetria_configuracoes", JSON.stringify(novo));
  } catch (erroArmazenamento) {
    alert("Não foi possível salvar as configurações neste navegador.");
    return;
  }

  salvarConfiguracoesNoBanco(novo);
  carregarConfiguracoes();
  atualizarMonitoramentoComConfiguracoes();
  alert("Configurações salvas e aplicadas ao Dashboard!");
}

function restaurarPadrao() {
  try {
    localStorage.setItem("tetria_configuracoes", JSON.stringify({ ...configuracaoPadrao }));
  } catch (erro) {
    alert("Não foi possível restaurar as configurações.");
    return;
  }

  salvarConfiguracoesNoBanco(configuracaoPadrao);
  carregarConfiguracoes();
  atualizarMonitoramentoComConfiguracoes();
  alert("Valores padrão restaurados e aplicados ao Dashboard!");
}

window.addEventListener("storage", function(evento) {
  if (evento.key === "tetria_configuracoes") {
    carregarConfiguracoes();
    atualizarMonitoramentoComConfiguracoes();
  }
});

// ---------------------------------------------------------------------
//  "Atualizado às" (horário da última leitura gravada no banco)
// ---------------------------------------------------------------------

function atualizarUltimaLeitura() {
  if (!ultimaLeitura) {
    hora_leitura.innerHTML = "--:--";
    ultima_leitura.className = "ultima-leitura offline";
    return;
  }

  let minutos = Math.floor((Date.now() - ultimaLeitura.getTime()) / 60000);
  hora_leitura.innerHTML = ultimaLeitura.toLocaleTimeString("pt-BR");

  if (minutos <= 12) {
    ultima_leitura.className = "ultima-leitura";
  } else if (minutos <= 30) {
    ultima_leitura.className = "ultima-leitura atrasado";
  } else {
    ultima_leitura.className = "ultima-leitura offline";
  }
}

// ---------------------------------------------------------------------
//  Inicialização
// ---------------------------------------------------------------------

preencherSelectDia();
carregarConfiguracoes();

carregarConfiguracoesDoBanco()
  .then(carregarColmeias)
  .then(function () {
    // dashboard.html?colmeia=N (vindo da página de colmeias, N = posição na lista)
    let colmeiaDaUrl = new URLSearchParams(location.search).get("colmeia");
    if (colmeiaDaUrl !== null && colmeias[Number(colmeiaDaUrl)]) {
      abrirColmeia(colmeias[Number(colmeiaDaUrl)].id);
    }
    return carregarAlertas();
  });

setInterval(carregarColmeias, INTERVALO_ATUALIZACAO);
setInterval(carregarAlertas, INTERVALO_ALERTAS);
setInterval(atualizarUltimaLeitura, 30000);
