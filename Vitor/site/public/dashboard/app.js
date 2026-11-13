// ================== LIMITES (documentação de medidas) ==================
// Temperatura: ideal 33 a 36 °C | risco abaixo de 32 ou acima de 38 °C (entre os dois: atenção)
// Umidade:     ideal 50 a 75 %  | fora disso: atenção | risco a partir de 85 % com temperatura abaixo de 32 °C
let tempMin = 33;
let tempMax = 36;
let tempFrio = 32;
let tempCalor = 38;
let umidMin = 50;
let umidMax = 75;
let umidRisco = 85;
let umidSeca = 40;

// ================== DADOS (simulados) ==================
// horário da leitura atual: header, KPIs, gráficos e alertas usam todos este mesmo horário
let agora = new Date();
let minutoAgora = agora.getHours() * 60 + agora.getMinutes();

// curva de um dia inteiro, com um ponto a cada 3 horas.
// "hoje" usa essa curva só de 00:00 até o horário atual (ver montarHoje)
let horarios = ["00:00", "03:00", "06:00", "09:00", "12:00", "15:00", "18:00", "21:00"];

// só existe UM sensor externo para todas as colmeias
let tempExternaBase = [29.2, 28.6, 28.1, 30.4, 32.6, 33.8, 32.1, 30.3];
let umidExternaBase = [74, 76, 78, 71, 64, 60, 65, 70];

// cada linha é uma colmeia: posição 0 = Colmeia 01, posição 1 = Colmeia 02...
let tempInternaBase = [
  [34.2, 33.9, 33.6, 34.3, 35.2, 35.6, 35.1, 34.9],
  [36.8, 36.2, 35.9, 37.0, 38.3, 39.4, 39.1, 38.9],
  [35.4, 35.0, 34.8, 35.6, 36.5, 37.2, 37.0, 36.9],
  [33.0, 32.4, 31.8, 32.6, 33.1, 33.4, 32.2, 31.4],
  [33.8, 33.4, 33.2, 33.9, 34.6, 34.9, 34.4, 34.1],
  [34.0, 33.7, 33.5, 34.2, 35.0, 35.3, 34.9, 34.7],
  [34.8, 34.5, 34.3, 35.0, 35.7, 35.9, 35.8, 35.6],
  [36.5, 36.0, 35.8, 36.9, 38.2, 39.3, 39.1, 38.9],
  [33.9, 33.6, 33.4, 34.0, 34.6, 34.8, 34.5, 34.2],
  [34.6, 34.3, 34.1, 34.9, 35.6, 35.9, 35.7, 35.5],
];
let umidInternaBase = [
  [65, 66, 67, 64, 61, 60, 62, 63],
  [64, 65, 66, 67, 68, 69, 70, 71],
  [63, 64, 65, 62, 60, 59, 61, 62],
  [60, 62, 63, 59, 55, 53, 54, 55],
  [60, 61, 62, 59, 57, 56, 57, 58],
  [74, 76, 78, 75, 72, 73, 77, 79],
  [68, 69, 70, 67, 65, 64, 67, 69],
  [72, 73, 74, 73, 75, 76, 77, 78],
  [57, 58, 59, 56, 53, 52, 53, 54],
  [72, 73, 74, 71, 69, 68, 71, 73],
];

// leituras de HOJE (de 00:00 até agora): a última posição é a leitura atual
let horariosHoje = [];
let minutosHoje = [];
let tempExterna = [];
let umidExterna = [];
let tempInterna = [];
let umidInterna = [];

// valor da curva base em qualquer minuto do dia (interpola entre os pontos de 3 em 3 horas)
function valorNoMinuto(vetor, minuto) {
  let p = Math.floor(minuto / minutosEntrePontos);
  let fracao = (minuto % minutosEntrePontos) / minutosEntrePontos;
  let antes = vetor[p];
  let depois = vetor[(p + 1) % vetor.length]; // depois das 21:00 volta para a curva das 00:00
  return antes + (depois - antes) * fracao;
}

