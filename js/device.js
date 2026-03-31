function digitarIP() {
    console.log("Event ......: onfocus");
    console.log("function ...: digitarIP()");
    //noneElement("btn-ip-arp");
    //noneElement("div-info");

    document.getElementById("btn-device-ping").style.backgroundColor = cinzapadrao;

    document.getElementById("btn-device-ping").innerText = "Device Info";
    document.getElementById("btn-device-ping").style.backgroundColor = cinzapadrao;
    document.getElementById("btn-device-ping").style.color = brancopadrao;
}

function ipbutton(ipdigitado) {
    if (ipdigitado.value == '')
        document.getElementById("btn-device-ping").innerText = "Device IP";
    else
        document.getElementById("btn-device-ping").innerText = ipdigitado.value;
}

function changeIP(base) {
    console.log(base.value);

    switch (base.value) {

        case "":
            base.value = "172.16.88.";
            break;
        case "172.16.88.":
            base.value = "172.16.89.";
            break;
        case "172.16.89.":
            base.value = "172.16.90.";
            break;
        case "172.16.90.":
            base.value = "172.16.91.";
            break;
        case "172.16.91.":
            base.value = "192.168.172.";
            break;
        case "192.168.172.":
            base.value = "192.168.173.";
            break;
        case "192.168.173.":
            base.value = "172.16.88.";
            break;
        default:
        //code block
    }

    document.getElementById("btn-device-ping").innerText = base.value;
}