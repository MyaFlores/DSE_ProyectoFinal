// Al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    loadRegisters();
    loadComments();
    
    // Configurar formulario de registro
    document.getElementById('registerForm').addEventListener('submit', function(e) {
        e.preventDefault();
        addRegister();
    });
    
    // Configurar formulario de comentario
    document.getElementById('commentForm').addEventListener('submit', function(e) {
        e.preventDefault();
        addComment();
    });
});

// Cargar registros desde LocalStorage
function loadRegisters() {
    const registers = JSON.parse(localStorage.getItem('inventoryRegisters')) || [];
    const tbody = document.querySelector('#registersTable tbody');
    tbody.innerHTML = '';
    
    registers.forEach((register, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${register.product}</td>
            <td>${register.stock}</td>
            <td>${new Date(register.date).toLocaleDateString()}</td>
            <td>
                <button onclick="editRegister(${index})">Editar</button>
                <button onclick="deleteRegister(${index})">Eliminar</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Cargar comentarios desde LocalStorage
function loadComments() {
    const comments = JSON.parse(localStorage.getItem('inventoryComments')) || [];
    const tbody = document.querySelector('#commentsTable tbody');
    tbody.innerHTML = '';
    
    comments.forEach((comment, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${comment.text}</td>
            <td>${new Date(comment.date).toLocaleDateString()}</td>
            <td>
                <button onclick="deleteComment(${index})">Eliminar</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Agregar nuevo registro
function addRegister() {
    const product = document.getElementById('product').value.trim();
    const stock = parseInt(document.getElementById('stock').value);
    
    if (!product || isNaN(stock)) {
        alert('Por favor complete todos los campos correctamente');
        return;
    }
    
    const registers = JSON.parse(localStorage.getItem('inventoryRegisters')) || [];
    registers.push({
        product,
        stock,
        date: new Date().toISOString()
    });
    
    localStorage.setItem('inventoryRegisters', JSON.stringify(registers));
    document.getElementById('registerForm').reset();
    loadRegisters();
}

// Agregar nuevo comentario
function addComment() {
    const comment = document.getElementById('comment').value.trim();
    
    if (!comment) {
        alert('Por favor ingrese un comentario');
        return;
    }
    
    const comments = JSON.parse(localStorage.getItem('inventoryComments')) || [];
    comments.push({
        text: comment,
        date: new Date().toISOString()
    });
    
    localStorage.setItem('inventoryComments', JSON.stringify(comments));
    document.getElementById('commentForm').reset();
    loadComments();
}

// Editar registro
function editRegister(index) {
    const registers = JSON.parse(localStorage.getItem('inventoryRegisters')) || [];
    const register = registers[index];
    
    const newProduct = prompt('Editar producto:', register.product);
    if (newProduct === null) return;
    
    const newStock = prompt('Editar stock:', register.stock);
    if (newStock === null) return;
    
    registers[index] = {
        product: newProduct.trim(),
        stock: parseInt(newStock),
        date: register.date
    };
    
    localStorage.setItem('inventoryRegisters', JSON.stringify(registers));
    loadRegisters();
}

// Eliminar registro
function deleteRegister(index) {
    if (confirm('¿Está seguro de eliminar este registro?')) {
        const registers = JSON.parse(localStorage.getItem('inventoryRegisters')) || [];
        registers.splice(index, 1);
        localStorage.setItem('inventoryRegisters', JSON.stringify(registers));
        loadRegisters();
    }
}

// Eliminar comentario
function deleteComment(index) {
    if (confirm('¿Está seguro de eliminar este comentario?')) {
        const comments = JSON.parse(localStorage.getItem('inventoryComments')) || [];
        comments.splice(index, 1);
        localStorage.setItem('inventoryComments', JSON.stringify(comments));
        loadComments();
    }
}

// Función para cerrar sesión
function cerrarPagina() {
    if(confirm("¿Estás seguro que deseas salir?")) {
        window.location.href = "inicio.html";
    }
}
