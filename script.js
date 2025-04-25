// Atualizar calendário
const diasContainer = document.getElementById("diasCalendario");
const mesAno = document.getElementById("mesAno");
const dataAtual = new Date();
let mesAtual = dataAtual.getMonth();
let anoAtual = dataAtual.getFullYear();
let eventos = JSON.parse(localStorage.getItem("eventos")) || {};


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

        const hoje = new Date();
        if (
            dia === hoje.getDate() &&
            mes === hoje.getMonth() &&
            ano === hoje.getFullYear()
        ) {
            divDia.classList.add("hoje");
        } else {
            divDia.classList.remove("hoje");
        }


        const dataFormatada = `${dia}/${mes + 1}/${ano}`;
        if (eventos[dataFormatada]) {
            divDia.classList.add("com-evento");
        }

        diasContainer.appendChild(divDia);
    }

}

carregarCalendario(mesAtual, anoAtual);

// Tabs
document.querySelectorAll(".tab-button").forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelectorAll(".tab-button").forEach(b => b.classList.remove("active"));
        document.querySelectorAll(".tab-content").forEach(tab => tab.classList.remove("active"));
        btn.classList.add("active");

        const tabId = btn.dataset.tab;
        document.getElementById(tabId).classList.add("active");

        // Esconde lista de eventos se não for o calendário
        const eventosLista = document.getElementById("listaTodosEventos");
        eventosLista.style.display = tabId === "calendario" ? "block" : "none";
    });
});



// Tarefas
const listaTarefas = document.getElementById("listaTarefas");
document.getElementById("adicionarTarefa").onclick = () => {
    const valor = document.getElementById("novaTarefa").value;
    if (valor.trim() !== "") {
        const li = document.createElement("li");
        li.innerHTML = `
            <span>${valor}</span> 
            <input type="checkbox" onclick="this.parentElement.style.textDecoration = this.checked ? 'line-through' : 'none'; salvarTarefas()"> 
            <span class="botao-excluir-tarefa" title="Excluir tarefa">🗑️</span>
        `;
        li.querySelector(".botao-excluir-tarefa").addEventListener("click", () => {
            li.remove();
            salvarTarefas();
        });
        listaTarefas.appendChild(li);
        salvarTarefas();
        document.getElementById("novaTarefa").value = "";
    }
};


function salvarTarefas() {
    const tarefas = [];
    listaTarefas.querySelectorAll("li").forEach(li => {
        const texto = li.querySelector("span").innerText;
        const checkbox = li.querySelector("input[type='checkbox']");
        tarefas.push({
            texto,
            concluida: checkbox.checked
        });
    });
    localStorage.setItem("tarefas", JSON.stringify(tarefas));
}

function carregarTarefas() {
    const tarefasSalvas = JSON.parse(localStorage.getItem("tarefas")) || [];
    tarefasSalvas.forEach(obj => {
        const li = document.createElement("li");
        li.innerHTML = `
            <span>${obj.texto}</span> 
            <input type="checkbox" ${obj.concluida ? "checked" : ""} onclick="this.parentElement.style.textDecoration = this.checked ? 'line-through' : 'none'; salvarTarefas()"> 
            <span class="botao-excluir-tarefa" title="Excluir tarefa">🗑️</span>
        `;
        if (obj.concluida) {
            li.style.textDecoration = "line-through";
        }
        li.querySelector(".botao-excluir-tarefa").addEventListener("click", () => {
            li.remove();
            salvarTarefas();
        });
        listaTarefas.appendChild(li);
    });
}

carregarTarefas();


// Metas
document.getElementById("adicionarMeta").addEventListener("click", () => {
    const inputMeta = document.getElementById("novaMeta");
    const texto = inputMeta.value.trim();
    if (texto !== "") {
        const li = document.createElement("li");
        li.innerHTML = `
        ${texto}
        <span class="botao-excluir" title="Excluir meta">🗑️</span>
      `;
        li.querySelector(".botao-excluir").addEventListener("click", () => {
            li.remove();
            salvarMetas();
        });

        document.getElementById("listaMetas").appendChild(li);
        inputMeta.value = "";
        salvarMetas();

    }
});


// Modal Evento
const modal = document.getElementById("modalEvento");
const dataSelecionada = document.getElementById("dataSelecionada");
let diaSelecionado = null;

function abrirModal(dia, mes, ano) {
    diaSelecionado = `${dia}/${mes + 1}/${ano}`;
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
        modal.style.display = "none";
        localStorage.setItem("eventos", JSON.stringify(eventos));
        carregarCalendario(mesAtual, anoAtual);

    }
};



function atualizarListaEventos() {
    const lista = document.getElementById("listaEventos");
    lista.innerHTML = "";
    (eventos[diaSelecionado] || []).forEach((ev, index) => {
        const li = document.createElement("li");
        li.innerHTML = `
            ${ev}
            <span class="botao-excluir" title="Excluir evento">🗑️</span>
        `;
        li.querySelector(".botao-excluir").addEventListener("click", () => {
            eventos[diaSelecionado].splice(index, 1); // Remove o evento específico
            if (eventos[diaSelecionado].length === 0) {
                delete eventos[diaSelecionado]; // Se não tiver mais eventos, remove o dia
            }
            localStorage.setItem("eventos", JSON.stringify(eventos));
            atualizarListaEventos();
            carregarCalendario(mesAtual, anoAtual);
        });
        lista.appendChild(li);
    });
}


document.getElementById("btnMostrarEventos").addEventListener("click", () => {
    eventos = JSON.parse(localStorage.getItem("eventos")) || {}; // Recarrega os eventos atualizados
    const listaContainer = document.getElementById("listaTodosEventos");
    const ul = document.getElementById("eventosGerais");
    ul.innerHTML = "";

    Object.keys(eventos).forEach(data => {
        eventos[data].forEach(ev => {
            const li = document.createElement("li");
            li.innerHTML = `<strong>${data}</strong> — ${ev}`;
            ul.appendChild(li);
        });
    });

    listaContainer.style.display = listaContainer.style.display === "none" ? "block" : "none";
});


function salvarMetas() {
    const metas = [];
    document.querySelectorAll("#listaMetas li").forEach(li => {
        metas.push(li.firstChild.textContent.trim());
    });
    localStorage.setItem("metas", JSON.stringify(metas));
}

function carregarMetas() {
    const metasSalvas = JSON.parse(localStorage.getItem("metas")) || [];
    metasSalvas.forEach(texto => {
        const li = document.createElement("li");
        li.innerHTML = `${texto} <span class="botao-excluir" title="Excluir meta">🗑️</span>`;
        li.querySelector(".botao-excluir").addEventListener("click", () => {
            li.remove();
            salvarMetas();
        });
        document.getElementById("listaMetas").appendChild(li);
    });
}
carregarMetas();

document.getElementById("mesAnterior").addEventListener("click", () => {
    mesAtual--;
    if (mesAtual < 0) {
        mesAtual = 11;
        anoAtual--;
    }
    carregarCalendario(mesAtual, anoAtual);
});

document.getElementById("mesSeguinte").addEventListener("click", () => {
    mesAtual++;
    if (mesAtual > 11) {
        mesAtual = 0;
        anoAtual++;
    }
    carregarCalendario(mesAtual, anoAtual);
});
