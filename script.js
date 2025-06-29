/**
 * Wealth Extraction Analysis Tool v2.1
 * Optimized, integrated, and error-proof implementation
 */

// === CONFIGURATION & GLOBAL STATE ===
const CONFIG = {
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
            baseUrl: 'https://api.metalpriceapi.com/v1/latest',
            symbols: 'XAU,XAG'
        }
    },
    fallback: {
        gold: 3300,
        silver: 33,
        debt: 36.25
    },
    updateIntervals: {
        metals: 300000, // 5 minutes
        fred: 3600000,  // 1 hour
        counters: 1000  // 1 second
    }
};

// Global state management
const STATE = {
    currentPrices: {
        gold: CONFIG.fallback.gold,
        silver: CONFIG.fallback.silver,
        debt: CONFIG.fallback.debt
    },
    userWage: {
        hourly: 15,
        annual: 31200
    },
    charts: {},
    counters: {
        federalInterest: 0,
        personalTheft: 0
    },
    isInitialized: false
};

// === HISTORICAL DATA ===
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
        {year: 1900, wage: 0.22}, {year: 1968, wage: 1.60}, {year: 1980, wage: 3.10},
        {year: 2000, wage: 5.15}, {year: 2009, wage: 7.25}, {year: 2025, wage: 7.25}
    ]
};

const TIMELINE_EVENTS = [
    {year: 1910, title: "Jekyll Island Conspiracy", description: "Secret meeting creates Federal Reserve plan"},
    {year: 1913, title: "Federal Reserve Act", description: "Private banking cartel given control of money supply"},
    {year: 1933, title: "Gold Confiscation", description: "FDR bans private gold ownership"},
    {year: 1971, title: "Nixon Shock", description: "Gold standard completely abandoned"},
    {year: 2008, title: "Financial Crisis", description: "$700B+ bank bailouts"},
    {year: 2020, title: "COVID Wealth Transfer", description: "$4T+ to corporations"}
];

// === TOOLTIP INFORMATION ===
const TOOLTIP_INFO = {
    'wage-calculator': {
        title: 'How the Wage Calculator Works',
        content: '<p>Shows how much purchasing power you\'ve lost since 1968 when minimum wage was $1.60/hour and gold was $35/ounce.</p><p><strong>Calculation:</strong> 1968 wage ÷ 1968 gold price × current gold price = what you should earn today.</p>'
    },
    'should-earn': {
        title: 'What You Should Be Earning',
        content: '<p>This is what your wage would be if money hadn\'t been debased since 1968.</p><p><strong>Based on:</strong> Real purchasing power using gold as the measuring stick.</p>'
    },
    'theft-calculation': {
        title: 'How Theft is Calculated',
        content: '<p><strong>Formula:</strong> Gold-adjusted wage - actual wage = stolen amount per hour</p><p>This isn\'t inflation - it\'s systematic currency debasement transferring your wealth to asset holders.</p>'
    },
    'lifetime-theft': {
        title: 'Your Lifetime Theft',
        content: '<p>Total purchasing power stolen over a 40-year career.</p><p><strong>Calculation:</strong> Theft per hour × 2,080 hours/year × 40 years</p>'
    },
    'gold-price': {
        title: 'Why Gold Price Matters',
        content: '<p>Gold is constitutional money that can\'t be printed or manipulated.</p><p><strong>Live updates:</strong> Real market prices every 5 minutes</p><p><strong>Since 1971:</strong> Shows true dollar debasement</p>'
    },
    'silver-price': {
        title: 'Silver - Constitutional Money',
        content: '<p>Silver is also constitutional money, often more suppressed than gold.</p><p><strong>Historical ratio:</strong> 16:1 gold/silver, now 80+:1</p>'
    },
    'federal-debt': {
        title: 'Federal Debt Extraction',
        content: '<p>Debt created by Federal Reserve, paid by taxpayers with interest.</p><p><strong>Live data:</strong> Updated from Federal Reserve Economic Database</p>'
    },
    'correlation-chart': {
        title: 'The Mathematical Proof',
        content: '<p>Shows impossible correlation between gold/silver and debt growth.</p><p><strong>0.9+ correlation:</strong> Proves systematic coordination, not natural markets</p>'
    },
    'personal-impact-chart': {
        title: 'Your Wealth Destruction',
        content: '<p>Shows how your purchasing power has been systematically destroyed over time.</p><p><strong>Gap between lines:</strong> Your stolen wealth each year</p>'
    }
};

