// ====================================================================
// WEALTH EXTRACTION ANALYSIS TOOL 2.1 - COMPLETE JAVASCRIPT
// Optimized, Error-Free, API-Integrated
// ====================================================================

'use strict';

// ====================================================================
// GLOBAL CONFIGURATION & STATE
// ====================================================================

const CONFIG = {
    // API Configuration with your keys
    apis: {
        fred: {
            key: '455899376e41be09aa5f0910efb2c113',
            baseUrl: 'https://api.stlouisfed.org/fred/series/observations',
            series: {
                debt: 'GFDEBTN',
                gdp: 'GDP',
                cpi: 'CPIAUCSL'
            }
        },
        metals: {
            key: 'fd9f5f9b02a9ab882530fc61b3d726d2',
            baseUrl: 'https://api.metalpriceapi.com/v1/latest'
        }
    },
    
    // Fallback data for offline/API failure
    fallback: {
        gold: 3300,
        silver: 33,
        debt: 36.25
    },
    
    // Update intervals (milliseconds)
    intervals: {
        metals: 300000,    // 5 minutes
        fred: 3600000,     // 1 hour
        counters: 1000     // 1 second
    }
};

// Global state
const STATE = {
    charts: {},
    data: {
        gold: [],
        silver: [],
        debt: [],
        minimumWage: []
    },
    current: {
        gold: CONFIG.fallback.gold,
        silver: CONFIG.fallback.silver,
        debt: CONFIG.fallback.debt
    },
    user: {
        hourlyWage: 15,
        annualWage: 31200
    },
    counters: {
        federalInterest: 0,
        personalTheft: 0
    },
    timers: {}
};

// ====================================================================
// HISTORICAL DATA - COMPLETE DATASET
// ====================================================================

const HISTORICAL_DATA = {
    debt: [
        {year: 1900, debt: 1.26}, {year: 1910, debt: 1.15}, {year: 1913, debt: 2.9},
        {year: 1920, debt: 25.95}, {year: 1930, debt: 16.19}, {year: 1933, debt: 22.54},
        {year: 1940, debt: 42.97}, {year: 1950, debt: 257.36}, {year: 1960, debt: 286.33},
        {year: 1971, debt: 398}, {year: 1980, debt: 908}, {year: 1990, debt: 3233},
        {year: 2000, debt: 5674}, {year: 2008, debt: 10025}, {year: 2015, debt: 18151},
        {year: 2020, debt: 26945}, {year: 2024, debt: 35465}, {year: 2025, debt: 36250}
    ],
    
    gold: [
        {year: 1900, price: 20.67}, {year: 1913, price: 20.67}, {year: 1933, price: 35},
        {year: 1971, price: 35}, {year: 1980, price: 850}, {year: 1990, price: 400},
        {year: 2000, price: 280}, {year: 2008, price: 865}, {year: 2015, price: 1060},
        {year: 2020, price: 1900}, {year: 2024, price: 2400}, {year: 2025, price: 3300}
    ],
    
    silver: [
        {year: 1900, price: 0.65}, {year: 1913, price: 0.60}, {year: 1933, price: 0.35},
        {year: 1971, price: 1.39}, {year: 1980, price: 20.00}, {year: 1990, price: 4.00},
        {year: 2000, price: 5.00}, {year: 2008, price: 15.00}, {year: 2015, price: 16.00},
        {year: 2020, price: 25.00}, {year: 2024, price: 30.00}, {year: 2025, price: 33.00}
    ],
    
    minimumWage: [
        {year: 1900, wage: 0.22}, {year: 1913, wage: 0.30}, {year: 1933, wage: 0.25},
        {year: 1950, wage: 0.75}, {year: 1968, wage: 1.60}, {year: 1980, wage: 3.10},
        {year: 1990, wage: 3.80}, {year: 2000, wage: 5.15}, {year: 2009, wage: 7.25},
        {year: 2025, wage: 7.25}
    ]
};

const HISTORICAL_EVENTS = [
    {year: 1910, title: "Jekyll Island Conspiracy", description: "Secret meeting creates Federal Reserve plan"},
    {year: 1913, title: "Federal Reserve Act", description: "Private banking cartel given control of money supply"},
    {year: 1933, title: "Gold Confiscation", description: "FDR bans private gold ownership"},
    {year: 1944, title: "Bretton Woods", description: "Dollar becomes global reserve currency"},
    {year: 1971, title: "Nixon Shock", description: "Gold standard completely abandoned"},
    {year: 2008, title: "Financial Crisis", description: "$700B+ bank bailouts"},
    {year: 2020, title: "COVID Wealth Transfer", description: "$4T+ to corporations"}
];

