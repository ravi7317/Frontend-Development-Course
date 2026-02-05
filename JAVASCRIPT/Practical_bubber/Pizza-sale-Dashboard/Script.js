// script.js

/* ============================
   CONFIGURATION
============================ */
const CSV_PATH = "./Pizza Data/pizza_sales.csv"; // Update path as needed
const ITEMS_PER_PAGE = 50;
const COLORS = {
  Classic: "#3498db",
  Supreme: "#e74c3c",
  Veggie: "#2ecc71",
  Chicken: "#f39c12",
  "BBQ Chicken": "#d35400",
  "Mexican Green Wave": "#27ae60",
  Pepperoni: "#c0392b",
  Neapolitan: "#8e44ad",
  S: "#16a085",
  M: "#2980b9",
  L: "#8e44ad",
  XL: "#e74c3c",
  XXL: "#c0392b",
};

/* ============================
   GLOBAL STATE
============================ */
let orders = [];
let filteredOrders = [];
let currentPage = 1;
let currentDrilldown = null;
let insightsCache = {};

/* ============================
   DOM ELEMENTS
============================ */
// KPI Elements
const kpiRevenue = document.getElementById("kpiRevenue");
const kpiOrders = document.getElementById("kpiOrders");
const kpiQty = document.getElementById("kpiQty");
const kpiAOV = document.getElementById("kpiAOV");
const kpiPizzasPerOrder = document.getElementById("kpiPizzasPerOrder");
const kpiBestDay = document.getElementById("kpiBestDay");

// Filter Elements
const dateFrom = document.getElementById("dateFrom");
const dateTo = document.getElementById("dateTo");
const periodFilter = document.getElementById("periodFilter");
const categoryFilter = document.getElementById("categoryFilter");
const sizeFilter = document.getElementById("sizeFilter");
const topN = document.getElementById("topN");
const resetBtn = document.getElementById("resetBtn");

// Chart Containers
const trendChart = document.getElementById("trendChart");
const categoryDonut = document.getElementById("categoryDonut");
const categoryLegend = document.getElementById("categoryLegend");
const topPizzasBar = document.getElementById("topPizzasBar");
const sizeChart = document.getElementById("sizeChart");
const dowChart = document.getElementById("dowChart");
const hourlyHeatmap = document.getElementById("hourlyHeatmap");
const priceDistribution = document.getElementById("priceDistribution");
const ingredientsWordCloud = document.getElementById("ingredientsWordCloud");
const ingredientsTbody = document.getElementById("ingredientsTbody");
const drilldownChart = document.getElementById("drilldownChart");

// Table Elements
const ordersTbody = document.getElementById("ordersTbody");
const searchInput = document.getElementById("searchInput");
const exportBtn = document.getElementById("exportBtn");
const prevPage = document.getElementById("prevPage");
const nextPage = document.getElementById("nextPage");
const pageInfo = document.getElementById("pageInfo");
const tableCount = document.getElementById("tableCount");

// Insight Elements
const insightPeakHour = document.getElementById("insightPeakHour");
const insightMenuOpt = document.getElementById("insightMenuOpt");
const insightInventory = document.getElementById("insightInventory");
const insightPricePopularity = document.getElementById(
  "insightPricePopularity",
);

// Drilldown Elements
const drilldownPanel = document.getElementById("drilldownPanel");
const drilldownInfo = document.getElementById("drilldownInfo");
const closeDrilldown = document.getElementById("closeDrilldown");

// Other Elements
const segBtns = document.querySelectorAll(".seg-btn");
const rankMetric = document.getElementById("rankMetric");
const rankMode = document.getElementById("rankMode");

/* ============================
   UTILITY FUNCTIONS
============================ */
const formatCurrency = (n) =>
  `₹${n.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,")}`;
const formatNumber = (n) => n.toLocaleString("en-IN");
const parseDate = (dateStr) => {
  const [month, day, year] = dateStr.split("/").map(Number);
  return new Date(year, month - 1, day);
};