// === UTILITY FUNCTIONS ===
const Utils = {
    // Safe number parsing
    parseNumber(value, fallback = 0) {
        const parsed = parseFloat(value);
        return isNaN(parsed) ? fallback : parsed;
    },

    // Format currency
    formatCurrency(amount, decimals = 2) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
        }).format(amount);
    },

    // Format large numbers
    formatLargeNumber(num) {
        if (num >= 1e12) return (num / 1e12).toFixed(1) + 'T';
        if (num >= 1e9) return (num / 1e9).toFixed(1) + 'B';
        if (num >= 1e6) return (num / 1e6).toFixed(1) + 'M';
        return num.toLocaleString();
    },

    // Interpolate missing data points
    interpolateData(data, startYear, endYear, valueKey) {
        const result = [];
        for (let year = startYear; year <= endYear; year++) {
            const existing = data.find(d => d.year === year);
            if (existing) {
                result.push(existing);
            } else {
                const before = data.filter(d => d.year < year).pop();
                const after = data.find(d => d.year > year);
                if (before && after) {
                    const ratio = (year - before.year) / (after.year - before.year);
                    const interpolated = before[valueKey] + (after[valueKey] - before[valueKey]) * ratio;
                    result.push({year, [valueKey]: interpolated});
                }
            }
        }
        return result;
    },

    // Calculate correlation coefficient
    calculateCorrelation(x, y) {
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
};

// === API MANAGER ===
const ApiManager = {
    async fetchWithTimeout(url, timeout = 10000) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);
        
        try {
            const response = await fetch(url, { signal: controller.signal });
            clearTimeout(timeoutId);
            return response;
        } catch (error) {
            clearTimeout(timeoutId);
            throw error;
        }
    },

    async loadMetalPrices() {
        try {
            const url = `${CONFIG.apis.metals.baseUrl}?access_key=${CONFIG.apis.metals.key}&base=USD&symbols=${CONFIG.apis.metals.symbols}`;
            const response = await this.fetchWithTimeout(url);
            
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            
            const data = await response.json();
            
            if (data.success && data.rates) {
                STATE.currentPrices.gold = Math.round(1 / data.rates.XAU);
                STATE.currentPrices.silver = Math.round(1 / data.rates.XAG * 100) / 100;
                console.log('✓ Metal prices updated:', STATE.currentPrices.gold, STATE.currentPrices.silver);
                return true;
            }
            throw new Error('Invalid API response');
        } catch (error) {
            console.warn('Metal API failed, using fallback:', error.message);
            STATE.currentPrices.gold = CONFIG.fallback.gold;
            STATE.currentPrices.silver = CONFIG.fallback.silver;
            return false;
        }
    },

    async loadFredData() {
        try {
            const url = `${CONFIG.apis.fred.baseUrl}?series_id=${CONFIG.apis.fred.series.debt}&api_key=${CONFIG.apis.fred.key}&file_type=json&limit=1&sort_order=desc`;
            const response = await this.fetchWithTimeout(url);
            
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            
            const data = await response.json();
            
            if (data.observations && data.observations[0] && data.observations[0].value !== '.') {
                const debtBillions = Utils.parseNumber(data.observations[0].value);
                STATE.currentPrices.debt = Math.round(debtBillions / 100) / 10; // Convert to trillions
                console.log('✓ FRED data updated:', STATE.currentPrices.debt + 'T');
                return true;
            }
            throw new Error('No valid data');
        } catch (error) {
            console.warn('FRED API failed, using fallback:', error.message);
            STATE.currentPrices.debt = CONFIG.fallback.debt;
            return false;
        }
    },

    async updateAllData() {
        const results = await Promise.allSettled([
            this.loadMetalPrices(),
            this.loadFredData()
        ]);
        
        UI.updateDashboard();
        return results;
    }
};

