async function getDadosIpBloq() {
    noneElement("div-confirmar-btn");
    noneElement("div-confirmar-msg");

    const clienteId = document.getElementById("codigo").innerText;

    console.log("Estou na função getDadosIpBloq() consultando IP do cliente " + clienteId);

    await urlGet(applicationUrl + "ipmac/" + clienteId);

    if (response.ok) {
        ip = data.ip;

        await urlGet(applicationUrl + "ipbloq/" + ip);
        console.log("Consultando IP " + ip + " na Tabela IPBLOQ: " + data);

        if (data == "FALHA") { // IP não consta na Tabela IPBLOQ
            blockElement("falha-ipbloq");
        }

        if (data == "BLOQUEADO") { // IP consta na Tabela IPBLOQ
            const clienteId = document.getElementById("codigo").innerText;
            await urlGet(applicationUrl + "DiasDeAtraso/" + clienteId);

            diasatraso = data;

            console.log("Cliente " + clienteId + " com mensalidade vencida há " + diasatraso + " dias");

            if (document.getElementById("diasatraso")) {
                document.getElementById("diasatraso").innerText = diasatraso;
            }

            blockElement("div-diasatraso");

            if (diasatraso <= 21) {
                blockElement("div-opcoes");
            }

            if (diasatraso > 21) {
                blockElement("naoliberar-ipbloq");
            }
        }
    }
    else {
        blockElement("naoliberar-ipbloq");
    }
}

async function jaPaguei() {
    console.log("Cliente " + nomecliente + " disse que já pagou " + ip);
    await urlGet(applicationUrl + "japaguei/" + ip);
    Resultado();
}

async function vouPagar() {
    console.log("Cliente " + nomecliente + " disse que vai pagar " + ip);
    await urlGet(applicationUrl + "voupagar/" + ip);
    Resultado();
}

function Resultado() {
    noneElement("div-opcoes");

    if (data == "LIBERADO") {
        blockElement("liberado-ipbloq");
    }

    if (data == "FALHA") {
        blockElement("naoliberar-ipbloq");
    }
}