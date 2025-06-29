/**
 * Wealth Extraction Analysis Tool v2.1
 * Optimized and fully integrated with real-time APIs
 */

// ===== GLOBAL CONFIGURATION =====
const CONFIG = {
    // API Keys and endpoints
    apis: {
        metals: {
            key: 'fd9f5f9b02a9ab882530fc61b3d726d2',
            url: 'https://api.metalpriceapi.com/v1/latest',
            symbols: 'XAU,XAG',
            updateInterval: 300000 // 5 minutes
        },
        fred: {
            key: '455899376e41be09aa5f0910efb2c113',
            baseUrl: 'https://api.stlouisfed.org/fred/series/observations',
            series: {
                debt: 'GFDEBTN',
                gdp: 'GDP',
                cpi: 'CPIAUCSL'
            },
            updateInterval: 3600000 // 1 hour
        }
    },
    
    // Fallback data for when APIs fail
    fallback: {
        gold: 3300,
        silver: 33,
        debt: 36.25,
        lastUpdate: new Date().toISOString()
    },
    
    // Application settings
    settings: {
        defaultStartYear: 1900,
        defaultEndYear: 2025,
        chartAnimationDuration: 750,
        counterUpdateInterval: 1000,
        correlationThreshold: 0.7
    }
};

// ===== GLOBAL STATE =====
const STATE = {
    // Current data
    currentPrices: {
        gold: CONFIG.fallback.gold,
        silver: CONFIG.fallback.silver,
        debt: CONFIG.fallback.debt,
        lastUpdate: new Date()
    },
    
    // Historical data
    historicalData: {
        gold: [],
        silver: [],
        debt: [],
        wages: []
    },
    
    // User data
    userData: {
        hourlyWage: 15,
        annualWage: 31200,
        theftCalculated: false
    },
    
    // Charts
    charts: {},
    
    // Counters
    counters: {
        federalInterest: 0,
        personalTheft: 0,
        running: false
    },
    
    // UI state
    ui: {
        tooltipOpen: false,
        currentDateRange: {
            start: CONFIG.settings.defaultStartYear,
            end: CONFIG.settings.defaultEndYear
        }
    }
};

// ===== HISTORICAL DATA =====
const HISTORICAL_DATA = {
    // Federal debt in billions, converted to trillions
    debt: [
        {year: 1900, value: 1.26}, {year: 1910, value: 1.15}, {year: 1913, value: 2.9},
        {year: 1920, value: 25.95}, {year: 1930, value: 16.19}, {year: 1933, value: 22.54},
        {year: 1940, value: 42.97}, {year: 1950, value: 257.36}, {year: 1960, value: 286.33},
        {year: 1971, value: 398}, {year: 1980, value: 908}, {year: 1990, value: 3233},
        {year: 2000, value: 5674}, {year: 2008, value: 10025}, {year: 2010, value: 13562},
        {year: 2015, value: 18151}, {year: 2020, value: 26945}, {year: 2023, value: 33167},
        {year: 2024, value: 35465}, {year: 2025, value: 36250}
    ].map(d => ({...d, value: d.value < 1000 ? d.value : d.value / 1000})), // Convert to trillions
    
    // Gold prices in USD per ounce
    gold: [
        {year: 1900, value: 20.67}, {year: 1910, value: 20.67}, {year: 1913, value: 20.67},
        {year: 1920, value: 20.67}, {year: 1930, value: 20.67}, {year: 1933, value: 35},
        {year: 1940, value: 35}, {year: 1950, value: 35}, {year: 1960, value: 35},
        {year: 1971, value: 35}, {year: 1975, value: 140}, {year: 1980, value: 850},
        {year: 1985, value: 300}, {year: 1990, value: 400}, {year: 1995, value: 385},
        {year: 2000, value: 280}, {year: 2005, value: 430}, {year: 2008, value: 865},
        {year: 2010, value: 1400}, {year: 2015, value: 1060}, {year: 2020, value: 1900},
        {year: 2023, value: 2000}, {year: 2024, value: 2400}, {year: 2025, value: 3300}
    ],
    
    // Silver prices in USD per ounce
    silver: [
        {year: 1900, value: 0.65}, {year: 1910, value: 0.53}, {year: 1913, value: 0.60},
        {year: 1920, value: 1.00}, {year: 1930, value: 0.38}, {year: 1933, value: 0.35},
        {year: 1940, value: 0.35}, {year: 1950, value: 0.74}, {year: 1960, value: 0.91},
        {year: 1971, value: 1.39}, {year: 1975, value: 4.00}, {year: 1980, value: 20.00},
        {year: 1985, value: 6.00}, {year: 1990, value: 4.00}, {year: 1995, value: 5.15},
        {year: 2000, value: 5.00}, {year: 2005, value: 7.50}, {year: 2008, value: 15.00},
        {year: 2010, value: 20.00}, {year: 2015, value: 16.00}, {year: 2020, value: 25.00},
        {year: 2023, value: 24.00}, {year: 2024, value: 30.00}, {year: 2025, value: 33.00}
    ],
    
    // Minimum wage in USD per hour
    wages: [
        {year: 1900, value: 0.22}, {year: 1910, value: 0.25}, {year: 1913, value: 0.30},
        {year: 1920, value: 0.35}, {year: 1930, value: 0.40}, {year: 1933, value: 0.25},
        {year: 1940, value: 0.40}, {year: 1950, value: 0.75}, {year: 1960, value: 1.00},
        {year: 1968, value: 1.60}, {year: 1975, value: 2.10}, {year: 1980, value: 3.10},
        {year: 1990, value: 3.80}, {year: 1995, value: 4.25}, {year: 2000, value: 5.15},
        {year: 2007, value: 5.85}, {year: 2009, value: 7.25}, {year: 2025, value: 7.25}
    ]
};

