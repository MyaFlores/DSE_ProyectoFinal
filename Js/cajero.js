// Variables de estado
let currentSale = {
    id: generateSaleId(),
    date: new Date(),
    items: [],
    total: 0,
    status: 'pending'
};

let selectedPaymentMethod = null;

// Al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    // Actualizar fecha y cajero
    updateSaleInfo();
    
    // Cargar venta desde localStorage si existe
    const savedSale = localStorage.getItem('currentSale');
    if (savedSale) {
        currentSale = JSON.parse(savedSale);
        updateSaleDisplay();
    }
});

// Generar ID de venta
function generateSaleId() {
    return 'V-' + Math.floor(10000 + Math.random() * 90000);
}

// Actualizar información de venta
function updateSaleInfo() {
    document.getElementById('sale-id').textContent = currentSale.id;
    document.getElementById('sale-date').textContent = currentSale.date.toLocaleDateString();
    // En un sistema real, el nombre del cajero vendría de la sesión
    document.getElementById('cashier-name').textContent = 'Juan Pérez';
}

// Limpiar formulario
function clearForm() {
    document.getElementById('product-name').value = '';
    document.getElementById('product-price').value = '';
    document.getElementById('product-quantity').value = 1;
}

// Agregar producto manualmente
function addManualItem() {
    const name = document.getElementById('product-name').value.trim();
    const price = parseFloat(document.getElementById('product-price').value);
    const quantity = parseInt(document.getElementById('product-quantity').value);
    
    if (!name || isNaN(price) || price <= 0 || isNaN(quantity) || quantity <= 0) {
        alert('Por favor complete todos los campos correctamente');
        return;
    }
    
    // Buscar si el producto ya está en la venta
    const existingItem = currentSale.items.find(item => item.name.toLowerCase() === name.toLowerCase());
    
    if (existingItem) {
        existingItem.quantity += quantity;
        existingItem.subtotal = existingItem.quantity * existingItem.price;
    } else {
        currentSale.items.push({
            id: Date.now(), // ID temporal
            name: name,
            price: price,
            quantity: quantity,
            subtotal: price * quantity
        });
    }
    
    // Actualizar total
    currentSale.total = currentSale.items.reduce((sum, item) => sum + item.subtotal, 0);
    
    // Actualizar pantalla y guardar
    updateSaleDisplay();
    saveCurrentSale();
    clearForm();
}

// Eliminar producto de la venta
function removeFromSale(productId) {
    const itemIndex = currentSale.items.findIndex(item => item.id === productId);
    
    if (itemIndex !== -1) {
        currentSale.items.splice(itemIndex, 1);
        
        // Actualizar total
        currentSale.total = currentSale.items.reduce((sum, item) => sum + item.subtotal, 0);
        
        // Actualizar pantalla y guardar
        updateSaleDisplay();
        saveCurrentSale();
    }
}

// Actualizar la visualización de la venta
function updateSaleDisplay() {
    const saleItems = document.getElementById('sale-items');
    saleItems.innerHTML = '';
    
    currentSale.items.forEach(item => {
        const saleItem = document.createElement('div');
        saleItem.className = 'sale-item';
        saleItem.innerHTML = `
            <div class="item-name">${item.name} x${item.quantity}</div>
            <div class="item-price">$${item.subtotal.toFixed(2)}</div>
            <div class="item-actions">
                <span class="remove-item" onclick="removeFromSale(${item.id})">✕</span>
            </div>
        `;
        saleItems.appendChild(saleItem);
    });
    
    document.getElementById('sale-total').textContent = `$${currentSale.total.toFixed(2)}`;
}

// Guardar venta actual en localStorage
function saveCurrentSale() {
    localStorage.setItem('currentSale', JSON.stringify(currentSale));
}

// Cancelar venta
function cancelSale() {
    if (confirm('¿Está seguro de cancelar esta venta?')) {
        currentSale = {
            id: generateSaleId(),
            date: new Date(),
            items: [],
            total: 0,
            status: 'cancelled'
        };
        
        localStorage.removeItem('currentSale');
        updateSaleDisplay();
        updateSaleInfo();
    }
}

// Procesar pago
function processPayment() {
    if (currentSale.items.length === 0) {
        alert('No hay productos en la venta actual');
        return;
    }
    
    // Mostrar área de pago
    document.getElementById('payment-area').style.display = 'block';
    document.querySelector('.manual-entry').style.display = 'none';
}

