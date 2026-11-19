let tempMin = 33;
let tempMax = 36;
let tempFrio = 32;
let tempCalor = 38;
let umidMin = 50;
let umidMax = 75;
let umidRisco = 85;
let umidSeca = 40;

let idEndereco = sessionStorage.ID_ENDERECO;

if (idEndereco == undefined) {
  idEndereco = 1;
}

let colmeias = [];
let leiturasInternas = [];
let leiturasExternas = [];
let situacoes = [];
let minutosEmAlerta = [];
let historicoAlertas = [];
let ultimaLeitura = null;
let primeiraVez = true;

let tempoMinimoAlerta = 60;

function dataDoDia(d) {
  let data = new Date();
  data.setHours(0, 0, 0, 0);
  data.setDate(data.getDate() - d);
  return data;
}

function diasAtras(data) {
  let meiaNoite = new Date(data);
  meiaNoite.setHours(0, 0, 0, 0);
  return Math.round((dataDoDia(0) - meiaNoite) / 86400000);
}

function formatarHora(data) {
  let hora = data.getHours();
  let minuto = data.getMinutes();

  if (hora < 10) {
    hora = `0${hora}`;
  }
  if (minuto < 10) {
    minuto = `0${minuto}`;
  }

  return `${hora}:${minuto}`;
}

function formatarDiaMes(data) {
  let dia = data.getDate();
  let mes = data.getMonth() + 1;

  if (dia < 10) {
    dia = `0${dia}`;
  }
  if (mes < 10) {
    mes = `0${mes}`;
  }

  return `${dia}/${mes}`;
}

function formatar(numero) {
  if (numero == null) {
    return "--";
  }
  return numero.toFixed(1).replace(".", ",");
}

function formatarUmid(numero) {
  if (numero == null) {
    return "--";
  }
  return Math.round(numero);
}

function formatarTempo(minutos) {
  if (minutos >= 24 * 60) {
    let dias = Math.floor(minutos / (24 * 60));
    if (dias == 1) {
      return "1 dia";
    }
    return dias + " dias";
  }

  let horas = Math.floor(minutos / 60);
  let resto = minutos % 60;

  if (horas == 0) {
    return resto + " min";
  }
  if (resto < 10) {
    return horas + "h0" + resto;
  }
  return horas + "h" + resto;
}

function preencherSelectDia() {
  let nomes = ["dom.", "seg.", "ter.", "qua.", "qui.", "sex.", "sáb."];
  let html = "";

  for (let d = 0; d < 7; d++) {
    let nome = "";

    if (d == 0) {
      nome = "Hoje";
    } else if (d == 1) {
      nome = "Ontem";
    } else {
      let data = dataDoDia(d);
      nome = nomes[data.getDay()] + " " + formatarDiaMes(data);
    }

    html += `<option value="${d}">${nome}</option>`;
  }

  select_dia.innerHTML = html;
}

function nomeColmeia(i) {
  return colmeias[i].codigo;
}

function tempAtual(i) {
  let leituras = leiturasInternas[i];
  if (leituras.length == 0) {
    return null;
  }
  return leituras[leituras.length - 1].temp;
}

function umidAtual(i) {
  let leituras = leiturasInternas[i];
  if (leituras.length == 0) {
    return null;
  }
  return leituras[leituras.length - 1].umid;
}

function classeCss(situacao) {
  if (situacao == "Risco") {
    return "risco";
  } else if (situacao == "Atenção") {
    return "atencao";
  } else {
    return "estavel";
  }
}

function classificar(temp, umid) {
  if (temp == null || umid == null) {
    return "Sem leitura";
  } else if (temp < tempFrio || temp > tempCalor || umid >= umidRisco || umid < umidSeca) {
    return "Risco";
  } else if (temp < tempMin || temp > tempMax || umid < umidMin || umid > umidMax) {
    return "Atenção";
  } else {
    return "Ideal";
  }
}

