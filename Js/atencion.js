// Datos de ejemplo (en un sistema real estos vendrían de una base de datos)
let tickets = [
    {
        id: 'TCK-1001',
        clientName: 'María González',
        clientPhone: '555-1234',
        subject: 'Producto vencido',
        type: 'reclamo',
        description: 'Compré un paquete de galletas que estaba vencido',
        date: '2023-05-15',
        status: 'resolved',
        resolvedBy: 'Juan Pérez'
    },
    {
        id: 'TCK-1002',
        clientName: 'Carlos Mendoza',
        clientPhone: '555-5678',
        subject: 'Sugerencia de producto',
        type: 'sugerencia',
        description: 'Sería bueno que tengan más variedad de productos orgánicos',
        date: '2023-05-18',
        status: 'pending',
        resolvedBy: ''
    },
    {
        id: 'TCK-1003',
        clientName: 'Ana López',
        clientPhone: '555-9012',
        subject: 'Consulta sobre horarios',
        type: 'consulta',
        description: '¿A qué hora cierran los domingos?',
        date: '2023-05-20',
        status: 'resolved',
        resolvedBy: 'Luisa Ramírez'
    }
];

// Al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    loadTickets();
    
    // Cargar tickets desde localStorage si existen
    const savedTickets = localStorage.getItem('customerTickets');
    if (savedTickets) {
        tickets = JSON.parse(savedTickets);
        loadTickets();
    }
});