// Seleccionar método de pago
function selectPaymentMethod(method) {
    selectedPaymentMethod = method;
    
    // Actualizar selección visual
    document.querySelectorAll('.payment-method').forEach(el => {
        el.classList.remove('selected');
    });
    event.target.closest('.payment-method').classList.add('selected');
    
    // Mostrar detalles específicos del método de pago
    const paymentDetails = document.getElementById('payment-details');
    paymentDetails.innerHTML = '';
    paymentDetails.style.display = 'block';
    
    switch(method) {
        case 'efectivo':
            paymentDetails.innerHTML = `
                <h4>Pago en Efectivo</h4>
                <div style="margin-top: 1rem;">
                    <label>Monto Recibido:</label>
                    <input type="number" id="cash-received" min="${currentSale.total}" step="0.01" 
                           style="width: 100%; padding: 0.5rem; margin-top: 0.5rem;">
                    <p id="cash-change" style="margin-top: 0.5rem; font-weight: bold;"></p>
                </div>
            `;
            
            // Calcular cambio cuando se ingrese el monto
            document.getElementById('cash-received')?.addEventListener('input', function() {
                const received = parseFloat(this.value) || 0;
                const change = received - currentSale.total;
                document.getElementById('cash-change').textContent = 
                    `Cambio: $${change >= 0 ? change.toFixed(2) : '0.00'}`;
            });
            break;
            
        case 'tarjeta':
            paymentDetails.innerHTML = `
                <h4>Pago con Tarjeta</h4>
                <div style="margin-top: 1rem;">
                    <label>Últimos 4 dígitos:</label>
                    <input type="text" id="card-last4" maxlength="4" 
                           style="width: 100%; padding: 0.5rem; margin-top: 0.5rem;">
                </div>
            `;
            break;
            
        case 'transferencia':
            paymentDetails.innerHTML = `
                <h4>Transferencia Bancaria</h4>
                <div style="margin-top: 1rem;">
                    <label>Referencia:</label>
                    <input type="text" id="transfer-ref" 
                           style="width: 100%; padding: 0.5rem; margin-top: 0.5rem;">
                </div>
            `;
            break;
            
        case 'dolares':
            paymentDetails.innerHTML = `
                <h4>Pago en Dólares</h4>
                <div style="margin-top: 1rem;">
                    <label>Tipo de Cambio:</label>
                    <input type="number" id="exchange-rate" value="20" step="0.01" 
                           style="width: 100%; padding: 0.5rem; margin-top: 0.5rem;">
                    <p style="margin-top: 0.5rem;">
                        Total: $${(currentSale.total / 20).toFixed(2)} USD
                    </p>
                </div>
            `;
            
            // Actualizar total cuando cambie el tipo de cambio
            document.getElementById('exchange-rate')?.addEventListener('input', function() {
                const rate = parseFloat(this.value) || 20;
                document.querySelector('#payment-details p').textContent = 
                    `Total: $${(currentSale.total / rate).toFixed(2)} USD`;
            });
            break;
    }
}

// Cancelar pago y volver a la venta
function cancelPayment() {
    document.getElementById('payment-area').style.display = 'none';
    document.querySelector('.manual-entry').style.display = 'grid';
    selectedPaymentMethod = null;
}

// Completar la venta
function completeSale() {
    if (!selectedPaymentMethod) {
        alert('Por favor seleccione un método de pago');
        return;
    }
    
    // Validar detalles según el método de pago
    if (selectedPaymentMethod === 'efectivo') {
        const received = parseFloat(document.getElementById('cash-received').value) || 0;
        if (received < currentSale.total) {
            alert('El monto recibido es menor al total de la venta');
            return;
        }
    }
    
    // Guardar información del pago
    currentSale.payment = {
        method: selectedPaymentMethod,
        details: getPaymentDetails()
    };
    currentSale.status = 'completed';
    currentSale.date = new Date();
    
    // Guardar en el historial (en un sistema real se enviaría a una base de datos)
    saveToHistory(currentSale);
    
    // Crear nueva venta
    currentSale = {
        id: generateSaleId(),
        date: new Date(),
        items: [],
        total: 0,
        status: 'pending'
    };
    
    // Actualizar pantalla
    updateSaleDisplay();
    updateSaleInfo();
    cancelPayment();
    
    // Mostrar ticket (en un sistema real se imprimiría)
    alert('Venta completada con éxito');
}

// Obtener detalles del pago según el método seleccionado
function getPaymentDetails() {
    switch(selectedPaymentMethod) {
        case 'efectivo':
            return {
                received: parseFloat(document.getElementById('cash-received').value),
                change: parseFloat(document.getElementById('cash-received').value) - currentSale.total
            };
            
        case 'tarjeta':
            return {
                last4: document.getElementById('card-last4').value
            };
            
        case 'transferencia':
            return {
                reference: document.getElementById('transfer-ref').value
            };
            
        case 'dolares':
            return {
                exchangeRate: parseFloat(document.getElementById('exchange-rate').value),
                totalUSD: currentSale.total / parseFloat(document.getElementById('exchange-rate').value)
            };
            
        default:
            return {};
    }
}

// Guardar venta en el historial (simulado)
function saveToHistory(sale) {
    const salesHistory = JSON.parse(localStorage.getItem('salesHistory')) || [];
    salesHistory.push(sale);
    localStorage.setItem('salesHistory', JSON.stringify(salesHistory));
    localStorage.removeItem('currentSale');
}

// Función para cerrar sesión
function cerrarPagina() {
    if(confirm("¿Estás seguro que deseas salir?")) {
        // Guardar venta actual antes de salir
        saveCurrentSale();
        window.location.href = "inicio.html";
    }
}