// ====================================================================
// TOOLTIP INFORMATION DATABASE
// ====================================================================

const TOOLTIP_INFO = {
    'wage-calculator': {
        title: 'How the Wage Calculator Works',
        content: `
            <p>This calculator shows how much purchasing power you've lost due to monetary manipulation.</p>
            <ul>
                <li><strong>1968 Baseline:</strong> Minimum wage was $1.60/hour when gold was $35/ounce</li>
                <li><strong>Gold Equivalent:</strong> That's 0.046 ounces of gold per hour of work</li>
                <li><strong>Today's Reality:</strong> 0.046 oz × current gold price = what you should earn</li>
            </ul>
            <div class="example">If gold is $3,300/oz, you should earn $151.80/hour</div>
        `
    },
    
    'should-earn': {
        title: 'What You Should Be Earning',
        content: `
            <p>This shows what your wage would be if purchasing power hadn't been stolen.</p>
            <ul>
                <li><strong>Based on 1968:</strong> Before major monetary manipulation</li>
                <li><strong>Real Money:</strong> When dollars were backed by gold</li>
                <li><strong>Actual Value:</strong> What your labor was worth in real purchasing power</li>
            </ul>
        `
    },
    
    'theft-calculation': {
        title: 'How Theft is Calculated',
        content: `
            <p>The "theft" is the difference between what you should earn and what you actually earn.</p>
            <div class="example">$151.80/hour - $15.00/hour = $136.80/hour stolen</div>
            <p>This isn't inflation - it's systematic currency debasement transferring your wealth to financial elites.</p>
        `
    },
    
    'gold-price': {
        title: 'Why Gold Price Matters',
        content: `
            <p>Gold is constitutional money that can't be printed or manipulated.</p>
            <ul>
                <li><strong>Real Money:</strong> 5,000 years of history</li>
                <li><strong>Inflation Measure:</strong> Shows true currency debasement</li>
                <li><strong>Live Updates:</strong> Current market prices every 5 minutes</li>
            </ul>
        `
    },
    
    'federal-debt': {
        title: 'Federal Debt Extraction',
        content: `
            <p>National debt isn't money owed to "ourselves" - it's owed to private banks.</p>
            <ul>
                <li><strong>Created from Nothing:</strong> Federal Reserve creates money electronically</li>
                <li><strong>Interest Charged:</strong> Taxpayers pay interest on created money</li>
                <li><strong>$36+ Trillion:</strong> $108,000 per American citizen</li>
            </ul>
        `
    },
    
    'correlation-chart': {
        title: 'Mathematical Proof of Coordination',
        content: `
            <p>This chart proves systematic coordination - natural markets don't create 0.9+ correlations.</p>
            <ul>
                <li><strong>125 Years of Data:</strong> Long-term systematic pattern</li>
                <li><strong>Statistical Impossibility:</strong> Cannot occur naturally</li>
                <li><strong>Smoking Gun:</strong> Proves conscious manipulation</li>
            </ul>
        `
    }
};

// ====================================================================
// UTILITY FUNCTIONS
// ====================================================================

// Safe DOM element selection
function $(id) {
    const element = document.getElementById(id);
    if (!element) console.warn(`Element not found: ${id}`);
    return element;
}

// Safe number formatting
function formatCurrency(value, decimals = 2) {
    if (typeof value !== 'number' || isNaN(value)) return '$0.00';
    return '$' + value.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// Safe number parsing
function parseNumber(value, fallback = 0) {
    const parsed = parseFloat(value);
    return isNaN(parsed) ? fallback : parsed;
}

// Interpolate missing data points
function interpolateData(data, startYear, endYear) {
    const result = [];
    const sortedData = [...data].sort((a, b) => a.year - b.year);
    
    for (let year = startYear; year <= endYear; year++) {
        const existing = sortedData.find(d => d.year === year);
        if (existing) {
            result.push({...existing});
            continue;
        }
        
        const before = sortedData.filter(d => d.year < year).pop();
        const after = sortedData.find(d => d.year > year);
        
        if (before && after) {
            const ratio = (year - before.year) / (after.year - before.year);
            const newPoint = {year};
            
            Object.keys(before).forEach(key => {
                if (key !== 'year' && typeof before[key] === 'number') {
                    newPoint[key] = before[key] + (after[key] - before[key]) * ratio;
                }
            });
            
            result.push(newPoint);
        }
    }
    
    return result;
}

// Calculate correlation coefficient
function calculateCorrelation(x, y) {
    if (!Array.isArray(x) || !Array.isArray(y) || x.length !== y.length || x.length < 2) {
        return 0;
    }
    
    const n = x.length;
    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
    const sumX2 = x.reduce((sum, xi) => sum + xi * xi, 0);
    const sumY2 = y.reduce((sum, yi) => sum + yi * yi, 0);
    
    const numerator = n * sumXY - sumX * sumY;
    const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));
    
    return denominator === 0 ? 0 : numerator / denominator;
}