const getDayOfWeek = (date) => {
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return days[date.getDay()];
};

const getHourFromTime = (timeStr) => {
  const [hour] = timeStr.split(":").map(Number);
  return hour;
};

const extractIngredients = (ingredientsStr) => {
  return ingredientsStr
    .replace(/"/g, "")
    .split(", ")
    .map((i) => i.trim());
};

/* ============================
   DATA LOADING & PARSING
============================ */
async function loadData() {
  try {
    const response = await fetch(CSV_PATH);
    if (!response.ok) throw new Error(`Failed to load CSV: ${response.status}`);

    const text = await response.text();
    const lines = text.split("\n").filter((line) => line.trim());

    // Parse CSV headers
    const headers = lines[0].split(",").map((h) => h.trim());

    // Parse data rows
    orders = [];
    for (let i = 1; i < lines.length; i++) {
      // Simple CSV parsing (consider using a library for production)
      const values = lines[i].match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g) || [];
      const row = {};

      headers.forEach((header, index) => {
        let value = values[index] ? values[index].trim().replace(/"/g, "") : "";

        // Convert numeric fields
        if (
          [
            "pizza_id",
            "order_id",
            "quantity",
            "unit_price",
            "total_price",
          ].includes(header)
        ) {
          value = parseFloat(value) || 0;
        }

        row[header] = value;
      });

      // Add derived fields
      row.order_date_obj = parseDate(row.order_date);
      row.day_of_week = getDayOfWeek(row.order_date_obj);
      row.hour = getHourFromTime(row.order_time);
      row.ingredients_list = extractIngredients(row.pizza_ingredients);
      row.month_year = `${row.order_date_obj.getFullYear()}-${String(row.order_date_obj.getMonth() + 1).padStart(2, "0")}`;

      orders.push(row);
    }

    console.log(`Loaded ${orders.length} orders`);

    // Set default date range
    const dates = orders.map((o) => o.order_date_obj).sort((a, b) => a - b);
    dateFrom.valueAsDate = dates[0];
    dateTo.valueAsDate = dates[dates.length - 1];

    // Populate filter options
    populateFilters();

    // Initial render
    applyFilters();
  } catch (error) {
    console.error("Error loading data:", error);
    alert(`Error loading data: ${error.message}`);
  }
}

/* ============================
   FILTER FUNCTIONS
============================ */
function populateFilters() {
  // Get unique values
  const categories = [...new Set(orders.map((o) => o.pizza_category))].sort();
  const sizes = [...new Set(orders.map((o) => o.pizza_size))].sort();

  // Populate category filter
  categoryFilter.innerHTML =
    '<option value="ALL">All Categories</option>' +
    categories.map((cat) => `<option value="${cat}">${cat}</option>`).join("");

  // Populate size filter
  sizeFilter.innerHTML =
    '<option value="ALL">All Sizes</option>' +
    sizes.map((size) => `<option value="${size}">${size}</option>`).join("");
}

function applyFilters() {
  const startDate = new Date(dateFrom.value);
  const endDate = new Date(dateTo.value);
  endDate.setHours(23, 59, 59, 999);

  const selectedCategory = categoryFilter.value;
  const selectedSize = sizeFilter.value;
  const searchTerm = searchInput.value.toLowerCase();

  filteredOrders = orders.filter((order) => {
    // Date filter
    if (order.order_date_obj < startDate || order.order_date_obj > endDate) {
      return false;
    }

    // Category filter
    if (
      selectedCategory !== "ALL" &&
      order.pizza_category !== selectedCategory
    ) {
      return false;
    }

    // Size filter
    if (selectedSize !== "ALL" && order.pizza_size !== selectedSize) {
      return false;
    }

    // Search filter
    if (
      searchTerm &&
      !(
        order.order_id.toString().includes(searchTerm) ||
        order.pizza_name.toLowerCase().includes(searchTerm) ||
        order.pizza_ingredients.toLowerCase().includes(searchTerm)
      )
    ) {
      return false;
    }

    return true;
  });

  renderDashboard();
}

function resetFilters() {
  dateFrom.valueAsDate = new Date(
    Math.min(...orders.map((o) => o.order_date_obj)),
  );
  dateTo.valueAsDate = new Date(
    Math.max(...orders.map((o) => o.order_date_obj)),
  );
  categoryFilter.value = "ALL";
  sizeFilter.value = "ALL";
  periodFilter.value = "monthly";
  topN.value = "10";
  searchInput.value = "";
  currentPage = 1;
  applyFilters();
}

/* ============================
   KPI CALCULATIONS
============================ */
function calculateKPIs() {
  const uniqueOrders = new Set(filteredOrders.map((o) => o.order_id));
  const totalRevenue = filteredOrders.reduce(
    (sum, o) => sum + o.total_price,
    0,
  );
  const totalQuantity = filteredOrders.reduce((sum, o) => sum + o.quantity, 0);
  const orderCount = uniqueOrders.size;

  // Calculate AOV
  const aov = orderCount > 0 ? totalRevenue / orderCount : 0;

  // Calculate pizzas per order
  const pizzasPerOrder = orderCount > 0 ? totalQuantity / orderCount : 0;

  // Find best day by revenue
  const revenueByDay = {};
  filteredOrders.forEach((order) => {
    revenueByDay[order.day_of_week] =
      (revenueByDay[order.day_of_week] || 0) + order.total_price;
  });

  let bestDay = "N/A";
  let bestRevenue = 0;
  Object.entries(revenueByDay).forEach(([day, revenue]) => {
    if (revenue > bestRevenue) {
      bestRevenue = revenue;
      bestDay = day;
    }
  });

  // Update KPI displays
  kpiRevenue.textContent = formatCurrency(totalRevenue);
  kpiOrders.textContent = formatNumber(orderCount);
  kpiQty.textContent = formatNumber(totalQuantity);
  kpiAOV.textContent = formatCurrency(aov);
  kpiPizzasPerOrder.textContent = pizzasPerOrder.toFixed(1);
  kpiBestDay.textContent = bestDay;

  // Update subtitles
  document.getElementById("kpiRevenueSub").textContent =
    `From ${formatNumber(orderCount)} orders`;
  document.getElementById("kpiBestDaySub").textContent =
    `${formatCurrency(bestRevenue)} revenue`;
}

/* ============================
   CHART RENDER FUNCTIONS
============================ */
function renderTrendChart() {
  const period = periodFilter.value;
  const data = {};

  filteredOrders.forEach((order) => {
    let key;
    const date = order.order_date_obj;

    switch (period) {
      case "daily":
        key = date.toISOString().split("T")[0];
        break;
      case "weekly":
        const weekStart = new Date(date);
        weekStart.setDate(date.getDate() - date.getDay());
        key = weekStart.toISOString().split("T")[0];
        break;
      case "monthly":
        key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
        break;
    }

    data[key] = (data[key] || 0) + order.total_price;
  });

  // Sort by date
  const sortedData = Object.entries(data).sort(([a], [b]) =>
    a.localeCompare(b),
  );

  // Create chart HTML
  const maxRevenue = Math.max(...Object.values(data));
  const chartHeight = 280;

  let barsHtml = "";
  let labelsHtml = "";

  sortedData.forEach(([date, revenue]) => {
    const height = maxRevenue ? (revenue / maxRevenue) * (chartHeight - 40) : 0;
    const displayDate = period === "monthly" ? date.substring(5) : date;

    barsHtml += `
            <div class="trend-bar" style="height:${height}px" 
                 title="${date}: ${formatCurrency(revenue)}">
            </div>
        `;

    labelsHtml += `<div class="trend-label">${displayDate}</div>`;
  });

  trendChart.innerHTML = `
        <div class="trend-chart">
            <div class="trend-bars">${barsHtml}</div>
            <div class="trend-labels">${labelsHtml}</div>
        </div>
    `;
}

function renderCategoryChart() {
  const metric = document.querySelector(".seg-btn.active").dataset.catmetric;
  const data = {};

  filteredOrders.forEach((order) => {
    const category = order.pizza_category;
    if (!data[category]) data[category] = 0;

    if (metric === "qty") {
      data[category] += order.quantity;
    } else {
      data[category] += order.total_price;
    }
  });

  const categories = Object.keys(data);
  const values = Object.values(data);
  const total = values.reduce((a, b) => a + b, 0);

  // Create donut chart
  let cumulativePercent = 0;
  let donutHtml = "";
  let legendHtml = "";

  categories.forEach((category, index) => {
    const percent = total ? (values[index] / total) * 100 : 0;
    const color = COLORS[category] || getRandomColor(index);

    donutHtml += `
            <circle cx="100" cy="100" r="90" fill="transparent"
                    stroke="${color}" stroke-width="20"
                    stroke-dasharray="${percent} ${100 - percent}"
                    stroke-dashoffset="${100 - cumulativePercent}"
                    transform="rotate(-90 100 100)">
            </circle>
        `;

    legendHtml += `
  <div class="legend-item" data-drilldown="1" data-type="category" data-value="${category}">
    <span class="legend-color" style="background:${color}"></span>
    <span class="legend-label">${category}</span>
    <span class="legend-value">
      ${metric === "qty" ? formatNumber(values[index]) : formatCurrency(values[index])}
      (${percent.toFixed(1)}%)
    </span>
  </div>
`;

    cumulativePercent += percent;
  });

  categoryDonut.innerHTML = `
        <svg width="200" height="200" viewBox="0 0 200 200">
            ${donutHtml}
        </svg>
    `;

  categoryLegend.innerHTML = legendHtml;
}

function renderTopPizzas() {
  const metric = rankMetric.value;
  const mode = rankMode.value;
  const n = parseInt(topN.value);

  const data = {};

  filteredOrders.forEach((order) => {
    const pizza = order.pizza_name;
    if (!data[pizza]) data[pizza] = { qty: 0, revenue: 0 };

    data[pizza].qty += order.quantity;
    data[pizza].revenue += order.total_price;
  });

  let sortedPizzas = Object.entries(data)
    .sort((a, b) => {
      if (metric === "qty") {
        return mode === "top" ? b[1].qty - a[1].qty : a[1].qty - b[1].qty;
      } else {
        return mode === "top"
          ? b[1].revenue - a[1].revenue
          : a[1].revenue - b[1].revenue;
      }
    })
    .slice(0, n);

  // Create bar chart
  const maxValue = Math.max(
    ...sortedPizzas.map(([_, values]) => values[metric]),
  );
  let barsHtml = "";

  sortedPizzas.forEach(([pizza, values]) => {
    const value = values[metric];
    const width = maxValue ? (value / maxValue) * 100 : 0;
    const displayValue =
      metric === "qty" ? formatNumber(value) : formatCurrency(value);

    barsHtml += `
  <div class="bar-row" data-drilldown="1" data-type="pizza" data-value="${pizza}">
    <div class="bar-label" title="${pizza}">
      ${pizza.length > 25 ? pizza.substring(0, 22) + "..." : pizza}
    </div>
    <div class="bar-track">
      <div class="bar-fill" style="width:${width}%"></div>
    </div>
    <div class="bar-value">${displayValue}</div>
  </div>
`;
  });

  topPizzasBar.innerHTML =
    barsHtml || '<div class="no-data">No data available</div>';
}

function renderSizeChart() {
  const data = {};

  filteredOrders.forEach((order) => {
    const size = order.pizza_size;
    data[size] = (data[size] || 0) + order.quantity;
  });

  const sizes = Object.keys(data).sort();
  const values = Object.values(data);
  const total = values.reduce((a, b) => a + b, 0);

  let barsHtml = "";

  sizes.forEach((size, index) => {
    const percent = total ? (values[index] / total) * 100 : 0;
    const color = COLORS[size] || "#3498db";

    barsHtml += `
            <div class="size-bar-container">
                <div class="size-label">${size}</div>
                <div class="size-bar">
                    <div class="size-fill" style="width:${percent}%; background:${color}"></div>
                </div>
                <div class="size-value">${formatNumber(values[index])} (${percent.toFixed(1)}%)</div>
            </div>
        `;
  });

  sizeChart.innerHTML =
    barsHtml || '<div class="no-data">No data available</div>';
}

function renderDayOfWeekChart() {
  const data = {
    Sunday: 0,
    Monday: 0,
    Tuesday: 0,
    Wednesday: 0,
    Thursday: 0,
    Friday: 0,
    Saturday: 0,
  };

  filteredOrders.forEach((order) => {
    data[order.day_of_week] += order.total_price;
  });

  const days = Object.keys(data);
  const values = Object.values(data);
  const maxValue = Math.max(...values);

  let barsHtml = "";

  days.forEach((day, index) => {
    const height = maxValue ? (values[index] / maxValue) * 100 : 0;

    barsHtml += `
            <div class="dow-column">
                <div class="dow-bar" style="height:${height}%"></div>
                <div class="dow-label">${day.substring(0, 3)}</div>
                <div class="dow-value" title="${day}: ${formatCurrency(values[index])}">${formatCurrency(values[index])}</div>
            </div>
        `;
  });

  dowChart.innerHTML = `<div class="dow-chart">${barsHtml}</div>`;
}

function renderHourlyHeatmap() {
  const data = Array(24).fill(0);

  filteredOrders.forEach((order) => {
    data[order.hour] += order.quantity;
  });

  const maxValue = Math.max(...data);

  let heatmapHtml = "";

  for (let hour = 0; hour < 24; hour++) {
    const intensity = maxValue ? data[hour] / maxValue : 0;
    const color = `rgba(231, 76, 60, ${0.3 + intensity * 0.7})`;

    heatmapHtml += `
            <div class="heatmap-cell" style="background:${color}" 
                 title="${hour}:00 - ${data[hour]} pizzas sold">
                <div class="heatmap-hour">${hour}</div>
                <div class="heatmap-value">${data[hour]}</div>
            </div>
        `;
  }

  hourlyHeatmap.innerHTML = `
        <div class="heatmap-grid">${heatmapHtml}</div>
        <div class="heatmap-legend">
            <span>Low</span>
            <div class="legend-gradient"></div>
            <span>High</span>
        </div>
    `;
}

function renderPriceDistribution() {
  const prices = filteredOrders.map((o) => o.unit_price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);

  // Create 10 price bins
  const binCount = 10;
  const binSize = (maxPrice - minPrice) / binCount;
  const bins = Array(binCount).fill(0);

  prices.forEach((price) => {
    const binIndex = Math.min(
      Math.floor((price - minPrice) / binSize),
      binCount - 1,
    );
    bins[binIndex]++;
  });

  const maxBin = Math.max(...bins);

  let histogramHtml = "";

  bins.forEach((count, index) => {
    const height = maxBin ? (count / maxBin) * 100 : 0;
    const priceRange = `${(minPrice + index * binSize).toFixed(2)} - ${(minPrice + (index + 1) * binSize).toFixed(2)}`;

    histogramHtml += `
            <div class="histogram-bar" style="height:${height}%" 
                 title="${priceRange}: ${count} pizzas">
                <div class="histogram-count">${count}</div>
            </div>
        `;
  });

  priceDistribution.innerHTML = `
        <div class="histogram">
            ${histogramHtml}
        </div>
        <div class="histogram-labels">
            <span>${minPrice.toFixed(2)}</span>
            <span>${((minPrice + maxPrice) / 2).toFixed(2)}</span>
            <span>${maxPrice.toFixed(2)}</span>
        </div>
    `;
}

function renderIngredientsAnalysis() {
  const ingredientCounts = {};

  filteredOrders.forEach((order) => {
    order.ingredients_list.forEach((ingredient) => {
      ingredientCounts[ingredient] =
        (ingredientCounts[ingredient] || 0) + order.quantity;
    });
  });

  // Sort by count
  const sortedIngredients = Object.entries(ingredientCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20);

  // Create word cloud
  const maxCount = Math.max(...sortedIngredients.map(([_, count]) => count));
  let wordCloudHtml = "";

  sortedIngredients.forEach(([ingredient, count]) => {
    const size = 12 + (count / maxCount) * 30;
    const opacity = 0.6 + (count / maxCount) * 0.4;

    wordCloudHtml += `
            <span class="word-cloud-item" style="font-size:${size}px; opacity:${opacity}"
                  title="${ingredient}: ${formatNumber(count)}">
                ${ingredient}
            </span>
        `;
  });

  ingredientsWordCloud.innerHTML = wordCloudHtml;

  // Create table
  let tableHtml = "";
  sortedIngredients.slice(0, 10).forEach(([ingredient, count]) => {
    tableHtml += `
            <tr>
                <td>${ingredient}</td>
                <td>${formatNumber(count)}</td>
            </tr>
        `;
  });

  ingredientsTbody.innerHTML = tableHtml;
}

function renderInsights() {
  // Peak hour insight
  const hourlySales = Array(24).fill(0);
  filteredOrders.forEach((order) => {
    hourlySales[order.hour] += order.quantity;
  });

  const peakHour = hourlySales.indexOf(Math.max(...hourlySales));
  insightPeakHour.textContent = `Peak sales at ${peakHour}:00 (${hourlySales[peakHour]} pizzas). Consider increasing staff during ${peakHour - 1}:00-${peakHour + 1}:00.`;

  // Menu optimization insight
  const pizzaPerformance = {};
  filteredOrders.forEach((order) => {
    const pizza = order.pizza_name;
    if (!pizzaPerformance[pizza])
      pizzaPerformance[pizza] = { qty: 0, revenue: 0 };
    pizzaPerformance[pizza].qty += order.quantity;
    pizzaPerformance[pizza].revenue += order.total_price;
  });

  const sortedPizzas = Object.entries(pizzaPerformance).sort(
    (a, b) => a[1].qty - b[1].qty,
  );
  const worstPizza = sortedPizzas[0];
  const bestPizza = sortedPizzas[sortedPizzas.length - 1];

  insightMenuOpt.textContent = `Consider promoting "${bestPizza[0]}" (${bestPizza[1].qty} sold) and reviewing "${worstPizza[0]}" (${worstPizza[1].qty} sold).`;

  // Inventory insight
  const ingredientUsage = {};
  filteredOrders.forEach((order) => {
    order.ingredients_list.forEach((ingredient) => {
      ingredientUsage[ingredient] =
        (ingredientUsage[ingredient] || 0) + order.quantity;
    });
  });

  const topIngredients = Object.entries(ingredientUsage)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  insightInventory.textContent = `Top 3 ingredients needed: ${topIngredients.map(([ing, count]) => `${ing} (${count})`).join(", ")}.`;

  // Price popularity insight
  const avgPrice =
    filteredOrders.reduce((sum, o) => sum + o.unit_price, 0) /
    filteredOrders.length;
  const highPricePizzas = filteredOrders.filter((o) => o.unit_price > avgPrice);
  const lowPricePizzas = filteredOrders.filter((o) => o.unit_price <= avgPrice);

  const highPriceSales = highPricePizzas.reduce(
    (sum, o) => sum + o.quantity,
    0,
  );
  const lowPriceSales = lowPricePizzas.reduce((sum, o) => sum + o.quantity, 0);

  insightPricePopularity.textContent = `${((lowPriceSales / (lowPriceSales + highPriceSales)) * 100).toFixed(1)}% of sales are from pizzas below average price (₹${avgPrice.toFixed(2)}).`;
}

/* ============================
   TABLE FUNCTIONS
============================ */
function renderOrdersTable() {
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const pageOrders = filteredOrders.slice(startIndex, endIndex);

  let tableHtml = "";

  pageOrders.forEach((order) => {
    tableHtml += `
            <tr>
                <td>${order.order_id}</td>
                <td>${order.order_date}</td>
                <td>${order.order_time}</td>
                <td>${order.pizza_name}</td>
                <td>${order.pizza_category}</td>
                <td>${order.pizza_size}</td>
                <td>${order.quantity}</td>
                <td>${formatCurrency(order.unit_price)}</td>
                <td>${formatCurrency(order.total_price)}</td>
                <td>${order.pizza_ingredients}</td>
                <td>—</td>
            </tr>
        `;
  });

  ordersTbody.innerHTML = tableHtml;

  // Update pagination info
  const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE);
  pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
  tableCount.textContent = `Showing ${startIndex + 1}-${Math.min(endIndex, filteredOrders.length)} of ${filteredOrders.length} rows`;

  // Enable/disable pagination buttons
  prevPage.disabled = currentPage === 1;
  nextPage.disabled = currentPage === totalPages;
}

