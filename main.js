// --- DATA ---
const rawHistoricalData = {
    gold: [ {year: 1900, price: 20.67}, {year: 1910, price: 20.67}, {year: 1920, price: 20.68}, {year: 1930, price: 20.67}, {year: 1940, price: 35.00}, {year: 1950, price: 40.25}, {year: 1960, price: 35.27}, {year: 1970, price: 36.02}, {year: 1971, price: 40.62}, {year: 1975, price: 161.02}, {year: 1980, price: 589.75}, {year: 1985, price: 317.26}, {year: 1990, price: 383.51}, {year: 1995, price: 384.00}, {year: 2000, price: 279.11}, {year: 2005, price: 444.74}, {year: 2010, price: 1224.53}, {year: 2015, price: 1160.06}, {year: 2020, price: 1770.75}, {year: 2021, price: 1800.00}, {year: 2022, price: 1814.00}, {year: 2023, price: 1940.00}, {year: 2024, price: 2400.00}, {year: 2025, price: 3320.00} ],
    silver: [ {year: 1900, price: 0.64}, {year: 1910, price: 0.54}, {year: 1920, price: 1.00}, {year: 1930, price: 0.38}, {year: 1940, price: 0.43}, {year: 1950, price: 0.74}, {year: 1960, price: 0.91}, {year: 1970, price: 1.29}, {year: 1971, price: 1.39}, {year: 1975, price: 4.19}, {year: 1980, price: 20.63}, {year: 1985, price: 6.14}, {year: 1990, price: 4.07}, {year: 1995, price: 5.15}, {year: 2000, price: 4.95}, {year: 2005, price: 7.31}, {year: 2010, price: 20.19}, {year: 2015, price: 15.68}, {year: 2020, price: 20.51}, {year: 2021, price: 25.00}, {year: 2022, price: 21.73}, {year: 2023, price: 23.35}, {year: 2024, price: 29.00}, {year: 2025, price: 33.00} ],
    federalDebt: [ {year: 1900, debt: 2.1}, {year: 1910, debt: 2.6}, {year: 1920, debt: 25.9}, {year: 1930, debt: 16.2}, {year: 1940, debt: 42.9}, {year: 1950, debt: 257.4}, {year: 1960, debt: 286.3}, {year: 1970, debt: 370.9}, {year: 1971, debt: 398.1}, {year: 1975, debt: 533.2}, {year: 1980, debt: 907.7}, {year: 1985, debt: 1823.1}, {year: 1990, debt: 3233.3}, {year: 1995, debt: 4973.9}, {year: 2000, debt: 5674.2}, {year: 2005, debt: 7932.7}, {year: 2010, debt: 13561.6}, {year: 2015, debt: 18150.6}, {year: 2020, debt: 26945.4}, {year: 2021, debt: 28428.9}, {year: 2022, debt: 30928.9}, {year: 2023, debt: 33167.3}, {year: 2024, debt: 35464.7}, {year: 2025, debt: 36254.7} ],
    minimumWage: [ {year: 1938, wage: 0.25}, {year: 1950, wage: 0.40}, {year: 1960, wage: 1.00}, {year: 1968, wage: 1.60}, {year: 1970, wage: 1.60}, {year: 1975, wage: 2.10}, {year: 1980, wage: 3.10}, {year: 1985, wage: 3.35}, {year: 1990, wage: 3.80}, {year: 1995, wage: 4.25}, {year: 2000, wage: 5.15}, {year: 2005, wage: 5.15}, {year: 2010, wage: 7.25}, {year: 2015, wage: 7.25}, {year: 2020, wage: 7.25}, {year: 2025, wage: 7.25} ],
    cpi: [ {year: 1913, value: 9.9}, {year: 1914, value: 10}, {year: 1915, value: 10.1}, {year: 1916, value: 10.9}, {year: 1917, value: 12.8}, {year: 1918, value: 15.1}, {year: 1919, value: 17.3}, {year: 1920, value: 20}, {year: 1921, value: 17.9}, {year: 1922, value: 16.8}, {year: 1923, value: 17.1}, {year: 1924, value: 17.1}, {year: 1925, value: 17.5}, {year: 1926, value: 17.7}, {year: 1927, value: 17.4}, {year: 1928, value: 17.2}, {year: 1929, value: 17.2}, {year: 1930, value: 16.7}, {year: 1931, value: 15.2}, {year: 1932, value: 13.7}, {year: 1933, value: 13}, {year: 1934, value: 13.4}, {year: 1935, value: 13.7}, {year: 1936, value: 13.9}, {year: 1937, value: 14.4}, {year: 1938, value: 14.1}, {year: 1939, value: 13.9}, {year: 1940, value: 14}, {year: 1941, value: 14.7}, {year: 1942, value: 16.3}, {year: 1943, value: 17.3}, {year: 1944, value: 17.6}, {year: 1945, value: 18}, {year: 1946, value: 19.5}, {year: 1947, value: 22.3}, {year: 1948, value: 24.1}, {year: 1949, value: 23.8}, {year: 1950, value: 24.1}, {year: 1951, value: 26}, {year: 1952, value: 26.6}, {year: 1953, value: 26.7}, {year: 1954, value: 26.9}, {year: 1955, value: 26.8}, {year: 1956, value: 27.2}, {year: 1957, value: 28.1}, {year: 1958, value: 28.9}, {year: 1959, value: 29.2}, {year: 1960, value: 29.6}, {year: 1961, value: 29.9}, {year: 1962, value: 30.3}, {year: 1963, value: 30.6}, {year: 1964, value: 31}, {year: 1965, value: 31.5}, {year: 1966, value: 32.5}, {year: 1967, value: 33.4}, {year: 1968, value: 34.8}, {year: 1969, value: 36.7}, {year: 1970, value: 38.8}, {year: 1971, value: 40.5}, {year: 1972, value: 41.8}, {year: 1973, value: 44.4}, {year: 1974, value: 49.3}, {year: 1975, value: 53.8}, {year: 1976, value: 56.9}, {year: 1977, value: 60.6}, {year: 1978, value: 65.2}, {year: 1979, value: 72.6}, {year: 1980, value: 82.4}, {year: 1981, value: 90.9}, {year: 1982, value: 96.5}, {year: 1983, value: 99.6}, {year: 1984, value: 103.9}, {year: 1985, value: 107.6}, {year: 1986, value: 109.6}, {year: 1987, value: 113.6}, {year: 1988, value: 118.3}, {year: 1989, value: 124}, {year: 1990, value: 130.7}, {year: 1991, value: 136.2}, {year: 1992, value: 140.3}, {year: 1993, value: 144.5}, {year: 1994, value: 148.2}, {year: 1995, value: 152.4}, {year: 1996, value: 156.9}, {year: 1997, value: 160.5}, {year: 1998, value: 163}, {year: 1999, value: 166.6}, {year: 2000, value: 172.2}, {year: 2001, value: 177.1}, {year: 2002, value: 179.9}, {year: 2003, value: 184}, {year: 2004, value: 188.9}, {year: 2005, value: 195.3}, {year: 2006, value: 201.6}, {year: 2007, value: 207.3}, {year: 2008, value: 215.3}, {year: 2009, value: 214.5}, {year: 2010, value: 218.1}, {year: 2011, value: 224.9}, {year: 2012, value: 229.6}, {year: 2013, value: 233}, {year: 2014, value: 236.7}, {year: 2015, value: 237}, {year: 2016, value: 240}, {year: 2017, value: 245.1}, {year: 2018, value: 251.1}, {year: 2019, value: 255.7}, {year: 2020, value: 258.8}, {year: 2021, value: 271}, {year: 2022, value: 292.7}, {year: 2023, value: 304.7}, {year: 2024, value: 314}, {year: 2025, value: 325} ],
    gdp: [ {year: 1900, value: 21.2}, {year: 1910, value: 33.7}, {year: 1920, value: 89.2}, {year: 1930, value: 92.2}, {year: 1940, value: 102.9}, {year: 1950, value: 299.8}, {year: 1960, value: 542.4}, {year: 1970, value: 1073.3}, {year: 1971, value: 1164.9}, {year: 1975, value: 1684.9}, {year: 1980, value: 2857.3}, {year: 1985, value: 4339.0}, {year: 1990, value: 5963.1}, {year: 1995, value: 7639.7}, {year: 2000, value: 10251.0}, {year: 2005, value: 13039.2}, {year: 2010, value: 15049.0}, {year: 2015, value: 18295.0}, {year: 2020, value: 21354.1}, {year: 2021, value: 23681.2}, {year: 2022, value: 26006.9}, {year: 2023, value: 27720.7}, {year: 2024, value: 29184.9}, {year: 2025, value: 30156.0} ]
};