// monta o dia de hoje: os pontos de 3 em 3 horas que já passaram + a leitura atual
function montarHoje() {
  minutosHoje = [];
  for (let h = 0; h < horarios.length && h * minutosEntrePontos < minutoAgora; h++) {
    minutosHoje.push(h * minutosEntrePontos);
  }
  minutosHoje.push(minutoAgora);

  horariosHoje = [];
  tempExterna = [];
  umidExterna = [];
  tempInterna = [];
  umidInterna = [];
  for (let i = 0; i < tempInternaBase.length; i++) {
    tempInterna.push([]);
    umidInterna.push([]);
  }

  for (let m = 0; m < minutosHoje.length; m++) {
    let minuto = minutosHoje[m];
    horariosHoje.push(formatarMinutoDoDia(minuto));
    tempExterna.push(arredondar1(valorNoMinuto(tempExternaBase, minuto)));
    umidExterna.push(Math.round(valorNoMinuto(umidExternaBase, minuto)));
    for (let i = 0; i < tempInternaBase.length; i++) {
      tempInterna[i].push(arredondar1(valorNoMinuto(tempInternaBase[i], minuto)));
      umidInterna[i].push(Math.round(valorNoMinuto(umidInternaBase[i], minuto)));
    }
  }
}
// ================== HISTÓRICO (dias anteriores, simulados) ==================
// posição 0 = hoje (os vetores acima), 1 = ontem, 2 = anteontem... até 1 ano atrás
let qtdDias = 7;          // dias que aparecem no select "Dia" da colmeia
let diasHistorico = 365;  // dias guardados no histórico (usado no histórico de alertas)
let historico = [];

// gerador "aleatório" com semente: gera sempre os mesmos números ao recarregar a página
let semente = 42;
function aleatorio() {
  semente = (semente * 9301 + 49297) % 233280;
  return semente / 233280; // número entre 0 e 1
}

function arredondar1(valor) {
  return Math.round(valor * 10) / 10;
}

function limitarUmid(valor) {
  return Math.min(100, Math.max(0, Math.round(valor)));
}

// data (meia-noite) de "d" dias atrás
function dataDoDia(d) {
  let data = new Date();
  data.setHours(0, 0, 0, 0);
  data.setDate(data.getDate() - d);
  return data;
}

// estação do ano: +1 no auge do verão (meados de janeiro), -1 no auge do inverno (julho)
function estacao(d) {
  let data = dataDoDia(d);
  let inicioAno = new Date(data.getFullYear(), 0, 1);
  let diaDoAno = Math.floor((data - inicioAno) / 86400000);
  return Math.cos((2 * Math.PI * (diaDoAno - 15)) / 365);
}

// umidade "normal" de cada colmeia (média de hoje, sem os exageros)
function umidadeBase(i) {
  let soma = 0;
  for (let h = 0; h < umidInternaBase[i].length; h++) soma += umidInternaBase[i][h];
  return Math.min(68, Math.max(56, soma / umidInternaBase[i].length));
}

