let idApiario = sessionStorage.ID_ENDERECO;

if (idApiario == undefined) {
  idApiario = 1;
}

let coletas = [];
let graficoMel = null;

function formatarKg(numero) {
  return numero.toFixed(1).replace(".", ",");
}

function carregarColetas() {
  fetch(`/coletaMel/listar/${idApiario}`)
    .then(function (resposta) {
      if (resposta.ok) {
        resposta.json().then(function (dados) {
          coletas = dados;
          mostrarHistorico();
          mostrarGrafico();
        });
      } else {
        tabela_coletas_corpo.innerHTML = `<tr><td colspan="4" class="sem-alertas">Não foi possível carregar as coletas.</td></tr>`;
      }
    })
    .catch(function (erro) {
      console.log(erro);
      tabela_coletas_corpo.innerHTML = `<tr><td colspan="4" class="sem-alertas">Não foi possível carregar as coletas. Verifique se o servidor está rodando.</td></tr>`;
    });
}

function mostrarHistorico() {
  let qtd = coletas.length;

  if (qtd == 0) {
    tabela_coletas_corpo.innerHTML = `<tr><td colspan="4" class="sem-alertas">Nenhuma coleta registrada ainda. Clique em "Adicionar coleta".</td></tr>`;
    return;
  }

  let linhas = "";

  for (let i = 0; i < qtd; i++) {
    let coleta = coletas[i];
    let badge = `<span class="honey-badge neutro">● Coleta inicial</span>`;

    if (i > 0) {
      let anterior = coletas[i - 1];
      let diferenca = coleta.quantidade - anterior.quantidade;
      let porcentagem = (diferenca / anterior.quantidade) * 100;

      if (diferenca >= 0) {
        badge = `<span class="honey-badge subiu"><span>▲</span><strong>+${formatarKg(porcentagem)}%</strong><small>(+${formatarKg(diferenca)} kg)</small></span>`;
      } else {
        badge = `<span class="honey-badge caiu"><span>▼</span><strong>${formatarKg(porcentagem)}%</strong><small>(${formatarKg(diferenca)} kg)</small></span>`;
      }
    }

    linhas = `
      <tr>
        <td><strong>#${i + 1}</strong></td>
        <td><strong>${coleta.data}</strong></td>
        <td><span class="qtd-coleta">${formatarKg(coleta.quantidade)} kg</span></td>
        <td>${badge}</td>
      </tr>
    ` + linhas;
  }

  tabela_coletas_corpo.innerHTML = linhas;

  let ultima = coletas[qtd - 1];
  resumo_ultima_qtd.innerHTML = `${formatarKg(ultima.quantidade)} <small>kg</small>`;
  resumo_ultima_data.innerHTML = `Realizada em ${ultima.data}`;

  if (qtd >= 2) {
    let penultima = coletas[qtd - 2];
    let diferenca = ultima.quantidade - penultima.quantidade;
    let porcentagem = (diferenca / penultima.quantidade) * 100;

    if (diferenca >= 0) {
      resumo_badge_crescimento.className = "honey-badge subiu";
      resumo_badge_crescimento.innerHTML = `<span>▲</span><strong>+${formatarKg(porcentagem)}%</strong>`;
      resumo_diff_kg.style.color = "var(--green)";
      resumo_diff_kg.innerHTML = `+${formatarKg(diferenca)} <small>kg</small>`;
    } else {
      resumo_badge_crescimento.className = "honey-badge caiu";
      resumo_badge_crescimento.innerHTML = `<span>▼</span><strong>${formatarKg(porcentagem)}%</strong>`;
      resumo_diff_kg.style.color = "var(--red)";
      resumo_diff_kg.innerHTML = `${formatarKg(diferenca)} <small>kg</small>`;
    }
  } else {
    resumo_badge_crescimento.className = "honey-badge neutro";
    resumo_badge_crescimento.innerHTML = "● Primeira coleta";
    resumo_diff_kg.style.color = "var(--muted)";
    resumo_diff_kg.innerHTML = `— <small>kg</small>`;
  }

  let ano = ultima.ano;
  let totalSafra = 0;
  let qtdExtracoes = 0;

  for (let i = 0; i < qtd; i++) {
    if (coletas[i].ano == ano) {
      totalSafra += coletas[i].quantidade;
      qtdExtracoes++;
    }
  }

  badge_safra.innerHTML = `Safra ativa - ${ano}`;
  resumo_titulo_safra.innerHTML = `Total da Safra ${ano}`;
  resumo_total_safra.innerHTML = `${formatarKg(totalSafra)} <small>kg</small>`;

  if (qtdExtracoes == 1) {
    resumo_qtd_extracoes.innerHTML = "1 extração registrada";
  } else {
    resumo_qtd_extracoes.innerHTML = `${qtdExtracoes} extrações registradas`;
  }

  resumo_media_coleta.innerHTML = `${formatarKg(totalSafra / qtdExtracoes)} <small>kg</small>`;
}

