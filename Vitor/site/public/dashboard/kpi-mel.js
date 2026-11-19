let idApiarioMel = sessionStorage.ID_ENDERECO;

if (idApiarioMel == undefined) {
  idApiarioMel = 1;
}

function atualizarKpiMel() {
  fetch(`/coletaMel/listar/${idApiarioMel}`)
    .then(function (resposta) {
      if (resposta.ok) {
        resposta.json().then(function (coletas) {
          if (coletas.length == 0) {
            kpi_mel_valor.innerHTML = `0 <small>kg</small>`;
            kpi_mel_data.innerHTML = "nenhuma coleta registrada";
            kpi_mel_badge.className = "honey-badge neutro";
            kpi_mel_badge.innerHTML = "● Sem coletas";
            return;
          }

          let ultima = coletas[coletas.length - 1];
          kpi_mel_valor.innerHTML = `${ultima.quantidade.toFixed(1).replace(".", ",")} <small>kg</small>`;
          kpi_mel_data.innerHTML = `na última coleta (${ultima.data.slice(0, 5)})`;

          if (coletas.length == 1) {
            kpi_mel_badge.className = "honey-badge neutro";
            kpi_mel_badge.innerHTML = "● Primeira coleta";
            return;
          }

          let penultima = coletas[coletas.length - 2];
          let diferenca = ultima.quantidade - penultima.quantidade;
          let porcentagem = ((diferenca / penultima.quantidade) * 100).toFixed(1).replace(".", ",");

          if (diferenca >= 0) {
            kpi_mel_badge.className = "honey-badge subiu";
            kpi_mel_badge.innerHTML = `<span>▲</span><strong>+${porcentagem}%</strong><small>vs anterior</small>`;
          } else {
            kpi_mel_badge.className = "honey-badge caiu";
            kpi_mel_badge.innerHTML = `<span>▼</span><strong>${porcentagem}%</strong><small>vs anterior</small>`;
          }
        });
      } else {
        kpi_mel_valor.innerHTML = `— <small>kg</small>`;
        kpi_mel_data.innerHTML = "não foi possível carregar as coletas";
      }
    })
    .catch(function (erro) {
      console.log(erro);
      kpi_mel_valor.innerHTML = `— <small>kg</small>`;
      kpi_mel_data.innerHTML = "não foi possível carregar as coletas";
    });
}

atualizarKpiMel();