// gera um dia passado: clima do dia + colmeias regulando a temperatura + incidentes raros
function gerarDia(d) {
  // diferença de clima em relação a hoje (estação do ano + sorte do dia)
  let difTemp = 2.5 * (estacao(d) - estacao(0)) + (aleatorio() - 0.5) * 2;
  let difUmid = 8 * (estacao(d) - estacao(0)) + (aleatorio() - 0.5) * 8;

  let dia = { horarios: horarios, minutos: [], tempExterna: [], umidExterna: [], tempInterna: [], umidInterna: [] };
  let somaExt = 0;
  for (let h = 0; h < horarios.length; h++) {
    dia.minutos.push(h * minutosEntrePontos);
    dia.tempExterna.push(arredondar1(tempExternaBase[h] + difTemp + (aleatorio() - 0.5) * 0.8));
    dia.umidExterna.push(limitarUmid(umidExternaBase[h] + difUmid + (aleatorio() - 0.5) * 4));
    somaExt += dia.tempExterna[h];
  }
  let mediaExt = somaExt / horarios.length;

  for (let i = 0; i < tempInternaBase.length; i++) {
    let temps = [];
    let umids = [];
    // as abelhas seguram a temperatura perto de 34,6 °C; o clima de fora influencia pouco
    for (let h = 0; h < horarios.length; h++) {
      temps.push(34.6 + 0.2 * (dia.tempExterna[h] - mediaExt) + 0.15 * difTemp + (aleatorio() - 0.5) * 0.6);
      umids.push(umidadeBase(i) + 0.4 * difUmid + (aleatorio() - 0.5) * 4);
    }

    // ~3% de chance por dia de um incidente (calor, frio, umidade alta ou ar seco)
    if (aleatorio() < 0.03) {
      let tipo = Math.floor(aleatorio() * 4);
      let inicio = Math.floor(aleatorio() * 6);
      let duracao = 1 + Math.floor(aleatorio() * 3); // de 1 a 3 leituras (3 a 9 horas)
      let forca = aleatorio();
      for (let h = inicio; h < inicio + duracao && h < horarios.length; h++) {
        if (tipo == 0) temps[h] += 2.5 + forca * 2;    // calor
        if (tipo == 1) temps[h] -= 2 + forca * 1.5;    // frio
        if (tipo == 2) umids[h] += 14 + forca * 8;     // umidade alta
        if (tipo == 3) umids[h] -= 16 + forca * 8;     // ar seco
      }
    }

    for (let h = 0; h < horarios.length; h++) {
      temps[h] = arredondar1(temps[h]);
      umids[h] = limitarUmid(umids[h]);
    }
    dia.tempInterna.push(temps);
    dia.umidInterna.push(umids);
  }
  return dia;
}

function gerarHistorico() {
  semente = 42;
  montarHoje();
  historico = [{ horarios: horariosHoje, minutos: minutosHoje, tempExterna: tempExterna, umidExterna: umidExterna, tempInterna: tempInterna, umidInterna: umidInterna }];
  for (let d = 1; d < diasHistorico; d++) {
    historico.push(gerarDia(d));
  }
}

// texto do dia no select: "Hoje", "Ontem" ou "seg. 09/11"
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

// ================== HISTÓRICO DE ALERTAS ==================
// REGRA DE NEGÓCIO: só é alerta quando a colmeia fica MAIS DE 1 HORA seguida fora da faixa ideal.
// saídas rápidas (até 1 hora) são ignoradas: podem ser só uma oscilação do sensor.
let tempoMinimoAlerta = 60; // minutos
let historicoAlertas = [];

// o sensor lê a cada 10 minutos, mas o histórico guarda um ponto a cada 3 horas.
// para medir o tempo fora da faixa, recriamos as leituras de 10 em 10 min entre um ponto e outro
let minutosEntrePontos = 3 * 60;
let minutosEntreLeituras = 10;

// pequena oscilação do sensor, sempre igual para a mesma leitura (não muda ao recalcular)
function ruido(n) {
  let x = Math.sin(n * 12.9898) * 43758.5453;
  return x - Math.floor(x) - 0.5; // número entre -0,5 e 0,5
}

// "00:00", "08:40", "21:00"...
function formatarMinutoDoDia(minuto) {
  let h = Math.floor(minuto / 60);
  let m = minuto % 60;
  return (h < 10 ? "0" : "") + h + ":" + (m < 10 ? "0" : "") + m;
}

