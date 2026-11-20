let alertasApi = [];
let falhaAlertas = false;

function idEnderecoLogado() {
  return sessionStorage.getItem("ID_ENDERECO") || 1;
}

function buscarJson(url) {
  return fetch(url).then(function (resposta) {
    if (!resposta.ok) throw new Error("HTTP " + resposta.status);
    return resposta.json();
  });
}

function escaparHtml(texto) {
  return String(texto).replace(/[&<>"']/g, function (caractere) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[caractere];
  });
}

function nomeSituacao(situacao) {
  return situacao == "Atencao" ? "Atenção" : situacao;
}

function formatarInicioAlerta(inicioIso) {
  let data = new Date(inicioIso);
  let hora = data.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

  let hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  let diaDoAlerta = new Date(data);
  diaDoAlerta.setHours(0, 0, 0, 0);
  let diasAtras = Math.round((hoje - diaDoAlerta) / 86400000);

  if (diasAtras == 0) return "Hoje, " + hora;
  if (diasAtras == 1) return "Ontem, " + hora;
  return data.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" }) + ", " + hora;
}

function atualizarTotalColmeias() {
  buscarJson(`/dashgeral/total-colmeias/${idEnderecoLogado()}`)
    .then(function (dados) {
      qtd_total3.innerHTML = dados.total_colmeias_monitoradas;
    })
    .catch(function (erro) {
      console.log("Erro ao buscar total de colmeias:", erro);
      qtd_total3.innerHTML = "—";
    });
}

function atualizarAlertas() {
  buscarJson(`/dashgeral/alertas/${idEnderecoLogado()}`)
    .then(function (lista) {
      alertasApi = lista;
      falhaAlertas = false;
      mostrarVisaoGeral();
    })
    .catch(function (erro) {
      console.log("Erro ao buscar alertas:", erro);
      alertasApi = [];
      falhaAlertas = true;
      mostrarVisaoGeral();
    });
}

function linhaCardAlerta(alerta) {
  let leitura = formatar(alerta.temperatura) + " °C · " + alerta.umidade + "%";
  return `<button class="alert-row" onclick="abrirColmeia(${alerta.idcolmeia - 1})">
      <strong>${escaparHtml(alerta.codigo)}</strong><span>${leitura}</span><time>há ${formatarTempo(alerta.duracao_min)}</time>
    </button>`;
}

function mostrarVisaoGeral() {
  let semanaEmMinutos = 7 * 24 * 60;

  let atuais = alertasApi.filter(function (alerta) {
    return alerta.em_andamento == 1 && alerta.duracao_min > tempoMinimoAlerta && alerta.duracao_min <= semanaEmMinutos;
  });
  let emRisco = atuais.filter(function (alerta) {
    return alerta.situacao == "Risco";
  });
  let emAtencao = atuais.filter(function (alerta) {
    return alerta.situacao == "Atencao";
  });

  lista_risco.innerHTML = emRisco.slice(0, 3).map(linhaCardAlerta).join("");
  lista_atencao.innerHTML = emAtencao.slice(0, 3).map(linhaCardAlerta).join("");
  qtd_risco.innerHTML = emRisco.length;
  qtd_atencao.innerHTML = emAtencao.length;

  mostrarHistoricoAlertas();
}

