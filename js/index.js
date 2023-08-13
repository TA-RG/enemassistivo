$(document).ready(function () {
  const form = document.forms.buscar;

  $(form).submit(filtros);

  function filtros() {
    const filtros = {
      ano: $(form.ano).val(),
      area: $(form.area).val(),
      materia: $(form.materia).val(),
      conteudo: $(form.conteudo).val(),
    };
    sessionStorage.setItem('filtros', JSON.stringify(filtros));
  }
});