// ====================================================================
// API INTEGRATION
// ====================================================================

// Load real-time metal prices
async function loadMetalPrices() {
    try {
        const url = `${CONFIG.apis.metals.baseUrl}?access_key=${CONFIG.apis.metals.key}&base=USD&symbols=XAU,XAG`;
        
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        
        const data = await response.json();
        
        if (data.success && data.rates) {
            STATE.current.gold = Math.round(1 / data.rates.XAU);
            STATE.current.silver = Math.round(1 / data.rates.XAG * 100) / 100;
            console.log(`✓ Metal prices updated: Gold $${STATE.current.gold}, Silver $${STATE.current.silver}`);
            return true;
        }
        throw new Error('Invalid API response');
        
    } catch (error) {
        console.warn('Metal API failed, using fallback:', error.message);
        STATE.current.gold = CONFIG.fallback.gold;
        STATE.current.silver = CONFIG.fallback.silver;
        return false;
    }
}

// Load Federal Reserve data
async function loadFredData() {
    try {
        const url = `${CONFIG.apis.fred.baseUrl}?series_id=${CONFIG.apis.fred.series.debt}&api_key=${CONFIG.apis.fred.key}&file_type=json&limit=1&sort_order=desc`;
        
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        
        const data = await response.json();
        
        if (data.observations && data.observations.length > 0) {
            const latest = data.observations[0];
            if (latest.value !== '.') {
                STATE.current.debt = parseNumber(latest.value) / 1000; // Convert billions to trillions
                console.log(`✓ FRED data updated: Debt $${STATE.current.debt.toFixed(2)}T`);
                return true;
            }
        }
        throw new Error('No valid data');
        
    } catch (error) {
        console.warn('FRED API failed, using fallback:', error.message);
        STATE.current.debt = CONFIG.fallback.debt;
        return false;
    }
}

// Load all real-time data
async function loadRealTimeData() {
    const metalSuccess = await loadMetalPrices();
    const fredSuccess = await loadFredData();
    
    updateDashboard();
    
    if (metalSuccess || fredSuccess) {
        console.log('✓ Real-time data loaded successfully');
    }
}

// ====================================================================
// DATA MANAGEMENT
// ====================================================================

// Initialize historical data
function loadHistoricalData() {
    STATE.data.gold = interpolateData(HISTORICAL_DATA.gold, 1900, 2025);
    STATE.data.silver = interpolateData(HISTORICAL_DATA.silver, 1900, 2025);
    STATE.data.debt = interpolateData(HISTORICAL_DATA.debt, 1900, 2025);
    STATE.data.minimumWage = interpolateData(HISTORICAL_DATA.minimumWage, 1900, 2025);
    
    console.log('✓ Historical data loaded and interpolated');
}

// Update dashboard with current data
function updateDashboard() {
    // Update price displays
    const goldEl = $('currentGold');
    const silverEl = $('currentSilver');
    const debtEl = $('currentDebt');
    
    if (goldEl) goldEl.textContent = formatCurrency(STATE.current.gold);
    if (silverEl) silverEl.textContent = formatCurrency(STATE.current.silver);
    if (debtEl) debtEl.textContent = `$${STATE.current.debt.toFixed(2)}T`;
    
    // Calculate and display changes
    const goldChange = ((STATE.current.gold - 35) / 35 * 100);
    const silverChange = ((STATE.current.silver - 1.39) / 1.39 * 100);
    
    const goldChangeEl = $('goldChange');
    const silverChangeEl = $('silverChange');
    
    if (goldChangeEl) {
        goldChangeEl.textContent = `+${goldChange.toFixed(0)}% since 1971`;
        goldChangeEl.className = 'metric-change positive';
    }
    
    if (silverChangeEl) {
        silverChangeEl.textContent = `+${silverChange.toFixed(0)}% since 1971`;
        silverChangeEl.className = 'metric-change positive';
    }
    
    // Update theft percentage
    const theftEl = $('totalTheft');
    if (theftEl) {
        const theftPercent = ((STATE.current.gold - 35) / STATE.current.gold * 100);
        theftEl.textContent = `${theftPercent.toFixed(1)}%`;
    }
}

