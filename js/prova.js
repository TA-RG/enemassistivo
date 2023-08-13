$(document).ready(function () {
  const buscar = new Worker('js/filtrar.js', {
    type: 'module',
  });

  const filtros = JSON.parse(sessionStorage.getItem('filtros'));
  let questoes;
  let numero = 0;

  buscar.onmessage = (msg) => {
    questoes = msg.data;
    render();
    buscar.terminate();
  };

  buscar.postMessage(filtros);

  $('#proxima').click(() => {
    if (numero === questoes.length - 1) {
      return;
    }
    numero++;
    render();
  });

  $('#anterior').click(() => {
    if (numero === 0) {
      return;
    }
    numero--;
    render();
  });

  function render() {
    questao(questoes[numero]);
  }

  function questao(questao) {
    $('#enunciados').empty();
    $('#alternativas').empty();

    questao.enunciados.forEach((en) => {
      $('#enunciados').append(`
        <p>${en}</p>
      `);
    });

    for (const letra in questao.alternativas) {
      const alternativa = questao.alternativas[letra];
      $('#alternativas').append(`
        <div class="input-group mb-3">
          <span class="input-group-text font-monospace">${letra})</span>
          <label for="${letra}" class="form-control">${alternativa}</label>
          <div class="input-group-text">
            <input form="resposta" name="alternativas" id="${letra}" value="${letra}" class="form-check-input mt-0" type="radio" />
          </div>
        </div>
      `);
    }

    $('#ano').text(questao.filtros.ano);
    $('#questao').text(questao.filtros.questao);
    $('#area').text(questao.filtros.area);
    $('.materia.conteudo').empty();
    questao.filtros.materia.forEach((ma) => {
      $('.materia.conteudo').append(`
        <span class="badge bg-primary fs-6">${ma}</span>
      `);
    });
    questao.filtros.conteudo.forEach((co) => {
      $('.materia.conteudo').append(`
        <span class="badge rounded-pill text-bg-info fs-6">${co}</span>
      `);
    });
  }

  function corrigir(questao) {
    return {
      numero: questao.filtros.questao,
      resposta: document.forms.resposta.alternativas.value,
      gabarito: questao._gabarito,
      correta() {
        return this.resposta === this.gabarito;
      },
    };
  }

  const modal = $('#enviarResposta');
  modal.on('show.bs.modal', () => {
    const gabarito = `${corrigir(questoes[numero]).gabarito}`;
    $('#enviarResposta .modal-title').text(`Questão ${corrigir(questoes[numero]).numero}`);
    $('#enviarResposta .modal-body').html(`
      <p class="fs-3">Resposta ${corrigir(questoes[numero]).correta() ? 'correta' : 'incorreta'}!</p>
      <button id="enviar" type="button" class="btn btn-info" data-bs-toggle="modal" data-bs-target="#respostaCerta">Exibir resposta correta</button>
    `);
    $('#enviarResposta .modal-footer').html(`
      <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Voltar à questão</button>
      <button type="button" class="btn btn-primary" data-bs-dismiss="modal" onclick="document.querySelector('#proxima').click()">Próxima questão</button>
    `);
    $('#respostaCerta .modal-title').text(`Resposta da questão ${corrigir(questoes[numero]).numero}`);
    $('#respostaCerta .modal-body').html(`
      <div class="input-group">
        <span class="input-group-text font-monospace">${gabarito})</span>
        <span class="form-control">${questoes[numero].alternativas[gabarito]}</span>
      </div>
    `);
    $('#respostaCerta .modal-footer').html(`
      <button type="button" class="btn btn-secondary" data-bs-toggle="modal" data-bs-target="#enviarResposta">Voltar</button>
    `);
  });
});