const historicalEvents = [
    { year: 1913, label: 'Fed Created' },
    { year: 1933, label: 'Gold Confiscated' },
    { year: 1944, label: 'Bretton Woods' },
    { year: 1971, label: 'Nixon Shock' },
    { year: 2008, label: 'Financial Crisis' },
    { year: 2020, label: 'COVID-19' }
];

const infoData = {
    indexedGrowth: { title: "Indexed Growth", text: "This chart shows the percentage growth of Gold and the Federal Debt, starting from a baseline of 100 in your selected start year. It makes it easy to compare their growth rates on an equal footing. The divergence of the lines clearly shows how debt and the price of real money have exploded." },
    laborValueInMetals: { title: "Labor Value in Precious Metals", text: "This chart shows how many ounces of gold or silver one hour of minimum wage labor could buy. It is a direct measure of the real value of labor. The downward trend illustrates how, even as nominal dollar wages have risen, their actual purchasing power in terms of real money has collapsed." },
    debtToGdp: { title: "U.S. National Debt as a % of GDP", text: "This chart shows the total national debt as a percentage of the nation's Gross Domestic Product (GDP). It is a key indicator of a country's financial health, measuring its ability to pay back its debts. A rising ratio indicates that debt is growing faster than the economy that supports it." },
    purchasingPower: { title: "Dollar Purchasing Power Loss", text: "This shows how the dollar has lost 96%+ of its purchasing power since 1913. What $1 could buy in 1913 now costs over $25. This is the 'inflation tax' - a hidden tax on everyone who holds dollars." },
    wageComparison: { title: "Your Wage vs Real Benchmarks", text: "This chart compares three wage metrics over time. Gold-Adjusted Wage: What you should earn if wages kept pace with gold. Your Wage (Inflation Adjusted): Your current wage, adjusted backwards for historical inflation to show its equivalent purchasing power in past years. Minimum Wage: The official federal minimum wage." },
    goldSilverPrices: { title: "Gold & Silver Prices", text: "This chart shows the historical price of gold and silver in U.S. dollars. As the dollar is debased, the prices of these precious metals, considered real money, tend to rise over the long term." }
};

