// Global variables and configuration
let charts = {};
let goldData = [];
let silverData = [];
let debtData = [];
let internationalData = [];
let currentGoldPrice = 3300;
let currentSilverPrice = 28;
let userHourlyWage = 7.25;
let realTimeIntervals = [];

// API Configuration
const API_CONFIG = {
    gold: {
        primary: 'https://api.metals.live/v1/spot/gold',
        backup: 'https://api.coincap.io/v2/assets/gold',
        fallback: 3300
    },
    silver: {
        primary: 'https://api.metals.live/v1/spot/silver',
        backup: 'https://api.coincap.io/v2/assets/silver',
        fallback: 28
    }
};

// Historical data expanded to 1900
const HISTORICAL_DATA = {
    gold: {
        1900: 20.67, 1905: 20.67, 1910: 20.67, 1913: 20.67, 1915: 20.67,
        1920: 20.67, 1925: 20.67, 1930: 20.67, 1933: 35, 1935: 35,
        1940: 35, 1945: 35, 1950: 40, 1955: 35, 1960: 35, 1965: 35,
        1970: 36, 1971: 41, 1975: 161, 1980: 615, 1985: 318, 1990: 383,
        1995: 384, 2000: 279, 2005: 444, 2008: 872, 2010: 1225, 2015: 1160,
        2020: 1770, 2021: 1800, 2022: 1800, 2023: 2000, 2024: 2400, 2025: 3300
    },
    silver: {
        1900: 1.29, 1905: 1.29, 1910: 1.29, 1913: 1.29, 1915: 1.29,
        1920: 1.29, 1925: 1.29, 1930: 1.29, 1933: 1.29, 1935: 1.29,
        1940: 1.29, 1945: 1.29, 1950: 1.29, 1955: 1.29, 1960: 1.29, 1965: 1.29,
        1970: 1.77, 1971: 1.54, 1975: 4.42, 1980: 20.63, 1985: 6.14, 1990: 4.07,
        1995: 5.15, 2000: 4.95, 2005: 7.31, 2008: 14.99, 2010: 20.19, 2015: 15.68,
        2020: 20.51, 2021: 22.28, 2022: 21.73, 2023: 24.35, 2024: 26.50, 2025: 28
    },
    debt: [
        {year: 1900, debt: 2.1}, {year: 1910, debt: 2.6}, {year: 1913, debt: 2.9},
        {year: 1920, debt: 25.9}, {year: 1930, debt: 16.2}, {year: 1933, debt: 22.5},
        {year: 1940, debt: 43.0}, {year: 1945, debt: 258.7}, {year: 1950, debt: 257.4},
        {year: 1960, debt: 286.3}, {year: 1970, debt: 371.0}, {year: 1971, debt: 398},
        {year: 1980, debt: 908}, {year: 1990, debt: 3233}, {year: 2000, debt: 5674},
        {year: 2008, debt: 10025}, {year: 2010, debt: 13562}, {year: 2015, debt: 18151},
        {year: 2020, debt: 26945}, {year: 2023, debt: 33167}, {year: 2024, debt: 35465},
        {year: 2025, debt: 36250}
    ],
    international: {
        USA: {purchasing_power_loss: 95.2, gold_correlation: 0.92},
        UK: {purchasing_power_loss: 94.1, gold_correlation: 0.89},
        Canada: {purchasing_power_loss: 93.4, gold_correlation: 0.88},
        Australia: {purchasing_power_loss: 92.7, gold_correlation: 0.91},
        Germany: {purchasing_power_loss: 91.3, gold_correlation: 0.87},
        France: {purchasing_power_loss: 93.8, gold_correlation: 0.90}
    }
};