function calcularHistoricoAlertas() {
  historicoAlertas = [];
  for (let i = 0; i < tempInterna.length; i++) {
    // todos os pontos da colmeia em ordem: do dia mais antigo até a leitura atual
    let pontos = [];
    for (let d = historico.length - 1; d >= 0; d--) {
      let dia = historico[d];
      for (let h = 0; h < dia.minutos.length; h++) {
        pontos.push({ d: d, minuto: dia.minutos[h], temp: dia.tempInterna[i][h], umid: dia.umidInterna[i][h] });
      }
    }

    let aberto = null; // período fora da faixa que ainda não terminou
    let n = 0;         // contador de leituras (usado no ruído)

    for (let p = 0; p < pontos.length; p++) {
      let a = pontos[p];
      let b = pontos[p + 1];
      // leituras de 10 em 10 min até o próximo ponto (no último ponto, agora, só existe a leitura atual)
      let qtd = 1;
      if (b) {
        let diferenca = (a.d - b.d) * 24 * 60 + b.minuto - a.minuto;
        qtd = Math.max(1, Math.floor(diferenca / minutosEntreLeituras));
      }

      for (let s = 0; s < qtd; s++) {
        n++;
        let fracao = s / qtd;
        let temp = b ? a.temp + (b.temp - a.temp) * fracao : a.temp;
        let umid = b ? a.umid + (b.umid - a.umid) * fracao : a.umid;
        // a leitura atual (último ponto) fica sem ruído: igual à mostrada nos KPIs e na situação da colmeia
        if (b) {
          temp = arredondar1(temp + ruido(n + i * 100000) * 0.3);
          umid = Math.round(umid + ruido(n + i * 100000 + 50000) * 2);
        }
        let situacao = classificar(temp, umid);

        if (situacao == "Ideal") {
          fecharAlerta(aberto, false);
          aberto = null;
          continue;
        }

        if (!aberto) {
          let minutoDoDia = a.minuto + s * minutosEntreLeituras;
          aberto = { colmeia: i, diasAtras: a.d, minuto: minutoDoDia, leituras: 0, situacao: situacao, temp: temp, umid: umid, emAndamento: false };
        }
        aberto.leituras++;
        // guarda a leitura do momento mais grave do alerta
        if (situacao == "Risco" && aberto.situacao != "Risco") {
          aberto.situacao = "Risco";
          aberto.temp = temp;
          aberto.umid = umid;
        }
      }
    }
    fecharAlerta(aberto, true); // ainda fora da faixa na leitura atual
  }

  // mais recentes primeiro
  historicoAlertas.sort(function (a, b) {
    if (a.diasAtras != b.diasAtras) return a.diasAtras - b.diasAtras;
    return b.minuto - a.minuto;
  });

  // tempo em alerta de cada colmeia = duração do alerta em andamento (0 se não houver)
  minutosEmAlerta = [];
  for (let i = 0; i < tempInterna.length; i++) minutosEmAlerta.push(0);
  for (let a = 0; a < historicoAlertas.length; a++) {
    let alerta = historicoAlertas[a];
    if (alerta.emAndamento) minutosEmAlerta[alerta.colmeia] = alerta.duracao;
  }
}

// só vira alerta se passou mais de 1 hora fora da faixa ideal
function fecharAlerta(periodo, emAndamento) {
  if (!periodo) return;
  periodo.duracao = periodo.leituras * minutosEntreLeituras;
  // alerta em andamento: dura do início até a leitura atual (agora)
  if (emAndamento) periodo.duracao = periodo.diasAtras * 24 * 60 + minutoAgora - periodo.minuto;
  if (periodo.duracao <= tempoMinimoAlerta) return;
  periodo.emAndamento = emAndamento;
  historicoAlertas.push(periodo);
}

// "Hoje, 12:40", "Ontem, 03:10" ou "09/11, 15:00"
function formatarInicio(alerta) {
  let hora = formatarMinutoDoDia(alerta.minuto);
  if (alerta.diasAtras == 0) return "Hoje, " + hora;
  if (alerta.diasAtras == 1) return "Ontem, " + hora;
  let data = dataDoDia(alerta.diasAtras).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
  return data + ", " + hora;
}

// há quantos minutos cada colmeia está em alerta
// (calculado a partir do histórico, em calcularHistoricoAlertas)
let minutosEmAlerta = [];

// situação de cada colmeia: "Ideal", "Atenção" ou "Risco"
let situacoes = [];