// ===== TOOLTIP INFORMATION =====
const TOOLTIP_INFO = {
    'wage-calculator': {
        title: 'How the Wage Calculator Works',
        content: `<p>This calculator shows how much purchasing power you've lost due to monetary manipulation since 1968.</p>
        <ul>
            <li><strong>1968 Baseline:</strong> Minimum wage was $1.60/hour when gold was $35/ounce</li>
            <li><strong>Gold Standard:</strong> That's 0.046 ounces of gold per hour of work</li>
            <li><strong>Today's Reality:</strong> 0.046 oz × current gold price = what you should earn</li>
        </ul>
        <div class="example">If gold is $3,300/oz: You should earn $151.80/hour</div>`
    },
    
    'should-earn': {
        title: 'What You Should Be Earning',
        content: `<p>This shows what your wage would be if purchasing power hadn't been stolen.</p>
        <ul>
            <li><strong>Based on 1968:</strong> Last year before major manipulation accelerated</li>
            <li><strong>Real Money:</strong> When dollars were backed by gold</li>
            <li><strong>Mathematical Proof:</strong> Your labor is worth the same, money was debased</li>
        </ul>`
    },
    
    'theft-calculation': {
        title: 'How the Theft is Calculated',
        content: `<p>The "theft" is the difference between what you should earn and what you actually earn.</p>
        <div class="example">Gold-Adjusted Wage - Actual Wage = Theft Amount</div>
        <ul>
            <li><strong>Not Inflation:</strong> This is systematic currency debasement</li>
            <li><strong>Wealth Transfer:</strong> Your purchasing power went to financial elites</li>
        </ul>`
    },
    
    'gold-price': {
        title: 'Why Gold Price Matters',
        content: `<p>Gold is constitutional money that shows true currency debasement.</p>
        <ul>
            <li><strong>Can't Be Printed:</strong> Unlike paper money</li>
            <li><strong>5,000 Year History:</strong> Always been real money</li>
            <li><strong>Inflation Thermometer:</strong> Shows true monetary destruction</li>
        </ul>
        <div class="example">1971: $35/oz → Today: $3,300/oz = 9,400% increase</div>`
    },
    
    'correlation-chart': {
        title: 'The Mathematical Proof',
        content: `<p>This chart proves systematic coordination between debt and precious metals.</p>
        <ul>
            <li><strong>Correlation >0.9:</strong> Nearly perfect mathematical relationship</li>
            <li><strong>Statistically Impossible:</strong> Cannot occur naturally</li>
            <li><strong>125 Years:</strong> Shows long-term systematic coordination</li>
        </ul>`
    }
};

// ===== CORE FUNCTIONS =====

/**
 * Initialize the application
 */
async function initializeApp() {
    try {
        console.log('🚀 Initializing Wealth Extraction Analysis Tool v2.1...');
        
        // Setup in correct order
        setupEventListeners();
        initializeTooltips();
        loadHistoricalData();
        
        // Load real-time data with fallback
        await loadRealTimeData();
        
        // Initialize UI components
        initializeCharts();
        updateDashboard();
        startCounters();
        updateSliderDisplays();
        setupEraButtons();
        
        // Auto-calculate with default wage
        setTimeout(() => calculatePersonalImpact(), 1000);
        
        console.log('✅ Application initialized successfully');
        
    } catch (error) {
        console.error('❌ Initialization error:', error);
        // Use fallback data and continue
        STATE.currentPrices = {...CONFIG.fallback, lastUpdate: new Date()};
        initializeCharts();
        updateDashboard();
    }
}

/**
 * Setup all event listeners
 */