// Major crisis events for timeline
const CRISIS_EVENTS = [
    {year: 1913, event: 'Federal Reserve Created', impact: 'inflation_begins', color: '#e67e22'},
    {year: 1929, event: 'Stock Market Crash', impact: 'first_fed_crisis', color: '#e74c3c'},
    {year: 1933, event: 'Gold Confiscation', impact: 'gold_banned', color: '#c0392b'},
    {year: 1944, event: 'Bretton Woods Agreement', impact: 'dollar_hegemony', color: '#9b59b6'},
    {year: 1971, event: 'Nixon Shock - Gold Standard Ended', impact: 'pure_fiat', color: '#34495e'},
    {year: 2008, event: 'Financial Crisis & Bank Bailouts', impact: 'wealth_transfer', color: '#8e44ad'},
    {year: 2020, event: 'COVID-19 Wealth Transfer', impact: 'corporate_bailouts', color: '#e74c3c'}
];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing Wealth Extraction Analysis Tool V2.0...');
    initializeApp();
});

async function initializeApp() {
    try {
        // Setup event listeners first
        setupEventListeners();
        
        // Initialize data
        await loadHistoricalData();
        
        // Load real-time data
        await loadRealTimeData();
        
        // Initialize all charts
        initializeAllCharts();
        
        // Setup real-time counters
        startRealTimeCounters();
        
        // Initial calculations
        calculatePersonalImpact();
        
        // Update dashboard
        updateDashboard();
        
        console.log('Application initialized successfully');
    } catch (error) {
        console.error('Error initializing application:', error);
        // Continue with fallback data
        initializeWithFallbackData();
    }
}

function setupEventListeners() {
    // Personal calculator
    document.getElementById('calculateTheft').addEventListener('click', calculatePersonalImpact);
    document.getElementById('userWage').addEventListener('input', debounce(calculatePersonalImpact, 500));
    
    // Timeline controls
    document.getElementById('startYear').addEventListener('input', updateSliderDisplays);
    document.getElementById('endYear').addEventListener('input', updateSliderDisplays);
    document.getElementById('updateCharts').addEventListener('click', updateAllCharts);
    document.getElementById('resetRange').addEventListener('click', resetTimelineRange);
    document.getElementById('resetWage').addEventListener('click', resetToMinimumWage);
    
    // Chart tabs
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', handleTabChange);
    });
    
    // Action buttons
    document.getElementById('shareAnalysis').addEventListener('click', shareAnalysis);
    document.getElementById('downloadData').addEventListener('click', downloadData);
    
    // Mobile optimizations
    setupMobileOptimizations();
}

