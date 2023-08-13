import enem2017 from './json/enem2017.json' assert { type: 'json' };
import enem2018 from './json/enem2018.json' assert { type: 'json' };
import enem2019 from './json/enem2019.json' assert { type: 'json' };

const questoes = [];
parseQuestoes(questoes, enem2017, enem2018, enem2019);

onmessage = (msg) => {
  const ano = msg.data.ano;
  const area = msg.data.area;
  const materia = msg.data.materia;
  const conteudo = msg.data.conteudo;
  const busca = fConteudo(fMateria(fArea(fAno(questoes, ano), area), materia), conteudo);
  postMessage(shuffle(busca));
};

function parseQuestoes(questoes, ...provas) {
  [...provas].forEach((prova) => {
    Object.keys(prova).forEach((questao) => {
      questoes.push(prova[questao]);
    });
  });
}

// Fisher-Yates Array Shuffle
function shuffle(array) {
  let index = array.length, random;
  while (index > 0) {
    random = Math.floor(Math.random() * index--);
    let temp = array[index];
    array[index] = array[random];
    array[random] = temp;
  }
  return array;
}

function fAno(questoes, ano) {
  if (!ano) {
    return questoes;
  }
  return questoes.filter((questao) => questao.filtros.ano === ano);
}

function fArea(questoes, area) {
  if (!area) {
    return questoes;
  }
  return questoes.filter((questao) => questao.filtros.area === area);
}

function fMateria(questoes, materia) {
  if (!materia) {
    return questoes;
  }
  return questoes.filter((questao) => questao.filtros.materia.indexOf(materia) !== -1);
}

function fConteudo(questoes, conteudo) {
  if (!conteudo) {
    return questoes;
  }
  return questoes.filter((questao) => questao.filtros.conteudo.indeOf(conteudo) !== -1);
}
