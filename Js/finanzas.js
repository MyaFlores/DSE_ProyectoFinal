        // Datos de ejemplo (en un sistema real estos vendrían de una base de datos o API)
        let financialData = {
            ingresos: 12500,
            gastos: 7800,
            evolucionVentas: [40, 30, 35, 20, 25, 10, 15, 20, 30, 35, 40, 45],
            gastosCategorias: [
                { name: "Proveedores", value: 3500 },
                { name: "Nómina", value: 2500 },
                { name: "Servicios", value: 1000 },
                { name: "Otros", value: 800 }
            ],
            ingresosMensuales: [6000, 7000, 5000, 8000, 6500, 7500, 9000, 8500, 9500, 10000, 11000, 12000],
            rentabilidad: [
                { x: 20, y: 70 },
                { x: 35, y: 55 },
                { x: 50, y: 60 },
                { x: 65, y: 40 },
                { x: 80, y: 30 }
            ],
            ventasCategorias: [
                { name: "Abarrotes", value: 7500 },
                { name: "Lácteos", value: 3000 },
                { name: "Bebidas", value: 2000 }
            ]
        };

        // Al cargar la página
        document.addEventListener('DOMContentLoaded', function() {
            // Cargar datos desde localStorage si existen
            const savedData = localStorage.getItem('financialData');
            if (savedData) {
                financialData = JSON.parse(savedData);
            }
            
            // Configurar evento para el selector de periodo
            document.getElementById('periodo').addEventListener('change', function() {
                if (this.value === 'personalizado') {
                    document.getElementById('fechaInicio').style.display = 'block';
                    document.getElementById('fechaFin').style.display = 'block';
                } else {
                    document.getElementById('fechaInicio').style.display = 'none';
                    document.getElementById('fechaFin').style.display = 'none';
                }
            });
            
            // Actualizar gráficos
            updateCharts();
        });
        
        // Aplicar filtros
        function aplicarFiltros() {
            const periodo = document.getElementById('periodo').value;
            let filteredData = {};
            
            // Aquí iría la lógica para filtrar los datos según el periodo seleccionado
            // Por ahora usamos los mismos datos de ejemplo para todos los periodos
            
            // Actualizar los gráficos con los datos filtrados
            updateCharts();
        }
        
        // Actualizar todos los gráficos
        function updateCharts() {
            updateSummary();
            updateLineChart();
            updatePieChart();
            updateVerticalBars();
            updateXYChart();
            updateCategoryBars();
        }
        
        // Actualizar resumen financiero
        function updateSummary() {
            document.getElementById('ingresos-totales').textContent = `$${financialData.ingresos.toLocaleString()}`;
            document.getElementById('gastos-totales').textContent = `$${financialData.gastos.toLocaleString()}`;
            document.getElementById('beneficio-neto').textContent = `$${(financialData.ingresos - financialData.gastos).toLocaleString()}`;
            
            // Actualizar barras horizontales
            const maxValue = Math.max(financialData.ingresos, financialData.gastos);
            const ingresosWidth = (financialData.ingresos / maxValue * 100) + '%';
            const gastosWidth = (financialData.gastos / maxValue * 100) + '%';
            
            document.getElementById('barra-ingresos').style.width = ingresosWidth;
            document.getElementById('barra-gastos').style.width = gastosWidth;
        }
        
        // Actualizar gráfico de líneas
        function updateLineChart() {
            const svg = document.getElementById('lineChart');
            const path = document.getElementById('lineChartPath');
            
            // Limpiar puntos anteriores
            const oldPoints = svg.querySelectorAll('circle');
            oldPoints.forEach(point => point.remove());
            
            // Crear puntos para el gráfico
            const points = financialData.evolucionVentas.map((value, index) => {
                const x = (index / (financialData.evolucionVentas.length - 1)) * 100;
                const y = 50 - (value / 50 * 40); // Ajustar escala
                return `${x},${y}`;
            }).join(' ');
            
            path.setAttribute('points', points);
            
            // Agregar puntos al gráfico
            financialData.evolucionVentas.forEach((value, index) => {
                const x = (index / (financialData.evolucionVentas.length - 1)) * 100;
                const y = 50 - (value / 50 * 40);
                
                const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                circle.setAttribute('cx', x);
                circle.setAttribute('cy', y);
                circle.setAttribute('r', '1.5');
                circle.setAttribute('fill', '#3498db');
                
                svg.appendChild(circle);
            });
        }
        
        // Actualizar gráfico de pastel
        function updatePieChart() {
            const svg = document.getElementById('pieChart');
            svg.innerHTML = '';
            
            // Calcular total para porcentajes
            const total = financialData.gastosCategorias.reduce((sum, item) => sum + item.value, 0);
            
            // Crear el gráfico de pastel
            let startAngle = 0;
            const centerX = 16;
            const centerY = 16;
            const radius = 16;
            
            // Colores para las categorías
            const colors = ['#e74c3c', '#f1c40f', '#2ecc71', '#9b59b6', '#3498db'];
            
            financialData.gastosCategorias.forEach((item, index) => {
                const percentage = item.value / total;
                const endAngle = startAngle + percentage * 2 * Math.PI;
                
                // Crear arco
                const x1 = centerX + radius * Math.cos(startAngle);
                const y1 = centerY + radius * Math.sin(startAngle);
                const x2 = centerX + radius * Math.cos(endAngle);
                const y2 = centerY + radius * Math.sin(endAngle);
                
                const largeArcFlag = percentage > 0.5 ? 1 : 0;
                
                const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                path.setAttribute('d', 
                    `M${centerX},${centerY} L${x1},${y1} A${radius},${radius} 0 ${largeArcFlag},1 ${x2},${y2} Z`
                );
                path.setAttribute('fill', colors[index % colors.length]);
                
                svg.appendChild(path);
                
                startAngle = endAngle;
            });
            
            // Agregar círculo central para efecto donut
            const centerCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            centerCircle.setAttribute('cx', centerX);
            centerCircle.setAttribute('cy', centerY);
            centerCircle.setAttribute('r', radius * 0.5);
            centerCircle.setAttribute('fill', '#f5f6fa');
            svg.appendChild(centerCircle);
        }
        
        // Actualizar barras verticales
        function updateVerticalBars() {
            const container = document.getElementById('verticalBars');
            container.innerHTML = '';
            
            const maxValue = Math.max(...financialData.ingresosMensuales);
            const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
            
            financialData.ingresosMensuales.forEach((value, index) => {
                if (index < 6) { // Mostrar solo los primeros 6 meses por simplicidad
                    const height = (value / maxValue * 100) + '%';
                    
                    const bar = document.createElement('div');
                    bar.className = 'vbar';
                    bar.style.height = height;
                    bar.textContent = monthNames[index];
                    
                    // Tooltip con el valor exacto
                    bar.title = `$${value.toLocaleString()}`;
                    
                    container.appendChild(bar);
                }
            });
        }
        
        // Actualizar gráfico XY
        function updateXYChart() {
            const svg = document.getElementById('xyChart');
            
            // Limpiar puntos anteriores
            const oldPoints = svg.querySelectorAll('circle:not([cx="10"])');
            oldPoints.forEach(point => point.remove());
            
            // Agregar puntos al gráfico
            financialData.rentabilidad.forEach(point => {
                const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                circle.setAttribute('cx', point.x);
                circle.setAttribute('cy', point.y);
                circle.setAttribute('r', '2');
                circle.setAttribute('fill', '#9b59b6');
                
                svg.appendChild(circle);
            });
        }
        
        // Actualizar barras de categorías
        function updateCategoryBars() {
            const container = document.getElementById('categoriasBars');
            container.innerHTML = '';
            
            const maxValue = Math.max(...financialData.ventasCategorias.map(item => item.value));
            
            financialData.ventasCategorias.forEach(item => {
                const width = (item.value / maxValue * 100) + '%';
                
                const bar = document.createElement('div');
                bar.className = 'bar';
                bar.style.width = width;
                bar.textContent = item.name;
                bar.title = `$${item.value.toLocaleString()}`;
                
                // Color aleatorio para cada barra
                const randomColor = `hsl(${Math.random() * 360}, 70%, 50%)`;
                bar.style.backgroundColor = randomColor;
                
                container.appendChild(bar);
            });
        }
        
        // Función para cerrar sesión
        function cerrarPagina() {
            if(confirm("¿Estás seguro que deseas salir?")) {
                window.location.href = "inicio.html";
            }
        }
  