// === UI MANAGER ===
const UI = {
    updateDashboard() {
        // Update current prices
        document.getElementById('currentGold').textContent = Utils.formatCurrency(STATE.currentPrices.gold, 0);
        document.getElementById('currentSilver').textContent = Utils.formatCurrency(STATE.currentPrices.silver, 2);
        document.getElementById('currentDebt').textContent = `$${STATE.currentPrices.debt.toFixed(2)}T`;
        
        // Calculate changes since 1971
        const goldChange = ((STATE.currentPrices.gold - 35) / 35 * 100);
        const silverChange = ((STATE.currentPrices.silver - 1.39) / 1.39 * 100);
        
        document.getElementById('goldChange').textContent = `+${goldChange.toFixed(0)}% since 1971`;
        document.getElementById('silverChange').textContent = `+${silverChange.toFixed(0)}% since 1971`;
        
        // Update purchasing power theft
        const theftPercent = ((STATE.currentPrices.gold - 35) / STATE.currentPrices.gold * 100);
        document.getElementById('totalTheft').textContent = `${theftPercent.toFixed(1)}%`;
    },

    updatePersonalImpact() {
        const hourlyWage = STATE.userWage.hourly;
        
        // 1968 calculations
        const goldOuncesPerHour1968 = 1.60 / 35; // $1.60 min wage / $35 gold
        const silverOuncesPerHour1968 = 1.60 / 1.39; // $1.60 min wage / $1.39 silver
        
        // What wages should be today
        const goldAdjustedWage = goldOuncesPerHour1968 * STATE.currentPrices.gold;
        const silverAdjustedWage = silverOuncesPerHour1968 * STATE.currentPrices.silver;
        
        // Use higher value (usually gold)
        const shouldEarn = Math.max(goldAdjustedWage, silverAdjustedWage);
        const theftPerHour = shouldEarn - hourlyWage;
        const monthlyTheft = theftPerHour * 40 * 4.33; // 40 hrs/week, 4.33 weeks/month
        const lifetimeTheft = theftPerHour * 40 * 52 * 40; // 40 year career
        
        // Update UI
        document.getElementById('shouldEarn').textContent = Utils.formatCurrency(shouldEarn, 0) + '/hour';
        document.getElementById('actualEarn').textContent = Utils.formatCurrency(hourlyWage, 0) + '/hour';
        document.getElementById('stolenAmount').textContent = Utils.formatCurrency(theftPerHour, 0) + '/hour';
        document.getElementById('monthlyTheft').textContent = Utils.formatCurrency(monthlyTheft, 0) + ' per month';
        document.getElementById('lifetimeTheft').textContent = `$${(lifetimeTheft/1000000).toFixed(1)} Million`;
        
        // Show results
        const resultsDiv = document.getElementById('theftResults');
        resultsDiv.style.display = 'grid';
        
        // Update counter rate
        STATE.counters.personalTheft = theftPerHour / 24; // Per hour to counter rate
    },

    showTooltip(infoKey) {
        const tooltip = document.getElementById('infoTooltip');
        const tooltipText = tooltip.querySelector('.tooltip-text');
        const info = TOOLTIP_INFO[infoKey];
        
        if (!info) return;
        
        tooltipText.innerHTML = `<h4>${info.title}</h4>${info.content}`;
        tooltip.style.display = 'block';
        
        // Close handlers
        tooltip.querySelector('.tooltip-close').onclick = () => this.hideTooltip();
        document.addEventListener('click', this.handleTooltipClose);
        document.addEventListener('keydown', this.handleTooltipEscape);
    },

    hideTooltip() {
        document.getElementById('infoTooltip').style.display = 'none';
        document.removeEventListener('click', this.handleTooltipClose);
        document.removeEventListener('keydown', this.handleTooltipEscape);
    },

    handleTooltipClose(e) {
        if (!e.target.closest('.info-tooltip') && !e.target.closest('.info-icon')) {
            UI.hideTooltip();
        }
    },

    handleTooltipEscape(e) {
        if (e.key === 'Escape') UI.hideTooltip();
    }
};