// ====================================================================
// PERSONAL IMPACT CALCULATOR
// ====================================================================

// Calculate personal theft impact
function calculatePersonalImpact() {
    const wageInput = parseNumber($('userWage')?.value, 15);
    const wageType = $('wageType')?.value || 'hourly';
    
    // Convert to hourly
    const hourlyWage = wageType === 'annual' ? wageInput / (40 * 52) : wageInput;
    
    // Store user data
    STATE.user.hourlyWage = hourlyWage;
    STATE.user.annualWage = hourlyWage * 40 * 52;
    
    // Calculate 1968 purchasing power equivalent
    const goldOuncesPerHour1968 = 1.60 / 35;
    const goldAdjustedWage = goldOuncesPerHour1968 * STATE.current.gold;
    
    // Calculate theft amounts
    const theftPerHour = Math.max(0, goldAdjustedWage - hourlyWage);
    const monthlyTheft = theftPerHour * 40 * 4.33;
    const lifetimeTheft = theftPerHour * 40 * 52 * 40;
    
    // Update UI elements
    const shouldEarnEl = $('shouldEarn');
    const actualEarnEl = $('actualEarn');
    const stolenAmountEl = $('stolenAmount');
    const monthlyTheftEl = $('monthlyTheft');
    const lifetimeTheftEl = $('lifetimeTheft');
    
    if (shouldEarnEl) shouldEarnEl.textContent = formatCurrency(goldAdjustedWage) + '/hour';
    if (actualEarnEl) actualEarnEl.textContent = formatCurrency(hourlyWage) + '/hour';
    if (stolenAmountEl) stolenAmountEl.textContent = formatCurrency(theftPerHour) + '/hour';
    if (monthlyTheftEl) monthlyTheftEl.textContent = formatCurrency(monthlyTheft, 0) + ' per month';
    if (lifetimeTheftEl) lifetimeTheftEl.textContent = `$${(lifetimeTheft/1000000).toFixed(1)} Million`;
    
    // Show results
    const resultsEl = $('theftResults');
    if (resultsEl) {
        resultsEl.style.display = 'grid';
        resultsEl.classList.add('fade-in');
    }
    
    // Update personal theft counter
    STATE.counters.personalTheft = theftPerHour / 24; // Per hour to per minute
    
    // Update personal chart
    updatePersonalChart();
    
    console.log(`✓ Personal impact calculated: $${theftPerHour.toFixed(2)}/hour theft`);
}

// ====================================================================
// CHART MANAGEMENT
// ====================================================================

// Initialize all charts
function initializeCharts() {
    createMasterChart();
    createPersonalChart();
    createConstitutionalChart();
    createTimelineChart();
    createCumulativeChart();
    
    console.log('✓ All charts initialized');
}

// Create main correlation chart
function createMasterChart() {
    const ctx = $('masterChart')?.getContext('2d');
    if (!ctx) return;
    
    STATE.charts.master = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [
                {
                    label: 'Gold Price ($)',
                    data: [],
                    borderColor: '#ffd700',
                    backgroundColor: 'rgba(255, 215, 0, 0.1)',
                    yAxisID: 'y',
                    borderWidth: 3,
                    tension: 0.1
                },
                {
                    label: 'Silver Price ($)',
                    data: [],
                    borderColor: '#c0c0c0',
                    backgroundColor: 'rgba(192, 192, 192, 0.1)',
                    yAxisID: 'y',
                    borderWidth: 2,
                    tension: 0.1
                },
                {
                    label: 'Federal Debt ($T)',
                    data: [],
                    borderColor: '#e74c3c',
                    backgroundColor: 'rgba(231, 76, 60, 0.1)',
                    yAxisID: 'y1',
                    borderWidth: 3,
                    tension: 0.1
                }
            ]
        },
        options: {
            responsive: true,
            interaction: {
                mode: 'index',
                intersect: false,
            },
            plugins: {
                legend: {
                    position: 'top'
                }
            },
            scales: {
                y: {
                    type: 'logarithmic',
                    display: true,
                    position: 'left',
                    title: {
                        display: true,
                        text: 'Gold & Silver Price ($)'
                    }
                },
                y1: {
                    type: 'logarithmic',
                    display: true,
                    position: 'right',
                    title: {
                        display: true,
                        text: 'Federal Debt ($T)'
                    },
                    grid: {
                        drawOnChartArea: false,
                    }
                }
            }
        }
    });
}