function fecharAlerta(alerta, fim, emAndamento) {
  if (alerta == null) {
    return;
  }

  alerta.duracao = Math.round((fim - alerta.inicio) / 60000);

  if (alerta.duracao <= tempoMinimoAlerta) {
    return;
  }

  alerta.emAndamento = emAndamento;
  alerta.diasAtras = diasAtras(alerta.inicio);

  if (emAndamento) {
    alerta.situacao = alerta.ultimaSituacao;
    alerta.temp = alerta.ultimaTemp;
    alerta.umid = alerta.ultimaUmid;
  }

  historicoAlertas.push(alerta);
}

function calcularHistoricoAlertas() {
  historicoAlertas = [];
  let agora = new Date();

  for (let i = 0; i < leiturasInternas.length; i++) {
    let leituras = leiturasInternas[i];
    let aberto = null;

    for (let p = 0; p < leituras.length; p++) {
      let leitura = leituras[p];
      let situacao = classificar(leitura.temp, leitura.umid);

      if (situacao == "Ideal") {
        fecharAlerta(aberto, leitura.data, false);
        aberto = null;
      } else {
        if (aberto == null) {
          aberto = {
            colmeia: i,
            inicio: leitura.data,
            situacao: situacao,
            temp: leitura.temp,
            umid: leitura.umid,
            emAndamento: false
          };
        }

        aberto.ultimaSituacao = situacao;
        aberto.ultimaTemp = leitura.temp;
        aberto.ultimaUmid = leitura.umid;

        if (situacao == "Risco" && aberto.situacao != "Risco") {
          aberto.situacao = "Risco";
          aberto.temp = leitura.temp;
          aberto.umid = leitura.umid;
        }
      }
    }

    fecharAlerta(aberto, agora, true);
  }

  historicoAlertas.sort(function (a, b) {
    return b.inicio - a.inicio;
  });

  minutosEmAlerta = [];
  for (let i = 0; i < colmeias.length; i++) {
    minutosEmAlerta.push(0);
  }

  for (let a = 0; a < historicoAlertas.length; a++) {
    if (historicoAlertas[a].emAndamento) {
      minutosEmAlerta[historicoAlertas[a].colmeia] = historicoAlertas[a].duracao;
    }
  }
}

function calcularSituacoes() {
  situacoes = [];

  for (let i = 0; i < colmeias.length; i++) {
    situacoes.push(classificar(tempAtual(i), umidAtual(i)));
  }

  calcularHistoricoAlertas();
}

function filtrarColmeias() {
  let selecaoAnterior = select_colmeia.value;
  let html = `<option value="todas">Todas as colmeias</option>`;
  let grupos = ["Risco", "Atenção", "Ideal", "Sem leitura"];
  let titulos = ["Em risco", "Em atenção", "Ideal", "Sem leitura"];

  for (let g = 0; g < grupos.length; g++) {
    let opcoes = "";

    for (let i = 0; i < situacoes.length; i++) {
      if (situacoes[i] == grupos[g]) {
        opcoes += `<option value="${i}">${nomeColmeia(i)}</option>`;
      }
    }

    if (opcoes != "") {
      html += `<optgroup label="${titulos[g]}">${opcoes}</optgroup>`;
    }
  }

  select_colmeia.innerHTML = html;
  select_colmeia.value = selecaoAnterior;

  if (select_colmeia.value == "") {
    select_colmeia.value = "todas";
  }

  mostrarDashboard();
}

function abrirColmeia(i) {
  select_colmeia.value = i;
  mostrarDashboard();
}

function voltarVisaoGeral() {
  select_colmeia.value = "todas";
  mostrarDashboard();
}

function mostrarDashboard() {
  if (select_colmeia.value == "todas") {
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
    mostrarColmeia(Number(select_colmeia.value));
  }
}

