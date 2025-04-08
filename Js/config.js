// Datos de configuración
let configuracion = {
    pagos: {
        moneda: 'MXN',
        comision: 2.5,
        metodos: ['efectivo', 'tarjeta']
    },
    empresa: {
        nombre: 'Abarrotes Pedro',
        direccion: '',
        telefono: '',
        horario: ''
    },
    usuarios: [
        {
            usuario: 'admin',
            nombre: 'Administrador',
            area: 'administracion',
            acceso: 'administrador'
        }
    ]
};

// Al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    // Cargar configuración desde localStorage
    const savedConfig = localStorage.getItem('configuracionSistema');
    if (savedConfig) {
        configuracion = JSON.parse(savedConfig);
        cargarConfiguracion();
    }
    
    // Mostrar usuarios
    mostrarUsuarios();
});

// Cambiar entre pestañas
function openTab(evt, tabName) {
    const tabcontent = document.getElementsByClassName('tabcontent');
    for (let i = 0; i < tabcontent.length; i++) {
        tabcontent[i].classList.remove('active');
    }
    
    const tablinks = document.getElementsByClassName('tablinks');
    for (let i = 0; i < tablinks.length; i++) {
        tablinks[i].classList.remove('active');
    }
    
    document.getElementById(tabName).classList.add('active');
    evt.currentTarget.classList.add('active');
}

// Cargar configuración en los formularios
function cargarConfiguracion() {
    // Configuración de pagos
    document.getElementById('moneda').value = configuracion.pagos.moneda;
    document.getElementById('comision').value = configuracion.pagos.comision;
    
    const metodosPago = document.getElementById('metodos-pago');
    for (let i = 0; i < metodosPago.options.length; i++) {
        metodosPago.options[i].selected = configuracion.pagos.metodos.includes(metodosPago.options[i].value);
    }
    
    // Configuración de empresa
    document.getElementById('nombre-empresa').value = configuracion.empresa.nombre;
    document.getElementById('direccion').value = configuracion.empresa.direccion;
    document.getElementById('telefono').value = configuracion.empresa.telefono;
    document.getElementById('horario').value = configuracion.empresa.horario;
}

// Guardar configuración de pagos
function guardarConfigPagos() {
    const metodosPago = document.getElementById('metodos-pago');
    const metodosSeleccionados = [];
    
    for (let i = 0; i < metodosPago.options.length; i++) {
        if (metodosPago.options[i].selected) {
            metodosSeleccionados.push(metodosPago.options[i].value);
        }
    }
    
    configuracion.pagos = {
        moneda: document.getElementById('moneda').value,
        comision: parseFloat(document.getElementById('comision').value),
        metodos: metodosSeleccionados
    };
    
    guardarConfiguracion();
    alert('Configuración de pagos guardada correctamente');
}

// Guardar configuración de empresa
function guardarConfigEmpresa() {
    configuracion.empresa = {
        nombre: document.getElementById('nombre-empresa').value,
        direccion: document.getElementById('direccion').value,
        telefono: document.getElementById('telefono').value,
        horario: document.getElementById('horario').value
    };
    
    guardarConfiguracion();
    alert('Configuración de empresa guardada correctamente');
}

// Agregar nuevo usuario
function agregarUsuario() {
    const nuevoUsuario = {
        usuario: document.getElementById('nuevo-usuario').value,
        nombre: document.getElementById('nombre-completo').value,
        area: document.getElementById('area-usuario').value,
        acceso: document.getElementById('nivel-acceso').value
    };
    
    if (!nuevoUsuario.usuario || !nuevoUsuario.nombre || !nuevoUsuario.area) {
        alert('Por favor complete todos los campos obligatorios');
        return;
    }
    
    configuracion.usuarios.push(nuevoUsuario);
    guardarConfiguracion();
    mostrarUsuarios();
    resetForm('usuarios');
    alert('Usuario agregado correctamente');
}

// Mostrar usuarios en la tabla
function mostrarUsuarios() {
    const tbody = document.querySelector('#tabla-usuarios tbody');
    tbody.innerHTML = '';
    
    configuracion.usuarios.forEach((usuario, index) => {
        const row = document.createElement('tr');
        
        // Traducir área y nivel de acceso para mejor visualización
        let areaText = '';
        switch(usuario.area) {
            case 'caja': areaText = 'Caja'; break;
            case 'atencion': areaText = 'Atención al Cliente'; break;
            case 'almacen': areaText = 'Almacén'; break;
            case 'administracion': areaText = 'Administración'; break;
            case 'gerencia': areaText = 'Gerencia'; break;
            default: areaText = usuario.area;
        }
        
        let accesoText = '';
        switch(usuario.acceso) {
            case 'basico': accesoText = 'Básico'; break;
            case 'intermedio': accesoText = 'Intermedio'; break;
            case 'avanzado': accesoText = 'Avanzado'; break;
            case 'administrador': accesoText = 'Administrador'; break;
            default: accesoText = usuario.acceso;
        }
        
        row.innerHTML = `
            <td>${usuario.usuario}</td>
            <td>${usuario.nombre}</td>
            <td>${areaText}</td>
            <td>${accesoText}</td>
            <td>
                <button onclick="editarUsuario(${index})">Editar</button>
                <button onclick="eliminarUsuario(${index})">Eliminar</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Editar usuario
function editarUsuario(index) {
    const usuario = configuracion.usuarios[index];
    
    document.getElementById('nuevo-usuario').value = usuario.usuario;
    document.getElementById('nombre-completo').value = usuario.nombre;
    document.getElementById('area-usuario').value = usuario.area;
    document.getElementById('nivel-acceso').value = usuario.acceso;
    
    // Cambiar a la pestaña de usuarios
    document.querySelector('.tablinks[onclick*="usuarios"]').click();
    
    // Opcional: guardar el índice para actualizar en lugar de agregar
    // Esto requeriría modificar la función agregarUsuario para manejar actualizaciones
}

// Eliminar usuario
function eliminarUsuario(index) {
    if (confirm('¿Está seguro de eliminar este usuario?')) {
        configuracion.usuarios.splice(index, 1);
        guardarConfiguracion();
        mostrarUsuarios();
    }
}

// Guardar toda la configuración
function guardarConfiguracion() {
    localStorage.setItem('configuracionSistema', JSON.stringify(configuracion));
}

// Resetear formularios
function resetForm(tabName) {
    if (tabName === 'pagos') {
        document.getElementById('moneda').value = 'MXN';
        document.getElementById('comision').value = '2.5';
        const metodosPago = document.getElementById('metodos-pago');
        for (let i = 0; i < metodosPago.options.length; i++) {
            metodosPago.options[i].selected = ['efectivo', 'tarjeta'].includes(metodosPago.options[i].value);
        }
    } else if (tabName === 'usuarios') {
        document.getElementById('nuevo-usuario').value = '';
        document.getElementById('nombre-completo').value = '';
        document.getElementById('area-usuario').value = '';
        document.getElementById('nivel-acceso').value = 'basico';
    } else if (tabName === 'empresa') {
        document.getElementById('nombre-empresa').value = 'Abarrotes Pedro';
        document.getElementById('direccion').value = '';
        document.getElementById('telefono').value = '';
        document.getElementById('horario').value = '';
    }
}

// Función para cerrar sesión
function cerrarPagina() {
    if(confirm("¿Estás seguro que deseas salir?")) {
        window.location.href = "inicio.html";
    }
}
