// ================== KPI DO MEL ==================
// Busca as coletas no backend (web-data-viz) e mostra no card:
// quantidade da última coleta e o crescimento em relação à penúltima.

// apiário exibido no dashboard (idendereco na tabela endereco)
const ID_APIARIO = 1;

function formatarKg(numero) {
  return numero.toFixed(1).replace(".", ",");
}

function atualizarKpiMel() {
  fetch(`/coletaMel/listar/${ID_APIARIO}`)
    .then(function (resposta) {
      if (!resposta.ok) throw new Error("HTTP " + resposta.status);
      return resposta.json();
    })
    .then(function (coletas) {
      const elValor = document.getElementById("kpi_mel_valor");
      const elData = document.getElementById("kpi_mel_data");
      const elBadge = document.getElementById("kpi_mel_badge");

      if (coletas.length == 0) {
        elValor.innerHTML = `0 <small>kg</small>`;
        elData.textContent = "nenhuma coleta registrada";
        elBadge.className = "honey-badge neutro";
        elBadge.innerHTML = "● Sem coletas";
        return;
      }

      const ultima = coletas[coletas.length - 1];
      elValor.innerHTML = `${formatarKg(ultima.quantidade)} <small>kg</small>`;
      elData.textContent = `na última coleta (${ultima.data.slice(0, 5)})`;

      if (coletas.length == 1) {
        elBadge.className = "honey-badge neutro";
        elBadge.innerHTML = "● Primeira coleta";
        return;
      }

      const penultima = coletas[coletas.length - 2];
      const diferenca = ultima.quantidade - penultima.quantidade;
      const percentual = (diferenca / penultima.quantidade) * 100;
      const subiu = diferenca >= 0;
      const sinal = subiu ? "+" : "";

      elBadge.className = "honey-badge " + (subiu ? "subiu" : "caiu");
      elBadge.innerHTML = `
        <span>${subiu ? "▲" : "▼"}</span>
        <strong>${sinal}${percentual.toFixed(1).replace(".", ",")}%</strong>
        <small>vs anterior</small>
      `;
    })
    .catch(function (erro) {
      console.error("Erro ao carregar a KPI do mel:", erro);
      document.getElementById("kpi_mel_valor").innerHTML = `— <small>kg</small>`;
      document.getElementById("kpi_mel_data").textContent = "não foi possível carregar as coletas";
    });
}

atualizarKpiMel();