function nomeColmeia(i) {
  if (i + 1 < 10) return "Colmeia 0" + (i + 1);
  return "Colmeia " + (i + 1);
}


function formatar(numero) {
  return numero.toFixed(1).replace(".", ",");
}


function formatarTempo(minutos) {
  // alertas com mais de um dia aparecem em dias (ex.: "3 dias")
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

// a leitura atual é a última posição do vetor
function atual(vetor) {
  return vetor[vetor.length - 1];
}

// nome da classe do CSS (sem acento) para pintar a situação
function classeCss(situacao) {
  if (situacao == "Risco") return "risco";
  if (situacao == "Atenção") return "atencao";
  return "estavel";
}

// situação de uma leitura de acordo com os limites configurados
function classificar(temp, umid) {
  if (temp < tempFrio || temp > tempCalor || umid >= umidRisco || umid < umidSeca) return "Risco";
  if (temp < tempMin || temp > tempMax || umid < umidMin || umid > umidMax) return "Atenção";
  return "Ideal";
}

function calcularSituacoes() {
  situacoes = [];
  for (let i = 0; i < tempInterna.length; i++) {
    situacoes.push(classificar(atual(tempInterna[i]), atual(umidInterna[i])));
  }
  // os limites podem ter mudado: refaz o histórico de alertas também
  calcularHistoricoAlertas();
}

// ================== NAVEGAÇÃO ==================
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

// monta o select único: "Todas as colmeias" + as colmeias agrupadas por situação (risco, atenção, ideal)
function filtrarColmeias() {
  let selecaoAnterior = select_colmeia.value;
  let html = '<option value="todas">Todas as colmeias</option>';

  let grupos = [
    ["Risco", "Em risco"],
    ["Atenção", "Em atenção"],
    ["Ideal", "Ideal"],
  ];
  for (let g = 0; g < grupos.length; g++) {
    let opcoes = "";
    for (let i = 0; i < situacoes.length; i++) {
      if (situacoes[i] == grupos[g][0]) {
        opcoes += `<option value="${i}">${nomeColmeia(i)}</option>`;
      }
    }
    if (opcoes != "") html += `<optgroup label="${grupos[g][1]}">${opcoes}</optgroup>`;
  }

  select_colmeia.innerHTML = html;
  select_colmeia.value = selecaoAnterior || "todas";
  if (select_colmeia.value == "") select_colmeia.value = "todas";
  mostrarDashboard();
}

function abrirColmeia(i) {
  filtrarColmeias();
  select_colmeia.value = i;
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
    document.body.classList.add("sem-rolagem");
    mostrarColmeia(Number(selecao));
  }
}

// ================== VISÃO GERAL ==================
function mostrarVisaoGeral() {
  let qtdRisco = 0;
  let qtdAtencao = 0;
  lista_risco.innerHTML = "";
  lista_atencao.innerHTML = "";
  let semanaEmMinutos = 7 * 24 * 60;

  // primeiro passa pelas colmeias em risco, depois pelas em atenção:
  // assim a lista já fica da mais crítica para a menos crítica
  let ordem = ["Risco", "Atenção"];
  for (let o = 0; o < ordem.length; o++) {
    for (let i = 0; i < situacoes.length; i++) {
      if (situacoes[i] == ordem[o]) {
        let leitura = formatar(atual(tempInterna[i])) + " °C · " + atual(umidInterna[i]) + "%";
        let tempo = formatarTempo(minutosEmAlerta[i]);
        let linhaCard = `<button class="alert-row" onclick="abrirColmeia(${i})">
            <strong>${nomeColmeia(i)}</strong><span>${leitura}</span><time>há ${tempo}</time>
          </button>`;

        // os cards só consideram alertas da última semana
        // e cada card mostra no máximo 3 colmeias; a tabela embaixo mostra todas
        // só entra quem já está em alerta (mais de 1 hora fora da faixa)
        if (minutosEmAlerta[i] > tempoMinimoAlerta && minutosEmAlerta[i] <= semanaEmMinutos) {
          if (ordem[o] == "Risco") {
            qtdRisco++;
            if (qtdRisco <= 3) lista_risco.innerHTML += linhaCard;
          } else {
            qtdAtencao++;
            if (qtdAtencao <= 3) lista_atencao.innerHTML += linhaCard;
          }
        }
      }
    }
  }

  mostrarHistoricoAlertas();

  qtd_risco.innerHTML = qtdRisco;
  qtd_atencao.innerHTML = qtdAtencao;
  qtd_total3.innerHTML = situacoes.length;
}