// Create personal impact chart
function createPersonalChart() {
    const ctx = $('personalChart')?.getContext('2d');
    if (!ctx) return;
    
    STATE.charts.personal = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [
                {
                    label: 'Your Actual Wage',
                    data: [],
                    borderColor: '#e74c3c',
                    borderWidth: 3,
                    fill: false
                },
                {
                    label: 'Gold-Adjusted Wage',
                    data: [],
                    borderColor: '#ffd700',
                    borderWidth: 3,
                    fill: false
                },
                {
                    label: 'Silver-Adjusted Wage',
                    data: [],
                    borderColor: '#c0c0c0',
                    borderWidth: 2,
                    fill: false
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    title: {
                        display: true,
                        text: 'Hourly Wage ($)'
                    }
                }
            }
        }
    });
}

// Create constitutional money chart
function createConstitutionalChart() {
    const ctx = $('constitutionalChart')?.getContext('2d');
    if (!ctx) return;
    
    STATE.charts.constitutional = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [
                {
                    label: 'Gold/Silver Ratio',
                    data: [],
                    borderColor: '#f39c12',
                    borderWidth: 3
                },
                {
                    label: 'Historical Average (16:1)',
                    data: [],
                    borderColor: '#95a5a6',
                    borderWidth: 2,
                    borderDash: [5, 5]
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    title: {
                        display: true,
                        text: 'Gold/Silver Ratio'
                    }
                }
            }
        }
    });
}

// Create timeline chart
function createTimelineChart() {
    const ctx = $('timelineChart')?.getContext('2d');
    if (!ctx) return;
    
    STATE.charts.timeline = new Chart(ctx, {
        type: 'scatter',
        data: {
            datasets: [{
                label: 'Major Events',
                data: HISTORICAL_EVENTS.map(event => ({
                    x: event.year,
                    y: 0.5,
                    title: event.title,
                    description: event.description
                })),
                backgroundColor: '#3498db',
                borderColor: '#2980b9',
                pointRadius: 10
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        title: function(context) {
                            const point = context[0];
                            return `${point.parsed.x}: ${point.raw.title}`;
                        },
                        label: function(context) {
                            return context.raw.description;
                        }
                    }
                }
            },
            scales: {
                x: {
                    title: { display: true, text: 'Year' },
                    min: 1900,
                    max: 2025
                },
                y: {
                    display: false,
                    min: 0,
                    max: 1
                }
            }
        }
    });
    
    // Create timeline events display
    createTimelineEvents();
}

// Create cumulative theft chart
function createCumulativeChart() {
    const ctx = $('cumulativeChart')?.getContext('2d');
    if (!ctx) return;
    
    STATE.charts.cumulative = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: [],
            datasets: [{
                label: 'Cumulative Wealth Transfer ($T)',
                data: [],
                backgroundColor: 'rgba(231, 76, 60, 0.8)',
                borderColor: '#e74c3c',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            plugins: { legend: { display: false } },
            scales: {
                y: {
                    title: { display: true, text: 'Transfer ($T)' }
                }
            }
        }
    });
}

// Create timeline events display
function createTimelineEvents() {
    const container = $('timelineEvents');
    if (!container) return;
    
    container.innerHTML = HISTORICAL_EVENTS.map(event => `
        <div class="timeline-event">
            <h4>${event.year}: ${event.title}</h4>
            <p>${event.description}</p>
        </div>
    `).join('');
}

// Update all charts
function updateAllCharts() {
    const startYear = parseNumber($('startYear')?.value, 1900);
    const endYear = parseNumber($('endYear')?.value, 2025);
    
    updateMasterChart(startYear, endYear);
    updatePersonalChart();
    updateConstitutionalChart(startYear, endYear);
    updateCumulativeChart(startYear, endYear);
    calculateCorrelations(startYear, endYear);
}