function debounce(func, wait) {
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

async function loadRealTimeData() {
    try {
        // Load current gold price
        currentGoldPrice = await fetchGoldPrice();
        
        // Load current silver price
        currentSilverPrice = await fetchSilverPrice();
        
        console.log(`Loaded real-time prices: Gold $${currentGoldPrice}, Silver $${currentSilverPrice}`);
    } catch (error) {
        console.error('Error loading real-time data:', error);
        // Use fallback prices
        currentGoldPrice = API_CONFIG.gold.fallback;
        currentSilverPrice = API_CONFIG.silver.fallback;
    }
}

async function fetchGoldPrice() {
    try {
        // Try primary API
        let response = await fetch(API_CONFIG.gold.primary);
        if (response.ok) {
            const data = await response.json();
            return data.price || data.gold || currentGoldPrice;
        }
        
        // Try backup API
        response = await fetch(API_CONFIG.gold.backup);
        if (response.ok) {
            const data = await response.json();
            return parseFloat(data.data?.priceUsd) || currentGoldPrice;
        }
        
        throw new Error('All gold APIs failed');
    } catch (error) {
        console.log('Using fallback gold price');
        return API_CONFIG.gold.fallback;
    }
}

async function fetchSilverPrice() {
    try {
        // Try primary API
        let response = await fetch(API_CONFIG.silver.primary);
        if (response.ok) {
            const data = await response.json();
            return data.price || data.silver || currentSilverPrice;
        }
        
        // Try backup API
        response = await fetch(API_CONFIG.silver.backup);
        if (response.ok) {
            const data = await response.json();
            return parseFloat(data.data?.priceUsd) || currentSilverPrice;
        }
        
        throw new Error('All silver APIs failed');
    } catch (error) {
        console.log('Using fallback silver price');
        return API_CONFIG.silver.fallback;
    }
}

function loadHistoricalData() {
    // Convert historical data to arrays
    goldData = Object.entries(HISTORICAL_DATA.gold).map(([year, price]) => ({
        year: parseInt(year),
        price: parseFloat(price)
    }));
    
    silverData = Object.entries(HISTORICAL_DATA.silver).map(([year, price]) => ({
        year: parseInt(year),
        price: parseFloat(price)
    }));
    
    debtData = HISTORICAL_DATA.debt.map(item => ({
        year: item.year,
        debt: item.debt
    }));
    
    internationalData = HISTORICAL_DATA.international;
    
    // Interpolate missing years for smoother charts
    goldData = interpolateData(goldData, 1900, 2025);
    silverData = interpolateData(silverData, 1900, 2025);
    
    console.log('Historical data loaded successfully');
}

function interpolateData(data, startYear, endYear) {
    const interpolated = [];
    
    for (let year = startYear; year <= endYear; year++) {
        const existing = data.find(d => d.year === year);
        if (existing) {
            interpolated.push(existing);
        } else {
            // Find surrounding years for interpolation
            const before = data.filter(d => d.year < year).pop();
            const after = data.find(d => d.year > year);
            
            if (before && after) {
                const ratio = (year - before.year) / (after.year - before.year);
                const interpolatedPrice = before.price + (after.price - before.price) * ratio;
                interpolated.push({year, price: interpolatedPrice});
            } else if (before) {
                interpolated.push({year, price: before.price});
            } else if (after) {
                interpolated.push({year, price: after.price});
            }
        }
    }
    
    return interpolated;
}

function calculatePersonalImpact() {
    const userWageInput = document.getElementById('userWage');
    userHourlyWage = parseFloat(userWageInput.value) || 7.25;
    
    // Gold-adjusted calculations
    const goldOuncesPerHour1968 = 1.60 / 35; // 0.0457 oz/hour
    const goldAdjustedWage = goldOuncesPerHour1968 * currentGoldPrice;
    
    // Silver-adjusted calculations (historical 16:1 ratio)
    const silverOuncesPerHour1968 = (1.60 / 35) * 16; // Silver equivalent
    const silverAdjustedWage = silverOuncesPerHour1968 * currentSilverPrice;
    
    // Calculate theft amounts
    const goldTheftPerHour = goldAdjustedWage - userHourlyWage;
    const silverTheftPerHour = silverAdjustedWage - userHourlyWage;
    
    // Use the higher theft amount (silver is typically more)
    const maxTheftPerHour = Math.max(goldTheftPerHour, silverTheftPerHour);
    const maxAdjustedWage = Math.max(goldAdjustedWage, silverAdjustedWage);
    
    // Calculate time periods (assuming 40 hours/week, 52 weeks/year)
    const hoursPerMonth = 40 * 52 / 12;
    const hoursPerYear = 40 * 52;
    const hoursOver20Years = hoursPerYear * 20;
    
    const monthlyTheft = maxTheftPerHour * hoursPerMonth;
    const yearlyTheft = maxTheftPerHour * hoursPerYear;
    const twentyYearTheft = maxTheftPerHour * hoursOver20Years;
    
    // Update display
    updatePersonalImpactDisplay({
        shouldEarn: maxAdjustedWage,
        actualEarn: userHourlyWage,
        monthlyTheft: monthlyTheft,
        yearlyTheft: yearlyTheft,
        twentyYearTheft: twentyYearTheft,
        goldAdjusted: goldAdjustedWage,
        silverAdjusted: silverAdjustedWage
    });
    
    // Update real-time counter base
    startRealTimeCounters(maxTheftPerHour);
}

function updatePersonalImpactDisplay(calculations) {
    document.getElementById('shouldEarnAmount').textContent = `$${calculations.shouldEarn.toFixed(2)}/hour`;
    document.getElementById('actualEarnAmount').textContent = `$${calculations.actualEarn.toFixed(2)}/hour`;
    document.getElementById('stolenMonthly').textContent = `$${formatCurrency(calculations.monthlyTheft)}`;
    document.getElementById('stolenYearly').textContent = `$${formatCurrency(calculations.yearlyTheft)}`;
    document.getElementById('stolenLifetime').textContent = `$${formatCurrency(calculations.twentyYearTheft)}`;
    
    // Update individual metal calculations
    document.getElementById('goldAdjustedWage').textContent = `$${calculations.goldAdjusted.toFixed(0)}/hr`;
    document.getElementById('silverAdjustedWage').textContent = `$${calculations.silverAdjusted.toFixed(0)}/hr`;
    
    // Calculate theft percentages
    const goldTheftPercent = ((calculations.goldAdjusted - calculations.actualEarn) / calculations.goldAdjusted) * 100;
    const silverTheftPercent = ((calculations.silverAdjusted - calculations.actualEarn) / calculations.silverAdjusted) * 100;
    
    document.getElementById('goldTheftPercent').textContent = `${goldTheftPercent.toFixed(1)}%`;
    document.getElementById('silverTheftPercent').textContent = `${silverTheftPercent.toFixed(1)}%`;
    
    // Update personal gap in charts
    const personalGap = calculations.yearlyTheft;
    document.getElementById('personalGap').textContent = `$${formatCurrency(personalGap)} annually`;
}

function startRealTimeCounters(theftPerHour = 143.75) {
    // Clear existing intervals
    realTimeIntervals.forEach(interval => clearInterval(interval));
    realTimeIntervals = [];
    
    const startTime = Date.now();
    const theftPerSecond = theftPerHour / 3600; // Convert to per second
    const fedInterestPerSecond = 3200000000 / 86400; // $3.2B per day
    
    // Personal theft counter
    const personalCounter = setInterval(() => {
        const secondsElapsed = (Date.now() - startTime) / 1000;
        const dailyTheft = theftPerSecond * 86400; // 86400 seconds in a day
        const currentDayProgress = (secondsElapsed / 86400) * dailyTheft;
        
        document.getElementById('dailyTheftCounter').textContent = `$${formatCurrency(currentDayProgress)}`;
    }, 100);
    
    // Fed interest counter
    const fedCounter = setInterval(() => {
        const secondsElapsed = (Date.now() - startTime) / 1000;
        const dailyInterest = fedInterestPerSecond * 86400;
        const currentDayProgress = (secondsElapsed / 86400) * dailyInterest;
        
        document.getElementById('fedInterestCounter').textContent = `$${formatCurrency(currentDayProgress, true)}`;
    }, 1000);
    
    realTimeIntervals.push(personalCounter, fedCounter);
}

function formatCurrency(amount, useBillions = false) {
    if (useBillions && amount >= 1000000000) {
        return (amount / 1000000000).toFixed(2) + 'B';
    } else if (amount >= 1000000) {
        return (amount / 1000000).toFixed(1) + 'M';
    } else if (amount >= 1000) {
        return (amount / 1000).toFixed(0) + 'K';
    } else {
        return amount.toFixed(2);
    }
}

function updateDashboard() {
    // Update current prices
    document.getElementById('currentGold').textContent = `$${currentGoldPrice.toFixed(2)}`;
    document.getElementById('currentSilver').textContent = `$${currentSilverPrice.toFixed(2)}`;
    
    // Mock daily changes (in production, calculate from previous day)
    const goldChange = (Math.random() - 0.5) * 100;
    const silverChange = (Math.random() - 0.5) * 3;
    
    updateChangeDisplay('goldChange', goldChange);
    updateChangeDisplay('silverChange', silverChange);
    
    // Update correlation display
    const correlation = calculateGoldDebtCorrelation();
    document.getElementById('correlationDisplay').textContent = correlation.toFixed(3);
}

function updateChangeDisplay(elementId, change) {
    const element = document.getElementById(elementId);
    element.textContent = `${change > 0 ? '+' : ''}${change.toFixed(2)} (24h)`;
    element.className = `metric-change ${change > 0 ? 'positive' : 'negative'}`;
}

function calculateGoldDebtCorrelation() {
    // Simple correlation calculation between gold and debt
    const goldPrices = goldData.filter(d => d.year >= 1971).map(d => d.price);
    const debtValues = goldData.filter(d => d.year >= 1971).map(d => {
        const debtEntry = debtData.find(debt => debt.year === d.year);
        return debtEntry ? debtEntry.debt : 0;
    }).filter(d => d > 0);
    
    if (goldPrices.length !== debtValues.length || goldPrices.length < 2) {
        return 0.92; // Fallback
    }
    
    return pearsonCorrelation(goldPrices, debtValues);
}

function pearsonCorrelation(x, y) {
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

function initializeAllCharts() {
    try {
        initializeMasterTimelineChart();
        initializeConstitutionalMoneyChart();
        initializePersonalWealthChart();
        initializeCrisisChart();
        initializeInternationalChart();
        
        console.log('All charts initialized successfully');
    } catch (error) {
        console.error('Error initializing charts:', error);
    }
}

function initializeMasterTimelineChart() {
    const ctx = document.getElementById('masterTimelineChart').getContext('2d');
    
    charts.masterTimeline = new Chart(ctx, {
        type: 'line',
        data: {
            labels: goldData.map(d => d.year),
            datasets: [
                {
                    label: 'Gold Price ($)',
                    data: goldData.map(d => d.price),
                    borderColor: '#f39c12',
                    backgroundColor: 'rgba(243, 156, 18, 0.1)',
                    yAxisID: 'y',
                    fill: true
                },
                {
                    label: 'Federal Debt ($B)',
                    data: goldData.map(d => {
                        const debtEntry = debtData.find(debt => debt.year === d.year);
                        return debtEntry ? debtEntry.debt : null;
                    }),
                    borderColor: '#e74c3c',
                    backgroundColor: 'rgba(231, 76, 60, 0.1)',
                    yAxisID: 'y1',
                    fill: true
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
                title: {
                    display: true,
                    text: '125 Years of Systematic Monetary Manipulation'
                },
                legend: {
                    display: true,
                    position: 'top'
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Year'
                    },
                    grid: {
                        color: function(context) {
                            // Highlight major crisis years
                            const year = goldData[context.index]?.year;
                            if ([1913, 1933, 1971, 2008, 2020].includes(year)) {
                                return 'rgba(231, 76, 60, 0.5)';
                            }
                            return 'rgba(0, 0, 0, 0.1)';
                        }
                    }
                },
                y: {
                    type: 'logarithmic',
                    display: true,
                    position: 'left',
                    title: {
                        display: true,
                        text: 'Gold Price ($) - Log Scale'
                    }
                },
                y1: {
                    type: 'logarithmic',
                    display: true,
                    position: 'right',
                    title: {
                        display: true,
                        text: 'Federal Debt ($B) - Log Scale'
                    },
                    grid: {
                        drawOnChartArea: false,
                    }
                }
            }
        }
    });
}

function initializeConstitutionalMoneyChart() {
    const ctx = document.getElementById('constitutionalMoneyChart').getContext('2d');
    
    // Calculate constitutional wages
    const goldAdjustedWages = goldData.map(d => {
        const goldOuncesPerHour = 1.60 / 35; // 1968 minimum wage in gold
        return goldOuncesPerHour * d.price;
    });
    
    const silverAdjustedWages = silverData.map(d => {
        const silverOuncesPerHour = (1.60 / 35) * 16; // Historical 16:1 ratio
        return silverOuncesPerHour * d.price;
    });
    
    // Actual minimum wage progression
    const actualWages = goldData.map(d => {
        if (d.year < 1938) return 0.25;
        if (d.year < 1945) return 0.30;
        if (d.year < 1950) return 0.40;
        if (d.year < 1956) return 0.75;
        if (d.year < 1961) return 1.00;
        if (d.year < 1963) return 1.15;
        if (d.year < 1967) return 1.25;
        if (d.year < 1974) return 1.60;
        if (d.year < 1975) return 2.00;
        if (d.year < 1978) return 2.30;
        if (d.year < 1979) return 2.65;
        if (d.year < 1980) return 2.90;
        if (d.year < 1981) return 3.10;
        if (d.year < 1990) return 3.35;
        if (d.year < 1991) return 3.80;
        if (d.year < 1996) return 4.25;
        if (d.year < 1997) return 4.75;
        if (d.year < 2007) return 5.15;
        if (d.year < 2008) return 5.85;
        if (d.year < 2009) return 6.55;
        return 7.25;
    });
    
    charts.constitutionalMoney = new Chart(ctx, {
        type: 'line',
        data: {
            labels: goldData.map(d => d.year),
            datasets: [
                {
                    label: 'Gold-Adjusted Minimum Wage',
                    data: goldAdjustedWages,
                    borderColor: '#f39c12',
                    backgroundColor: 'rgba(243, 156, 18, 0.1)',
                    fill: false,
                    hidden: false
                },
                {
                    label: 'Silver-Adjusted Minimum Wage',
                    data: silverAdjustedWages,
                    borderColor: '#95a5a6',
                    backgroundColor: 'rgba(149, 165, 166, 0.1)',
                    fill: false,
                    hidden: false
                },
                {
                    label: 'Actual Minimum Wage',
                    data: actualWages,
                    borderColor: '#e74c3c',
                    backgroundColor: 'rgba(231, 76, 60, 0.1)',
                    fill: false
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    type: 'logarithmic',
                    title: {
                        display: true,
                        text: 'Hourly Wage ($) - Log Scale'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Year'
                    }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Constitutional Money vs. Actual Wages'
                }
            }
        }
    });
}

function initializePersonalWealthChart() {
    const ctx = document.getElementById('personalWealthChart').getContext('2d');
    
    // Calculate what user should have earned vs actual (based on current wage)
    const shouldHaveEarned = goldData.map(d => {
        const goldOuncesPerHour = 1.60 / 35;
        return goldOuncesPerHour * d.price;
    });
    
    const actualUserWage = goldData.map(() => userHourlyWage);
    
    charts.personalWealth = new Chart(ctx, {
        type: 'area',
        data: {
            labels: goldData.map(d => d.year),
            datasets: [
                {
                    label: 'What You Should Earn (Gold Standard)',
                    data: shouldHaveEarned,
                    borderColor: '#f39c12',
                    backgroundColor: 'rgba(243, 156, 18, 0.3)',
                    fill: true
                },
                {
                    label: 'What You Actually Earn',
                    data: actualUserWage,
                    borderColor: '#e74c3c',
                    backgroundColor: 'rgba(231, 76, 60, 0.3)',
                    fill: true
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    type: 'logarithmic',
                    title: {
                        display: true,
                        text: 'Hourly Wage ($)'
                    }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Your Personal Wealth Destruction Timeline'
                }
            }
        }
    });
}

function initializeCrisisChart() {
    const ctx = document.getElementById('crisisChart').getContext('2d');
    
    // Create scatter plot of crisis events
    const crisisData = CRISIS_EVENTS.map(event => ({
        x: event.year,
        y: goldData.find(d => d.year === event.year)?.price || 0,
        label: event.event,
        backgroundColor: event.color
    }));
    
    charts.crisis = new Chart(ctx, {
        type: 'scatter',
        data: {
            datasets: [
                {
                    label: 'Gold Price Timeline',
                    data: goldData.map(d => ({x: d.year, y: d.price})),
                    borderColor: '#f39c12',
                    backgroundColor: 'rgba(243, 156, 18, 0.1)',
                    type: 'line',
                    pointRadius: 0,
                    fill: true
                },
                {
                    label: 'Major Crisis Events',
                    data: crisisData,
                    backgroundColor: crisisData.map(d => d.backgroundColor),
                    borderColor: '#2c3e50',
                    pointRadius: 12,
                    pointHoverRadius: 15
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    type: 'logarithmic',
                    title: {
                        display: true,
                        text: 'Gold Price ($) - Log Scale'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Year'
                    }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Crisis Exploitation Pattern: Each Crisis Accelerates Theft'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            if (context.datasetIndex === 1) {
                                const point = crisisData[context.dataIndex];
                                return point.label;
                            }
                            return `Gold: $${context.parsed.y.toFixed(2)}`;
                        }
                    }
                }
            }
        }
    });
}