function mostrarHistoricoAlertas() {
  let filtroAlertas = select_alertas.value;
  let diasPeriodo = { dia: 1, semana: 7, mes: 30, ano: 365 };
  let limiteDias = diasPeriodo[select_periodo.value];

  let inicioDoDia = new Date();
  inicioDoDia.setHours(0, 0, 0, 0);
  let corte = inicioDoDia.getTime() - (limiteDias - 1) * 86400000;

  let html = "";
  for (let a = 0; a < alertasApi.length; a++) {
    let alerta = alertasApi[a];
    let situacao = nomeSituacao(alerta.situacao);

    if (alerta.duracao_min <= tempoMinimoAlerta) continue;
    if (filtroAlertas != "todos" && filtroAlertas != situacao) continue;
    if (alerta.em_andamento != 1 && new Date(alerta.inicio).getTime() < corte) continue;

    html += `<tr class="linha-clicavel" onclick="abrirColmeia(${alerta.idcolmeia - 1})">
        <td class="hive-name">${escaparHtml(alerta.codigo)}</td>
        <td><span class="status-badge ${classeCss(situacao)}">${situacao}</span></td>
        <td>${formatarInicioAlerta(alerta.inicio)}</td>
        <td>${formatarTempo(alerta.duracao_min)}</td>
        <td>${formatar(alerta.temperatura)} °C</td>
        <td>${alerta.umidade}%</td>
      </tr>`;
  }

  if (falhaAlertas) {
    html = `<tr><td colspan="6" class="sem-alertas">Não foi possível carregar os alertas.</td></tr>`;
  } else if (html == "") {
    html = `<tr><td colspan="6" class="sem-alertas">Nenhum alerta neste filtro.</td></tr>`;
  }
  tabela_alertas.innerHTML = html;
}

function atualizarHoraLeitura() {
  buscarJson(`/dashgeral/ultima-leitura/${idEnderecoLogado()}`)
    .then(function (dados) {
      ultimaLeitura = dados.ultima_leitura ? new Date(dados.ultima_leitura) : null;
      atualizarUltimaLeitura();
    })
    .catch(function (erro) {
      console.log("Erro ao buscar a última leitura:", erro);
      ultimaLeitura = null;
      atualizarUltimaLeitura();
    });
}

let colmeiasApi = [];
let falhaColmeias = false;

function atualizarColmeias() {
  buscarJson(`/dashgeral/colmeias/${idEnderecoLogado()}`)
    .then(function (lista) {
      colmeiasApi = lista;
      falhaColmeias = false;
      listarColmeias();
    })
    .catch(function (erro) {
      console.log("Erro ao buscar colmeias:", erro);
      colmeiasApi = [];
      falhaColmeias = true;
      listarColmeias();
    });
}

function valorOuTraco(valor, sufixo) {
  return valor == null ? "—" : valor + sufixo;
}

function listarColmeias() {
  let filtro = select_status.value;
  let html = "";

  for (let c = 0; c < colmeiasApi.length; c++) {
    let colmeia = colmeiasApi[c];
    let situacao = nomeSituacao(colmeia.situacao);

    if (filtro != "todas" && filtro != situacao) continue;

    html += `<tr class="linha-clicavel" onclick="abrirColmeia(${colmeia.idcolmeia - 1})">
        <td class="hive-name">${escaparHtml(colmeia.codigo)}</td>
        <td>${colmeia.temp_interna == null ? "—" : formatar(colmeia.temp_interna) + " °C"}</td>
        <td>${colmeia.temp_externa == null ? "—" : formatar(colmeia.temp_externa) + " °C"}</td>
        <td>${valorOuTraco(colmeia.umid_interna, "%")}</td>
        <td>${valorOuTraco(colmeia.umid_externa, "%")}</td>
        <td><span class="status-badge ${classeCss(situacao)}">${situacao}</span></td>
      </tr>`;
  }

  if (falhaColmeias) {
    html = `<tr><td colspan="6" class="sem-alertas">Não foi possível carregar as colmeias.</td></tr>`;
  } else if (html == "") {
    html = `<tr><td colspan="6" class="sem-alertas">Nenhuma colmeia neste filtro.</td></tr>`;
  }
  tabela_colmeias.innerHTML = html;
}

function atualizarPainel() {
  atualizarTotalColmeias();
  atualizarAlertas();
  atualizarHoraLeitura();
  atualizarColmeias();
}

mostrarVisaoGeral();
listarColmeias();
atualizarPainel();
setInterval(atualizarPainel, 30000);