function setupEventListeners() {
    // Personal calculator
    const calculateBtn = document.getElementById('calculateImpact');
    const userWageInput = document.getElementById('userWage');
    const wageTypeSelect = document.getElementById('wageType');
    
    if (calculateBtn) calculateBtn.addEventListener('click', calculatePersonalImpact);
    if (userWageInput) userWageInput.addEventListener('input', handleWageInput);
    if (wageTypeSelect) wageTypeSelect.addEventListener('change', handleWageInput);
    
    // Chart controls
    const startYearSlider = document.getElementById('startYear');
    const endYearSlider = document.getElementById('endYear');
    const showUserWageCheck = document.getElementById('showUserWage');
    const resetBtn = document.getElementById('resetToDefaults');
    
    if (startYearSlider) startYearSlider.addEventListener('input', updateSliderDisplays);
    if (endYearSlider) endYearSlider.addEventListener('input', updateSliderDisplays);
    if (showUserWageCheck) showUserWageCheck.addEventListener('change', updatePersonalChart);
    if (resetBtn) resetBtn.addEventListener('click', resetToDefaults);
    
    // Share functionality
    const shareBtn = document.getElementById('shareAnalysis');
    if (shareBtn) shareBtn.addEventListener('click', shareAnalysis);
}

/**
 * Load historical data and interpolate missing years
 */
function loadHistoricalData() {
    STATE.historicalData.gold = interpolateYearlyData(HISTORICAL_DATA.gold, 1900, 2025);
    STATE.historicalData.silver = interpolateYearlyData(HISTORICAL_DATA.silver, 1900, 2025);
    STATE.historicalData.debt = interpolateYearlyData(HISTORICAL_DATA.debt, 1900, 2025);
    STATE.historicalData.wages = interpolateYearlyData(HISTORICAL_DATA.wages, 1900, 2025);
    
    console.log('📊 Historical data loaded and interpolated');
}

/**
 * Interpolate data points for missing years
 */
function interpolateYearlyData(data, startYear, endYear) {
    const result = [];
    
    for (let year = startYear; year <= endYear; year++) {
        const existing = data.find(d => d.year === year);
        
        if (existing) {
            result.push(existing);
        } else {
            // Linear interpolation
            const before = data.filter(d => d.year < year).pop();
            const after = data.find(d => d.year > year);
            
            if (before && after) {
                const ratio = (year - before.year) / (after.year - before.year);
                const interpolatedValue = before.value + (after.value - before.value) * ratio;
                result.push({year, value: interpolatedValue});
            } else if (before) {
                result.push({year, value: before.value});
            } else if (after) {
                result.push({year, value: after.value});
            }
        }
    }
    
    return result;
}

/**
 * Load real-time data from APIs with robust error handling
 */
async function loadRealTimeData() {
    console.log('🔄 Loading real-time data...');
    
    try {
        const promises = [
            loadMetalPrices().catch(e => console.warn('Metal API failed:', e.message)),
            loadFredData().catch(e => console.warn('FRED API failed:', e.message))
        ];
        
        await Promise.allSettled(promises);
        
        STATE.currentPrices.lastUpdate = new Date();
        updateDashboard();
        
        console.log('✅ Real-time data loaded:', STATE.currentPrices);
        
    } catch (error) {
        console.warn('⚠️ Using fallback data due to API errors');
        STATE.currentPrices = {...CONFIG.fallback, lastUpdate: new Date()};
    }
}

/**
 * Load metal prices from API
 */
async function loadMetalPrices() {
    try {
        // Note: Direct API calls may be blocked by CORS in production
        // Consider using a proxy server for production deployment
        const response = await fetch(`${CONFIG.apis.metals.url}?access_key=${CONFIG.apis.metals.key}&base=USD&symbols=${CONFIG.apis.metals.symbols}`);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        if (data.success && data.rates) {
            // API returns rates (USD per metal unit), convert to price (metal per USD)
            STATE.currentPrices.gold = 1 / data.rates.XAU;
            STATE.currentPrices.silver = 1 / data.rates.XAG;
            
            // Update historical data with current prices
            updateHistoricalWithCurrent('gold', STATE.currentPrices.gold);
            updateHistoricalWithCurrent('silver', STATE.currentPrices.silver);
            
        } else {
            throw new Error('Invalid API response structure');
        }
        
    } catch (error) {
        console.warn('Metal API error, using fallback:', error.message);
        STATE.currentPrices.gold = CONFIG.fallback.gold;
        STATE.currentPrices.silver = CONFIG.fallback.silver;
    }
}

/**
 * Load FRED economic data
 */