function mostrarVisaoGeral() {
  let qtdRisco = 0;
  let qtdAtencao = 0;
  let agora = new Date();

  lista_risco.innerHTML = "";
  lista_atencao.innerHTML = "";

  for (let i = 0; i < situacoes.length; i++) {
    if (situacoes[i] == "Risco" || situacoes[i] == "Atenção") {
      // volta nas leituras ate achar a ultima vez que a colmeia estava ideal
      let leituras = leiturasInternas[i];
      let inicio = agora;

      for (let p = leituras.length - 1; p >= 0; p--) {
        if (classificar(leituras[p].temp, leituras[p].umid) == "Ideal") {
          break;
        }
        inicio = leituras[p].data;
      }

      let minutos = Math.round((agora - inicio) / 60000);

      let linha = `
        <button class="alert-row" onclick="abrirColmeia(${i})">
          <strong>${nomeColmeia(i)}</strong>
          <span>${formatar(tempAtual(i))} °C · ${formatarUmid(umidAtual(i))}%</span>
          <time>há ${formatarTempo(minutos)}</time>
        </button>`;

      if (situacoes[i] == "Risco") {
        qtdRisco++;
        if (qtdRisco <= 3) {
          lista_risco.innerHTML += linha;
        }
      } else {
        qtdAtencao++;
        if (qtdAtencao <= 3) {
          lista_atencao.innerHTML += linha;
        }
      }
    }
  }

  if (qtdRisco == 0) {
    lista_risco.innerHTML = `<p class="alert-row-vazia">Nenhuma colmeia em risco.</p>`;
  }
  if (qtdAtencao == 0) {
    lista_atencao.innerHTML = `<p class="alert-row-vazia">Nenhuma colmeia em atenção.</p>`;
  }

  qtd_risco.innerHTML = qtdRisco;
  qtd_atencao.innerHTML = qtdAtencao;
  qtd_total3.innerHTML = colmeias.length;

  mostrarHistoricoAlertas();
}

function mostrarHistoricoAlertas() {
  let filtro = select_alertas.value;
  let limiteDias = 1;

  if (select_periodo.value == "semana") {
    limiteDias = 7;
  } else if (select_periodo.value == "mes") {
    limiteDias = 30;
  } else if (select_periodo.value == "ano") {
    limiteDias = 365;
  }

  let html = "";

  for (let a = 0; a < historicoAlertas.length; a++) {
    let alerta = historicoAlertas[a];

    if (filtro != "todos" && filtro != alerta.situacao) {
      continue;
    }
    if (alerta.emAndamento == false && alerta.diasAtras >= limiteDias) {
      continue;
    }

    let inicio = formatarDiaMes(alerta.inicio) + ", " + formatarHora(alerta.inicio);
    if (alerta.diasAtras == 0) {
      inicio = "Hoje, " + formatarHora(alerta.inicio);
    } else if (alerta.diasAtras == 1) {
      inicio = "Ontem, " + formatarHora(alerta.inicio);
    }

    html += `
      <tr class="linha-clicavel" onclick="abrirColmeia(${alerta.colmeia})">
        <td class="hive-name">${nomeColmeia(alerta.colmeia)}</td>
        <td><span class="status-badge ${classeCss(alerta.situacao)}">${alerta.situacao}</span></td>
        <td>${inicio}</td>
        <td>${formatarTempo(alerta.duracao)}</td>
        <td>${formatar(alerta.temp)} °C</td>
        <td>${formatarUmid(alerta.umid)}%</td>
      </tr>`;
  }

  if (html == "") {
    html = `<tr><td colspan="6" class="sem-alertas">Nenhum alerta neste filtro.</td></tr>`;
  }

  tabela_alertas.innerHTML = html;
}

function externaMaisProxima(externas, data) {
  let maisProxima = null;

  for (let p = 0; p < externas.length; p++) {
    if (maisProxima == null || Math.abs(externas[p].data - data) < Math.abs(maisProxima.data - data)) {
      maisProxima = externas[p];
    }
  }

  if (maisProxima != null && Math.abs(maisProxima.data - data) > 60 * 60000) {
    maisProxima = null;
  }

  return maisProxima;
}

