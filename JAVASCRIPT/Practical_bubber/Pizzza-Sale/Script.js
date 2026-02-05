// Configuration
const CSV_PATH = "./Pizza Data/pizza_sales.csv"; 
const ITEMS_PER_PAGE = 10;

// Global variables
let pizzaData = [];
let filteredData = [];
let currentPage = 1;
let charts = {};
let colorPalette = [
    '#FF6B6B', '#4ECDC4', '#FFD166', '#06D6A0', '#118AB2',
    '#9D4EDD', '#FF9E00', '#EF476F', '#83C5BE', '#006D77'
];

// DOM Elements
document.addEventListener('DOMContentLoaded', function() {
    // Set current date
    const currentDate = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    document.getElementById('currentDate').textContent = currentDate;

    // Show loading state
    showLoading(true);

    // Load data from CSV
    loadCSVData();

    // Event Listeners
    document.getElementById('applyFilters').addEventListener('click', applyFilters);
    document.getElementById('resetFilters').addEventListener('click', resetFilters);
    document.getElementById('exportData').addEventListener('click', exportToCSV);
    document.getElementById('searchInput').addEventListener('input', filterTable);
    document.getElementById('prevPage').addEventListener('click', () => changePage(-1));
    document.getElementById('nextPage').addEventListener('click', () => changePage(1));
    document.getElementById('trendPeriod').addEventListener('change', renderCharts);
    document.getElementById('topCount').addEventListener('change', renderCharts);
    
    // Toggle buttons for category chart
    document.querySelectorAll('.toggle-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.toggle-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            renderCategoryChart();
        });
    });
});

// Show/hide loading state
function showLoading(show) {
    const loadingOverlay = document.getElementById('loadingOverlay');
    if (show) {
        if (!loadingOverlay) {
            const overlay = document.createElement('div');
            overlay.id = 'loadingOverlay';
            overlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(15, 52, 96, 0.9);
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                z-index: 9999;
                color: white;
            `;
            overlay.innerHTML = `
                <div class="spinner" style="
                    border: 5px solid rgba(255, 255, 255, 0.3);
                    border-radius: 50%;
                    border-top: 5px solid #FF6B6B;
                    width: 50px;
                    height: 50px;
                    animation: spin 1s linear infinite;
                    margin-bottom: 20px;
                "></div>
                <h3>Loading Pizza Data...</h3>
                <p>Please wait while we fetch your sales data</p>
            `;
            document.body.appendChild(overlay);
        }
    } else {
        if (loadingOverlay) {
            loadingOverlay.remove();
        }
    }
}

// Load CSV Data
async function loadCSVData() {
    try {
        const response = await fetch(CSV_PATH);
        if (!response.ok) {
            throw new Error(`Failed to load CSV file. Please make sure '${CSV_PATH}' exists in the same folder.`);
        }
        
        const csvText = await response.text();
        pizzaData = parseCSV(csvText);
        
        if (pizzaData.length === 0) {
            throw new Error('CSV file is empty or contains no valid data');
        }
        
        console.log(`Successfully loaded ${pizzaData.length} records`);
        
        // Set default date range
        setDefaultDateRange();
        
        // Populate filter options
        populateFilters();
        
        // Initial render
        applyFilters();
        
        document.getElementById('dataInfo').textContent = `Loaded ${pizzaData.length} orders from CSV`;
        
    } catch (error) {
        console.error('Error loading CSV:', error);
        document.getElementById('dataInfo').textContent = `Error: ${error.message}`;
        document.getElementById('dataInfo').style.color = '#FF6B6B';
        
        // Show error in KPI cards instead of sample data
        updateKPIs();
        renderEmptyCharts();
        renderEmptyTable();
        renderEmptyInsights();
        
        // Show error message to user
        setTimeout(() => {
            alert(`Error loading CSV data:\n\n${error.message}\n\nPlease make sure:\n1. The CSV file exists at '${CSV_PATH}'\n2. The CSV has the correct format\n3. You're running on a local server (like Live Server) to avoid CORS issues`);
        }, 500);
    } finally {
        // Hide loading overlay
        showLoading(false);
    }
}