function exportToCSV() {
  const headers = [
    "order_id",
    "order_date",
    "order_time",
    "pizza_name",
    "pizza_category",
    "pizza_size",
    "quantity",
    "unit_price",
    "total_price",
    "pizza_ingredients",
  ];

  const csvContent = [
    headers.join(","),
    ...filteredOrders.map((order) =>
      headers
        .map((header) => {
          const value = order[header];
          return typeof value === "string" ? `"${value}"` : value;
        })
        .join(","),
    ),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `pizza_sales_${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
}

/* ============================
   DRILLDOWN FUNCTIONS
============================ */
function setupDrilldown() {
  // Add click listeners to charts for drilldown
  document.addEventListener("click", (e) => {
    const chartElement = e.target.closest("[data-drilldown]");
    if (chartElement) {
      const type = chartElement.dataset.type;
      const value = chartElement.dataset.value;

      if (type && value) {
        openDrilldown(type, value);
      }
    }
  });
}

function openDrilldown(type, value) {
  currentDrilldown = { type, value };
  drilldownPanel.style.display = "block";

  let title = "";
  let details = "";

  switch (type) {
    case "category":
      const categoryOrders = filteredOrders.filter(
        (o) => o.pizza_category === value,
      );
      const categoryRevenue = categoryOrders.reduce(
        (sum, o) => sum + o.total_price,
        0,
      );
      const categoryQty = categoryOrders.reduce(
        (sum, o) => sum + o.quantity,
        0,
      );

      title = `Category: ${value}`;
      details = `
                <p><strong>Total Revenue:</strong> ${formatCurrency(categoryRevenue)}</p>
                <p><strong>Total Quantity:</strong> ${formatNumber(categoryQty)}</p>
                <p><strong>Number of Orders:</strong> ${formatNumber(new Set(categoryOrders.map((o) => o.order_id)).size)}</p>
                <p><strong>Average Price:</strong> ${formatCurrency(categoryRevenue / categoryQty)}</p>
            `;

      // Show top pizzas in this category
      const pizzaData = {};
      categoryOrders.forEach((order) => {
        pizzaData[order.pizza_name] =
          (pizzaData[order.pizza_name] || 0) + order.quantity;
      });

      renderDrilldownChart(
        Object.entries(pizzaData)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 10),
        "pizzas",
      );
      break;

    case "pizza":
      const pizzaOrders = filteredOrders.filter((o) => o.pizza_name === value);
      const pizzaStats = pizzaOrders.reduce(
        (acc, order) => {
          acc.revenue += order.total_price;
          acc.qty += order.quantity;
          return acc;
        },
        { revenue: 0, qty: 0 },
      );

      title = `Pizza: ${value}`;
      details = `
                <p><strong>Total Revenue:</strong> ${formatCurrency(pizzaStats.revenue)}</p>
                <p><strong>Total Sold:</strong> ${formatNumber(pizzaStats.qty)}</p>
                <p><strong>Average Unit Price:</strong> ${formatCurrency(pizzaOrders[0]?.unit_price || 0)}</p>
                <p><strong>Size Distribution:</strong> See chart</p>
            `;

      // Show size distribution
      const sizeData = {};
      pizzaOrders.forEach((order) => {
        sizeData[order.pizza_size] =
          (sizeData[order.pizza_size] || 0) + order.quantity;
      });

      renderDrilldownChart(Object.entries(sizeData), "sizes");
      break;
  }

  drilldownInfo.innerHTML = `
        <h4>${title}</h4>
        ${details}
    `;
}

function renderDrilldownChart(data, type) {
  let chartHtml = "";

  if (type === "pizzas") {
    const maxValue = Math.max(...data.map(([_, value]) => value));

    data.forEach(([label, value]) => {
      const width = maxValue ? (value / maxValue) * 100 : 0;
      chartHtml += `
                <div class="bar-row">
                    <div class="bar-label">${label}</div>
                    <div class="bar-track">
                        <div class="bar-fill" style="width:${width}%"></div>
                    </div>
                    <div class="bar-value">${formatNumber(value)}</div>
                </div>
            `;
    });
  } else if (type === "sizes") {
    data.forEach(([size, count]) => {
      const color = COLORS[size] || "#3498db";
      chartHtml += `
                <div class="size-item">
                    <span class="size-label">${size}</span>
                    <span class="size-count" style="color:${color}">${formatNumber(count)}</span>
                </div>
            `;
    });
  }

  drilldownChart.innerHTML =
    chartHtml || '<div class="no-data">No data available</div>';
}

/* ============================
   MAIN RENDER FUNCTION
============================ */
function renderDashboard() {
  calculateKPIs();
  renderTrendChart();
  renderCategoryChart();
  renderTopPizzas();
  renderSizeChart();
  renderDayOfWeekChart();
  renderHourlyHeatmap();
  renderPriceDistribution();
  renderIngredientsAnalysis();
  renderInsights();
  renderOrdersTable();
}

/* ============================
   EVENT LISTENERS
============================ */
function setupEventListeners() {
  // Filter changes
  [dateFrom, dateTo, periodFilter, categoryFilter, sizeFilter, topN].forEach(
    (el) => {
      el.addEventListener("change", () => {
        currentPage = 1;
        applyFilters();
      });
    },
  );

  // Reset button
  resetBtn.addEventListener("click", resetFilters);

  // Segmented buttons
  segBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      segBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      renderCategoryChart();
    });
  });

  // Rank controls
  rankMetric.addEventListener("change", renderTopPizzas);
  rankMode.addEventListener("change", renderTopPizzas);

  // Table controls
  searchInput.addEventListener("input", () => {
    currentPage = 1;
    applyFilters();
  });

  exportBtn.addEventListener("click", exportToCSV);

  prevPage.addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--;
      renderOrdersTable();
    }
  });

  nextPage.addEventListener("click", () => {
    const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE);
    if (currentPage < totalPages) {
      currentPage++;
      renderOrdersTable();
    }
  });

  // Drilldown controls
  closeDrilldown.addEventListener("click", () => {
    drilldownPanel.style.display = "none";
    currentDrilldown = null;
  });
}

/* ============================
   INITIALIZATION
============================ */
async function init() {
  await loadData();
  setupEventListeners();
  setupDrilldown();
  applyFilters();
}

// Start the application
init();

// Utility function for random colors
function getRandomColor(index) {
  const colors = [
    "#3498db",
    "#e74c3c",
    "#2ecc71",
    "#f39c12",
    "#9b59b6",
    "#1abc9c",
    "#d35400",
    "#c0392b",
    "#16a085",
    "#8e44ad",
  ];
  return colors[index % colors.length];
}
