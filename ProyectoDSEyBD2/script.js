document.getElementById('registerForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const product = document.getElementById('product').value;
    const stock = document.getElementById('stock').value;
    const date = new Date().toLocaleDateString();
    
    const tableBody = document.querySelector('#registersTable tbody');
    const newRow = document.createElement('tr');
    
    newRow.innerHTML = `
        <td>${product}</td>
        <td>${stock}</td>
        <td>${date}</td>
    `;
    
    tableBody.appendChild(newRow);
    
    document.getElementById('product').value = '';
    document.getElementById('stock').value = '';
});

document.getElementById('commentForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const comment = document.getElementById('comment').value;
    const date = new Date().toLocaleDateString();
    
    const tableBody = document.querySelector('#commentsTable tbody');
    const newRow = document.createElement('tr');
    
    newRow.innerHTML = `
        <td>${comment}</td>
        <td>${date}</td>
    `;
    
    tableBody.appendChild(newRow);
    
    document.getElementById('comment').value = ''; 
});