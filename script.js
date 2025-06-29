// Global variables
let charts = {};
let goldData = [];
let silverData = [];
let debtData = [];
let currentGoldPrice = 3300;
let currentSilverPrice = 33;
let userWageData = { hourly: 15, annual: 31200 };
let personalTheftCounter = 0;
let federalInterestCounter = 0;

// API Configuration
const API_CONFIG = {
    fred: {
        key: '455899376e41be09aa5f0910efb2c113',
        baseUrl: 'https://api.stlouisfed.org/fred/series/observations',
        series: {
            debt: 'GFDEBTN', // Federal Debt
            gdp: 'GDP', // Gross Domestic Product
            cpi: 'CPIAUCSL', // Consumer Price Index
            m2: 'M2SL' // Money Supply
        }
    },
    metals: {
        key: 'fd9f5f9b02a9ab882530fc61b3d726d2',
        baseUrl: 'https://api.metalpriceapi.com/v1/latest',
        symbols: 'XAU,XAG' // Gold (XAU), Silver (XAG)
    }
};

// Initialize application
document.addEventListener('DOMContentLoaded', async function() {
    try {
        setupEventListeners();
        initializeTooltips();
        loadHistoricalData();
        await loadRealTimeData();
        initializeCharts();
        updateDashboard();
        startCounters();
        updateSliderDisplays();
        setupEraButtons();
        console.log('Wealth Extraction Tool v2.1 initialized successfully');
    } catch (error) {
        console.error('Initialization error:', error);
        handleInitializationFailure();
    }
});

// Real-time data loading
async function loadRealTimeData() {
    try {
        // Load metals first (faster API)
        await loadMetalPrices();
        
        // Load FRED data
        await loadFredData();
        
        // Update all charts with new data
        updateAllCharts();
    } catch (error) {
        console.error('Real-time data error:', error);
        handleRealTimeDataFailure();
    }
}

// Load metal prices
async function loadMetalPrices() {
    try {
        const url = `${API_CONFIG.metals.baseUrl}?access_key=${API_CONFIG.metals.key}&base=USD&symbols=${API_CONFIG.metals.symbols}`;
        const response = await fetch(url);
        
        if (!response.ok) throw new Error(`Metal API error: ${response.status}`);
        
        const data = await response.json();
        if (!data.success) throw new Error('Metal API invalid response');
        
        // Update prices
        currentGoldPrice = parseFloat(data.rates.XAU);
        currentSilverPrice = parseFloat(data.rates.XAG);
        
        console.log(`Loaded metal prices: Gold $${currentGoldPrice}, Silver $${currentSilverPrice}`);
    } catch (error) {
        console.warn('Metal API failed, using fallback:', error);
        currentGoldPrice = 3300;
        currentSilverPrice = 33;
    }
}

// Load FRED economic data
async function loadFredData() {
    try {
        const debtUrl = `${API_CONFIG.fred.baseUrl}?series_id=${API_CONFIG.fred.series.debt}&api_key=${API_CONFIG.fred.key}&file_type=json&limit=1`;
        const response = await fetch(debtUrl);
        
        if (!response.ok) throw new Error(`FRED API error: ${response.status}`);
        
        const data = await response.json();
        if (!data.observations?.length) throw new Error('FRED API invalid response');
        
        // Update debt data
        const latestDebt = data.observations[0];
        const debtTrillions = parseFloat(latestDebt.value) / 1000;
        
        updateDebtData(latestDebt.date, debtTrillions);
        console.log(`Loaded FRED debt: $${debtTrillions.toFixed(2)}T (${latestDebt.date})`);
    } catch (error) {
        console.warn('FRED API failed, using fallback:', error);
        updateDebtData('2024-01-01', 36.25); // Fallback
    }
}