// Parse CSV with proper handling
function parseCSV(csvText) {
    const lines = csvText.trim().split('\n');
    if (lines.length < 2) return [];
    
    const headers = lines[0].split(',').map(h => h.trim());
    
    const data = [];
    
    for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue;
        
        // Handle quoted fields with commas
        const regex = /(".*?"|[^",]+)(?=\s*,|\s*$)/g;
        const values = lines[i].match(regex) || [];
        
        const row = {};
        headers.forEach((header, index) => {
            let value = values[index] ? values[index].trim().replace(/"/g, '') : '';
            
            // Convert numeric fields
            if (['quantity', 'unit_price', 'total_price'].includes(header)) {
                value = parseFloat(value) || 0;
            }
            
            // Parse pizza_id and order_id if they exist
            if (['pizza_id', 'order_id'].includes(header)) {
                value = parseFloat(value) || 0;
            }
            
            row[header] = value;
        });
        
        // Parse date and time
        if (row.order_date) {
            try {
                const [month, day, year] = row.order_date.split('/').map(Number);
                row.dateObj = new Date(year, month - 1, day);
                row.dayOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][row.dateObj.getDay()];
                row.monthYear = `${year}-${String(month).padStart(2, '0')}`;
            } catch (e) {
                console.warn('Error parsing date:', row.order_date);
                row.dateObj = new Date();
                row.dayOfWeek = 'Unknown';
                row.monthYear = 'Unknown';
            }
        }
        
        if (row.order_time) {
            try {
                const [hours] = row.order_time.split(':').map(Number);
                row.hourOfDay = hours;
            } catch (e) {
                console.warn('Error parsing time:', row.order_time);
                row.hourOfDay = 0;
            }
        }
        
        // Parse ingredients list
        if (row.pizza_ingredients) {
            row.ingredientsList = row.pizza_ingredients.replace(/"/g, '').split(',').map(i => i.trim());
        }
        
        data.push(row);
    }
    
    return data;
}

// Set default date range (last 30 days)
function setDefaultDateRange() {
    if (pizzaData.length === 0) return;
    
    const dates = pizzaData.map(d => d.dateObj).filter(d => d);
    if (dates.length === 0) return;
    
    const minDate = new Date(Math.min(...dates));
    const maxDate = new Date(Math.max(...dates));
    
    // Set default to last 30 days from max date
    const defaultFrom = new Date(maxDate);
    defaultFrom.setDate(defaultFrom.getDate() - 30);
    
    document.getElementById('dateFrom').valueAsDate = defaultFrom;
    document.getElementById('dateTo').valueAsDate = maxDate;
}

// Populate filter dropdowns
function populateFilters() {
    if (pizzaData.length === 0) return;
    
    const categories = [...new Set(pizzaData.map(d => d.pizza_category))].filter(c => c).sort();
    const sizes = [...new Set(pizzaData.map(d => d.pizza_size))].filter(s => s).sort();
    
    const categorySelect = document.getElementById('categoryFilter');
    const sizeSelect = document.getElementById('sizeFilter');
    
    categories.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat;
        option.textContent = cat;
        categorySelect.appendChild(option);
    });
    
    sizes.forEach(size => {
        const option = document.createElement('option');
        option.value = size;
        option.textContent = size;
        sizeSelect.appendChild(option);
    });
}