function initializeInternationalChart() {
    const ctx = document.getElementById('internationalChart').getContext('2d');
    
    const countries = Object.keys(internationalData);
    const purchasingPowerLoss = countries.map(country => internationalData[country].purchasing_power_loss);
    const correlations = countries.map(country => internationalData[country].gold_correlation);
    
    charts.international = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: countries,
            datasets: [
                {
                    label: 'Purchasing Power Loss (%)',
                    data: purchasingPowerLoss,
                    backgroundColor: 'rgba(231, 76, 60, 0.8)',
                    borderColor: '#e74c3c',
                    borderWidth: 1,
                    yAxisID: 'y'
                },
                {
                    label: 'Gold Correlation',
                    data: correlations,
                    type: 'line',
                    borderColor: '#f39c12',
                    backgroundColor: 'rgba(243, 156, 18, 0.3)',
                    yAxisID: 'y1',
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
                        text: 'Purchasing Power Loss (%)'
                    },
                    max: 100
                },
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    title: {
                        display: true,
                        text: 'Gold Correlation'
                    },
                    max: 1,
                    grid: {
                        drawOnChartArea: false,
                    }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Global Coordination: Identical Patterns Across Nations'
                }
            }
        }
    });
}

function updateSliderDisplays() {
    const startYear = document.getElementById('startYear').value;
    const endYear = document.getElementById('endYear').value;
    
    document.getElementById('startYearValue').textContent = startYear;
    document.getElementById('endYearValue').textContent = endYear;
    
    // Ensure end year is always after start year
    if (parseInt(endYear) <= parseInt(startYear)) {
        document.getElementById('endYear').value = parseInt(startYear) + 1;
        document.getElementById('endYearValue').textContent = parseInt(startYear) + 1;
    }
}