// Update debt data array
function updateDebtData(date, value) {
    const year = new Date(date).getFullYear();
    
    // Update existing or add new
    const existing = debtData.find(d => d.year === year);
    if (existing) existing.debt = value;
    else debtData.push({ year, debt: value });
    
    // Sort and trim
    debtData.sort((a, b) => a.year - b.year);
    debtData = debtData.slice(-125); // Keep 125 years
}

// Create all charts
function initializeCharts() {
    createMasterChart();
    createPersonalChart();
    createConstitutionalChart();
    createTimelineChart();
    createCumulativeChart();
}

// Main correlation chart
function createMasterChart() {
    const ctx = document.getElementById('masterChart').getContext('2d');
    charts.master = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [
                { label: 'Gold Price ($)', data: [], borderColor: '#FFD700', yAxisID: 'y-metals' },
                { label: 'Silver Price ($)', data: [], borderColor: '#C0C0C0', yAxisID: 'y-metals' },
                { label: 'Federal Debt ($T)', data: [], borderColor: '#DC143C', yAxisID: 'y-debt' }
            ]
        },
        options: {
            responsive: true,
            scales: {
                'y-metals': { position: 'left', type: 'logarithmic' },
                'y-debt': { position: 'right', type: 'logarithmic' }
            }
        }
    });
}

// Personal impact chart
function createPersonalChart() {
    const ctx = document.getElementById('personalChart').getContext('2d');
    charts.personal = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [
                { label: 'Your Actual Wage', data: [], borderColor: '#DC143C' },
                { label: 'Gold-Adjusted Wage', data: [], borderColor: '#FFD700' },
                { label: 'Silver-Adjusted Wage', data: [], borderColor: '#C0C0C0' }
            ]
        }
    });
}

// Gold/silver ratio chart
function createConstitutionalChart() {
    const ctx = document.getElementById('constitutionalChart').getContext('2d');
    charts.constitutional = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [
                { label: 'Gold/Silver Ratio', data: [], borderColor: '#FFD700' }
            ]
        }
    });
}

// Event timeline chart
function createTimelineChart() {
    const ctx = document.getElementById('timelineChart').getContext('2d');
    charts.timeline = new Chart(ctx, {
        type: 'scatter',
        data: {
            datasets: [{
                label: 'Key Events',
                data: HISTORICAL_EVENTS.map(e => ({ x: e.year, y: 1 })),
                backgroundColor: '#FFD700'
            }]
        },
        options: {
            scales: {
                x: { type: 'linear', min: 1900, max: 2025 },
                y: { display: false }
            }
        }
    });
}

// Cumulative theft chart
function createCumulativeChart() {
    const ctx = document.getElementById('cumulativeChart').getContext('2d');
    charts.cumulative = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: [],
            datasets: [{
                label: 'Cumulative Theft ($T)',
                data: [],
                backgroundColor: '#DC143C'
            }]
        }
    });
}

// Update all charts
function updateAllCharts() {
    const startYear = 1900;
    const endYear = 2025;
    
    updateMasterChart(startYear, endYear);
    updatePersonalChart();
    updateConstitutionalChart(startYear, endYear);
    updateCumulativeChart(startYear, endYear);
    calculateCorrelations(startYear, endYear);
}

// Update main chart
function updateMasterChart(start, end) {
    const years = goldData.map(d => d.year).filter(y => y >= start && y <= end);
    const gold = goldData.map(d => d.price).filter((_, i) => years[i] >= start && years[i] <= end);
    const silver = silverData.map(d => d.price).filter((_, i) => years[i] >= start && years[i] <= end);
    const debt = debtData.map(d => d.debt).filter(d => d.year >= start && d.year <= end);
    
    charts.master.data.labels = years;
    charts.master.data.datasets[0].data = gold;
    charts.master.data.datasets[1].data = silver;
    charts.master.data.datasets[2].data = debt;
    charts.master.update();
}

