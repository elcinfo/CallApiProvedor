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
    blockElement("div-info");
    noneElement("btn-ip-arp");
    noneElement("btn-reboot");

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
    noneElement("btn-nome-pesquisar");

    if (document.getElementById("btn-ip-arp")) {
        document.getElementById("btn-ip-arp").style.backgroundColor = cinzapadrao;
        document.getElementById("btn-ip-arp").innerText = "IP ARP";
    }

    if (document.getElementById("btn-reboot")) {
        document.getElementById("btn-reboot").style.backgroundColor = cinzapadrao;
        document.getElementById("btn-reboot").innerText = "REBOOT";
    }

    await urlGet(applicationUrl + "deviceinfo/" + ip);

    for (var i = 0; i < data.length; i++) {
        element = document.createElement("p");
        element.innerText = data[i];
        document.getElementById("div-info").appendChild(element);
    }

    blockElement("btn-ip-arp");
    blockElement("btn-reboot");
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
    if (soucpf) {
        getDadosClienteCPF();
    }
    else {
        getDadosClienteCNPJ();
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
        blockElement("erro-container");
        noneElement("div-enviar");
    }
}

async function getDadosClienteCPF() {
    var cpf = document.getElementById("cpf").value;

    /*if (cpf.length < 14) {
        alert("CPF incorreto ou incompleto...");
        return;
    }*/

    console.log("CPF Digitado/Colado: " + cpf);
    cpf = cpf.replace(".", "").replace(".", "").replace("-", "");
    console.log("CPF Digitado/Colado: " + cpf);

    if (!validarCPF(cpf)) {
        alert("CPF incorreto. Digite novamente...");
        return;
    }

    if (cpf.length < 14) {
        var newCPF;
        newCPF = cpf.slice(0, 3) + "." + cpf.slice(3, 6) + "." + cpf.slice(6, 9) + "-" + cpf.slice(9, 11);
        console.log("newCPF Formatado: " + newCPF);
        document.getElementById("cpf").value = newCPF;
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
    //clearElement("div-info");

    var tagcliente = document.createElement("p");
    tagcliente.style.textAlign = "center";
    tagcliente.innerText = "(" + cliente + ") " + nome;
    divnomes.appendChild(tagcliente);

    var tagip = document.getElementById("btn-device-ping");
    tagip.innerText = data.ip;
    blockElement("btn-device-ping");
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

async function reboot() {
    var ip = document.getElementById("btn-device-ping").innerText;
    console.log("Reboot IP ....: " + ip);

    await urlGet(applicationUrl + "reboot/" + ip); // incluir ip

    console.log("Response ...........: " + data);

    document.getElementById("btn-reboot").style.backgroundColor = cinzaclaro;

    if (data == "EXECUTADO") {
        document.getElementById("btn-reboot").innerText = "REBOOT (OK)";
    }

    if (data == "FALHA") {
        document.getElementById("btn-reboot").innerText = "REBOOT (FALHA)";
    }
}

// erro-container: CPF ou CNPJ não encontrado, mensalidades não encontradas
function erro() {
    //console.log("Estou em: 'function erro() onload'");

    var diverro = document.getElementById("erro-container");
    var line1 = document.createElement("p");
    var line2 = document.createElement("p");
    var line3 = document.createElement("p");
    var line4 = document.createElement("a");
    var line5 = document.createElement("p");

    line1.innerText = "Não foi possível atender sua solicitação,";
    line2.innerText = "entre em contato com o Provedor";
    line3.innerText = "pelo Whatsapp";
    line4.innerText = "(18) 99776-0998";
    line5.innerText = "Ou digite o CPF novamente";

    line1.setAttribute("class", "erro");
    line2.setAttribute("class", "erro");
    line3.setAttribute("class", "erro");
    line4.setAttribute("class", "a-link");
    line4.setAttribute("href", "https://wa.me/5518997760998");
    line5.setAttribute("class", "erro");
    line5.setAttribute("id", "erro-line5");

    diverro.appendChild(line1);
    diverro.appendChild(line2);
    diverro.appendChild(line3);
    diverro.appendChild(line4);
    diverro.appendChild(line5);
}