// Apply filters
function applyFilters() {
    if (pizzaData.length === 0) {
        updateKPIs();
        renderEmptyCharts();
        renderEmptyTable();
        renderEmptyInsights();
        return;
    }
    
    const fromDate = document.getElementById('dateFrom').value;
    const toDate = document.getElementById('dateTo').value;
    const category = document.getElementById('categoryFilter').value;
    const size = document.getElementById('sizeFilter').value;
    
    filteredData = pizzaData.filter(row => {
        // Date filter
        if (fromDate && row.dateObj) {
            const from = new Date(fromDate);
            from.setHours(0, 0, 0, 0);
            if (row.dateObj < from) return false;
        }
        
        if (toDate && row.dateObj) {
            const to = new Date(toDate);
            to.setHours(23, 59, 59, 999);
            if (row.dateObj > to) return false;
        }
        
        // Category filter
        if (category !== 'ALL' && row.pizza_category !== category) {
            return false;
        }
        
        // Size filter
        if (size !== 'ALL' && row.pizza_size !== size) {
            return false;
        }
        
        return true;
    });
    
    console.log(`Filtered to ${filteredData.length} records`);
    
    // Update everything
    updateKPIs();
    renderCharts();
    renderTable();
    generateInsights();
}

// Reset filters
function resetFilters() {
    if (pizzaData.length === 0) return;
    
    document.getElementById('dateFrom').value = '';
    document.getElementById('dateTo').value = '';
    document.getElementById('categoryFilter').value = 'ALL';
    document.getElementById('sizeFilter').value = 'ALL';
    document.getElementById('searchInput').value = '';
    
    setDefaultDateRange();
    applyFilters();
}

// Update KPI cards
function updateKPIs() {
    if (pizzaData.length === 0) {
        document.getElementById('totalRevenue').textContent = 'No Data';
        document.getElementById('totalOrders').textContent = 'No Data';
        document.getElementById('totalPizzas').textContent = 'No Data';
        document.getElementById('avgOrderValue').textContent = 'No Data';
        document.getElementById('revenueChange').textContent = 'N/A';
        document.getElementById('ordersChange').textContent = 'N/A';
        document.getElementById('pizzasChange').textContent = 'N/A';
        document.getElementById('aovChange').textContent = 'N/A';
        return;
    }
    
    if (filteredData.length === 0) {
        document.getElementById('totalRevenue').textContent = '₹0';
        document.getElementById('totalOrders').textContent = '0';
        document.getElementById('totalPizzas').textContent = '0';
        document.getElementById('avgOrderValue').textContent = '₹0';
        document.getElementById('revenueChange').textContent = '0%';
        document.getElementById('ordersChange').textContent = '0%';
        document.getElementById('pizzasChange').textContent = '0%';
        document.getElementById('aovChange').textContent = '0%';
        return;
    }
    
    // Calculate metrics
    const uniqueOrders = [...new Set(filteredData.map(d => d.order_id))];
    const totalRevenue = filteredData.reduce((sum, row) => sum + row.total_price, 0);
    const totalQuantity = filteredData.reduce((sum, row) => sum + row.quantity, 0);
    const avgOrderValue = uniqueOrders.length > 0 ? totalRevenue / uniqueOrders.length : 0;
    
    // Update display
    document.getElementById('totalRevenue').textContent = formatCurrency(totalRevenue);
    document.getElementById('totalOrders').textContent = formatNumber(uniqueOrders.length);
    document.getElementById('totalPizzas').textContent = formatNumber(totalQuantity);
    document.getElementById('avgOrderValue').textContent = formatCurrency(avgOrderValue);
}

// Render all charts
function renderCharts() {
    if (filteredData.length === 0) {
        renderEmptyCharts();
        return;
    }
    
    renderRevenueChart();
    renderCategoryChart();
    renderTopPizzasChart();
    renderHourlyChart();
    renderSizeChart();
    renderDayOfWeekChart();
}

