function cabecalho() {
    var divcabecalho = document.getElementById("div-cabecalho");
    var titulo = document.createElement("p");
    var subtitulo = document.createElement("p");

    titulo.innerText = "elc.net.br";
    subtitulo.innerText = "Provedor de Internet Via Rádio";

    titulo.setAttribute("class", "titulo-principal");
    subtitulo.setAttribute("class", "titulo-secundario");

    divcabecalho.appendChild(titulo);
    divcabecalho.appendChild(subtitulo);
}

function noneElement(elementID) {
    if (document.getElementById(elementID)) {
        document.getElementById(elementID).style.display = "none";
    }
}

function blockElement(elementID) {
    if (document.getElementById(elementID)) {
        document.getElementById(elementID).style.display = "block";
    }
}

function clearElement(elementID) {
    if (document.getElementById(elementID)) {
        document.getElementById(elementID).innerHTML = "";
    }
}

async function urlGet(urlget) {
    try { response = await fetch(urlget); }
    catch (err) { console.log(err.message); }

    data = await response.json();

    console.log(response);
    console.log(response.status);
    console.log(data);
}

async function pingTest(ip) {
    console.log("Event ......: onclick");
    console.log("function ...: pingTest()");

    //noneElement("div-info");

    await urlGet(applicationUrl + "ping/" + ip.innerText);

    var idbutton = ip.getAttribute("id");

    if (data == "PingOff") {
        document.getElementById(idbutton).style.backgroundColor = vermelhopadrao;
    }

    if (data == "PingOn") {
        document.getElementById(idbutton).style.backgroundColor = verdepadrao;
        if (document.getElementById("div-info")) {
            deviceInfo(ip.innerText);
        }
    }
}

async function deviceInfo(ip) {
    clearElement("div-info");

    if (document.getElementById("btn-ip-arp")) {
        document.getElementById("btn-ip-arp").style.backgroundColor = cinzapadrao;
        document.getElementById("btn-ip-arp").innerText = "IP ARP";
    }

    await urlGet(applicationUrl + "deviceinfo/" + ip);

    for (var i = 0; i < data.length; i++) {
        element = document.createElement("p");
        element.innerText = data[i];
        document.getElementById("div-info").appendChild(element);
    }

    blockElement("btn-ip-arp");
}

function mascaraCPF(i) {
    var v = i.value;

    if (isNaN(v[v.length - 1])) {
        i.value = v.substring(0, v.length - 1);
        return;
    }

    if (v.length == 3 || v.length == 7) {
        i.value += ".";
    }

    if (v.length == 11) {
        i.value += "-";
    }
}

function digitarCPF() {
    noneElement("div-cliente");
    noneElement("erro-container");
    noneElement("boleto-container");
    noneElement("div-boleto");
    noneElement("div-opcoes");
    noneElement("chavepix");
    noneElement("numeracao");
    noneElement("div-confirmar-msg");
    noneElement("div-confirmar-btn");
    noneElement("div-diasatraso");
    noneElement("falha-ipbloq");
    noneElement("naoliberar-ipbloq");
    noneElement("liberado-ipbloq");

    blockElement("div-enviar");
    blockElement("titulo-consultar-boletos");
    blockElement("soucnpj");

    console.log("data ............: " + data);
    console.log("titulo-pagina ...: " + document.querySelector("#soucpf-container > p.titulo-pagina").innerText);

    if (data != null && document.querySelector("#soucpf-container > p.titulo-pagina").innerText == 'Consultar Boletos') {
        clearShowMonth();
    }
}

function getDadosCliente() {
    if (soucnpj) {
        getDadosClienteCNPJ();
    }
    else {
        getDadosClienteCPF();
    }
}