function mostrarGrafico() {
  let datas = [];
  let valores = [];

  for (let i = 0; i < coletas.length; i++) {
    datas.push(coletas[i].data.slice(0, 5));
    valores.push(coletas[i].quantidade);
  }

  if (graficoMel != null) {
    graficoMel.data.labels = datas;
    graficoMel.data.datasets[0].data = valores;
    graficoMel.update();
    return;
  }

  graficoMel = new Chart(graficoMelHistorico, {
    type: "line",
    data: {
      labels: datas,
      datasets: [
        {
          label: "Volume Colhido (kg)",
          data: valores,
          borderColor: "#a87900",
          backgroundColor: "rgba(223, 173, 22, 0.25)",
          borderWidth: 3,
          fill: true,
          tension: 0.35,
          pointBackgroundColor: "#2b1e17",
          pointBorderColor: "#dfad16",
          pointBorderWidth: 2,
          pointRadius: 6,
          pointHoverRadius: 8
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: "#2b1e17",
          titleColor: "#ffffff",
          bodyColor: "#fbf0ce",
          padding: 12,
          displayColors: false,
          callbacks: {
            label: function (contexto) {
              return `Produção: ${formatarKg(contexto.parsed.y)} kg`;
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: false,
          grace: "15%",
          ticks: {
            callback: function (valor) {
              return valor + " kg";
            },
            font: { family: "Inter", size: 11 },
            color: "#776b60"
          },
          grid: { color: "#f0e6da" }
        },
        x: {
          ticks: {
            font: { family: "Inter", size: 12, weight: "600" },
            color: "#402610"
          },
          grid: { display: false }
        }
      }
    }
  });
}

function dataDeHoje() {
  let hoje = new Date();
  let ano = hoje.getFullYear();
  let mes = hoje.getMonth() + 1;
  let dia = hoje.getDate();

  if (mes < 10) {
    mes = `0${mes}`;
  }
  if (dia < 10) {
    dia = `0${dia}`;
  }

  return `${ano}-${mes}-${dia}`;
}

function abrirModalColeta() {
  form_coleta.reset();
  ipt_data_coleta.max = dataDeHoje();
  ipt_data_coleta.value = dataDeHoje();
  msg_coleta.innerHTML = "";
  modal_coleta.classList.remove("hidden");
}

function fecharModalColeta() {
  modal_coleta.classList.add("hidden");
}

function salvarColeta(evento) {
  evento.preventDefault();

  let dataColeta = ipt_data_coleta.value;
  let quantidade = Number(ipt_qtd_coleta.value);

  if (dataColeta == "") {
    msg_coleta.innerHTML = "Informe a data da coleta.";
  } else if (dataColeta > dataDeHoje()) {
    msg_coleta.innerHTML = "A data da coleta não pode estar no futuro.";
  } else if (quantidade <= 0) {
    msg_coleta.innerHTML = "Informe uma quantidade maior que 0 kg.";
  } else {
    msg_coleta.innerHTML = "";
    btn_salvar_coleta.disabled = true;

    fetch("/coletaMel/cadastrar", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        dataServer: dataColeta,
        quantidadeServer: quantidade,
        idEnderecoServer: idApiario
      })
    })
      .then(function (resposta) {
        btn_salvar_coleta.disabled = false;

        if (resposta.ok) {
          fecharModalColeta();
          carregarColetas();
        } else {
          resposta.json().then(function (dados) {
            msg_coleta.innerHTML = dados.erro;
          });
        }
      })
      .catch(function (erro) {
        console.log(erro);
        btn_salvar_coleta.disabled = false;
        msg_coleta.innerHTML = "Erro de conexão com o servidor.";
      });
  }
}

carregarColetas();