// Calculate and display correlations
function calculateCorrelations(start, end) {
    const gold = goldData.filter(d => d.year >= start && d.year <= end).map(d => d.price);
    const silver = silverData.filter(d => d.year >= start && d.year <= end).map(d => d.price);
    const debt = debtData.filter(d => d.year >= start && d.year <= end).map(d => d.debt);
    
    const goldCorr = calculateCorrelation(gold, debt);
    const silverCorr = calculateCorrelation(silver, debt);
    
    document.getElementById('goldDebtCorr').textContent = goldCorr.toFixed(2);
    document.getElementById('silverDebtCorr').textContent = silverCorr.toFixed(2);
}

// Pearson correlation calculation
function calculateCorrelation(x, y) {
    if (x.length < 3 || y.length < 3) return 0;
    
    const meanX = x.reduce((a, b) => a + b) / x.length;
    const meanY = y.reduce((a, b) => a + b) / y.length;
    
    const numerator = x.map((xi, i) => (xi - meanX) * (y[i] - meanY)).reduce((a, b) => a + b);
    const denominator = Math.sqrt(
        x.map(xi => Math.pow(xi - meanX, 2)).reduce((a, b) => a + b) *
        y.map(yi => Math.pow(yi - meanY, 2)).reduce((a, b) => a + b)
    );
    
    return denominator === 0 ? 0 : numerator / denominator;
}

// Update dashboard with real-time data
function updateDashboard() {
    document.getElementById('currentGold').textContent = `$${currentGoldPrice.toFixed(2)}`;
    document.getElementById('currentSilver').textContent = `$${currentSilverPrice.toFixed(2)}`;
    document.getElementById('currentDebt').textContent = `$${debtData[debtData.length - 1].debt.toFixed(2)}T`;
    
    // Update personal impact
    calculatePersonalImpact();
}

// Personal theft calculator
function calculatePersonalImpact() {
    const goldOunces1968 = 1.6 / 35; // $1.60/hr ÷ $35/oz
    const shouldEarnGold = goldOunces1968 * currentGoldPrice;
    const shouldEarnSilver = goldOunces1968 * currentSilverPrice * 25; // Silver ratio adjustment
    
    const theftPerHour = Math.max(shouldEarnGold - userWageData.hourly, 0);
    personalTheftCounter = theftPerHour / 60; // Per minute for counter
    
    // Update UI
    document.getElementById('shouldEarn').textContent = `$${shouldEarnGold.toFixed(2)}/hr`;
    document.getElementById('theftAmount').textContent = `$${theftPerHour.toFixed(2)}/hr`;
    document.getElementById('lifetimeTheft').textContent = `$${(theftPerHour * 40 * 52 * 40 / 1e6).toFixed(1)}M`;
}

// Start real-time counters
function startCounters() {
    const federalInterest = 1.1e12 / 365 / 24 / 60 / 60; // $1.1T annual interest
    
    setInterval(() => {
        federalInterestCounter += federalInterest;
        document.getElementById('federalInterest').textContent = `$${Math.floor(federalInterestCounter).toLocaleString()}`;
        
        if (personalTheftCounter > 0) {
            const personalDaily = personalTheftCounter * 60 * 24;
            document.getElementById('personalShare').textContent = `$${personalDaily.toFixed(0)}`;
        }
    }, 1000);
}

// Tooltip system
function initializeTooltips() {
    document.querySelectorAll('.info-icon').forEach(icon => {
        icon.addEventListener('click', e => {
            e.stopPropagation();
            showTooltip(icon.dataset.info);
        });
    });
    
    document.getElementById('tooltipClose').addEventListener('click', hideTooltip);
    document.addEventListener('click', e => {
        if (!e.target.closest('.info-tooltip')) hideTooltip();
    });
}

// Show tooltip
function showTooltip(key) {
    const tooltip = document.getElementById('infoTooltip');
    const content = TOOLTIP_CONTENT[key] || 'No information available';
    
    tooltip.querySelector('.tooltip-text').innerHTML = content;
    tooltip.style.display = 'block';
    setTimeout(() => tooltip.style.opacity = 1, 10);
}