async function getDadosClienteCNPJ() {
    var cnpj = document.getElementById("cnpj").value;

    if (cnpj.length < 18) {
        alert("CNPJ incorreto ou incompleto...");
        return;
    }

    cnpj = cnpj.replace(".", "").replace(".", "").replace("/", "").replace("-", "");

    if (!validarCNPJ(cnpj)) {
        alert("CNPJ incorreto. Digite novamente...");
        return;
    }
    else {
        console.log("CNPJ correto");
    }

    await urlGet(applicationUrl + "ClientePJ/" + cnpj);

    if (response.ok) {
        noneElement("soucpf");
        mostrarCliente(data);
    }
    else {
        blockElement("erro-container-pj");
        noneElement("div-enviar");
    }

}

async function getDadosClienteCPF() {
    var cpf = document.getElementById("cpf").value;

    if (cpf.length < 14) {
        alert("CPF incorreto ou incompleto...");
        return;
    }

    cpf = cpf.replace(".", "").replace(".", "").replace("-", "");

    if (!validarCPF(cpf)) {
        alert("CPF incorreto. Digite novamente...");
        return;
    }

    await urlGet(applicationUrl + "Cliente/" + cpf);

    if (response.ok) {
        noneElement("soucnpj");
        nomecliente = data.nome;
        mostrarCliente(data);
    }
    else {
        blockElement("erro-container");
        noneElement("div-enviar");
    }
}

function validarCPF(CPF) {
    try {
        var tCPF = CPF.substring(0, 9);

        var soma = 0;

        for (i = 0; i < 9; i++) {
            soma += parseInt(tCPF[i]) * (i + 1);
        }

        tCPF += (soma % 11) % 10;

        soma = 0;

        for (i = 0; i < 10; i++) {
            soma += parseInt(CPF[i]) * i;
        }

        tCPF += (soma % 11) % 10;

        return CPF.endsWith(tCPF.substring(9));
    }
    catch {
        return false;
    }
}

function mostrarCliente(data) {
    blockElement("div-cliente");
    noneElement("div-enviar");
    noneElement("titulo-consultar-boletos");
    blockElement("div-confirmar-msg");
    blockElement("div-confirmar-btn");

    var codigo = document.getElementById("codigo");
    var nome = document.getElementById("nome");
    var endereco = document.getElementById("endereco");
    var cpf = document.getElementById("CPF");

    codigo.innerText = data.codigo;
    nome.innerText = data.nome;
    endereco.innerText = data.endereco;
    cpf.innerText = data.cpf;

    nomecliente = data.nome;

    var carne = document.getElementById("carne");
    var boleto = document.getElementById("boleto");

    if (document.querySelector("#soucpf-container > p.titulo-pagina").innerText == 'Consultar Boletos') {
        carne.setAttribute("href", applicationUrl + "download/Carnê " + data.nome + ".PDF"); // funcionando
    }
}

async function getIpmac(cliente) {
    await urlGet(applicationUrl + "ipmac/" + cliente);

    var nome = document.getElementById(cliente).innerText;
    var divnomes = document.getElementById("div-nomes");

    clearElement("div-nomes");
    clearElement("div-info");

    var tagcliente = document.createElement("p");
    tagcliente.innerText = "(" + cliente + ") " + nome;
    divnomes.appendChild(tagcliente);

    var tagip = document.getElementById("btn-device-ping");
    tagip.innerText = data.ip;
}

async function ipArp() {
    var ip = document.getElementById("btn-device-ping");
    console.log("Consulta IP ARP ....: " + ip.innerText);

    await urlGet(applicationUrl + "iparp/" + ip.innerText); // incluir ip

    console.log("Response ...........: " + data);

    if (data == "DISABLED") {
        document.getElementById("btn-ip-arp").style.backgroundColor = cinzaclaro;
        document.getElementById("btn-ip-arp").innerText = "IP ARP (DISABLED)";
    }

    if (data == "FALHA") {
        document.getElementById("btn-ip-arp").style.backgroundColor = cinzaclaro;
        document.getElementById("btn-ip-arp").innerText = "IP ARP (FALHA)";
    }
}