// === CHART MANAGER ===
const ChartManager = {
    createMasterChart() {
        const ctx = document.getElementById('masterChart').getContext('2d');
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
                maintainAspectRatio: false,
                interaction: { mode: 'index', intersect: false },
                plugins: {
                    legend: { position: 'top' }
                },
                scales: {
                    y: {
                        type: 'logarithmic',
                        display: true,
                        position: 'left',
                        title: { display: true, text: 'Gold & Silver ($) - Log Scale' }
                    },
                    y1: {
                        type: 'logarithmic',
                        display: true,
                        position: 'right',
                        title: { display: true, text: 'Federal Debt ($T) - Log Scale' },
                        grid: { drawOnChartArea: false }
                    }
                }
            }
        });
    },

    createPersonalChart() {
        const ctx = document.getElementById('personalChart').getContext('2d');
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
                        label: 'Gold-Adjusted (What You Should Earn)',
                        data: [],
                        borderColor: '#ffd700',
                        borderWidth: 3,
                        fill: false
                    },
                    {
                        label: 'Silver-Adjusted',
                        data: [],
                        borderColor: '#c0c0c0',
                        borderWidth: 2,
                        fill: false
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: 'top' } },
                scales: {
                    y: {
                        title: { display: true, text: 'Hourly Wage ($)' },
                        beginAtZero: true
                    }
                }
            }
        });
    },

    createConstitutionalChart() {
        const ctx = document.getElementById('constitutionalChart').getContext('2d');
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
                maintainAspectRatio: false,
                scales: {
                    y: { title: { display: true, text: 'Gold/Silver Ratio' } }
                }
            }
        });
    },

    createTimelineChart() {
        const ctx = document.getElementById('timelineChart').getContext('2d');
        STATE.charts.timeline = new Chart(ctx, {
            type: 'scatter',
            data: {
                datasets: [{
                    label: 'Major Events',
                    data: TIMELINE_EVENTS.map(event => ({
                        x: event.year,
                        y: 0.5,
                        title: event.title,
                        description: event.description
                    })),
                    backgroundColor: '#3498db',
                    pointRadius: 10
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            title: ctx => `${ctx[0].parsed.x}: ${ctx[0].raw.title}`,
                            label: ctx => ctx.raw.description
                        }
                    }
                },
                scales: {
                    x: { title: { display: true, text: 'Year' } },
                    y: { display: false, min: 0, max: 1 }
                }
            }
        });
    },

    createCumulativeChart() {
        const ctx = document.getElementById('cumulativeChart').getContext('2d');
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
                plugins: { legend: { display: false } },
                scales: {
                    y: { 
                        title: { display: true, text: 'Cumulative Transfer ($T)' },
                        beginAtZero: true
                    }
                }
            }
        });
    },

    updateAllCharts() {
        const startYear = parseInt(document.getElementById('startYear').value);
        const endYear = parseInt(document.getElementById('endYear').value);
        
        this.updateMasterChart(startYear, endYear);
        this.updatePersonalChart(startYear, endYear);
        this.updateConstitutionalChart(startYear, endYear);
        this.updateCumulativeChart(startYear, endYear);
        this.calculateCorrelations(startYear, endYear);
    },

    updateMasterChart(startYear, endYear) {
        // Interpolate data for the selected range
        const goldData = Utils.interpolateData(HISTORICAL_DATA.gold, startYear, endYear, 'price');
        const silverData = Utils.interpolateData(HISTORICAL_DATA.silver, startYear, endYear, 'price');
        const debtData = Utils.interpolateData(HISTORICAL_DATA.debt, startYear, endYear, 'debt');
        
        const years = goldData.map(d => d.year);
        
        STATE.charts.master.data.labels = years;
        STATE.charts.master.data.datasets[0].data = goldData.map(d => d.price);
        STATE.charts.master.data.datasets[1].data = silverData.map(d => d.price);
        STATE.charts.master.data.datasets[2].data = debtData.map(d => d.debt);
        STATE.charts.master.update('none');
    },

    updatePersonalChart(startYear, endYear) {
        const showUserWage = document.getElementById('showUserWage').checked;
        const years = [];
        const actualWages = [];
        const goldAdjustedWages = [];
        const silverAdjustedWages = [];
        
        for (let year = startYear; year <= endYear; year += 5) {
            years.push(year);
            
            // Get wage for year
            let wage = showUserWage ? STATE.userWage.hourly : 7.25;
            const historicalWage = HISTORICAL_DATA.minimumWage.find(w => w.year <= year);
            if (!showUserWage && historicalWage) wage = historicalWage.wage;
            
            actualWages.push(wage);
            
            // Get prices for year
            const goldPrice = HISTORICAL_DATA.gold.find(g => g.year <= year)?.price || 35;
            const silverPrice = HISTORICAL_DATA.silver.find(s => s.year <= year)?.price || 1.39;
            
            // Calculate adjusted wages
            goldAdjustedWages.push((1.60 / 35) * goldPrice);
            silverAdjustedWages.push((1.60 / 1.39) * silverPrice);
        }
        
        STATE.charts.personal.data.labels = years;
        STATE.charts.personal.data.datasets[0].data = actualWages;
        STATE.charts.personal.data.datasets[1].data = goldAdjustedWages;
        STATE.charts.personal.data.datasets[2].data = silverAdjustedWages;
        STATE.charts.personal.update('none');
    },

    updateConstitutionalChart(startYear, endYear) {
        const years = [];
        const ratios = [];
        const historicalAverage = [];
        
        for (let year = startYear; year <= endYear; year += 5) {
            const gold = HISTORICAL_DATA.gold.find(g => g.year <= year)?.price || 35;
            const silver = HISTORICAL_DATA.silver.find(s => s.year <= year)?.price || 1.39;
            
            years.push(year);
            ratios.push(gold / silver);
            historicalAverage.push(16);
        }
        
        STATE.charts.constitutional.data.labels = years;
        STATE.charts.constitutional.data.datasets[0].data = ratios;
        STATE.charts.constitutional.data.datasets[1].data = historicalAverage;
        STATE.charts.constitutional.update('none');
    },

    updateCumulativeChart(startYear, endYear) {
        const years = [];
        const cumulativeTransfer = [];
        let cumulative = 0;
        
        for (let year = startYear; year <= endYear; year += 10) {
            const debt = HISTORICAL_DATA.debt.find(d => d.year <= year)?.debt || 0;
            years.push(year);
            
            if (year > startYear) {
                const transfer = debt * 0.05; // Simplified 5% interest
                cumulative += transfer;
            }
            cumulativeTransfer.push(cumulative);
        }
        
        STATE.charts.cumulative.data.labels = years;
        STATE.charts.cumulative.data.datasets[0].data = cumulativeTransfer;
        STATE.charts.cumulative.update('none');
    },

    calculateCorrelations(startYear, endYear) {
        const goldData = Utils.interpolateData(HISTORICAL_DATA.gold, startYear, endYear, 'price');
        const silverData = Utils.interpolateData(HISTORICAL_DATA.silver, startYear, endYear, 'price');
        const debtData = Utils.interpolateData(HISTORICAL_DATA.debt, startYear, endYear, 'debt');
        
        const goldPrices = goldData.map(d => d.price);
        const silverPrices = silverData.map(d => d.price);
        const debtValues = debtData.map(d => d.debt);
        
        const goldDebtCorr = Utils.calculateCorrelation(goldPrices, debtValues);
        const silverDebtCorr = Utils.calculateCorrelation(silverPrices, debtValues);
        
        document.getElementById('goldDebtCorr').textContent = goldDebtCorr.toFixed(3);
        document.getElementById('silverDebtCorr').textContent = silverDebtCorr.toFixed(3);
    }
};