// Update master correlation chart
function updateMasterChart(startYear, endYear) {
    if (!STATE.charts.master) return;
    
    const filteredGold = STATE.data.gold.filter(d => d.year >= startYear && d.year <= endYear);
    const filteredSilver = STATE.data.silver.filter(d => d.year >= startYear && d.year <= endYear);
    const filteredDebt = STATE.data.debt.filter(d => d.year >= startYear && d.year <= endYear);
    
    const years = filteredGold.map(d => d.year);
    
    STATE.charts.master.data.labels = years;
    STATE.charts.master.data.datasets[0].data = filteredGold.map(d => d.price);
    STATE.charts.master.data.datasets[1].data = filteredSilver.map(d => d.price);
    STATE.charts.master.data.datasets[2].data = filteredDebt.map(d => d.debt);
    STATE.charts.master.update('none');
}

// Update personal impact chart
function updatePersonalChart() {
    if (!STATE.charts.personal) return;
    
    const showUserWage = $('showUserWage')?.checked ?? true;
    const startYear = parseNumber($('startYear')?.value, 1900);
    const endYear = parseNumber($('endYear')?.value, 2025);
    
    const years = [];
    const actualWages = [];
    const goldAdjustedWages = [];
    const silverAdjustedWages = [];
    
    for (let year = startYear; year <= endYear; year += 5) {
        years.push(year);
        
        let wage = 7.25;
        if (showUserWage && STATE.user.hourlyWage > 0) {
            wage = STATE.user.hourlyWage;
        } else {
            const historicalWage = STATE.data.minimumWage.find(w => w.year <= year);
            if (historicalWage) wage = historicalWage.wage;
        }
        
        actualWages.push(wage);
        
        const goldPrice = STATE.data.gold.find(g => g.year === year)?.price || 35;
        const silverPrice = STATE.data.silver.find(s => s.year === year)?.price || 1.39;
        
        const goldOuncesPerHour1968 = 1.60 / 35;
        const silverOuncesPerHour1968 = 1.60 / 1.39;
        
        goldAdjustedWages.push(goldOuncesPerHour1968 * goldPrice);
        silverAdjustedWages.push(silverOuncesPerHour1968 * silverPrice);
    }
    
    STATE.charts.personal.data.labels = years;
    STATE.charts.personal.data.datasets[0].data = actualWages;
    STATE.charts.personal.data.datasets[1].data = goldAdjustedWages;
    STATE.charts.personal.data.datasets[2].data = silverAdjustedWages;
    STATE.charts.personal.update('none');
}

// Update constitutional money chart
function updateConstitutionalChart(startYear, endYear) {
    if (!STATE.charts.constitutional) return;
    
    const years = [];
    const ratios = [];
    const historicalAverage = [];
    
    for (let year = startYear; year <= endYear; year += 2) {
        const gold = STATE.data.gold.find(g => g.year === year)?.price || 35;
        const silver = STATE.data.silver.find(s => s.year === year)?.price || 1.39;
        
        years.push(year);
        ratios.push(gold / silver);
        historicalAverage.push(16);
    }
    
    STATE.charts.constitutional.data.labels = years;
    STATE.charts.constitutional.data.datasets[0].data = ratios;
    STATE.charts.constitutional.data.datasets[1].data = historicalAverage;
    STATE.charts.constitutional.update('none');
}

// Update cumulative theft chart
function updateCumulativeChart(startYear, endYear) {
    if (!STATE.charts.cumulative) return;
    
    const years = [];
    const cumulativeTransfer = [];
    let cumulative = 0;
    
    for (let year = startYear; year <= endYear; year += 5) {
        const debt = STATE.data.debt.find(d => d.year === year)?.debt || 0;
        
        years.push(year);
        
        if (year > startYear) {
            const prevDebt = STATE.data.debt.find(d => d.year === year - 5)?.debt || 0;
            const avgDebt = (debt + prevDebt) / 2;
            const transfer = avgDebt * 0.05 * 5;
            cumulative += transfer;
        }
        
        cumulativeTransfer.push(cumulative);
    }
    
    STATE.charts.cumulative.data.labels = years;
    STATE.charts.cumulative.data.datasets[0].data = cumulativeTransfer;
    STATE.charts.cumulative.update('none');
}

