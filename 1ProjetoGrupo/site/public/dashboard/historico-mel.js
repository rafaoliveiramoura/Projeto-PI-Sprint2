const ID_APIARIO = 1;

let coletasMelHistorico = [];
let graficoMel = null;

function formatarKg(numero) {
  return numero.toFixed(1).replace(".", ",");
}

function carregarColetas() {
  fetch(`/coletaMel/listar/${ID_APIARIO}`)
    .then(function (resposta) {
      if (!resposta.ok) throw new Error("HTTP " + resposta.status);
      return resposta.json();
    })
    .then(function (coletas) {
      coletasMelHistorico = coletas;
      renderizarHistorico();
      renderizarGraficoMel();
    })
    .catch(function (erro) {
      console.error("Erro ao carregar coletas:", erro);
      document.getElementById("tabela_coletas_corpo").innerHTML =
        `<tr><td colspan="4" class="sem-alertas">Não foi possível carregar as coletas. Verifique se o servidor está rodando.</td></tr>`;
    });
}

function renderizarHistorico() {
  const corpoTabela = document.getElementById("tabela_coletas_corpo");
  const n = coletasMelHistorico.length;

  if (n == 0) {
    corpoTabela.innerHTML = `<tr><td colspan="4" class="sem-alertas">Nenhuma coleta registrada ainda. Clique em "Adicionar coleta".</td></tr>`;
    return;
  }

  let linhasHtml = "";
  for (let i = 0; i < n; i++) {
    const item = coletasMelHistorico[i];
    let badgeCrescimento = `<span class="honey-badge neutro">● Coleta inicial</span>`;

    if (i > 0) {
      const anterior = coletasMelHistorico[i - 1];
      const diff = item.quantidade - anterior.quantidade;
      const perc = (diff / anterior.quantidade) * 100;
      const subiu = diff >= 0;
      const sinal = subiu ? "+" : "";

      badgeCrescimento = `
        <span class="honey-badge ${subiu ? "subiu" : "caiu"}">
          <span>${subiu ? "▲" : "▼"}</span>
          <strong>${sinal}${perc.toFixed(1).replace(".", ",")}%</strong>
          <small>(${sinal}${formatarKg(diff)} kg)</small>
        </span>
      `;
    }

    linhasHtml = `
      <tr>
        <td><strong>#${i + 1}</strong></td>
        <td><strong>${item.data}</strong></td>
        <td><span class="qtd-coleta">${formatarKg(item.quantidade)} kg</span></td>
        <td>${badgeCrescimento}</td>
      </tr>
    ` + linhasHtml;
  }
  corpoTabela.innerHTML = linhasHtml;

  const ultima = coletasMelHistorico[n - 1];
  document.getElementById("resumo_ultima_qtd").innerHTML = `${formatarKg(ultima.quantidade)} <small>kg</small>`;
  document.getElementById("resumo_ultima_data").textContent = `Realizada em ${ultima.data}`;

  const badge = document.getElementById("resumo_badge_crescimento");
  const elDiff = document.getElementById("resumo_diff_kg");
  if (n >= 2) {
    const penultima = coletasMelHistorico[n - 2];
    const diff = ultima.quantidade - penultima.quantidade;
    const perc = (diff / penultima.quantidade) * 100;
    const subiu = diff >= 0;
    const sinal = subiu ? "+" : "";

    badge.className = "honey-badge " + (subiu ? "subiu" : "caiu");
    badge.innerHTML = `<span>${subiu ? "▲" : "▼"}</span><strong>${sinal}${perc.toFixed(1).replace(".", ",")}%</strong>`;
    elDiff.style.color = subiu ? "var(--green)" : "var(--red)";
    elDiff.innerHTML = `${sinal}${formatarKg(diff)} <small>kg</small>`;
  } else {
    badge.className = "honey-badge neutro";
    badge.textContent = "● Primeira coleta";
    elDiff.style.color = "var(--muted)";
    elDiff.innerHTML = `— <small>kg</small>`;
  }

  const ano = ultima.ano;
  const coletasDaSafra = coletasMelHistorico.filter(c => c.ano == ano);
  const totalSafra = coletasDaSafra.reduce((soma, c) => soma + c.quantidade, 0);
  const qtdExtracoes = coletasDaSafra.length;

  document.getElementById("badge_safra").textContent = `Safra ativa - ${ano}`;
  document.getElementById("resumo_titulo_safra").textContent = `Total da Safra ${ano}`;
  document.getElementById("resumo_total_safra").innerHTML = `${formatarKg(totalSafra)} <small>kg</small>`;
  document.getElementById("resumo_qtd_extracoes").textContent =
    `${qtdExtracoes} ${qtdExtracoes == 1 ? "extração registrada" : "extrações registradas"}`;
  document.getElementById("resumo_media_coleta").innerHTML = `${formatarKg(totalSafra / qtdExtracoes)} <small>kg</small>`;
}