// tabela com o histórico de alertas (mais recentes primeiro)
function mostrarHistoricoAlertas() {
  let filtroAlertas = select_alertas.value;
  // período em dias: hoje, últimos 7, 30 ou 365 dias
  let diasPeriodo = { dia: 1, semana: 7, mes: 30, ano: 365 };
  let limiteDias = diasPeriodo[select_periodo.value];

  let html = "";
  for (let a = 0; a < historicoAlertas.length; a++) {
    let alerta = historicoAlertas[a];
    if (filtroAlertas != "todos" && filtroAlertas != alerta.situacao) continue;
    // alertas em andamento sempre aparecem; os encerrados só se começaram dentro do período
    if (!alerta.emAndamento && alerta.diasAtras >= limiteDias) continue;

    html += `<tr class="linha-clicavel" onclick="abrirColmeia(${alerta.colmeia})">
        <td class="hive-name">${nomeColmeia(alerta.colmeia)}</td>
        <td><span class="status-badge ${classeCss(alerta.situacao)}">${alerta.situacao}</span></td>
        <td>${formatarInicio(alerta)}</td>
        <td>${formatarTempo(alerta.duracao)}</td>
        <td>${formatar(alerta.temp)} °C</td>
        <td>${alerta.umid}%</td>
      </tr>`;
  }

  if (html == "") {
    html = `<tr><td colspan="6" class="sem-alertas">Nenhum alerta neste filtro.</td></tr>`;
  }
  tabela_alertas.innerHTML = html;
}

// ================== COLMEIA INDIVIDUAL ==================
function mostrarColmeia(i) {
  // picos e gráficos usam o dia escolhido; os KPIs de leitura atual usam sempre hoje
  let dia = historico[Number(select_dia.value)] || historico[0];
  let temps = dia.tempInterna[i];
  let umids = dia.umidInterna[i];

  titulo_pagina.innerHTML = nomeColmeia(i);
  badge_situacao.innerHTML = situacoes[i];
  badge_situacao.className = "status-badge " + classeCss(situacoes[i]);

  // procura a posição da temperatura mais alta e da mais baixa do dia
  let maior = 0;
  let menor = 0;
  for (let p = 1; p < temps.length; p++) {
    if (temps[p] > temps[maior]) maior = p;
    if (temps[p] < temps[menor]) menor = p;
  }

  
  // procura a posição da umidade mais alta e mais baixa do dia
  let maiorUmid = 0;
  let menorUmid = 0;

  for (let p = 1; p < umids.length; p++) {
    if (umids[p] > umids[maiorUmid]) maiorUmid = p;
    if (umids[p] < umids[menorUmid]) menorUmid = p;
  }

  // preenche a KPI de picos de umidade
  kpi_umid_alta.innerHTML = umids[maiorUmid] + "%";
  kpi_hora_umid_alta.innerHTML = dia.horarios[maiorUmid];

  kpi_umid_baixa.innerHTML = umids[menorUmid] + "%";
  kpi_hora_umid_baixa.innerHTML = dia.horarios[menorUmid];


  kpi_temp.innerHTML = formatar(atual(tempInterna[i]));
  kpi_temp_ideal.innerHTML = tempMin + " °C a " + tempMax + " °C";
  kpi_umid.innerHTML = atual(umidInterna[i]);
  kpi_umid_ideal.innerHTML = umidMin + "% a " + umidMax + "%";
  kpi_pico_alto.innerHTML = formatar(temps[maior]) + " °C";
  kpi_hora_alto.innerHTML = dia.horarios[maior];
  kpi_pico_baixo.innerHTML = formatar(temps[menor]) + " °C";
  kpi_hora_baixo.innerHTML = dia.horarios[menor];
  kpi_temp_ext.innerHTML = formatar(atual(tempExterna)) + " °C";
  kpi_umid_ext.innerHTML = atual(umidExterna) + "%";

  // o eixo X mostra os horários do dia escolhido (hoje vai só até a leitura atual)
  graficoTemperatura.data.labels = dia.horarios;
  graficoUmidade.data.labels = dia.horarios;

  // posições das linhas: 0 colmeia, 1 externo, 2 e 3 ideal, 4 e 5 risco
  graficoTemperatura.data.datasets[0].data = temps;
  graficoTemperatura.data.datasets[1].data = dia.tempExterna;
  graficoTemperatura.data.datasets[2].data = linhaReta(tempMin);
  graficoTemperatura.data.datasets[3].data = linhaReta(tempMax);
  graficoTemperatura.data.datasets[4].data = linhaReta(tempFrio);
  graficoTemperatura.data.datasets[5].data = linhaReta(tempCalor);
  graficoTemperatura.update();

  graficoUmidade.data.datasets[0].data = umids;
  graficoUmidade.data.datasets[1].data = dia.umidExterna;
  graficoUmidade.data.datasets[2].data = linhaReta(umidMin);
  graficoUmidade.data.datasets[3].data = linhaReta(umidMax);
  graficoUmidade.data.datasets[4].data = linhaReta(umidSeca);
  graficoUmidade.data.datasets[5].data = linhaReta(umidRisco);
  graficoUmidade.update();
}

