function guardarDatos(tipo) {
    let valor = document.getElementById(tipo).value;
    if (valor.trim() === "") {
        alert("Por favor, ingrese un valor en " + tipo);
        return;
    }
    alert(tipo + " guardado: " + valor);
}

function cerrarPagina() {
    window.close();
}

function cambiarPantalla(pantalla) {
    document.querySelectorAll('.content').forEach(div => div.classList.remove('active'));
    document.getElementById(pantalla).classList.add('active');
}