// --- GLOBAL STATE ---
let currentUserWage = 15.00;
let currentStartYear = 1971;
let currentEndYear = 2025;
let charts = {};
let unifiedData = [];

// --- CORE LOGIC ---
function createUnifiedData() {
    const data = [];
    const dataKeys = Object.keys(rawHistoricalData);
    let currentValues = {};
    for (let year = 1900; year <= 2025; year++) {
        const yearEntry = { year };
        dataKeys.forEach(key => {
            const recordForYear = rawHistoricalData[key].find(d => d.year === year);
            if (recordForYear) {
                const valueKey = Object.keys(recordForYear)[1];
                currentValues[key] = recordForYear[valueKey];
            }
            yearEntry[key] = currentValues[key] || null;
        });
        data.push(yearEntry);
    }
    unifiedData = data;
}

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', function() {
    createUnifiedData();
    initializeAllCharts();
    updateAllCalculationsAndCharts();
    setupTabs();
});

// --- UI & EVENT HANDLERS ---
function setupTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons[0].classList.add('active');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            tabContents.forEach(content => content.classList.add('hidden'));
            const activeTab = document.getElementById(button.dataset.tab);
            if (activeTab) {
                activeTab.classList.remove('hidden');
            }
            
            Object.values(charts).forEach(chart => {
                if (chart && chart.canvas.offsetParent !== null) {
                     chart.resize();
                }
            });
        });
    });
}

function updateDateRange() {
    const startYearEl = document.getElementById('startYear');
    const endYearEl = document.getElementById('endYear');
    currentStartYear = parseInt(startYearEl.value);
    currentEndYear = parseInt(endYearEl.value);
    startYearEl.max = currentEndYear - 1;
    endYearEl.min = currentStartYear + 1;
    if (currentEndYear <= currentStartYear) {
        currentEndYear = currentStartYear + 1;
        if (currentEndYear > 2025) currentEndYear = 2025;
        endYearEl.value = currentEndYear;
    }
    document.getElementById('startYearDisplay').textContent = currentStartYear;
    document.getElementById('endYearDisplay').textContent = currentEndYear;
    updateAllCalculationsAndCharts();
}

function updatePersonalData() {
    currentUserWage = parseFloat(document.getElementById('userWage').value) || 15.00;
    updateAllCalculationsAndCharts();
}