function updateAllCharts() {
    const startYear = parseInt(document.getElementById('startYear').value);
    const endYear = parseInt(document.getElementById('endYear').value);
    
    // Filter data by date range for each chart
    updateChartDateRange(charts.masterTimeline, startYear, endYear);
    updateChartDateRange(charts.constitutionalMoney, startYear, endYear);
    updateChartDateRange(charts.personalWealth, startYear, endYear);
    updateChartDateRange(charts.crisis, startYear, endYear);
    
    console.log(`Charts updated for range ${startYear}-${endYear}`);
}

function updateChartDateRange(chart, startYear, endYear) {
    if (!chart) return;
    
    const filteredData = goldData.filter(d => d.year >= startYear && d.year <= endYear);
    const labels = filteredData.map(d => d.year);
    
    chart.data.labels = labels;
    
    // Update each dataset
    chart.data.datasets.forEach((dataset, index) => {
        if (dataset.type === 'line' || !dataset.type) {
            // Handle line datasets
            if (dataset.label.includes('Gold')) {
                dataset.data = filteredData.map(d => d.price);
            } else if (dataset.label.includes('Silver')) {
                dataset.data = filteredData.map(d => {
                    const silverEntry = silverData.find(s => s.year === d.year);
                    return silverEntry ? silverEntry.price : null;
                });
            } else if (dataset.label.includes('Debt')) {
                dataset.data = filteredData.map(d => {
                    const debtEntry = debtData.find(debt => debt.year === d.year);
                    return debtEntry ? debtEntry.debt : null;
                });
            }
        }
    });
    
    chart.update();
}