// === COUNTER MANAGER ===
const CounterManager = {
    start() {
        const dailyFederalInterest = 1100000000000 / 365; // $1.1T annually
        const perSecondInterest = dailyFederalInterest / 86400; // 24*60*60
        
        setInterval(() => {
            STATE.counters.federalInterest += perSecondInterest;
            document.getElementById('federalInterest').textContent = 
                Utils.formatLargeNumber(STATE.counters.federalInterest);
            
            if (STATE.counters.personalTheft > 0) {
                const personalDaily = STATE.counters.personalTheft * 24;
                document.getElementById('personalShare').textContent = 
                    Utils.formatCurrency(personalDaily, 0);
            }
        }, CONFIG.updateIntervals.counters);
    }
};

// === EVENT HANDLERS ===
const EventHandlers = {
    setupAll() {
        // Personal calculator
        document.getElementById('calculateImpact').addEventListener('click', () => {
            const wage = Utils.parseNumber(document.getElementById('userWage').value, 15);
            const type = document.getElementById('wageType').value;
            
            STATE.userWage.hourly = type === 'annual' ? wage / (40 * 52) : wage;
            STATE.userWage.annual = STATE.userWage.hourly * 40 * 52;
            
            UI.updatePersonalImpact();
        });

        // Chart controls
        document.getElementById('startYear').addEventListener('input', this.updateSliders);
        document.getElementById('endYear').addEventListener('input', this.updateSliders);
        document.getElementById('showUserWage').addEventListener('change', 
            () => ChartManager.updatePersonalChart());
        document.getElementById('resetToDefaults').addEventListener('click', this.resetToDefaults);

        // Era buttons
        document.querySelectorAll('.era-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.era-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                
                const ranges = {
                    'gold-standard': [1900, 1933],
                    'fed-expansion': [1913, 1971],
                    'fiat-era': [1971, 2025],
                    'all': [1900, 2025]
                };
                
                const [start, end] = ranges[e.target.dataset.era] || [1900, 2025];
                this.setDateRange(start, end);
            });
        });

        // Tooltips
        document.querySelectorAll('.info-icon').forEach(icon => {
            icon.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                UI.showTooltip(icon.dataset.info);
            });
        });

        // Auto-calculate on wage input
        document.getElementById('userWage').addEventListener('input', 
            this.debounce(() => document.getElementById('calculateImpact').click(), 500)
        );

        // Share functionality
        document.getElementById('shareAnalysis').addEventListener('click', this.shareAnalysis);
    },

    updateSliders() {
        const startYear = document.getElementById('startYear').value;
        const endYear = document.getElementById('endYear').value;
        
        document.getElementById('startYearValue').textContent = startYear;
        document.getElementById('endYearValue').textContent = endYear;
        
        // Ensure end > start
        if (parseInt(endYear) <= parseInt(startYear)) {
            document.getElementById('endYear').value = parseInt(startYear) + 1;
            document.getElementById('endYearValue').textContent = parseInt(startYear) + 1;
        }
        
        ChartManager.updateAllCharts();
    },

    setDateRange(start, end) {
        document.getElementById('startYear').value = start;
        document.getElementById('endYear').value = end;
        this.updateSliders();
    },

    resetToDefaults() {
        this.setDateRange(1900, 2025);
        document.getElementById('showUserWage').checked = true;
    },

    shareAnalysis() {
        const url = window.location.href;
        const theftAmount = (STATE.userWage.hourly * 40 * 52 * 40 / 1000000).toFixed(1);
        const text = `I discovered I've been robbed of $${theftAmount} million through systematic monetary manipulation. See the proof:`;
        
        if (navigator.share) {
            navigator.share({ title: 'Systematic Wealth Extraction Proof', text, url });
        } else {
            navigator.clipboard.writeText(`${text} ${url}`)
                .then(() => alert('Analysis copied to clipboard!'))
                .catch(() => console.warn('Could not copy to clipboard'));
        }
    },

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
};