function resetToDefault() {
    document.getElementById('userWage').value = '';
    currentUserWage = 15.00;
    updateAllCalculationsAndCharts();
}

function updateAllCalculationsAndCharts() {
    updateChartData();
}

function filterDataByDateRange(data) {
    return data.filter(d => d.year >= currentStartYear && d.year <= currentEndYear);
}

// --- CHARTING ---
function updateChartData() {
    const dataSlice = filterDataByDateRange(unifiedData);
    const dateLabels = dataSlice.map(d => new Date(d.year, 0, 1));
    const dynamicAnnotations = getDynamicAnnotations(currentStartYear, currentEndYear);
    
    Object.values(charts).forEach(chart => {
        chart.options.scales.x.min = new Date(currentStartYear, 0, 1);
        chart.options.scales.x.max = new Date(currentEndYear, 0, 1);
        chart.options.plugins.annotation.annotations = dynamicAnnotations;
    });

    // Indexed Growth Chart
    const baseValues = dataSlice[0] || {};
    charts.indexedGrowth.data.labels = dateLabels;
    charts.indexedGrowth.data.datasets[0].data = dataSlice.map(d => baseValues.gold ? (d.gold / baseValues.gold) * 100 : null);
    charts.indexedGrowth.data.datasets[1].data = dataSlice.map(d => baseValues.federalDebt ? (d.federalDebt / baseValues.federalDebt) * 100 : null);
    charts.indexedGrowth.update('none');

    // Labor Value in Metals Chart
    charts.laborValueInMetals.data.labels = dateLabels;
    charts.laborValueInMetals.data.datasets[0].data = dataSlice.map(d => d.gold ? d.minimumWage / d.gold : null);
    charts.laborValueInMetals.data.datasets[1].data = dataSlice.map(d => d.silver ? d.minimumWage / d.silver : null);
    charts.laborValueInMetals.update('none');

    // Debt to GDP Chart
    charts.debtToGdp.data.labels = dateLabels;
    charts.debtToGdp.data.datasets[0].data = dataSlice.map(d => (d.federalDebt && d.gdp) ? (d.federalDebt / d.gdp) * 100 : null);
    charts.debtToGdp.update('none');

    // Purchasing Power Chart
    const baseGoldPrice1913 = unifiedData.find(d => d.year === 1913)?.gold || 20.67;
    charts.purchasingPower.data.labels = dateLabels;
    charts.purchasingPower.data.datasets[0].data = dataSlice.map(d => d.gold ? (baseGoldPrice1913 / d.gold) * 100 : null);
    charts.purchasingPower.update('none');

    // Wage Comparison Chart
    const goldPerHour1968 = 0.046;
    const latestCpiData = unifiedData.find(d => d.year === new Date().getFullYear()) || unifiedData[unifiedData.length - 1];
    charts.wageComparison.data.labels = dateLabels;
    charts.wageComparison.data.datasets[0].data = dataSlice.map(d => d.gold ? goldPerHour1968 * d.gold : null);
    charts.wageComparison.data.datasets[1].data = dataSlice.map(d => d.cpi && latestCpiData.cpi ? currentUserWage * (d.cpi / latestCpiData.cpi) : null);
    charts.wageComparison.data.datasets[2].data = dataSlice.map(d => d.minimumWage);
    charts.wageComparison.update('none');
    
    // Gold and Silver Prices Chart
    charts.goldSilverPrices.data.labels = dateLabels;
    charts.goldSilverPrices.data.datasets[0].data = dataSlice.map(d => d.gold);
    charts.goldSilverPrices.data.datasets[1].data = dataSlice.map(d => d.silver);
    charts.goldSilverPrices.update('none');
}

function getDynamicAnnotations(startYear, endYear) {
    const annotations = {};
    historicalEvents
        .filter(event => event.year >= startYear && event.year <= endYear)
        .forEach(event => {
            annotations[`line${event.year}`] = {
                type: 'line',
                xMin: new Date(event.year, 0, 1),
                xMax: new Date(event.year, 0, 1),
                borderColor: 'rgba(107, 114, 128, 0.5)',
                borderWidth: 1,
                borderDash: [6, 6],
                label: {
                    content: event.label,
                    display: true,
                    position: 'start',
                    backgroundColor: 'rgba(15, 23, 42, 0.8)',
                    font: { size: 9 },
                    color: '#9CA3AF',
                    yAdjust: -10
                }
            };
        });
    return annotations;
}