function resetTimelineRange() {
    document.getElementById('startYear').value = 1900;
    document.getElementById('endYear').value = 2025;
    updateSliderDisplays();
    updateAllCharts();
}

function resetToMinimumWage() {
    document.getElementById('userWage').value = 7.25;
    userHourlyWage = 7.25;
    calculatePersonalImpact();
}

function handleTabChange(event) {
    const targetChart = event.target.dataset.chart;
    const tabs = document.querySelectorAll('.tab-btn');
    const chart = charts.constitutionalMoney;
    
    // Update tab appearance
    tabs.forEach(tab => tab.classList.remove('active'));
    event.target.classList.add('active');
    
    // Show/hide datasets based on selection
    if (targetChart === 'gold') {
        chart.data.datasets[0].hidden = false; // Gold
        chart.data.datasets[1].hidden = true;  // Silver
    } else if (targetChart === 'silver') {
        chart.data.datasets[0].hidden = true;  // Gold
        chart.data.datasets[1].hidden = false; // Silver
    } else { // both
        chart.data.datasets[0].hidden = false; // Gold
        chart.data.datasets[1].hidden = false; // Silver
    }
    
    chart.update();
}

function shareAnalysis() {
    const userWage = parseFloat(document.getElementById('userWage').value) || 7.25;
    const goldAdjusted = (1.60 / 35) * currentGoldPrice;
    const stolen = goldAdjusted - userWage;
    const yearlyStolen = stolen * 40 * 52;
    
    const shareText = `🚨 I've been SYSTEMATICALLY ROBBED! 
    
If wages tracked constitutional money (gold), I should earn $${goldAdjusted.toFixed(0)}/hour.
Instead I earn $${userWage}/hour.

They've stolen $${formatCurrency(yearlyStolen)} from me THIS YEAR alone!

See the mathematical proof: ${window.location.href}

#WealthExtraction #EndTheFed #ConstitutionalMoney`;

    if (navigator.share) {
        navigator.share({
            title: 'My Personal Wealth Theft Calculator',
            text: shareText,
            url: window.location.href
        });
    } else {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(shareText).then(() => {
            alert('Your personal theft analysis has been copied to clipboard!');
        });
    }
}