async function loadFredData() {
    try {
        const url = `${CONFIG.apis.fred.baseUrl}?series_id=${CONFIG.apis.fred.series.debt}&api_key=${CONFIG.apis.fred.key}&file_type=json&limit=1&sort_order=desc`;
        
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        if (data.observations && data.observations.length > 0) {
            const latest = data.observations[0];
            
            if (latest.value !== '.') {
                const debtBillions = parseFloat(latest.value);
                const debtTrillions = debtBillions / 1000;
                
                STATE.currentPrices.debt = debtTrillions;
                
                // Update historical data
                const currentYear = new Date().getFullYear();
                updateHistoricalWithCurrent('debt', debtTrillions, currentYear);
            }
        }
        
    } catch (error) {
        console.warn('FRED API error, using fallback:', error.message);
        STATE.currentPrices.debt = CONFIG.fallback.debt;
    }
}

/**
 * Update historical data with current API values
 */
function updateHistoricalWithCurrent(dataType, value, year = new Date().getFullYear()) {
    const dataArray = STATE.historicalData[dataType];
    const existingIndex = dataArray.findIndex(d => d.year === year);
    
    if (existingIndex >= 0) {
        dataArray[existingIndex].value = value;
    } else {
        dataArray.push({year, value});
        dataArray.sort((a, b) => a.year - b.year);
    }
}

/**
 * Update dashboard with current data
 */
function updateDashboard() {
    // Update price displays
    safeUpdateElement('currentGold', `$${STATE.currentPrices.gold.toFixed(2)}`);
    safeUpdateElement('currentSilver', `$${STATE.currentPrices.silver.toFixed(2)}`);
    safeUpdateElement('currentDebt', `$${STATE.currentPrices.debt.toFixed(2)}T`);
    
    // Calculate changes from 1971
    const goldChange = ((STATE.currentPrices.gold - 35) / 35 * 100);
    const silverChange = ((STATE.currentPrices.silver - 1.39) / 1.39 * 100);
    
    safeUpdateElement('goldChange', `+${goldChange.toFixed(0)}% since 1971`);
    safeUpdateElement('silverChange', `+${silverChange.toFixed(0)}% since 1971`);
    
    // Update theft percentage
    const theftPercentage = ((STATE.currentPrices.gold - 35) / STATE.currentPrices.gold * 100);
    safeUpdateElement('totalTheft', `${theftPercentage.toFixed(1)}%`);
    
    // Add updated class for visual feedback
    ['currentGold', 'currentSilver', 'currentDebt'].forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.classList.add('updated');
            setTimeout(() => element.classList.remove('updated'), 2000);
        }
    });
}

/**
 * Safe element update helper
 */
function safeUpdateElement(id, content) {
    const element = document.getElementById(id);
    if (element) {
        element.textContent = content;
    }
}

/**
 * Calculate personal impact for user
 */
function calculatePersonalImpact() {
    const wageInput = parseFloat(document.getElementById('userWage')?.value) || 15;
    const wageType = document.getElementById('wageType')?.value || 'hourly';
    
    // Convert to hourly
    let hourlyWage = wageInput;
    if (wageType === 'annual') {
        hourlyWage = wageInput / (40 * 52); // 40 hours/week, 52 weeks/year
    }
    
    // Store user wage data
    STATE.userData.hourlyWage = hourlyWage;
    STATE.userData.annualWage = hourlyWage * 40 * 52;
    STATE.userData.theftCalculated = true;
    
    // Calculate 1968 purchasing power equivalent
    const goldOuncesPerHour1968 = 1.60 / 35; // 1968 min wage / 1968 gold price
    const goldAdjustedWage = goldOuncesPerHour1968 * STATE.currentPrices.gold;
    
    // Calculate silver equivalent
    const silverOuncesPerHour1968 = 1.60 / 1.39;
    const silverAdjustedWage = silverOuncesPerHour1968 * STATE.currentPrices.silver;
    
    // Use the higher of gold or silver adjusted wage
    const shouldEarn = Math.max(goldAdjustedWage, silverAdjustedWage);
    const theftPerHour = shouldEarn - hourlyWage;
    const monthlyTheft = theftPerHour * 40 * 4.33; // 40 hours/week, 4.33 weeks/month
    const lifetimeTheft = theftPerHour * 40 * 52 * 40; // 40-year career
    
    // Update UI
    safeUpdateElement('shouldEarn', `$${shouldEarn.toFixed(2)}/hour`);
    safeUpdateElement('actualEarn', `$${hourlyWage.toFixed(2)}/hour`);
    safeUpdateElement('stolenAmount', `$${theftPerHour.toFixed(2)}/hour`);
    safeUpdateElement('monthlyTheft', `$${monthlyTheft.toLocaleString()} per month`);
    safeUpdateElement('lifetimeTheft', `$${(lifetimeTheft/1000000).toFixed(1)} Million`);
    
    // Show results
    const resultsDiv = document.getElementById('theftResults');
    if (resultsDiv) {
        resultsDiv.style.display = 'grid';
        resultsDiv.classList.add('fade-in');
    }
    
    // Update counter for personal theft
    STATE.counters.personalTheft = theftPerHour / 24; // Per hour to per minute
    
    // Update personal chart
    updatePersonalChart();
    
    console.log('💰 Personal theft calculated:', {
        hourlyWage,
        shouldEarn,
        theftPerHour,
        lifetimeTheft: lifetimeTheft/1000000
    });
}

