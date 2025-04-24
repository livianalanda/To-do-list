const tabs = document.querySelectorAll('.tab-button');
const contents = document.querySelectorAll('.tab-content');

tabs.forEach(button => {
    button.addEventListener('click', () => {
        const tab = button.dataset.tab;

        tabs.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        contents.forEach(content => {
            content.classList.remove('active');
            if (content.id === tab) {
                content.classList.add('active');
            }
        });
    });
});

let diaSelecionado = null;

function gerarCalendario(mes, ano) {
  const diasDoMes = document.getElementById("diasDoMes");
  const mesAno = document.getElementById("mesAno");

  const nomesMeses = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
                      "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
  mesAno.innerText = `${nomesMeses[mes]} ${ano}`;

  diasDoMes.innerHTML = "";

  const primeiroDia = new Date(ano, mes, 1).getDay();
  const totalDias = new Date(ano, mes + 1, 0).getDate();

  for (let i = 0; i < primeiroDia; i++) {
    const vazio = document.createElement("div");
    vazio.classList.add("vazio");
    diasDoMes.appendChild(vazio);
  }

  for (let i = 1; i <= totalDias; i++) {
    const dia = document.createElement("div");
    dia.textContent = i;

    const dataKey = `${i}-${mes + 1}-${ano}`;
    const evento = localStorage.getItem(dataKey);

    if (evento) {
      dia.title = evento;
      dia.style.background = "#ffc4dc";
    }

    dia.onclick = () => {
      diaSelecionado = dataKey;
      abrirModal();
    };

    diasDoMes.appendChild(dia);
  }
}

function abrirModal() {
  document.getElementById("eventoModal").classList.remove("hidden");
  document.getElementById("inputEvento").value = "";
}

function fecharModal() {
  document.getElementById("eventoModal").classList.add("hidden");
}

function salvarEvento() {
  const evento = document.getElementById("inputEvento").value;
  if (evento.trim() !== "" && diaSelecionado) {
    localStorage.setItem(diaSelecionado, evento);
    fecharModal();
    const hoje = new Date();
    gerarCalendario(hoje.getMonth(), hoje.getFullYear());
  }
}

const hoje = new Date();
gerarCalendario(hoje.getMonth(), hoje.getFullYear());