// Cargar tickets en la tabla
function loadTickets(filter = 'all') {
    const tbody = document.querySelector('#ticketsTable tbody');
    tbody.innerHTML = '';
    
    let filteredTickets = tickets;
    
    if (filter !== 'all') {
        filteredTickets = tickets.filter(ticket => ticket.status === filter);
    }
    
    filteredTickets.forEach(ticket => {
        const row = document.createElement('tr');
        
        // Determinar clase de estado
        let statusClass = '';
        if (ticket.status === 'pending') statusClass = 'status-pending';
        else if (ticket.status === 'resolved') statusClass = 'status-resolved';
        else if (ticket.status === 'cancelled') statusClass = 'status-cancelled';
        
        // Traducir estado
        let statusText = '';
        if (ticket.status === 'pending') statusText = 'Pendiente';
        else if (ticket.status === 'resolved') statusText = 'Resuelto';
        else if (ticket.status === 'cancelled') statusText = 'Cancelado';
        
        row.innerHTML = `
            <td>${ticket.id}</td>
            <td>${ticket.clientName}</td>
            <td>${ticket.subject}</td>
            <td>${formatDate(ticket.date)}</td>
            <td class="${statusClass}">${statusText}</td>
            <td>
                <button onclick="viewTicket('${ticket.id}')">Ver</button>
                <button onclick="editTicket('${ticket.id}')">Editar</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Filtrar tickets
function filterTickets(filter) {
    loadTickets(filter);
}

// Buscar tickets
function searchTickets() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const tbody = document.querySelector('#ticketsTable tbody');
    tbody.innerHTML = '';
    
    const filteredTickets = tickets.filter(ticket => 
        ticket.clientName.toLowerCase().includes(searchTerm) ||
        ticket.id.toLowerCase().includes(searchTerm) ||
        ticket.subject.toLowerCase().includes(searchTerm)
    );
    
    filteredTickets.forEach(ticket => {
        const row = document.createElement('tr');
        
        let statusClass = '';
        if (ticket.status === 'pending') statusClass = 'status-pending';
        else if (ticket.status === 'resolved') statusClass = 'status-resolved';
        else if (ticket.status === 'cancelled') statusClass = 'status-cancelled';
        
        let statusText = '';
        if (ticket.status === 'pending') statusText = 'Pendiente';
        else if (ticket.status === 'resolved') statusText = 'Resuelto';
        else if (ticket.status === 'cancelled') statusText = 'Cancelado';
        
        row.innerHTML = `
            <td>${ticket.id}</td>
            <td>${ticket.clientName}</td>
            <td>${ticket.subject}</td>
            <td>${formatDate(ticket.date)}</td>
            <td class="${statusClass}">${statusText}</td>
            <td>
                <button onclick="viewTicket('${ticket.id}')">Ver</button>
                <button onclick="editTicket('${ticket.id}')">Editar</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Abrir modal para nuevo ticket
function openNewTicketModal() {
    document.getElementById('modalTitle').textContent = 'Nuevo Ticket';
    document.getElementById('ticketForm').reset();
    document.getElementById('ticketId').value = '';
    document.getElementById('statusGroup').style.display = 'none';
    document.getElementById('ticketModal').style.display = 'flex';
}

// Ver ticket
function viewTicket(ticketId) {
    const ticket = tickets.find(t => t.id === ticketId);
    if (!ticket) return;
    
    document.getElementById('modalTitle').textContent = `Ticket ${ticket.id}`;
    document.getElementById('ticketId').value = ticket.id;
    document.getElementById('clientName').value = ticket.clientName;
    document.getElementById('clientPhone').value = ticket.clientPhone;
    document.getElementById('ticketSubject').value = ticket.subject;
    document.getElementById('ticketType').value = ticket.type;
    document.getElementById('ticketDescription').value = ticket.description;
    document.getElementById('ticketStatus').value = ticket.status;
    
    // Deshabilitar campos para solo lectura
    document.getElementById('clientName').readOnly = true;
    document.getElementById('clientPhone').readOnly = true;
    document.getElementById('ticketSubject').readOnly = true;
    document.getElementById('ticketType').disabled = true;
    document.getElementById('ticketDescription').readOnly = true;
    document.getElementById('ticketStatus').disabled = true;
    
    document.getElementById('statusGroup').style.display = 'block';
    document.querySelector('.modal-actions').style.display = 'none';
    
    document.getElementById('ticketModal').style.display = 'flex';
}

// Editar ticket
function editTicket(ticketId) {
    const ticket = tickets.find(t => t.id === ticketId);
    if (!ticket) return;
    
    document.getElementById('modalTitle').textContent = `Editar Ticket ${ticket.id}`;
    document.getElementById('ticketId').value = ticket.id;
    document.getElementById('clientName').value = ticket.clientName;
    document.getElementById('clientPhone').value = ticket.clientPhone;
    document.getElementById('ticketSubject').value = ticket.subject;
    document.getElementById('ticketType').value = ticket.type;
    document.getElementById('ticketDescription').value = ticket.description;
    document.getElementById('ticketStatus').value = ticket.status;
    
    // Habilitar campos para edición
    document.getElementById('clientName').readOnly = false;
    document.getElementById('clientPhone').readOnly = false;
    document.getElementById('ticketSubject').readOnly = false;
    document.getElementById('ticketType').disabled = false;
    document.getElementById('ticketDescription').readOnly = false;
    document.getElementById('ticketStatus').disabled = false;
    
    document.getElementById('statusGroup').style.display = 'block';
    document.querySelector('.modal-actions').style.display = 'flex';
    
    document.getElementById('ticketModal').style.display = 'flex';
}

// Cerrar modal
function closeModal() {
    document.getElementById('ticketModal').style.display = 'none';
}

// Guardar ticket
function saveTicket() {
    const ticketId = document.getElementById('ticketId').value;
    const isNew = ticketId === '';
    
    const ticketData = {
        id: isNew ? 'TCK-' + (1000 + tickets.length + 1) : ticketId,
        clientName: document.getElementById('clientName').value,
        clientPhone: document.getElementById('clientPhone').value,
        subject: document.getElementById('ticketSubject').value,
        type: document.getElementById('ticketType').value,
        description: document.getElementById('ticketDescription').value,
        status: document.getElementById('ticketStatus').value,
        date: isNew ? new Date().toISOString().split('T')[0] : tickets.find(t => t.id === ticketId).date,
        resolvedBy: isNew ? '' : tickets.find(t => t.id === ticketId).resolvedBy
    };
    
    if (isNew) {
        tickets.push(ticketData);
    } else {
        const index = tickets.findIndex(t => t.id === ticketId);
        tickets[index] = ticketData;
    }
    
    // Guardar en localStorage
    localStorage.setItem('customerTickets', JSON.stringify(tickets));
    
    loadTickets();
    closeModal();
    alert(`Ticket ${isNew ? 'creado' : 'actualizado'} correctamente`);
}

// Formatear fecha
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
}

// Función para cerrar sesión
function cerrarPagina() {
    if(confirm("¿Estás seguro que deseas salir?")) {
        window.location.href = "inicio.html";
    }
}