// Calculate and display correlations
function calculateCorrelations(startYear, endYear) {
    const filteredGold = STATE.data.gold.filter(d => d.year >= startYear && d.year <= endYear);
    const filteredSilver = STATE.data.silver.filter(d => d.year >= startYear && d.year <= endYear);
    const filteredDebt = STATE.data.debt.filter(d => d.year >= startYear && d.year <= endYear);
    
    if (filteredGold.length < 3) return;
    
    const goldPrices = filteredGold.map(d => d.price);
    const silverPrices = filteredSilver.map(d => d.price);
    const debtValues = filteredDebt.map(d => d.debt);
    
    const goldDebtCorr = calculateCorrelation(goldPrices, debtValues);
    const silverDebtCorr = calculateCorrelation(silverPrices, debtValues);
    
    const goldCorrEl = $('goldDebtCorr');
    const silverCorrEl = $('silverDebtCorr');
    
    if (goldCorrEl) goldCorrEl.textContent = goldDebtCorr.toFixed(3);
    if (silverCorrEl) silverCorrEl.textContent = silverDebtCorr.toFixed(3);
}

// ====================================================================
// TOOLTIP SYSTEM
// ====================================================================

// Initialize tooltip system
function initializeTooltips() {
    document.querySelectorAll('.info-icon').forEach(icon => {
        icon.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            showTooltip(this.dataset.info);
        });
    });
    
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.info-tooltip') && !e.target.closest('.info-icon')) {
            hideTooltip();
        }
    });
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') hideTooltip();
    });
}

// Show tooltip
function showTooltip(infoKey) {
    const tooltip = $('infoTooltip');
    const tooltipText = tooltip?.querySelector('.tooltip-text');
    const closeBtn = tooltip?.querySelector('.tooltip-close');
    
    if (!tooltip || !tooltipText) return;
    
    const info = TOOLTIP_INFO[infoKey];
    if (!info) {
        console.warn('Tooltip info not found:', infoKey);
        return;
    }
    
    tooltipText.innerHTML = `<h4>${info.title}</h4>${info.content}`;
    tooltip.style.display = 'block';
    
    if (closeBtn) closeBtn.onclick = hideTooltip;
}

// Hide tooltip
function hideTooltip() {
    const tooltip = $('infoTooltip');
    if (tooltip) tooltip.style.display = 'none';
}

// ====================================================================
// COUNTERS AND TIMERS
// ====================================================================

// Start real-time counters
function startCounters() {
    const dailyFederalInterest = 1100000000000 / 365; // $1.1T annually
    const perSecondInterest = dailyFederalInterest / (24 * 60 * 60);
    
    STATE.timers.counters = setInterval(() => {
        STATE.counters.federalInterest += perSecondInterest;
        
        const federalEl = $('federalInterest');
        const personalEl = $('personalShare');
        
        if (federalEl) {
            federalEl.textContent = formatCurrency(STATE.counters.federalInterest, 0);
        }
        
        if (personalEl && STATE.counters.personalTheft > 0) {
            const personalDaily = STATE.counters.personalTheft * 24;
            personalEl.textContent = formatCurrency(personalDaily, 0);
        }
    }, CONFIG.intervals.counters);
}

// Start API update timers
function startApiTimers() {
    // Metal prices every 5 minutes
    STATE.timers.metals = setInterval(loadMetalPrices, CONFIG.intervals.metals);
    
    // FRED data every hour
    STATE.timers.fred = setInterval(loadFredData, CONFIG.intervals.fred);
}

// ====================================================================
// EVENT HANDLERS
// ====================================================================

// Setup all event listeners
function setupEventListeners() {
    // Personal calculator
    const calculateBtn = $('calculateImpact');
    const userWageEl = $('userWage');
    const wageTypeEl = $('wageType');
    
    if (calculateBtn) calculateBtn.addEventListener('click', calculatePersonalImpact);
    if (userWageEl) userWageEl.addEventListener('input', handleWageInput);
    if (wageTypeEl) wageTypeEl.addEventListener('change', handleWageInput);
    
    // Chart controls
    const startYearEl = $('startYear');
    const endYearEl = $('endYear');
    const showUserWageEl = $('showUserWage');
    const resetBtn = $('resetToDefaults');
    
    if (startYearEl) startYearEl.addEventListener('input', updateSliderDisplays);
    if (endYearEl) endYearEl.addEventListener('input', updateSliderDisplays);
    if (showUserWageEl) showUserWageEl.addEventListener('change', updatePersonalChart);
    if (resetBtn) resetBtn.addEventListener('click', resetToDefaults);
    
    // Era buttons
    setupEraButtons();
    
    // Share button
    const shareBtn = $('shareAnalysis');
    if (shareBtn) shareBtn.addEventListener('click', shareAnalysis);
}