// vetor com o mesmo valor em todos os horários = uma linha reta no gráfico
function linhaReta(valor) {
  let vetor = [];
  let dia = historico[Number(select_dia.value)] || historico[0];
  for (let h = 0; h < dia.horarios.length; h++) {
    vetor.push(valor);
  }
  return vetor;
}

// ================== PÁGINA COLMEIAS ==================
function listarColmeias() {
  let filtro = select_status.value;
  tabela_colmeias.innerHTML = "";

  for (let i = 0; i < situacoes.length; i++) {
    if (filtro == "todas" || situacoes[i] == filtro) {
      tabela_colmeias.innerHTML += `<tr class="linha-clicavel" onclick="abrirColmeia(${i})">
          <td class="hive-name">${nomeColmeia(i)}</td>
          <td>${formatar(atual(tempInterna[i]))} °C</td>
          <td>${formatar(atual(tempExterna))} °C</td>
          <td>${atual(umidInterna[i])}%</td>
          <td>${atual(umidExterna)}%</td>
          <td><span class="status-badge ${classeCss(situacoes[i])}">${situacoes[i]}</span></td>
        </tr>`;
    }
  }
}

// ================== GRÁFICOS (Chart.js) ==================
Chart.defaults.font.family = "Inter";
Chart.defaults.color = "#857a70";

let corVerde = "#2f8045";
let corAmarela = "#e0ad17";
let corVermelha = "#cf3329";
let corColmeia = "#f08c00"; // laranja mel: sensor da colmeia
let corExterno = "#495057"; // cinza escuro: sensor externo (ambiente)

// molde dos dois gráficos de linha (temperatura e umidade)
// a escala do eixo Y é fixa (minimo e maximo) para o gráfico não mudar de forma entre uma colmeia e outra