function linhaReta(valor, quantidade) {
  let vetor = [];
  for (let i = 0; i < quantidade; i++) {
    vetor.push(valor);
  }
  return vetor;
}

function mostrarColmeia(i) {
  let d = Number(select_dia.value);
  let horarios = [];
  let temps = [];
  let umids = [];
  let tempsExt = [];
  let umidsExt = [];
  let externasDoDia = [];

  for (let p = 0; p < leiturasExternas.length; p++) {
    if (diasAtras(leiturasExternas[p].data) == d) {
      externasDoDia.push(leiturasExternas[p]);
    }
  }

  for (let p = 0; p < leiturasInternas[i].length; p++) {
    let leitura = leiturasInternas[i][p];

    if (diasAtras(leitura.data) == d) {
      horarios.push(formatarHora(leitura.data));
      temps.push(leitura.temp);
      umids.push(leitura.umid);

      let externa = externaMaisProxima(externasDoDia, leitura.data);
      if (externa == null) {
        tempsExt.push(null);
        umidsExt.push(null);
      } else {
        tempsExt.push(externa.temp);
        umidsExt.push(externa.umid);
      }
    }
  }

  titulo_pagina.innerHTML = nomeColmeia(i);
  badge_situacao.innerHTML = situacoes[i];
  badge_situacao.className = "status-badge " + classeCss(situacoes[i]);

  kpi_temp.innerHTML = formatar(tempAtual(i));
  kpi_temp_ideal.innerHTML = tempMin + " °C a " + tempMax + " °C";
  kpi_umid.innerHTML = formatarUmid(umidAtual(i));
  kpi_umid_ideal.innerHTML = umidMin + "% a " + umidMax + "%";

  if (leiturasExternas.length > 0) {
    let externaAtual = leiturasExternas[leiturasExternas.length - 1];
    kpi_temp_ext.innerHTML = formatar(externaAtual.temp) + " °C";
    kpi_umid_ext.innerHTML = formatarUmid(externaAtual.umid) + "%";
  } else {
    kpi_temp_ext.innerHTML = "--";
    kpi_umid_ext.innerHTML = "--";
  }

  if (temps.length == 0) {
    kpi_pico_alto.innerHTML = "--";
    kpi_hora_alto.innerHTML = "--";
    kpi_pico_baixo.innerHTML = "--";
    kpi_hora_baixo.innerHTML = "--";
    kpi_umid_alta.innerHTML = "--";
    kpi_hora_umid_alta.innerHTML = "--";
    kpi_umid_baixa.innerHTML = "--";
    kpi_hora_umid_baixa.innerHTML = "--";
  } else {
    let maior = 0;
    let menor = 0;
    let maiorUmid = 0;
    let menorUmid = 0;

    for (let p = 1; p < temps.length; p++) {
      if (temps[p] > temps[maior]) {
        maior = p;
      }
      if (temps[p] < temps[menor]) {
        menor = p;
      }
      if (umids[p] > umids[maiorUmid]) {
        maiorUmid = p;
      }
      if (umids[p] < umids[menorUmid]) {
        menorUmid = p;
      }
    }

    kpi_pico_alto.innerHTML = formatar(temps[maior]) + " °C";
    kpi_hora_alto.innerHTML = horarios[maior];
    kpi_pico_baixo.innerHTML = formatar(temps[menor]) + " °C";
    kpi_hora_baixo.innerHTML = horarios[menor];
    kpi_umid_alta.innerHTML = formatarUmid(umids[maiorUmid]) + "%";
    kpi_hora_umid_alta.innerHTML = horarios[maiorUmid];
    kpi_umid_baixa.innerHTML = formatarUmid(umids[menorUmid]) + "%";
    kpi_hora_umid_baixa.innerHTML = horarios[menorUmid];
  }

  graficoTemperatura.data.labels = horarios;
  graficoTemperatura.data.datasets[0].data = temps;
  graficoTemperatura.data.datasets[1].data = tempsExt;
  graficoTemperatura.data.datasets[2].data = linhaReta(tempMin, horarios.length);
  graficoTemperatura.data.datasets[3].data = linhaReta(tempMax, horarios.length);
  graficoTemperatura.data.datasets[4].data = linhaReta(tempFrio, horarios.length);
  graficoTemperatura.data.datasets[5].data = linhaReta(tempCalor, horarios.length);
  graficoTemperatura.update();

  graficoUmidade.data.labels = horarios;
  graficoUmidade.data.datasets[0].data = umids;
  graficoUmidade.data.datasets[1].data = umidsExt;
  graficoUmidade.data.datasets[2].data = linhaReta(umidMin, horarios.length);
  graficoUmidade.data.datasets[3].data = linhaReta(umidMax, horarios.length);
  graficoUmidade.data.datasets[4].data = linhaReta(umidSeca, horarios.length);
  graficoUmidade.data.datasets[5].data = linhaReta(umidRisco, horarios.length);
  graficoUmidade.update();
}