// === MAIN APPLICATION ===
const App = {
    async initialize() {
        try {
            console.log('🚀 Initializing Wealth Extraction Analysis Tool v2.1');
            
            // Setup event handlers first
            EventHandlers.setupAll();
            
            // Load initial data
            await ApiManager.updateAllData();
            
            // Initialize charts
            ChartManager.createMasterChart();
            ChartManager.createPersonalChart();
            ChartManager.createConstitutionalChart();
            ChartManager.createTimelineChart();
            ChartManager.createCumulativeChart();
            
            // Update all charts
            ChartManager.updateAllCharts();
            
            // Start counters
            CounterManager.start();
            
            // Auto-calculate with default wage
            setTimeout(() => {
                document.getElementById('calculateImpact').click();
            }, 1000);
            
            // Setup periodic updates
            setInterval(() => ApiManager.updateAllData(), CONFIG.updateIntervals.metals);
            
            STATE.isInitialized = true;
            console.log('✅ Application initialized successfully');
            
        } catch (error) {
            console.error('❌ Initialization failed:', error);
            // Continue with fallback data
            UI.updateDashboard();
        }
    }
};

// === INITIALIZE WHEN DOM READY ===
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', App.initialize);
} else {
    App.initialize();
}

// === GLOBAL ERROR HANDLING ===
window.addEventListener('error', (e) => {
    console.error('Global error:', e.error);
});

window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled promise rejection:', e.reason);
});

console.log('📊 Wealth Extraction Analysis Tool v2.1 loaded');