// Hide tooltip
function hideTooltip() {
    const tooltip = document.getElementById('infoTooltip');
    tooltip.style.opacity = 0;
    setTimeout(() => tooltip.style.display = 'none', 300);
}

// Fallback handling
function handleInitializationFailure() {
    currentGoldPrice = 3300;
    currentSilverPrice = 33;
    updateDebtData('2024-01-01', 36.25);
    initializeCharts();
    updateDashboard();
}

function handleRealTimeDataFailure() {
    currentGoldPrice = 3300;
    currentSilverPrice = 33;
    updateDebtData('2024-01-01', 36.25);
    updateDashboard();
}

// Event listeners
function setupEventListeners() {
    document.getElementById('calculateImpact').addEventListener('click', calculatePersonalImpact);
    document.getElementById('resetToDefaults').addEventListener('click', resetToDefaults);
    document.getElementById('shareAnalysis').addEventListener('click', shareAnalysis);
    
    // Range sliders
    document.getElementById('startYear').addEventListener('input', updateSliderDisplays);
    document.getElementById('endYear').addEventListener('input', updateSliderDisplays);
}

// Update slider displays
function updateSliderDisplays() {
    const start = parseInt(document.getElementById('startYear').value);
    const end = parseInt(document.getElementById('endYear').value);
    
    updateAllCharts(start, end);
}

// Reset to defaults
function resetToDefaults() {
    document.getElementById('startYear').value = 1900;
    document.getElementById('endYear').value = 2025;
    updateSliderDisplays();
}

// Share functionality
function shareAnalysis() {
    const url = window.location.href;
    const text = `I just discovered I've been systematically robbed of $${userWageData.hourly * 40 * 52 * 40 / 1e6}M over my lifetime. See the proof:`;
    
    if (navigator.share) {
        navigator.share({ title: 'The $3.5Q Wealth Theft', text, url });
    } else {
        alert(`${text}\n\n${url}`);
    }
}

// Historical data
const HISTORICAL_EVENTS = [
    { year: 1913, label: 'Federal Reserve Created' },
    { year: 1933, label: 'Gold Confiscation' },
    { year: 1971, label: 'Nixon Ends Gold Standard' },
    { year: 2008, label: 'Financial Crisis Bailouts' },
    { year: 2020, label: 'COVID Wealth Transfer' }
];

// Tooltip content
const TOOLTIP_CONTENT = {
    'wage-calculator': `
        <h4>Personal Theft Calculator</h4>
        <p>Shows how much purchasing power you've lost since 1968</p>
        <p>Based on gold's constitutional role as money</p>
    `,
    'real-time-theft': `
        <h4>Real-Time Theft Counters</h4>
        <p>Shows wealth extraction happening every second</p>
        <p>Federal interest = $1.1T annual payments to private banks</p>
    `,
    'gold-price': `
        <h4>Gold Price - Live Data</h4>
        <p>Updated every 5 minutes from global markets</p>
        <p>Gold is real money that can't be printed</p>
    `,
    // Add more tooltips...
};

// Load historical data
function loadHistoricalData() {
    // Gold and silver data
    goldData = generateHistoricalData(1900, 2025, 35, 3300);
    silverData = generateHistoricalData(1900, 2025, 1.39, 33);
    
    // Debt data
    debtData = generateHistoricalData(1900, 2025, [REDACTED:CREDIT_DEBIT_NUMBER], 36.25, 'debt');
}

// Generate mock historical data
function generateHistoricalData(start, end, initial, final, type = 'metal') {
    const data = [];
    const growthRate = Math.pow(final / initial, 1 / (end - start));
    
    let value = initial;
    for (let year = start; year <= end; year++) {
        data.push({ year, price: value });
        value *= growthRate;
        
        if (type === 'debt') value = Math.min(value, final);
    }
    
    return data;
}

// Set API update intervals
setInterval(loadRealTimeData, 300000); // Every 5 minutes
