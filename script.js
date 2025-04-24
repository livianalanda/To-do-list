// Atualizar calendário
const diasContainer = document.getElementById("diasCalendario");
const mesAno = document.getElementById("mesAno");
const dataAtual = new Date();
const eventos = {};

function carregarCalendario(mes, ano) {
  diasContainer.innerHTML = "";
  const primeiroDia = new Date(ano, mes, 1).getDay();
  const totalDias = new Date(ano, mes + 1, 0).getDate();
  const nomesMeses = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
                      "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
  mesAno.innerText = `${nomesMeses[mes]} ${ano}`;

  for (let i = 0; i < primeiroDia; i++) {
    diasContainer.innerHTML += `<div></div>`;
  }

  for (let dia = 1; dia <= totalDias; dia++) {
    const divDia = document.createElement("div");
    divDia.innerText = dia;
    divDia.onclick = () => abrirModal(dia, mes, ano);
    diasContainer.appendChild(divDia);
  }
}

carregarCalendario(dataAtual.getMonth(), dataAtual.getFullYear());

// Tabs
document.querySelectorAll(".tab-button").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".tab-button").forEach(b => b.classList.remove("active"));
    document.querySelectorAll(".tab-content").forEach(tab => tab.classList.remove("active"));
    btn.classList.add("active");
    document.getElementById(btn.dataset.tab).classList.add("active");
  });
});

// Tarefas
const listaTarefas = document.getElementById("listaTarefas");
document.getElementById("adicionarTarefa").onclick = () => {
  const valor = document.getElementById("novaTarefa").value;
  if (valor.trim() !== "") {
    const li = document.createElement("li");
    li.innerHTML = `<span>${valor}</span> <input type="checkbox" onclick="this.parentElement.style.textDecoration = this.checked ? 'line-through' : 'none'">`;
    listaTarefas.appendChild(li);
    document.getElementById("novaTarefa").value = "";
  }
};

// Metas
const listaMetas = document.getElementById("listaMetas");
document.getElementById("adicionarMeta").onclick = () => {
  const valor = document.getElementById("novaMeta").value;
  if (valor.trim() !== "") {
    const li = document.createElement("li");
    li.textContent = valor;
    li.onclick = () => li.remove();
    listaMetas.appendChild(li);
    document.getElementById("novaMeta").value = "";
  }
};

// Modal Evento
const modal = document.getElementById("modalEvento");
const dataSelecionada = document.getElementById("dataSelecionada");
let diaSelecionado = null;

function abrirModal(dia, mes, ano) {
  diaSelecionado = `${dia}/${mes+1}/${ano}`;
  dataSelecionada.innerText = `Dia ${diaSelecionado}`;
  modal.style.display = "block";
  atualizarListaEventos();
}

document.getElementById("fecharModal").onclick = () => {
  modal.style.display = "none";
};

document.getElementById("salvarEvento").onclick = () => {
  const titulo = document.getElementById("tituloEvento").value;
  if (titulo.trim()) {
    if (!eventos[diaSelecionado]) eventos[diaSelecionado] = [];
    eventos[diaSelecionado].push(titulo);
    document.getElementById("tituloEvento").value = "";
    atualizarListaEventos();
  }
};

function atualizarListaEventos() {
  const lista = document.getElementById("listaEventos");
  lista.innerHTML = "";
  (eventos[diaSelecionado] || []).forEach(ev => {
    const li = document.createElement("li");
    li.textContent = ev;
    lista.appendChild(li);
  });
}