function initializeAllCharts() {
    const defaultChartOptions = () => ({
        responsive: true, maintainAspectRatio: false, animation: { duration: 800, easing: 'easeOutQuart' },
        interaction: { mode: 'index', intersect: false, axis: 'x' },
        plugins: { 
            legend: { labels: { color: '#D1D5DB', boxWidth: 15, padding: 15 } },
            tooltip: {
                backgroundColor: 'rgba(15, 23, 42, 0.8)',
                titleColor: '#fff',
                bodyColor: '#fff',
                borderColor: 'rgba(51, 65, 85, 0.5)',
                borderWidth: 1,
            },
            annotation: { annotations: {} }
        },
        scales: {
            x: { 
                type: 'time',
                time: { unit: 'year', displayFormats: { year: 'yyyy' } },
                ticks: { color: '#9CA3AF' }, 
                grid: { color: 'rgba(255, 255, 255, 0.05)' } 
            },
        }
    });
    
    const chartConfigs = {
        indexedGrowth: {
            ctx: document.getElementById('indexedGrowthChart').getContext('2d'),
            type: 'line',
            data: { datasets: [
                { label: 'Gold Price', borderColor: '#FBBF24', tension: 0.2, pointRadius: 0, borderWidth: 2 },
                { label: 'Federal Debt', borderColor: '#EF4444', tension: 0.2, pointRadius: 0, borderWidth: 2 }
            ]},
            options: { ...defaultChartOptions(), scales: { ...defaultChartOptions().scales, y: { type: 'logarithmic', title: { display: true, text: 'Growth (Index, Start Year = 100)', color: '#9CA3AF' }, ticks: { color: '#9CA3AF' }, grid: { color: 'rgba(255, 255, 255, 0.05)' } }}}
        },
        laborValueInMetals: {
            ctx: document.getElementById('laborValueInMetalsChart').getContext('2d'),
            type: 'line',
            data: { datasets: [
                { label: 'Ounces of Gold', borderColor: '#FBBF24', yAxisID: 'y', tension: 0.2, pointRadius: 0, borderWidth: 2 },
                { label: 'Ounces of Silver', borderColor: '#D1D5DB', yAxisID: 'y1', tension: 0.2, pointRadius: 0, borderWidth: 2 }
            ]},
            options: { ...defaultChartOptions(), scales: { ...defaultChartOptions().scales,
                y: { type: 'linear', position: 'left', title: { display: true, text: 'Gold Ounces', color: '#FBBF24' }, ticks: { color: '#FBBF24' }, grid: { color: 'rgba(251, 191, 36, 0.1)' } },
                y1: { type: 'linear', position: 'right', title: { display: true, text: 'Silver Ounces', color: '#D1D5DB' }, ticks: { color: '#D1D5DB' }, grid: { drawOnChartArea: false } }
            }}
        },
        debtToGdp: {
            ctx: document.getElementById('debtToGdpChart').getContext('2d'),
            type: 'line',
            data: { datasets: [{ label: 'Debt as % of GDP', borderColor: '#F87171', fill: { target: 'origin', above: 'rgba(248, 113, 113, 0.1)' }, tension: 0.2, pointRadius: 0, borderWidth: 2 }]},
            options: { ...defaultChartOptions(), scales: { ...defaultChartOptions().scales, y: { type: 'linear', title: { display: true, text: 'Percentage (%)', color: '#9CA3AF' }, ticks: { color: '#9CA3AF' }, grid: { color: 'rgba(255, 255, 255, 0.05)' } }}}
        },
        purchasingPower: {
            ctx: document.getElementById('purchasingPowerChart').getContext('2d'),
            type: 'line',
            data: { datasets: [{ label: 'Dollar Purchasing Power (% of 1913)', borderColor: '#60A5FA', fill: { target: 'origin', above: 'rgba(96, 165, 250, 0.1)' }, tension: 0.2, pointRadius: 0, borderWidth: 2 }]},
            options: { ...defaultChartOptions(), scales: { ...defaultChartOptions().scales, y: { type: 'linear', title: { display: true, text: 'Purchasing Power (%)', color: '#9CA3AF' }, min: 0, max: 105, ticks: { color: '#9CA3AF' }, grid: { color: 'rgba(255, 255, 255, 0.05)' } }}}
        },
        wageComparison: {
            ctx: document.getElementById('wageComparisonChart').getContext('2d'),
            type: 'line',
            data: { datasets: [
                { label: 'Gold-Adjusted Wage ($)', borderColor: '#FBBF24', tension: 0.2, pointRadius: 0, borderWidth: 2 },
                { label: 'Your Wage (Inflation Adjusted)', borderColor: '#F87171', tension: 0.2, pointRadius: 0, borderWidth: 2 },
                { label: 'Minimum Wage ($)', borderColor: '#6B7280', stepped: true, pointRadius: 0, borderWidth: 2 }
            ]},
            options: { ...defaultChartOptions(), scales: { ...defaultChartOptions().scales, y: { type: 'linear', beginAtZero: true, title: { display: true, text: 'Dollars per Hour', color: '#9CA3AF' }, ticks: { color: '#9CA3AF' }, grid: { color: 'rgba(255, 255, 255, 0.05)' } }}}
        },
        goldSilverPrices: {
            ctx: document.getElementById('goldSilverPricesChart').getContext('2d'),
            type: 'line',
            data: { datasets: [
                { label: 'Gold Price ($/oz)', borderColor: '#FBBF24', yAxisID: 'y', tension: 0.2, pointRadius: 0, borderWidth: 2 },
                { label: 'Silver Price ($/oz)', borderColor: '#D1D5DB', yAxisID: 'y1', tension: 0.2, pointRadius: 0, borderWidth: 2 }
            ]},
            options: { ...defaultChartOptions(), scales: { ...defaultChartOptions().scales,
                y: { type: 'linear', position: 'left', title: { display: true, text: 'Gold Price ($)', color: '#FBBF24' }, ticks: { color: '#FBBF24' }, grid: { color: 'rgba(251, 191, 36, 0.1)' } },
                y1: { type: 'linear', position: 'right', title: { display: true, text: 'Silver Price ($)', color: '#D1D5DB' }, ticks: { color: '#D1D5DB' }, grid: { drawOnChartArea: false } }
            }}
        }
    };

    Object.keys(chartConfigs).forEach(key => {
        charts[key] = new Chart(chartConfigs[key].ctx, {
            type: chartConfigs[key].type,
            data: chartConfigs[key].data,
            options: chartConfigs[key].options
        });
    });

    setupCrosshairSync();
}