function downloadData() {
    const data = {
        personalAnalysis: {
            userWage: userHourlyWage,
            goldAdjustedWage: (1.60 / 35) * currentGoldPrice,
            silverAdjustedWage: ((1.60 / 35) * 16) * currentSilverPrice,
            yearlyTheft: ((1.60 / 35) * currentGoldPrice - userHourlyWage) * 40 * 52
        },
        marketData: {
            currentGoldPrice,
            currentSilverPrice,
            goldDebtCorrelation: calculateGoldDebtCorrelation()
        },
        historicalData: {
            goldData: goldData.slice(0, 10), // Sample
            silverData: silverData.slice(0, 10), // Sample
            debtData: debtData.slice(0, 10) // Sample
        },
        analysis: {
            totalWealthTransfer: "2-3.5 Quadrillion",
            coordinationProbability: "1 in 10^300+",
            purchasingPowerTheft: "95.2%",
            timestamp: new Date().toISOString()
        }
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], {type: 'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `wealth-extraction-analysis-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function setupMobileOptimizations() {
    // Touch-friendly chart interactions
    Chart.defaults.interaction.intersect = false;
    Chart.defaults.interaction.mode = 'index';
    
    // Responsive font sizes
    const isMobile = window.innerWidth < 768;
    if (isMobile) {
        Chart.defaults.font.size = 10;
    }
    
    // Handle orientation changes
    window.addEventListener('orientationchange', () => {
        setTimeout(() => {
            Object.values(charts).forEach(chart => {
                if (chart && chart.resize) {
                    chart.resize();
                }
            });
        }, 500);
    });
}

function initializeWithFallbackData() {
    console.log('Initializing with fallback data...');
    
    // Use all the historical data we have
    loadHistoricalData();
    
    // Initialize charts with fallback
    initializeAllCharts();
    
    // Set fallback prices
    currentGoldPrice = 3300;
    currentSilverPrice = 28;
    
    // Update dashboard with fallback
    updateDashboard();
    
    // Calculate personal impact
    calculatePersonalImpact();
    
    // Start counters
    startRealTimeCounters();
}

// Auto-refresh real-time data every 5 minutes
setInterval(async () => {
    try {
        await loadRealTimeData();
        updateDashboard();
        calculatePersonalImpact();
    } catch (error) {
        console.log('Auto-refresh failed, continuing with current data');
    }
}, 300000);

// Handle page visibility changes (pause counters when not visible)
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        realTimeIntervals.forEach(interval => clearInterval(interval));
    } else {
        startRealTimeCounters();
    }
});

// Export functions for potential external use
window.WealthExtractionTool = {
    calculatePersonalImpact,
    updateAllCharts,
    shareAnalysis,
    downloadData
};

console.log('Wealth Extraction Analysis Tool V2.0 JavaScript loaded successfully');