function criarGrafico(canvas, minimo, maximo, unidade) {
  return new Chart(canvas, {
    type: "line",
    data: {
      labels: [],
      datasets: [
        {
          label: "Interna",
          data: [],
          borderColor: "#f08c00",
          backgroundColor: "#ffffff",
          borderWidth: 2.5,
          tension: 0.35,
          fill: false,
          pointRadius: 3,
          pointBackgroundColor: "#ffffff",
          pointBorderColor: "#f08c00",
          pointBorderWidth: 2
        },
        {
          label: "Externa",
          data: [],
          borderColor: "#495057",
          backgroundColor: "#ffffff",
          borderWidth: 2,
          tension: 0.35,
          fill: false,
          spanGaps: true,
          pointRadius: 2.5,
          pointBackgroundColor: "#ffffff",
          pointBorderColor: "#495057",
          pointBorderWidth: 1.5
        },
        {
          label: "Ideal",
          data: [],
          borderColor: "#2f8045",
          borderWidth: 1,
          pointRadius: 0,
          fill: false
        },
        {
          label: "",
          data: [],
          borderColor: "#2f8045",
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
          borderColor: "#cf3329",
          borderDash: [4, 4],
          borderWidth: 1,
          pointRadius: 0,
          fill: false
        },
        {
          label: "",
          data: [],
          borderColor: "#cf3329",
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
          labels: {
            boxWidth: 20,
            boxHeight: 8,
            padding: 10,
            color: "#716b63",
            font: { family: "Inter", size: 10 },
            filter: function (item) {
              return item.text != "";
            }
          }
        },
        tooltip: {
          backgroundColor: "#2b1e17",
          padding: 10,
          cornerRadius: 6
        }
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: {
            color: "#716b63",
            font: { family: "Inter", size: 11 }
          }
        },
        y: {
          min: minimo,
          max: maximo,
          grid: { color: "#f0e8dd" },
          ticks: {
            color: "#716b63",
            font: { family: "Inter", size: 11 },
            callback: function (valor) {
              return valor + unidade;
            }
          }
        }
      }
    }
  });
}

Chart.defaults.font.family = "Inter";
Chart.defaults.color = "#857a70";

let graficoTemperatura = criarGrafico(document.getElementById("graficoTemperatura"), 26, 42, " °C");
let graficoUmidade = criarGrafico(document.getElementById("graficoUmidade"), 40, 90, "%");

