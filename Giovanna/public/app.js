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
// há quantos minutos cada colmeia está em alerta (0 = sem alerta)
let minutosEmAlerta = [0, 100, 25, 135, 0, 90, 0, 65, 0, 0];

// situação de cada colmeia: "Ideal", "Atenção" ou "Risco"
let situacoes = [];

// ================== FUNÇÕES DE APOIO ==================
function nomeColmeia(i) {
  if (i + 1 < 10) return "Colmeia 0" + (i + 1);
  return "Colmeia " + (i + 1);
}

// 34.5 -> "34,5"
function formatar(numero) {
  return numero.toFixed(1).replace(".", ",");
}

// 100 -> "1h40" | 25 -> "25 min"
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

    if (temp < tempFrio || temp > tempCalor || (umid >= umidRisco && temp < tempFrio)) {
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
  dashboard.classList.add("hidden");
  colmeias.classList.add("hidden");
  configuracoes.classList.add("hidden");
  nav_dashboard.classList.remove("active");
  nav_colmeias.classList.remove("active");
  nav_configuracoes.classList.remove("active");

  document.getElementById(pagina).classList.remove("hidden");
  document.getElementById("nav_" + pagina).classList.add("active");

  if (pagina == "dashboard") {
    area_select.classList.remove("hidden");
    mostrarDashboard();
  } else {
    area_select.classList.add("hidden");
    badge_situacao.classList.add("hidden");
    btn_voltar.classList.add("hidden");
    document.body.classList.remove("sem-rolagem");
    if (pagina == "colmeias") titulo_pagina.innerHTML = "Colmeias";
    if (pagina == "configuracoes") titulo_pagina.innerHTML = "Configurações";
  }
}

function verColmeias(filtro) {
  select_status.value = filtro;
  listarColmeias();
  mostrarPagina("colmeias");
}

// monta o select de colmeias só com as colmeias da situação escolhida
function filtrarColmeias() {
  let filtro = select_situacao.value;
  select_colmeia.innerHTML = '<option value="todas">Todas</option>';

  for (let i = 0; i < situacoes.length; i++) {
    if (filtro == "todas" || situacoes[i] == filtro) {
      select_colmeia.innerHTML += `<option value="${i}">${nomeColmeia(i)}</option>`;
    }
  }
  mostrarDashboard();
}

function abrirColmeia(i) {
  select_situacao.value = "todas";
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
    titulo_pagina.innerHTML = "Visão geral";
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

  qtd_risco.innerHTML = qtdRisco;
  qtd_atencao.innerHTML = qtdAtencao;
  qtd_total1.innerHTML = situacoes.length;
  qtd_total2.innerHTML = situacoes.length;
  qtd_total3.innerHTML = situacoes.length;

  // conta quantas colmeias estão em cada faixa (para os dois gráficos)
  let faixasTemp = [0, 0, 0, 0, 0]; // muito quente, quente, ideal, fria, muito fria
  let faixasUmid = [0, 0, 0]; // úmida, ideal, seca
  for (let i = 0; i < tempInterna.length; i++) {
    let temp = atual(tempInterna[i]);
    let umid = atual(umidInterna[i]);

    if (temp > tempCalor) faixasTemp[0]++;
    else if (temp > tempMax) faixasTemp[1]++;
    else if (temp >= tempMin) faixasTemp[2]++;
    else if (temp >= tempFrio) faixasTemp[3]++;
    else faixasTemp[4]++;

    if (umid > umidMax) faixasUmid[0]++;
    else if (umid >= umidMin) faixasUmid[1]++;
    else faixasUmid[2]++;
  }

  graficoBarras.data.datasets[0].data = faixasTemp;
  graficoBarras.update();
  graficoRosca.data.datasets[0].data = faixasUmid;
  graficoRosca.update();
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

  kpi_temp.innerHTML = formatar(atual(temps));
  kpi_temp_ideal.innerHTML = tempMin + " a " + tempMax;
  kpi_umid.innerHTML = atual(umids);
  kpi_umid_ideal.innerHTML = umidMin + " a " + umidMax;
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
Chart.defaults.font.family = "Poppins";
Chart.defaults.color = "#857a70";

let corVerde = "#2f8045";
let corAmarela = "#e0ad17";
let corVermelha = "#cf3329";
let corColmeia = "#f08c00"; // laranja mel: sensor da colmeia
let corExterno = "#495057"; // cinza escuro: sensor externo (ambiente)

// molde dos dois gráficos de linha (temperatura e umidade)
// a escala do eixo Y é fixa (minimo e maximo) para o gráfico não mudar de forma entre uma colmeia e outra
function criarGraficoLinha(idCanvas, minimo, maximo) {
  return new Chart(document.getElementById(idCanvas), {
    type: "line",
    data: {
      labels: horarios,
      datasets: [
        { label: "Colmeia", data: [], borderColor: corColmeia, backgroundColor: corColmeia, borderWidth: 3, tension: 0.2 },
        { label: "Externo", data: [], borderColor: corExterno, backgroundColor: corExterno, borderWidth: 3, tension: 0.2 },
        { label: "Ideal", data: [], borderColor: corVerde, borderDash: [5, 4], borderWidth: 1.5, pointRadius: 0 },
        { label: "", data: [], borderColor: corVerde, borderDash: [5, 4], borderWidth: 1.5, pointRadius: 0 },
        { label: "Risco", data: [], borderColor: corVermelha, borderDash: [5, 4], borderWidth: 1.5, pointRadius: 0 },
        { label: "", data: [], borderColor: corVermelha, borderDash: [5, 4], borderWidth: 1.5, pointRadius: 0 },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          align: "start",
          labels: {
            boxWidth: 18,
            boxHeight: 3,
            font: { family: "Poppins", size: 11 },
            // linhas sem nome (o segundo limite de cada par) não aparecem na legenda
            filter: function (item) {
              return item.text != "";
            },
          },
        },
      },
      scales: {
        x: { grid: { display: false } },
        y: { min: minimo, max: maximo },
      },
    },
  });
}

let graficoTemperatura = criarGraficoLinha("graficoTemperatura", 26, 42);
let graficoUmidade = criarGraficoLinha("graficoUmidade", 40, 90);

let graficoBarras = new Chart(document.getElementById("graficoBarras"), {
  type: "bar",
  data: {
    labels: ["Muito quente", "Quente", "Ideal", "Fria", "Muito fria"],
    datasets: [{ data: [], backgroundColor: [corVermelha, corAmarela, corVerde, "#b9c7b7", corVermelha], maxBarThickness: 50 }],
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { display: false } },
      y: { beginAtZero: true, ticks: { stepSize: 1 } },
    },
  },
});

let graficoRosca = new Chart(document.getElementById("graficoRosca"), {
  type: "doughnut",
  data: {
    labels: ["Úmida", "Ideal", "Seca"],
    datasets: [{ data: [], backgroundColor: [corAmarela, corVerde, corVermelha] }],
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "65%",
    plugins: { legend: { position: "right", labels: { usePointStyle: true, font: { family: "Poppins", size: 12 } } } },
  },
});

// ================== INÍCIO ==================
calcularSituacoes();
listarColmeias();
filtrarColmeias();