function criarGraficoLinha(idCanvas, minimo, maximo) {
  let unidade = idCanvas === "graficoTemperatura" ? " °C" : "%";

  return new Chart(document.getElementById(idCanvas), {
    type: "line",

    data: {
      labels: horarios,
      datasets: [
        // 0 - Temperatura/umidade interna
        {
          label: "Interna",
          data: [],
          borderColor: corColmeia,
          backgroundColor: "#ffffff",
          borderWidth: 2.5,
          tension: 0.35,
          fill: false,
          pointRadius: 3,
          pointBackgroundColor: "#ffffff",
          pointBorderColor: corColmeia,
          pointBorderWidth: 2
        },

        // 1 - Temperatura/umidade externa
        {
          label: "Externa",
          data: [],
          borderColor: corExterno,
          backgroundColor: "#ffffff",
          borderWidth: 2,
          tension: 0.35,
          fill: false,
          pointRadius: 2.5,
          pointBackgroundColor: "#ffffff",
          pointBorderColor: corExterno,
          pointBorderWidth: 1.5
        },

        // 2 - Limite inferior ideal
        {
          label: "Ideal",
          data: [],
          borderColor: corVerde,
          borderWidth: 1,
          pointRadius: 0,
          fill: false
        },

        // 3 - Limite superior ideal + preenchimento
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

        // 4 - Limite inferior de risco
        {
          label: "Risco",
          data: [],
          borderColor: corVermelha,
          borderDash: [4, 4],
          borderWidth: 1,
          pointRadius: 0,
          fill: false
        },

        // 5 - Limite superior de risco
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
          cornerRadius: 6
        }
      },

      scales: {
        x: {
          grid: {
            display: false
          },

          ticks: {
            color: "#716b63",
            font: {
              family: "Inter",
              size: 11
            },

            callback: function(value) {
              return this.getLabelForValue(value).replace(":00", "h");
            }
          }
        },

        y: {
          min: minimo,
          max: maximo,

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

// ================== CONFIGURAÇÕES ==================
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
  calcularSituacoes();
  listarColmeias();
  filtrarColmeias();

  // Atualiza os gráficos de uma colmeia caso a visão individual esteja aberta.
  const selecao = document.getElementById("select_colmeia");
  if (selecao && selecao.value !== "todas") {
    mostrarDashboard();
  }
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

  carregarConfiguracoes();
  atualizarMonitoramentoComConfiguracoes();
  alert("Valores padrão restaurados e aplicados ao Dashboard!");
}

// Atualiza o dashboard aberto em outra aba quando as configurações forem alteradas.
window.addEventListener("storage", function(evento) {
  if (evento.key === "tetria_configuracoes") {
    carregarConfiguracoes();
    atualizarMonitoramentoComConfiguracoes();
  }
});


// ================== ÚLTIMA LEITURA (indicador no header) ==================
// os sensores enviam uma leitura a cada 10 minutos
const INTERVALO_LEITURA = 10; // minutos

// simulado: última leitura = horário atual (o mesmo "agora" usado nos dados de hoje).
// com a API, use a data/hora da última medida salva no banco, ex.:
// ultimaLeitura = new Date(dados[dados.length - 1].dtHora);
let ultimaLeitura = agora;

function atualizarUltimaLeitura() {
  let minutos = Math.floor((Date.now() - ultimaLeitura.getTime()) / 60000);

  hora_leitura.innerHTML = ultimaLeitura.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

  // até 12 min: dentro do ciclo (2 min de folga) | até 30 min: perdeu leituras | acima: sem sinal
  if (minutos <= 12) {
    ultima_leitura.className = "ultima-leitura";
  } else if (minutos <= 30) {
    ultima_leitura.className = "ultima-leitura atrasado";
  } else {
    ultima_leitura.className = "ultima-leitura offline";
  }
}

atualizarUltimaLeitura();
setInterval(atualizarUltimaLeitura, 30000); // só recalcula a cor do status, não chama a API

gerarHistorico();
preencherSelectDia();
carregarConfiguracoes();
calcularSituacoes();
listarColmeias();
filtrarColmeias();

// vindo da página Colmeias (dashboard.html?colmeia=N): já abre a colmeia escolhida
let colmeiaDaUrl = new URLSearchParams(location.search).get("colmeia");
if (colmeiaDaUrl !== null && tempInterna[Number(colmeiaDaUrl)]) {
  abrirColmeia(Number(colmeiaDaUrl));
}