/**
 * Handle wage input changes
 */
function handleWageInput() {
    const wage = document.getElementById('userWage')?.value;
    if (wage && parseFloat(wage) > 0) {
        // Auto-calculate after short delay
        clearTimeout(handleWageInput.timeout);
        handleWageInput.timeout = setTimeout(calculatePersonalImpact, 500);
    }
}

/**
 * Start real-time counters
 */
function startCounters() {
    if (STATE.counters.running) return;
    
    STATE.counters.running = true;
    
    // Federal interest: $1.1T annually = ~$3M daily
    const dailyFederalInterest = 1100000000000 / 365;
    const perSecondInterest = dailyFederalInterest / (24 * 60 * 60);
    
    const counterInterval = setInterval(() => {
        if (!STATE.counters.running) {
            clearInterval(counterInterval);
            return;
        }
        
        STATE.counters.federalInterest += perSecondInterest;
        safeUpdateElement('federalInterest', `$${Math.floor(STATE.counters.federalInterest).toLocaleString()}`);
        
        if (STATE.counters.personalTheft > 0) {
            const personalDaily = STATE.counters.personalTheft * 24;
            safeUpdateElement('personalShare', `$${personalDaily.toFixed(0)}`);
        }
    }, CONFIG.settings.counterUpdateInterval);
}

/**
 * Initialize all charts
 */
function initializeCharts() {
    try {
        createMasterChart();
        createPersonalChart();
        createConstitutionalChart();
        createTimelineChart();
        createCumulativeChart();
        
        // Initial update
        updateAllCharts();
        
        console.log('📈 Charts initialized successfully');
        
    } catch (error) {
        console.error('Chart initialization error:', error);
    }
}

/**
 * Create the master correlation chart
 */
function createMasterChart() {
    const canvas = document.getElementById('masterChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
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
                    tension: 0.1,
                    fill: false
                },
                {
                    label: 'Silver Price ($)',
                    data: [],
                    borderColor: '#c0c0c0',
                    backgroundColor: 'rgba(192, 192, 192, 0.1)',
                    yAxisID: 'y',
                    borderWidth: 2,
                    tension: 0.1,
                    fill: false
                },
                {
                    label: 'Federal Debt ($T)',
                    data: [],
                    borderColor: '#e74c3c',
                    backgroundColor: 'rgba(231, 76, 60, 0.1)',
                    yAxisID: 'y1',
                    borderWidth: 3,
                    tension: 0.1,
                    fill: false
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: {
                duration: CONFIG.settings.chartAnimationDuration
            },
            interaction: {
                mode: 'index',
                intersect: false,
            },
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        usePointStyle: true,
                        padding: 20
                    }
                },
                tooltip: {
                    callbacks: {
                        title: function(context) {
                            return `Year: ${context[0].label}`;
                        },
                        label: function(context) {
                            const value = context.parsed.y;
                            const suffix = context.dataset.yAxisID === 'y1' ? 'T' : '';
                            return `${context.dataset.label}: $${value.toFixed(2)}${suffix}`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    type: 'logarithmic',
                    display: true,
                    position: 'left',
                    title: {
                        display: true,
                        text: 'Gold & Silver Price ($) - Log Scale'
                    },
                    ticks: {
                        callback: function(value) {
                            return '$' + value;
                        }
                    }
                },
                y1: {
                    type: 'logarithmic',
                    display: true,
                    position: 'right',
                    title: {
                        display: true,
                        text: 'Federal Debt ($T) - Log Scale'
                    },
                    grid: {
                        drawOnChartArea: false,
                    },
                    ticks: {
                        callback: function(value) {
                            return '$' + value + 'T';
                        }
                    }
                }
            }
        }
    });
}

/**
 * Create personal impact chart
 */
