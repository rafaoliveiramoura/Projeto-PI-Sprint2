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
// uma leitura a cada 3 horas (a última posição é a leitura atual)
let horarios = ["00:00", "03:00", "06:00", "09:00", "12:00", "15:00", "18:00", "21:00"];

// só existe UM sensor externo para todas as colmeias
let tempExterna = [29.2, 28.6, 28.1, 30.4, 32.6, 33.8, 32.1, 30.3];
let umidExterna = [74, 76, 78, 71, 64, 60, 65, 70];

// cada linha é uma colmeia: posição 0 = Colmeia 01, posição 1 = Colmeia 02...
let tempInterna = [
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
let umidInterna = [
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
// há quantos minutos cada colmeia está em alerta
let minutosEmAlerta = [0, 100, 25, 135, 0, 90, 0, 65, 0, 0];

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

function calcularSituacoes() {
  situacoes = [];
  for (let i = 0; i < tempInterna.length; i++) {
    let temp = atual(tempInterna[i]);
    let umid = atual(umidInterna[i]);

    if (temp < tempFrio || temp > tempCalor || umid >= umidRisco || umid < umidSeca) {
      situacoes.push("Risco");
    } else if (temp < tempMin || temp > tempMax || umid < umidMin || umid > umidMax) {
      situacoes.push("Atenção");
    } else {
      situacoes.push("Ideal");
    }
  }
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
    badge_situacao.classList.add("hidden");
    btn_voltar.classList.add("hidden");
    document.body.classList.remove("sem-rolagem");
    titulo_pagina.innerHTML = "Colmeias em estado de risco e atenção";
    mostrarVisaoGeral();
  } else {
    visao_geral.classList.add("hidden");
    visao_individual.classList.remove("hidden");
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
  tabela_alertas.innerHTML = "";

  let filtroAlertas = select_alertas.value;
  // o "Ver todas" da tabela leva para a página Colmeias com o mesmo filtro
  link_alertas.href = filtroAlertas == "todos" ? "colmeias.html" : "colmeias.html?filtro=" + filtroAlertas;

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

        // cada card mostra no máximo 3 colmeias; a tabela embaixo mostra todas
        if (ordem[o] == "Risco") {
          qtdRisco++;
          if (qtdRisco <= 3) lista_risco.innerHTML += linhaCard;
        } else {
          qtdAtencao++;
          if (qtdAtencao <= 3) lista_atencao.innerHTML += linhaCard;
        }

        // a tabela respeita o filtro "Mostrar" (todos, críticos ou atenção)
        if (filtroAlertas != "todos" && filtroAlertas != ordem[o]) continue;

        tabela_alertas.innerHTML += `<tr class="linha-clicavel" onclick="abrirColmeia(${i})">
            <td class="hive-name">${nomeColmeia(i)}</td>
            <td><span class="status-badge ${classeCss(situacoes[i])}">${situacoes[i]}</span></td>
            <td>${formatar(atual(tempInterna[i]))} °C</td>
            <td>${atual(umidInterna[i])}%</td>
            <td>${tempo}</td>
          </tr>`;
      }
    }
  }

  if (tabela_alertas.innerHTML == "") {
    tabela_alertas.innerHTML = `<tr><td colspan="5" class="sem-alertas">Nenhum alerta neste filtro.</td></tr>`;
  }

  qtd_risco.innerHTML = qtdRisco;
  qtd_atencao.innerHTML = qtdAtencao;
  qtd_total1.innerHTML = situacoes.length;
  qtd_total2.innerHTML = situacoes.length;
  qtd_total3.innerHTML = situacoes.length;
}

// ================== COLMEIA INDIVIDUAL ==================
function mostrarColmeia(i) {
  let temps = tempInterna[i];
  let umids = umidInterna[i];

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
  kpi_hora_umid_alta.innerHTML = horarios[maiorUmid];

  kpi_umid_baixa.innerHTML = umids[menorUmid] + "%";
  kpi_hora_umid_baixa.innerHTML = horarios[menorUmid];


  kpi_temp.innerHTML = formatar(atual(temps));
  kpi_temp_ideal.innerHTML = tempMin + " °C a " + tempMax + " °C";
  kpi_umid.innerHTML = atual(umids);
  kpi_umid_ideal.innerHTML = umidMin + "% a " + umidMax + "%";
  kpi_pico_alto.innerHTML = formatar(temps[maior]) + " °C";
  kpi_hora_alto.innerHTML = horarios[maior];
  kpi_pico_baixo.innerHTML = formatar(temps[menor]) + " °C";
  kpi_hora_baixo.innerHTML = horarios[menor];
  kpi_temp_ext.innerHTML = formatar(atual(tempExterna)) + " °C";
  kpi_umid_ext.innerHTML = atual(umidExterna) + "%";

  // posições das linhas: 0 colmeia, 1 externo, 2 e 3 ideal, 4 e 5 risco
  graficoTemperatura.data.datasets[0].data = temps;
  graficoTemperatura.data.datasets[1].data = tempExterna;
  graficoTemperatura.data.datasets[2].data = linhaReta(tempMin);
  graficoTemperatura.data.datasets[3].data = linhaReta(tempMax);
  graficoTemperatura.data.datasets[4].data = linhaReta(tempFrio);
  graficoTemperatura.data.datasets[5].data = linhaReta(tempCalor);
  graficoTemperatura.update();

  graficoUmidade.data.datasets[0].data = umids;
  graficoUmidade.data.datasets[1].data = umidExterna;
  graficoUmidade.data.datasets[2].data = linhaReta(umidMin);
  graficoUmidade.data.datasets[3].data = linhaReta(umidMax);
  graficoUmidade.data.datasets[4].data = linhaReta(umidRisco);
  graficoUmidade.update();
}

// vetor com o mesmo valor em todos os horários = uma linha reta no gráfico
function linhaReta(valor) {
  let vetor = [];
  for (let h = 0; h < horarios.length; h++) {
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


carregarConfiguracoes();
calcularSituacoes();
listarColmeias();
filtrarColmeias();

// vindo da página Colmeias (dashboard.html?colmeia=N): já abre a colmeia escolhida
let colmeiaDaUrl = new URLSearchParams(location.search).get("colmeia");
if (colmeiaDaUrl !== null && tempInterna[Number(colmeiaDaUrl)]) {
  abrirColmeia(Number(colmeiaDaUrl));
}