// Render empty charts when no data
function renderEmptyCharts() {
    const chartContainers = [
        'revenueTrendChart',
        'categoryPieChart',
        'topPizzasBarChart',
        'hourlyHeatmapChart',
        'sizeDistributionChart',
        'dayOfWeekChart'
    ];
    
    chartContainers.forEach(chartId => {
        const canvas = document.getElementById(chartId);
        if (canvas) {
            const ctx = canvas.getContext('2d');
            
            // Destroy existing chart
            if (charts[chartId]) {
                charts[chartId].destroy();
            }
            
            // Clear canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Draw "No Data" message
            ctx.fillStyle = '#94a3b8';
            ctx.font = '16px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('No Data Available', canvas.width / 2, canvas.height / 2);
        }
    });
}

// Revenue Trend Chart
function renderRevenueChart() {
    const period = document.getElementById('trendPeriod').value;
    const ctx = document.getElementById('revenueTrendChart').getContext('2d');
    
    // Group data by period
    const revenueData = {};
    filteredData.forEach(row => {
        let key;
        if (period === 'daily') {
            key = row.dateObj.toISOString().split('T')[0];
        } else if (period === 'weekly') {
            const weekStart = new Date(row.dateObj);
            weekStart.setDate(row.dateObj.getDate() - row.dateObj.getDay());
            key = weekStart.toISOString().split('T')[0];
        } else {
            key = row.monthYear;
        }
        
        revenueData[key] = (revenueData[key] || 0) + row.total_price;
    });
    
    // Sort by date
    const sortedKeys = Object.keys(revenueData).sort();
    const labels = sortedKeys.map(key => {
        if (period === 'monthly') return key.split('-')[1];
        if (period === 'weekly') return `Week ${key}`;
        return key.split('-')[2];
    });
    const data = sortedKeys.map(key => revenueData[key]);
    
    // Destroy existing chart
    if (charts.revenue) charts.revenue.destroy();
    
    charts.revenue = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Revenue',
                data: data,
                borderColor: '#FF6B6B',
                backgroundColor: 'rgba(255, 107, 107, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: '#94a3b8',
                        callback: function(value) {
                            return '₹' + formatNumber(value);
                        }
                    }
                },
                x: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: '#94a3b8'
                    }
                }
            }
        }
    });
}