function renderizarGraficoMel() {
  const labels = coletasMelHistorico.map(c => c.data.slice(0, 5));
  const valores = coletasMelHistorico.map(c => c.quantidade);

  if (graficoMel) {
    graficoMel.data.labels = labels;
    graficoMel.data.datasets[0].data = valores;
    graficoMel.update();
    return;
  }

  const canvas = document.getElementById("graficoMelHistorico");
  const ctx = canvas.getContext("2d");
  const gradiente = ctx.createLinearGradient(0, 0, 0, 300);
  gradiente.addColorStop(0, "rgba(223, 173, 22, 0.45)");
  gradiente.addColorStop(1, "rgba(223, 173, 22, 0.02)");

  graficoMel = new Chart(canvas, {
    type: "line",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Volume Colhido (kg)",
          data: valores,
          borderColor: "#a87900",
          backgroundColor: gradiente,
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
            label: function (context) {
              const idx = context.dataIndex;
              const dados = context.dataset.data;
              let txt = `Produção: ${formatarKg(context.parsed.y)} kg`;
              if (idx > 0) {
                const diff = context.parsed.y - dados[idx - 1];
                const perc = (diff / dados[idx - 1]) * 100;
                const sinal = diff >= 0 ? "+" : "";
                txt += ` (${sinal}${perc.toFixed(1).replace(".", ",")}% vs anterior)`;
              }
              return txt;
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: false,
          grace: "15%",
          ticks: {
            callback: function (val) {
              return val + " kg";
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
  const hoje = new Date();
  const mes = String(hoje.getMonth() + 1).padStart(2, "0");
  const dia = String(hoje.getDate()).padStart(2, "0");
  return `${hoje.getFullYear()}-${mes}-${dia}`;
}

function abrirModalColeta() {
  document.getElementById("form_coleta").reset();
  ipt_data_coleta.max = dataDeHoje();
  ipt_data_coleta.value = dataDeHoje();
  msg_coleta.textContent = "";
  modal_coleta.classList.remove("hidden");
  ipt_qtd_coleta.focus();
}

function fecharModalColeta() {
  modal_coleta.classList.add("hidden");
}

document.addEventListener("keydown", function (evento) {
  if (evento.key === "Escape" && !modal_coleta.classList.contains("hidden")) {
    fecharModalColeta();
  }
});

function salvarColeta(evento) {
  evento.preventDefault();

  const dataColeta = ipt_data_coleta.value;
  const quantidade = Number(ipt_qtd_coleta.value);

  if (!dataColeta) {
    msg_coleta.textContent = "Informe a data da coleta.";
    return;
  }
  if (dataColeta > dataDeHoje()) {
    msg_coleta.textContent = "A data da coleta não pode estar no futuro.";
    return;
  }
  if (!(quantidade > 0)) {
    msg_coleta.textContent = "Informe uma quantidade maior que 0 kg.";
    return;
  }

  msg_coleta.textContent = "";
  btn_salvar_coleta.disabled = true;
  btn_salvar_coleta.textContent = "Salvando...";

  fetch("/coletaMel/cadastrar", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      dataServer: dataColeta,
      quantidadeServer: quantidade,
      idEnderecoServer: ID_APIARIO
    })
  })
    .then(function (resposta) {
      if (resposta.ok) {
        fecharModalColeta();
        carregarColetas();
      } else {
        return resposta.text().then(function (texto) {
          msg_coleta.textContent = texto || "Não foi possível salvar a coleta.";
        });
      }
    })
    .catch(function (erro) {
      console.error("Erro ao salvar coleta:", erro);
      msg_coleta.textContent = "Erro de conexão com o servidor.";
    })
    .finally(function () {
      btn_salvar_coleta.disabled = false;
      btn_salvar_coleta.textContent = "Salvar coleta";
    });
}

carregarColetas();
