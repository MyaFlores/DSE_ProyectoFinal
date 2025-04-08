// Variables globales
let productosAgregados = [];
let currentProveedor = null;

// Al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    // Establecer fecha actual por defecto
    document.getElementById('fecha').valueAsDate = new Date();
    
    // Cargar datos guardados si existen
    const savedData = localStorage.getItem('ingresoProveedor');
    if (savedData) {
        const data = JSON.parse(savedData);
        productosAgregados = data.productosAgregados || [];
        currentProveedor = data.currentProveedor || null;
        
        if (currentProveedor) {
            document.getElementById('proveedor').value = currentProveedor.id;
            document.getElementById('factura').value = currentProveedor.factura;
            document.getElementById('fecha').value = currentProveedor.fecha;
            document.getElementById('observaciones').value = currentProveedor.observaciones;
        }
        
        actualizarTablaProductos();
        calcularTotal();
    }
});

// Agregar producto a la lista
function agregarProducto() {
    const productoSelect = document.getElementById('producto');
    const productoText = productoSelect.options[productoSelect.selectedIndex].text;
    const productoId = productoSelect.value;
    const cantidad = parseInt(document.getElementById('cantidad').value);
    const precio = parseFloat(document.getElementById('precio').value);
    const lote = document.getElementById('lote').value;
    const vencimiento = document.getElementById('vencimiento').value;
    
    if (!productoId || !cantidad || !precio) {
        alert('Por favor complete los campos obligatorios');
        return;
    }
    
    const producto = {
        id: productoId,
        nombre: productoText,
        cantidad: cantidad,
        precio: precio,
        subtotal: cantidad * precio,
        lote: lote,
        vencimiento: vencimiento
    };
    
    productosAgregados.push(producto);
    actualizarTablaProductos();
    calcularTotal();
    limpiarCamposProducto();
    
    // Guardar en localStorage
    guardarDatosTemporales();
}

// Actualizar tabla de productos
function actualizarTablaProductos() {
    const tbody = document.getElementById('productos-agregados');
    tbody.innerHTML = '';
    
    productosAgregados.forEach((producto, index) => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${producto.id}</td>
            <td>${producto.nombre}</td>
            <td>${producto.cantidad}</td>
            <td>$${producto.precio.toFixed(2)}</td>
            <td>$${producto.subtotal.toFixed(2)}</td>
            <td>${producto.lote || '-'}</td>
            <td>${producto.vencimiento || '-'}</td>
            <td>
                <button class="danger" onclick="eliminarProducto(${index})">Eliminar</button>
            </td>
        `;
        
        tbody.appendChild(row);
    });
}

// Eliminar producto de la lista
function eliminarProducto(index) {
    if (confirm('¿Está seguro de eliminar este producto?')) {
        productosAgregados.splice(index, 1);
        actualizarTablaProductos();
        calcularTotal();
        guardarDatosTemporales();
    }
}

// Calcular total
function calcularTotal() {
    const total = productosAgregados.reduce((sum, producto) => sum + producto.subtotal, 0);
    document.getElementById('total').textContent = `$${total.toFixed(2)}`;
}

// Limpiar campos de producto
function limpiarCamposProducto() {
    document.getElementById('producto').value = '';
    document.getElementById('cantidad').value = '';
    document.getElementById('precio').value = '';
    document.getElementById('lote').value = '';
    document.getElementById('vencimiento').value = '';
}

// Limpiar todo el formulario
function limpiarFormulario() {
    if (confirm('¿Está seguro de limpiar todo el formulario?')) {
        document.getElementById('proveedor').value = '';
        document.getElementById('factura').value = '';
        document.getElementById('fecha').valueAsDate = new Date();
        document.getElementById('observaciones').value = '';
        
        productosAgregados = [];
        currentProveedor = null;
        
        actualizarTablaProductos();
        calcularTotal();
        
        // Eliminar datos temporales
        localStorage.removeItem('ingresoProveedor');
    }
}

// Cancelar ingreso
function cancelarIngreso() {
    if (confirm('¿Está seguro de cancelar este ingreso?')) {
        limpiarFormulario();
    }
}

// Guardar ingreso completo
function guardarIngreso() {
    const proveedorId = document.getElementById('proveedor').value;
    const proveedorText = document.getElementById('proveedor').options[document.getElementById('proveedor').selectedIndex].text;
    const factura = document.getElementById('factura').value;
    const fecha = document.getElementById('fecha').value;
    const observaciones = document.getElementById('observaciones').value;
    
    if (!proveedorId || !factura || !fecha || productosAgregados.length === 0) {
        alert('Por favor complete todos los campos obligatorios y agregue al menos un producto');
        return;
    }
    
    const ingreso = {
        proveedor: {
            id: proveedorId,
            nombre: proveedorText
        },
        factura: factura,
        fecha: fecha,
        observaciones: observaciones,
        productos: productosAgregados,
        total: productosAgregados.reduce((sum, producto) => sum + producto.subtotal, 0),
        fechaRegistro: new Date().toISOString()
    };
    
    // Guardar en el historial (en un sistema real esto iría a una base de datos)
    const historial = JSON.parse(localStorage.getItem('historialIngresos')) || [];
    historial.push(ingreso);
    localStorage.setItem('historialIngresos', JSON.stringify(historial));
    
    // Limpiar formulario después de guardar
    limpiarFormulario();
    
    alert('Ingreso registrado correctamente');
}

// Guardar datos temporalmente
function guardarDatosTemporales() {
    const proveedorId = document.getElementById('proveedor').value;
    const factura = document.getElementById('factura').value;
    const fecha = document.getElementById('fecha').value;
    const observaciones = document.getElementById('observaciones').value;
    
    if (proveedorId) {
        currentProveedor = {
            id: proveedorId,
            factura: factura,
            fecha: fecha,
            observaciones: observaciones
        };
    }
    
    const data = {
        productosAgregados: productosAgregados,
        currentProveedor: currentProveedor
    };
    
    localStorage.setItem('ingresoProveedor', JSON.stringify(data));
}

// Función para cerrar sesión
function cerrarPagina() {
    if(confirm("¿Estás seguro que deseas salir?")) {
        // Guardar datos temporalmente antes de salir
        guardarDatosTemporales();
        window.location.href = "inicio.html";
    }
}
