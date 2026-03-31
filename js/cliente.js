function digitarNome(pesquisar) {
    clearElement("div-nomes");
    clearElement("div-info");

    if (pesquisar.value != '') {
        document.getElementById("btn-nome-pesquisar").innerText = pesquisar.value;
        document.getElementById("btn-nome-pesquisar").style.backgroundColor = verdepadrao;
    }

    document.getElementById("btn-device-ping").innerText = "000.000.000.000";
    document.getElementById("btn-device-ping").style.backgroundColor = cinzapadrao;
}

function nomeCliente(pesquisar) {
    clearElement("div-nomes");
    clearElement("div-info");

    if (pesquisar.value == '') {
        document.getElementById("btn-nome-pesquisar").innerText = "nome do cliente";
        document.getElementById("btn-nome-pesquisar").style.backgroundColor = cinzapadrao;
    }
    else {
        document.getElementById("btn-nome-pesquisar").innerText = pesquisar.value;
        document.getElementById("btn-nome-pesquisar").style.backgroundColor = azulpadrao;
    }

    document.getElementById("btn-device-ping").innerText = "000.000.000.000";
    document.getElementById("btn-device-ping").style.backgroundColor = cinzapadrao;
}

async function nomePesquisar(pesquisar) {
    clearElement("div-nomes");

    if (pesquisar.innerText.split(" ").length > 2) {
        alert("Pesquise no máximo 2 partes do nome");
        return;
    }

    await urlGet(applicationUrl + "nome/" + pesquisar.innerText);

    var divnomes = document.getElementById("div-nomes");

    data.forEach(element => {
        var nome = document.createElement("a");
        nome.innerText = element.nome;
        nome.setAttribute("id", element.codigo);
        nome.setAttribute("href", "javascript:getIpmac(" + element.codigo + ")");
        //nome.setAttribute("class", "btn-large");
        divnomes.appendChild(nome);
    });

    document.getElementById("btn-device-ping").innerText = "000.000.000.000";
    document.getElementById("btn-device-ping").style.backgroundColor = cinzapadrao;
}