function setupCrosshairSync() {
    const chartInstances = Object.values(charts);
    chartInstances.forEach(chart => {
        chart.canvas.addEventListener('mousemove', (e) => {
            const activePoints = chart.getElementsAtEventForMode(e, 'index', { intersect: false }, true);
            if (activePoints.length > 0) {
                const dataIndex = activePoints[0].index;
                
                chartInstances.forEach(otherChart => {
                    if (otherChart !== chart && otherChart.canvas.offsetParent !== null) {
                        try {
                            const tooltip = otherChart.tooltip;
                            if (!tooltip) return;
                            const newActiveElements = [];
                            otherChart.data.datasets.forEach((dataset, datasetIndex) => {
                                const meta = otherChart.getDatasetMeta(datasetIndex);
                                if (meta.data[dataIndex]) {
                                    newActiveElements.push(meta.data[dataIndex]);
                                }
                            });
                            tooltip.setActiveElements(newActiveElements, { x: e.offsetX, y: e.offsetY });
                            otherChart.update('none');
                        } catch (err) {
                            // Silently fail to avoid console spam from hidden charts
                        }
                    }
                });
            }
        });

        chart.canvas.addEventListener('mouseleave', () => {
            chartInstances.forEach(otherChart => {
                if (otherChart.tooltip && otherChart.canvas.offsetParent !== null) {
                    try {
                        otherChart.tooltip.setActiveElements([], { x: 0, y: 0 });
                        otherChart.update('none');
                    } catch (err) {
                        // Silently fail
                    }
                }
            });
        });
    }

    // --- MODAL & ESSAY FUNCTIONS ---
    function showInfo(type) {
        const info = infoData[type];
        if (info) {
            document.getElementById('infoTitle').textContent = info.title;
            document.getElementById('infoText').textContent = info.text;
            document.getElementById('infoModal').style.display = 'block';
        }
    }

    document.getElementById('modalCloseButton').onclick = function() {
        document.getElementById('infoModal').style.display = 'none';
    }

    window.onclick = function(event) {
        if (event.target === document.getElementById('infoModal')) {
            document.getElementById('infoModal').style.display = 'none';
        }
    }
    </script>
</body>
</html>