function atualizarUltimaLeitura() {
  if (ultimaLeitura == null) {
    hora_leitura.innerHTML = "--:--";
    ultima_leitura.className = "ultima-leitura offline";
    return;
  }

  let minutos = Math.floor((new Date() - ultimaLeitura) / 60000);
  hora_leitura.innerHTML = formatarHora(ultimaLeitura);

  if (minutos <= 12) {
    ultima_leitura.className = "ultima-leitura";
  } else if (minutos <= 30) {
    ultima_leitura.className = "ultima-leitura atrasado";
  } else {
    ultima_leitura.className = "ultima-leitura offline";
  }
}

function guardarLeituras(listaColmeias, listaLeituras) {
  colmeias = listaColmeias;
  leiturasInternas = [];
  leiturasExternas = [];
  ultimaLeitura = null;

  for (let i = 0; i < colmeias.length; i++) {
    leiturasInternas.push([]);
  }

  for (let p = 0; p < listaLeituras.length; p++) {
    let linha = listaLeituras[p];

    if (linha.temperatura == null || linha.umidade == null) {
      continue;
    }

    let leitura = {
      data: new Date(linha.dt_hora),
      temp: Number(linha.temperatura),
      umid: Number(linha.umidade)
    };

    if (linha.tiposensor == "externo") {
      leiturasExternas.push(leitura);
    } else {
      for (let i = 0; i < colmeias.length; i++) {
        if (colmeias[i].idcolmeia == linha.idcolmeia) {
          leiturasInternas[i].push(leitura);
        }
      }
    }

    if (ultimaLeitura == null || leitura.data > ultimaLeitura) {
      ultimaLeitura = leitura.data;
    }
  }
}

function mostrarErro() {
  tabela_alertas.innerHTML = `<tr><td colspan="6" class="sem-alertas">Não foi possível carregar os dados. Verifique se o servidor está rodando.</td></tr>`;
}

function buscarConfig() {
  fetch(`/dashboard/config/${idEndereco}`)
    .then(function (resposta) {
      if (resposta.status == 200) {
        resposta.json().then(function (config) {
          tempMin = Number(config.temp_min_ideal);
          tempMax = Number(config.temp_max_ideal);
          tempFrio = Number(config.temp_alerta_frio);
          tempCalor = Number(config.temp_alerta_calor);
          umidMin = Number(config.umid_min_ideal);
          umidMax = Number(config.umid_max_ideal);
          umidSeca = Number(config.umid_alerta_seco);
          umidRisco = Number(config.umid_alerta_excessiva);
          buscarColmeias();
        });
      } else {
        buscarColmeias();
      }
    })
    .catch(function (erro) {
      console.log(erro);
      mostrarErro();
    });
}

function buscarColmeias() {
  fetch(`/dashboard/listarColmeias/${idEndereco}`)
    .then(function (resposta) {
      if (resposta.ok) {
        resposta.json().then(function (listaColmeias) {
          buscarLeituras(listaColmeias);
        });
      } else {
        mostrarErro();
      }
    })
    .catch(function (erro) {
      console.log(erro);
      mostrarErro();
    });
}

function buscarLeituras(listaColmeias) {
  fetch(`/dashboard/leituras/${idEndereco}`)
    .then(function (resposta) {
      if (resposta.ok) {
        resposta.json().then(function (listaLeituras) {
          guardarLeituras(listaColmeias, listaLeituras);
          calcularSituacoes();
          filtrarColmeias();
          atualizarUltimaLeitura();

          if (primeiraVez) {
            primeiraVez = false;
            let colmeiaDaUrl = new URLSearchParams(location.search).get("colmeia");

            if (colmeiaDaUrl != null && colmeias[Number(colmeiaDaUrl)] != undefined) {
              abrirColmeia(Number(colmeiaDaUrl));
            }
          }
        });
      } else {
        mostrarErro();
      }
    })
    .catch(function (erro) {
      console.log(erro);
      mostrarErro();
    });
}

preencherSelectDia();
buscarConfig();
setInterval(buscarConfig, 60000);
setInterval(atualizarUltimaLeitura, 30000);