// Category Distribution Chart
function renderCategoryChart() {
    const metric = document.querySelector('.toggle-btn.active').dataset.metric;
    const ctx = document.getElementById('categoryPieChart').getContext('2d');
    
    // Group by category
    const categoryData = {};
    filteredData.forEach(row => {
        const category = row.pizza_category;
        if (!categoryData[category]) categoryData[category] = 0;
        
        if (metric === 'quantity') {
            categoryData[category] += row.quantity;
        } else {
            categoryData[category] += row.total_price;
        }
    });
    
    const labels = Object.keys(categoryData);
    const data = Object.values(categoryData);
    const total = data.reduce((a, b) => a + b, 0);
    
    // Destroy existing chart
    if (charts.category) charts.category.destroy();
    
    charts.category = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: colorPalette,
                borderWidth: 2,
                borderColor: '#1e293b'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '70%',
            plugins: {
                legend: {
                    position: 'right',
                    labels: {
                        color: '#94a3b8',
                        padding: 20,
                        usePointStyle: true
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const value = context.raw;
                            const percentage = ((value / total) * 100).toFixed(1);
                            return `${context.label}: ${metric === 'quantity' ? formatNumber(value) : formatCurrency(value)} (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });
}

// Top Pizzas Chart
function renderTopPizzasChart() {
    const topN = parseInt(document.getElementById('topCount').value);
    const ctx = document.getElementById('topPizzasBarChart').getContext('2d');
    
    // Group by pizza name
    const pizzaData = {};
    filteredData.forEach(row => {
        const pizza = row.pizza_name;
        if (!pizzaData[pizza]) {
            pizzaData[pizza] = {
                quantity: 0,
                revenue: 0
            };
        }
        pizzaData[pizza].quantity += row.quantity;
        pizzaData[pizza].revenue += row.total_price;
    });
    
    // Sort by quantity and take top N
    const sortedPizzas = Object.entries(pizzaData)
        .sort((a, b) => b[1].quantity - a[1].quantity)
        .slice(0, topN);
    
    const labels = sortedPizzas.map(([name]) => 
        name.length > 15 ? name.substring(0, 12) + '...' : name
    );
    const quantities = sortedPizzas.map(([_, data]) => data.quantity);
    const revenues = sortedPizzas.map(([_, data]) => data.revenue);
    
    // Destroy existing chart
    if (charts.topPizzas) charts.topPizzas.destroy();
    
    charts.topPizzas = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Quantity Sold',
                    data: quantities,
                    backgroundColor: '#4ECDC4',
                    borderColor: '#4ECDC4',
                    borderWidth: 1
                },
                {
                    label: 'Revenue',
                    data: revenues,
                    backgroundColor: '#FFD166',
                    borderColor: '#FFD166',
                    borderWidth: 1,
                    yAxisID: 'y1'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: {
                        color: '#94a3b8'
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: '#94a3b8'
                    }
                },
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: '#94a3b8',
                        callback: function(value) {
                            return formatNumber(value);
                        }
                    }
                },
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    grid: {
                        drawOnChartArea: false
                    },
                    ticks: {
                        color: '#94a3b8',
                        callback: function(value) {
                            return '₹' + formatNumber(value);
                        }
                    }
                }
            }
        }
    });
}

// Hourly Sales Chart
function renderHourlyChart() {
    const ctx = document.getElementById('hourlyHeatmapChart').getContext('2d');
    
    // Group by hour
    const hourlyData = Array(24).fill(0);
    filteredData.forEach(row => {
        if (row.hourOfDay !== undefined) {
            hourlyData[row.hourOfDay] += row.quantity;
        }
    });
    
    const labels = Array.from({length: 24}, (_, i) => `${i}:00`);
    
    // Destroy existing chart
    if (charts.hourly) charts.hourly.destroy();
    
    charts.hourly = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Pizzas Sold',
                data: hourlyData,
                backgroundColor: hourlyData.map((value, index) => {
                    const max = Math.max(...hourlyData);
                    const opacity = max > 0 ? 0.3 + (value / max) * 0.7 : 0.3;
                    return `rgba(255, 107, 107, ${opacity})`;
                }),
                borderColor: '#FF6B6B',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                x: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: '#94a3b8',
                        maxTicksLimit: 12
                    }
                },
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: '#94a3b8'
                    }
                }
            }
        }
    });
}

// Size Distribution Chart
function renderSizeChart() {
    const ctx = document.getElementById('sizeDistributionChart').getContext('2d');
    
    // Group by size
    const sizeData = {};
    filteredData.forEach(row => {
        const size = row.pizza_size;
        sizeData[size] = (sizeData[size] || 0) + row.quantity;
    });
    
    const labels = Object.keys(sizeData).sort();
    const data = labels.map(size => sizeData[size]);
    
    // Destroy existing chart
    if (charts.size) charts.size.destroy();
    
    charts.size = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: ['#FF6B6B', '#4ECDC4', '#FFD166', '#06D6A0', '#118AB2'],
                borderWidth: 2,
                borderColor: '#1e293b'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right',
                    labels: {
                        color: '#94a3b8',
                        padding: 20
                    }
                }
            }
        }
    });
}

// Day of Week Chart
function renderDayOfWeekChart() {
    const ctx = document.getElementById('dayOfWeekChart').getContext('2d');
    
    // Group by day of week
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dowData = {};
    days.forEach(day => dowData[day] = 0);
    
    filteredData.forEach(row => {
        if (row.dayOfWeek) {
            dowData[row.dayOfWeek] += row.total_price;
        }
    });
    
    const labels = days.map(day => day.substring(0, 3));
    const data = days.map(day => dowData[day]);
    
    // Destroy existing chart
    if (charts.dow) charts.dow.destroy();
    
    charts.dow = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Revenue',
                data: data,
                backgroundColor: '#06D6A0',
                borderColor: '#06D6A0',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                x: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: '#94a3b8'
                    }
                },
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: '#94a3b8',
                        callback: function(value) {
                            return '₹' + formatNumber(value);
                        }
                    }
                }
            }
        }
    });
}

// Render Data Table
function renderTable() {
    const tbody = document.getElementById('tableBody');
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    
    if (pizzaData.length === 0) {
        renderEmptyTable();
        return;
    }
    
    // Apply search filter if any
    let displayData = filteredData;
    if (searchTerm) {
        displayData = filteredData.filter(row =>
            row.order_id.toString().includes(searchTerm) ||
            row.pizza_name.toLowerCase().includes(searchTerm) ||
            row.pizza_category.toLowerCase().includes(searchTerm)
        );
    }
    
    // Pagination
    const totalPages = Math.ceil(displayData.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const pageData = displayData.slice(startIndex, endIndex);
    
    // Build table rows
    tbody.innerHTML = pageData.map(row => `
        <tr>
            <td>${row.order_id}</td>
            <td>${row.order_date}</td>
            <td>${row.order_time}</td>
            <td>${row.pizza_name}</td>
            <td><span class="category-badge" style="background: ${getCategoryColor(row.pizza_category)}">${row.pizza_category}</span></td>
            <td>${row.pizza_size}</td>
            <td>${row.quantity}</td>
            <td>${formatCurrency(row.unit_price)}</td>
            <td><strong>${formatCurrency(row.total_price)}</strong></td>
        </tr>
    `).join('');
    
    // Update pagination info
    document.getElementById('pageInfo').textContent = `Page ${currentPage} of ${totalPages}`;
    document.getElementById('rowCount').textContent = `Showing ${startIndex + 1}-${Math.min(endIndex, displayData.length)} of ${displayData.length} rows`;
    
    // Enable/disable pagination buttons
    document.getElementById('prevPage').disabled = currentPage === 1;
    document.getElementById('nextPage').disabled = currentPage === totalPages || totalPages === 0;
}

// Render empty table when no data
function renderEmptyTable() {
    const tbody = document.getElementById('tableBody');
    tbody.innerHTML = `
        <tr>
            <td colspan="9" style="text-align: center; padding: 40px; color: #94a3b8;">
                <i class="fas fa-database" style="font-size: 2rem; margin-bottom: 10px; display: block;"></i>
                <h3>No Data Available</h3>
                <p>Please make sure your CSV file is properly loaded</p>
            </td>
        </tr>
    `;
    
    document.getElementById('pageInfo').textContent = 'Page 1 of 1';
    document.getElementById('rowCount').textContent = 'Showing 0 of 0 rows';
    document.getElementById('prevPage').disabled = true;
    document.getElementById('nextPage').disabled = true;
}

// Filter table by search
function filterTable() {
    currentPage = 1;
    renderTable();
}

// Change page
function changePage(direction) {
    if (pizzaData.length === 0) return;
    
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    let displayData = filteredData;
    
    if (searchTerm) {
        displayData = filteredData.filter(row =>
            row.order_id.toString().includes(searchTerm) ||
            row.pizza_name.toLowerCase().includes(searchTerm) ||
            row.pizza_category.toLowerCase().includes(searchTerm)
        );
    }
    
    const totalPages = Math.ceil(displayData.length / ITEMS_PER_PAGE);
    currentPage += direction;
    
    if (currentPage < 1) currentPage = 1;
    if (currentPage > totalPages) currentPage = totalPages;
    
    renderTable();
}

// Generate Business Insights
function generateInsights() {
    if (filteredData.length === 0) {
        renderEmptyInsights();
        return;
    }
    
    // Peak hour insight
    const hourlySales = Array(24).fill(0);
    filteredData.forEach(row => {
        if (row.hourOfDay !== undefined) {
            hourlySales[row.hourOfDay] += row.quantity;
        }
    });
    const peakHour = hourlySales.indexOf(Math.max(...hourlySales));
    document.getElementById('peakHourInsight').textContent = 
        `Peak sales at ${peakHour}:00 (${hourlySales[peakHour]} pizzas). Consider extra staff during ${peakHour-1}:00-${peakHour+1}:00.`;
    
    // Menu optimization insight
    const pizzaSales = {};
    filteredData.forEach(row => {
        pizzaSales[row.pizza_name] = (pizzaSales[row.pizza_name] || 0) + row.quantity;
    });
    const sortedPizzas = Object.entries(pizzaSales).sort((a, b) => b[1] - a[1]);
    const topPizza = sortedPizzas[0];
    const bottomPizza = sortedPizzas[sortedPizzas.length - 1];
    document.getElementById('menuInsight').textContent = 
        `Top seller: ${topPizza[0]} (${topPizza[1]} sold). Consider promoting this pizza more.`;
    
    // Inventory insight
    const ingredientUsage = {};
    filteredData.forEach(row => {
        if (row.ingredientsList) {
            row.ingredientsList.forEach(ingredient => {
                ingredientUsage[ingredient] = (ingredientUsage[ingredient] || 0) + row.quantity;
            });
        }
    });
    const topIngredients = Object.entries(ingredientUsage)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([ing, count]) => `${ing} (${count})`);
    document.getElementById('inventoryInsight').textContent = 
        `Top ingredients needed: ${topIngredients.join(', ')}. Stock up on these.`;
    
    // Price analysis insight
    const avgPrice = filteredData.reduce((sum, row) => sum + row.unit_price, 0) / filteredData.length;
    const expensivePizzas = filteredData.filter(row => row.unit_price > avgPrice * 1.2);
    const affordablePizzas = filteredData.filter(row => row.unit_price < avgPrice * 0.8);
    document.getElementById('priceInsight').textContent = 
        `Average pizza price: ₹${avgPrice.toFixed(2)}. ${expensivePizzas.length} pizzas priced above average.`;
}

// Render empty insights when no data
function renderEmptyInsights() {
    document.getElementById('peakHourInsight').textContent = 'No data available for insights';
    document.getElementById('menuInsight').textContent = 'No data available for insights';
    document.getElementById('inventoryInsight').textContent = 'No data available for insights';
    document.getElementById('priceInsight').textContent = 'No data available for insights';
}

// Export to CSV
function exportToCSV() {
    if (filteredData.length === 0) {
        alert('No data to export');
        return;
    }
    
    const headers = ['order_id', 'order_date', 'order_time', 'pizza_name', 'pizza_category', 
                     'pizza_size', 'quantity', 'unit_price', 'total_price', 'pizza_ingredients'];
    
    const csvContent = [
        headers.join(','),
        ...filteredData.map(row => 
            headers.map(header => {
                const value = row[header];
                // Quote values that contain commas
                if (typeof value === 'string' && value.includes(',')) {
                    return `"${value}"`;
                }
                return value;
            }).join(',')
        )
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pizza_sales_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
}

// Utility Functions
function formatCurrency(amount) {
    if (typeof amount !== 'number') return '₹0';
    return '₹' + amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
}

function formatNumber(num) {
    if (typeof num !== 'number') return '0';
    return num.toLocaleString('en-IN');
}

function getCategoryColor(category) {
    const colorMap = {
        'Classic': '#FF6B6B',
        'Supreme': '#4ECDC4',
        'Veggie': '#FFD166',
        'Chicken': '#06D6A0',
        'BBQ Chicken': '#118AB2'
    };
    return colorMap[category] || '#9D4EDD';
}

// Add CSS for category badges and animations
const style = document.createElement('style');
style.textContent = `
    .category-badge {
        padding: 4px 8px;
        border-radius: 12px;
        font-size: 0.8rem;
        font-weight: 600;
        color: white;
        display: inline-block;
    }
    
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
`;
document.head.appendChild(style);