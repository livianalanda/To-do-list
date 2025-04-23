const button = document.querySelector('.button-add-task');
const input = document.querySelector('.input-task');
const listaCompleta = document.querySelector('.list-tasks');
const calendarioCorpo = document.getElementById('calendarioCorpo');
const mesAno = document.getElementById('mesAno');
const bntMesAnterior = document.getElementById('mesAnterior');
const bntMesProximo = document.getElementById('mesProximo');

let minhaListaDeItens = [];
let dataAtual = new Date();

function adicionarNovaTarefa() {
    const valor = input.value.trim();
    if (valor === '') return;

    minhaListaDeItens.push({
        tarefa: valor,
        concluida: false
    });

    input.value = '';

    mostrarTarefas();
}

function mostrarTarefas() {
    let novaLi = '';

    minhaListaDeItens.forEach((item, index) => {
        novaLi += `
         <li class="task ${item.concluida && "done"}">
              <img src="./img/checked.png" alt="check-na-tarefa" onclick="concluirTarefa(${index})">
              <p>${item.tarefa}</p>
              <img src="./img/trash.png" alt="tarefa-para-o-lixo" onclick="deletarItem(${index})">
         </li>
        `;
    });

    listaCompleta.innerHTML = novaLi;

    localStorage.setItem('lista', JSON.stringify(minhaListaDeItens));
}

function concluirTarefa(index) {
    minhaListaDeItens[index].concluida = !minhaListaDeItens[index].concluida;
    mostrarTarefas();
}

function deletarItem(index) {
    minhaListaDeItens.splice(index, 1);
    mostrarTarefas();
}

function recarregarTarefas() {
    const tarefasDoLocalStorage = localStorage.getItem('lista');
    if (tarefasDoLocalStorage) {
        minhaListaDeItens = JSON.parse(tarefasDoLocalStorage);
    }
    mostrarTarefas();
}

function mostrarAba(id) {
    const abas = document.querySelectorAll('.aba');
    abas.forEach(aba => aba.style.display = 'none');
    document.getElementById(id).style.display = 'block';
}

function abrirAba(id) {
    const abas = document.querySelectorAll('.aba');
    abas.forEach(aba => aba.style.display = 'none');
    document.getElementById(id).style.display = 'block';

    if (id === 'calendario') {
        renderizarCalendario(dataAtual);
    }
}

function renderizarCalendario(data) {
    const ano = data.getFullYear();
    const mes = data.getMonth();

    const primeiroDia = new Date(ano, mes, 1);
    const ultimoDia = new Date(ano, mes + 1, 0);
    const primeiroDiaSemana = primeiroDia.getDay();

    mesAno.textContent = data.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
    
    calendarioCorpo.innerHTML = '';

    for (let i = 0; i < primeiroDiaSemana; i++) {
        calendarioCorpo.innerHTML += '<div></div>';
    }

    for (let dia = 1; dia <= ultimoDia.getDate(); dia++) {
        calendarioCorpo.innerHTML += `<div>${dia}</div>`;
    }
}

bntMesAnterior.addEventListener('click', () => {
    dataAtual.setMonth(dataAtual.getMonth() - 1);
    renderizarCalendario(dataAtual);
});

bntMesProximo.addEventListener('click', () => {
    dataAtual.setMonth(dataAtual.getMonth() + 1);
    renderizarCalendario(dataAtual);
});

recarregarTarefas();
button.addEventListener('click', adicionarNovaTarefa);