function createPersonalChart() {
    const canvas = document.getElementById('personalChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    STATE.charts.personal = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [
                {
                    label: 'Your Actual Wage',
                    data: [],
                    borderColor: '#e74c3c',
                    backgroundColor: 'rgba(231, 76, 60, 0.1)',
                    borderWidth: 3,
                    fill: false
                },
                {
                    label: 'Gold-Adjusted Wage',
                    data: [],
                    borderColor: '#ffd700',
                    backgroundColor: 'rgba(255, 215, 0, 0.1)',
                    borderWidth: 3,
                    fill: false
                },
                {
                    label: 'Silver-Adjusted Wage',
                    data: [],
                    borderColor: '#c0c0c0',
                    backgroundColor: 'rgba(192, 192, 192, 0.1)',
                    borderWidth: 2,
                    fill: false
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: {
                duration: CONFIG.settings.chartAnimationDuration
            },
            plugins: {
                legend: {
                    position: 'top'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.dataset.label}: $${context.parsed.y.toFixed(2)}/hour`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    title: {
                        display: true,
                        text: 'Hourly Wage ($)'
                    },
                    ticks: {
                        callback: function(value) {
                            return '$' + value;
                        }
                    }
                }
            }
        }
    });
}

/**
 * Create constitutional money chart
 */
function createConstitutionalChart() {
    const canvas = document.getElementById('constitutionalChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    STATE.charts.constitutional = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [
                {
                    label: 'Gold/Silver Ratio',
                    data: [],
                    borderColor: '#f39c12',
                    backgroundColor: 'rgba(243, 156, 18, 0.1)',
                    borderWidth: 3,
                    fill: false
                },
                {
                    label: 'Historical Average (16:1)',
                    data: [],
                    borderColor: '#95a5a6',
                    borderWidth: 2,
                    borderDash: [5, 5],
                    fill: false
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top'
                }
            },
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

/**
 * Create timeline chart
 */
function createTimelineChart() {
    const canvas = document.getElementById('timelineChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    const events = [
        {year: 1910, title: "Jekyll Island Conspiracy"},
        {year: 1913, title: "Federal Reserve Act"},
        {year: 1933, title: "Gold Confiscation"},
        {year: 1944, title: "Bretton Woods"},
        {year: 1971, title: "Nixon Shock"},
        {year: 2008, title: "Financial Crisis"},
        {year: 2020, title: "COVID Wealth Transfer"}
    ];
    
    STATE.charts.timeline = new Chart(ctx, {
        type: 'scatter',
        data: {
            datasets: [{
                label: 'Major Events',
                data: events.map((event, index) => ({
                    x: event.year,
                    y: (index % 2) * 0.5 + 0.5, // Alternate heights
                    title: event.title
                })),
                backgroundColor: '#3498db',
                borderColor: '#2980b9',
                pointRadius: 8,
                pointHoverRadius: 12
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        title: function(context) {
                            return `${context[0].parsed.x}: ${context[0].raw.title}`;
                        },
                        label: function() {
                            return '';
                        }
                    }
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Year'
                    },
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
}

/**
 * Create cumulative theft chart
 */
function createCumulativeChart() {
    const canvas = document.getElementById('cumulativeChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
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
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    title: {
                        display: true,
                        text: 'Cumulative Transfer ($T)'
                    },
                    ticks: {
                        callback: function(value) {
                            return '$' + value + 'T';
                        }
                    }
                }
            }
        }
    });
}

/**
 * Update all charts with current data
 */
function updateAllCharts() {
    const startYear = STATE.ui.currentDateRange.start;
    const endYear = STATE.ui.currentDateRange.end;
    
    updateMasterChart(startYear, endYear);
    updatePersonalChart();
    updateConstitutionalChart(startYear, endYear);
    updateCumulativeChart(startYear, endYear);
    calculateAndDisplayCorrelations(startYear, endYear);
}

/**
 * Update master correlation chart
 */
function updateMasterChart(startYear, endYear) {
    if (!STATE.charts.master) return;
    
    const filteredGold = STATE.historicalData.gold.filter(d => d.year >= startYear && d.year <= endYear);
    const filteredSilver = STATE.historicalData.silver.filter(d => d.year >= startYear && d.year <= endYear);
    const filteredDebt = STATE.historicalData.debt.filter(d => d.year >= startYear && d.year <= endYear);
    
    const years = filteredGold.map(d => d.year);
    
    STATE.charts.master.data.labels = years;
    STATE.charts.master.data.datasets[0].data = filteredGold.map(d => d.value);
    STATE.charts.master.data.datasets[1].data = filteredSilver.map(d => d.value);
    STATE.charts.master.data.datasets[2].data = filteredDebt.map(d => d.value);
    
    STATE.charts.master.update('none'); // Skip animation for performance
}

/**
 * Update personal impact chart
 */
function updatePersonalChart() {
    if (!STATE.charts.personal) return;
    
    const showUserWage = document.getElementById('showUserWage')?.checked ?? true;
    const startYear = STATE.ui.currentDateRange.start;
    const endYear = STATE.ui.currentDateRange.end;
    
    const years = [];
    const actualWages = [];
    const goldAdjustedWages = [];
    const silverAdjustedWages = [];
    
    // Sample every 5 years for performance
    for (let year = startYear; year <= endYear; year += 5) {
        years.push(year);
        
        // Get wage data
        let wage = 7.25; // Default current minimum wage
        if (showUserWage && STATE.userData.theftCalculated) {
            wage = STATE.userData.hourlyWage;
        } else {
            const historicalWage = STATE.historicalData.wages.find(w => w.year <= year);
            if (historicalWage) wage = historicalWage.value;
        }
        
        actualWages.push(wage);
        
        // Calculate adjusted wages
        const goldPrice = STATE.historicalData.gold.find(g => g.year === year)?.value || 35;
        const silverPrice = STATE.historicalData.silver.find(s => s.year === year)?.value || 1.39;
        
        goldAdjustedWages.push((1.60 / 35) * goldPrice);
        silverAdjustedWages.push((1.60 / 1.39) * silverPrice);
    }
    
    STATE.charts.personal.data.labels = years;
    STATE.charts.personal.data.datasets[0].data = actualWages;
    STATE.charts.personal.data.datasets[1].data = goldAdjustedWages;
    STATE.charts.personal.data.datasets[2].data = silverAdjustedWages;
    
    STATE.charts.personal.update('none');
}

/**
 * Update constitutional money chart
 */
function updateConstitutionalChart(startYear, endYear) {
    if (!STATE.charts.constitutional) return;
    
    const years = [];
    const ratios = [];
    const historicalAverage = [];
    
    // Sample every 2 years for performance
    for (let year = startYear; year <= endYear; year += 2) {
        const gold = STATE.historicalData.gold.find(g => g.year === year)?.value || 35;
        const silver = STATE.historicalData.silver.find(s => s.year === year)?.value || 1.39;
        
        years.push(year);
        ratios.push(gold / silver);
        historicalAverage.push(16); // Historical 16:1 ratio
    }
    
    STATE.charts.constitutional.data.labels = years;
    STATE.charts.constitutional.data.datasets[0].data = ratios;
    STATE.charts.constitutional.data.datasets[1].data = historicalAverage;
    
    STATE.charts.constitutional.update('none');
}

/**
 * Update cumulative theft chart
 */
function updateCumulativeChart(startYear, endYear) {
    if (!STATE.charts.cumulative) return;
    
    const years = [];
    const cumulativeTransfer = [];
    let cumulative = 0;
    
    // Sample every 5 years
    for (let year = startYear; year <= endYear; year += 5) {
        const debt = STATE.historicalData.debt.find(d => d.year === year)?.value || 0;
        
        years.push(year);
        
        // Simplified wealth transfer calculation
        if (year > startYear) {
            const prevDebt = STATE.historicalData.debt.find(d => d.year === year - 5)?.value || 0;
            const avgDebt = (debt + prevDebt) / 2;
            const transfer = avgDebt * 0.05 * 5; // 5% average interest over 5 years
            cumulative += transfer;
        }
        
        cumulativeTransfer.push(cumulative);
    }
    
    STATE.charts.cumulative.data.labels = years;
    STATE.charts.cumulative.data.datasets[0].data = cumulativeTransfer;
    
    STATE.charts.cumulative.update('none');
}

/**
 * Calculate and display correlations
 */
function calculateAndDisplayCorrelations(startYear, endYear) {
    const filteredGold = STATE.historicalData.gold.filter(d => d.year >= startYear && d.year <= endYear);
    const filteredSilver = STATE.historicalData.silver.filter(d => d.year >= startYear && d.year <= endYear);
    const filteredDebt = STATE.historicalData.debt.filter(d => d.year >= startYear && d.year <= endYear);
    
    if (filteredGold.length < 3 || filteredDebt.length < 3) return;
    
    const goldPrices = filteredGold.map(d => d.value);
    const silverPrices = filteredSilver.map(d => d.value);
    const debtValues = filteredDebt.map(d => d.value);
    
    const goldDebtCorr = calculateCorrelation(goldPrices, debtValues);
    const silverDebtCorr = calculateCorrelation(silverPrices, debtValues);
    
    safeUpdateElement('goldDebtCorr', goldDebtCorr.toFixed(3));
    safeUpdateElement('silverDebtCorr', silverDebtCorr.toFixed(3));
}

/**
 * Calculate Pearson correlation coefficient
 */
function calculateCorrelation(x, y) {
    if (x.length !== y.length || x.length < 2) return 0;
    
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

/**
 * Update slider displays and date range
 */
function updateSliderDisplays() {
    const startYear = parseInt(document.getElementById('startYear')?.value) || CONFIG.settings.defaultStartYear;
    const endYear = parseInt(document.getElementById('endYear')?.value) || CONFIG.settings.defaultEndYear;
    
    // Ensure end year is after start year
    const validEndYear = Math.max(endYear, startYear + 1);
    
    if (validEndYear !== endYear) {
        const endYearSlider = document.getElementById('endYear');
        if (endYearSlider) endYearSlider.value = validEndYear;
    }
    
    // Update displays
    safeUpdateElement('startYearValue', startYear.toString());
    safeUpdateElement('endYearValue', validEndYear.toString());
    
    // Update state
    STATE.ui.currentDateRange = {start: startYear, end: validEndYear};
    
    // Update charts
    updateAllCharts();
}

/**
 * Setup era buttons
 */
function setupEraButtons() {
    const eraButtons = document.querySelectorAll('.era-btn');
    eraButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            eraButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const era = this.dataset.era;
            switch(era) {
                case 'gold-standard':
                    setDateRange(1900, 1933);
                    break;
                case 'fed-expansion':
                    setDateRange(1913, 1971);
                    break;
                case 'fiat-era':
                    setDateRange(1971, 2025);
                    break;
                default:
                    setDateRange(1900, 2025);
            }
        });
    });
}

/**
 * Set date range and update sliders
 */
function setDateRange(start, end) {
    const startSlider = document.getElementById('startYear');
    const endSlider = document.getElementById('endYear');
    
    if (startSlider) startSlider.value = start;
    if (endSlider) endSlider.value = end;
    
    updateSliderDisplays();
}

/**
 * Reset to default settings
 */
function resetToDefaults() {
    setDateRange(CONFIG.settings.defaultStartYear, CONFIG.settings.defaultEndYear);
    
    const showUserWageCheck = document.getElementById('showUserWage');
    if (showUserWageCheck) showUserWageCheck.checked = true;
    
    updateAllCharts();
}

/**
 * Initialize tooltip system
 */
function initializeTooltips() {
    // Add click listeners to info icons
    document.querySelectorAll('.info-icon').forEach(icon => {
        icon.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            showTooltip(this.dataset.info);
        });
    });
    
    // Close tooltip when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.info-tooltip') && !e.target.closest('.info-icon')) {
            hideTooltip();
        }
    });
    
    // Close with escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            hideTooltip();
        }
    });
}

/**
 * Show tooltip with given info key
 */
function showTooltip(infoKey) {
    const tooltip = document.getElementById('infoTooltip');
    const tooltipText = tooltip?.querySelector('.tooltip-text');
    const closeBtn = tooltip?.querySelector('.tooltip-close');
    
    if (!tooltip || !tooltipText) return;
    
    const info = TOOLTIP_INFO[infoKey];
    if (!info) {
        console.warn('Tooltip info not found for:', infoKey);
        return;
    }
    
    // Set content
    tooltipText.innerHTML = `<h4>${info.title}</h4>${info.content}`;
    
    // Show tooltip
    tooltip.style.display = 'block';
    STATE.ui.tooltipOpen = true;
    
    // Add close handler
    if (closeBtn) {
        closeBtn.onclick = hideTooltip;
    }
}

/**
 * Hide tooltip
 */
function hideTooltip() {
    const tooltip = document.getElementById('infoTooltip');
    if (tooltip) {
        tooltip.style.display = 'none';
        STATE.ui.tooltipOpen = false;
    }
}

/**
 * Share analysis functionality
 */
function shareAnalysis() {
    if (!STATE.userData.theftCalculated) {
        alert('Please calculate your personal theft first!');
        return;
    }
    
    const lifetimeTheft = (STATE.userData.hourlyWage * 40 * 52 * 40) / 1000000;
    const url = window.location.href;
    const text = `I just discovered I've been systematically robbed of $${lifetimeTheft.toFixed(1)} million over my lifetime through monetary manipulation. See the mathematical proof:`;
    
    if (navigator.share) {
        navigator.share({
            title: 'The $3.5 Quadrillion Theft - Mathematical Proof',
            text: text,
            url: url
        }).catch(err => console.log('Share failed:', err));
    } else {
        // Fallback - copy to clipboard
        const fullText = `${text} ${url}`;
        navigator.clipboard.writeText(fullText).then(() => {
            alert('Analysis copied to clipboard! Share it everywhere.');
        }).catch(() => {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = fullText;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            alert('Analysis copied to clipboard!');
        });
    }
}

// ===== INITIALIZATION =====

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}

// Setup periodic data updates
setInterval(() => {
    loadRealTimeData().catch(err => console.warn('Periodic update failed:', err));
}, CONFIG.apis.metals.updateInterval);

// Export for debugging
window.WealthExtraction = {
    STATE,
    CONFIG,
    loadRealTimeData,
    calculatePersonalImpact,
    updateAllCharts
};

console.log('💎 Wealth Extraction Analysis Tool v2.1 - JavaScript Loaded');