// Handle wage input changes
function handleWageInput() {
    const wage = $('userWage')?.value;
    if (wage && parseNumber(wage) > 0) {
        setTimeout(calculatePersonalImpact, 500); // Debounce
    }
}

// Update slider displays
function updateSliderDisplays() {
    const startYear = $('startYear')?.value || '1900';
    const endYear = $('endYear')?.value || '2025';
    
    const startValueEl = $('startYearValue');
    const endValueEl = $('endYearValue');
    
    if (startValueEl) startValueEl.textContent = startYear;
    if (endValueEl) endValueEl.textContent = endYear;
    
    // Ensure end year is after start year
    if (parseInt(endYear) <= parseInt(startYear)) {
        const endYearEl = $('endYear');
        if (endYearEl) {
            endYearEl.value = parseInt(startYear) + 1;
            if (endValueEl) endValueEl.textContent = parseInt(startYear) + 1;
        }
    }
    
    updateAllCharts();
}

// Setup era buttons
function setupEraButtons() {
    const eraButtons = document.querySelectorAll('.era-btn');
    eraButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            eraButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const era = this.dataset.era;
            switch(era) {
                case 'gold-standard': setDateRange(1900, 1933); break;
                case 'fed-expansion': setDateRange(1913, 1971); break;
                case 'fiat-era': setDateRange(1971, 2025); break;
                default: setDateRange(1900, 2025);
            }
        });
    });
}

// Set date range
function setDateRange(start, end) {
    const startEl = $('startYear');
    const endEl = $('endYear');
    
    if (startEl) startEl.value = start;
    if (endEl) endEl.value = end;
    
    updateSliderDisplays();
}

// Reset to defaults
function resetToDefaults() {
    setDateRange(1900, 2025);
    const showUserWageEl = $('showUserWage');
    if (showUserWageEl) showUserWageEl.checked = true;
    updateAllCharts();
}

// Share analysis
function shareAnalysis() {
    const url = window.location.href;
    const theftAmount = STATE.user.hourlyWage * 40 * 52 * 40 / 1000000;
    const text = `I just discovered I've been systematically robbed of $${theftAmount.toFixed(1)} million through monetary manipulation. See the mathematical proof:`;
    
    if (navigator.share) {
        navigator.share({
            title: 'Systematic Wealth Theft - Mathematical Proof',
            text: text,
            url: url
        }).catch(console.warn);
    } else {
        navigator.clipboard.writeText(`${text} ${url}`).then(() => {
            alert('Analysis copied to clipboard! Share it everywhere.');
        }).catch(() => {
            console.warn('Could not copy to clipboard');
        });
    }
}

// ====================================================================
// INITIALIZATION
// ====================================================================

// Main initialization function
async function initializeApp() {
    try {
        console.log('🚀 Initializing Wealth Extraction Analysis Tool v2.1...');
        
        // Setup event listeners first
        setupEventListeners();
        initializeTooltips();
        
        // Load data
        loadHistoricalData();
        await loadRealTimeData();
        
        // Initialize UI
        updateDashboard();
        updateSliderDisplays();
        
        // Initialize charts
        initializeCharts();
        updateAllCharts();
        
        // Start counters and timers
        startCounters();
        startApiTimers();
        
        // Auto-calculate with default wage
        setTimeout(calculatePersonalImpact, 1000);
        
        console.log('✅ Application initialized successfully');
        
    } catch (error) {
        console.error('❌ Initialization failed:', error);
        
        // Emergency fallback
        STATE.current.gold = CONFIG.fallback.gold;
        STATE.current.silver = CONFIG.fallback.silver;
        STATE.current.debt = CONFIG.fallback.debt;
        
        updateDashboard();
        calculatePersonalImpact();
    }
}

// Start when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}

// Cleanup on page unload
window.addEventListener('beforeunload', function() {
    Object.values(STATE.timers).forEach(timer => {
        if (timer) clearInterval(timer);
    });
});

console.log('💰 Wealth Extraction Analysis Tool v2.1 - Script Loaded');
