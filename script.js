// Global variables and configuration
let charts = {};
let goldData = [];
let silverData = [];
let debtData = [];
let currentGoldPrice = 3300;
let currentSilverPrice = 33;
let userWageData = { hourly: 15, annual: 31200 };
let personalTheftCounter = 0;
let federalInterestCounter = 0;

// Historical data - Extended to 1900
const HISTORICAL_DATA = {
    debt: [
        {year: 1900, debt: 1.26}, {year: 1910, debt: 1.15}, {year: 1913, debt: 2.9},
        {year: 1920, debt: 25.95}, {year: 1930, debt: 16.19}, {year: 1933, debt: 22.54},
        {year: 1940, debt: 42.97}, {year: 1950, debt: 257.36}, {year: 1960, debt: 286.33},
        {year: 1971, debt: 398}, {year: 1980, debt: 908}, {year: 1990, debt: 3233},
        {year: 2000, debt: 5674}, {year: 2008, debt: 10025}, {year: 2010, debt: 13562},
        {year: 2015, debt: 18151}, {year: 2020, debt: 26945}, {year: 2023, debt: 33167},
        {year: 2024, debt: 35465}, {year: 2025, debt: 36250}
    ],
    
    gold: [
        {year: 1900, price: 20.67}, {year: 1910, price: 20.67}, {year: 1913, price: 20.67},
        {year: 1920, price: 20.67}, {year: 1930, price: 20.67}, {year: 1933, price: 35},
        {year: 1940, price: 35}, {year: 1950, price: 35}, {year: 1960, price: 35},
        {year: 1971, price: 35}, {year: 1975, price: 140}, {year: 1980, price: 850},
        {year: 1985, price: 300}, {year: 1990, price: 400}, {year: 1995, price: 385},
        {year: 2000, price: 280}, {year: 2005, price: 430}, {year: 2008, price: 865},
        {year: 2010, price: 1400}, {year: 2015, price: 1060}, {year: 2020, price: 1900},
        {year: 2023, price: 2000}, {year: 2024, price: 2400}, {year: 2025, price: 3300}
    ],
    
    silver: [
        {year: 1900, price: 0.65}, {year: 1910, price: 0.53}, {year: 1913, price: 0.60},
        {year: 1920, price: 1.00}, {year: 1930, price: 0.38}, {year: 1933, price: 0.35},
        {year: 1940, price: 0.35}, {year: 1950, price: 0.74}, {year: 1960, price: 0.91},
        {year: 1971, price: 1.39}, {year: 1975, price: 4.00}, {year: 1980, price: 20.00},
        {year: 1985, price: 6.00}, {year: 1990, price: 4.00}, {year: 1995, price: 5.15},
        {year: 2000, price: 5.00}, {year: 2005, price: 7.50}, {year: 2008, price: 15.00},
        {year: 2010, price: 20.00}, {year: 2015, price: 16.00}, {year: 2020, price: 25.00},
        {year: 2023, price: 24.00}, {year: 2024, price: 30.00}, {year: 2025, price: 33.00}
    ],
    
    minimumWage: [
        {year: 1900, wage: 0.22}, {year: 1910, wage: 0.25}, {year: 1913, wage: 0.30},
        {year: 1920, wage: 0.35}, {year: 1930, wage: 0.40}, {year: 1933, wage: 0.25},
        {year: 1940, wage: 0.40}, {year: 1950, wage: 0.75}, {year: 1960, wage: 1.00},
        {year: 1968, wage: 1.60}, {year: 1975, wage: 2.10}, {year: 1980, wage: 3.10},
        {year: 1990, wage: 3.80}, {year: 1995, wage: 4.25}, {year: 2000, wage: 5.15},
        {year: 2007, wage: 5.85}, {year: 2009, wage: 7.25}, {year: 2025, wage: 7.25}
    ]
};

// Key historical events for timeline
const HISTORICAL_EVENTS = [
    {year: 1910, title: "Jekyll Island Conspiracy", description: "Secret meeting creates Federal Reserve plan"},
    {year: 1913, title: "Federal Reserve Act", description: "Private banking cartel given control of money supply"},
    {year: 1933, title: "Gold Confiscation", description: "FDR bans private gold ownership, price manipulation begins"},
    {year: 1944, title: "Bretton Woods", description: "Dollar becomes global reserve currency"},
    {year: 1971, title: "Nixon Shock", description: "Gold standard completely abandoned, pure fiat begins"},
    {year: 2008, title: "Financial Crisis", description: "$700B+ bank bailouts, wealth transfer acceleration"},
    {year: 2020, title: "COVID Wealth Transfer", description: "$4T+ to corporations, small business destruction"}
];

// API Configuration
const API_CONFIG = {
    gold: 'https://api.metals.live/v1/spot/gold',
    silver: 'https://api.metals.live/v1/spot/silver',
    fallback: {
        gold: 3300,
        silver: 33
    }
};

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing Wealth Extraction Analysis Tool 2.0...');
    initializeApp();
});

async function initializeApp() {
    try {
        setupEventListeners();
        loadHistoricalData();
        await loadRealTimeData();
        initializeCharts();
        updateDashboard();
        startCounters();
        updateSliderDisplays();
        setupEraButtons();
        console.log('Application initialized successfully');
    } catch (error) {
        console.error('Initialization error:', error);
        // Use fallback data
        currentGoldPrice = API_CONFIG.fallback.gold;
        currentSilverPrice = API_CONFIG.fallback.silver;
        initializeCharts();
        updateDashboard();
    }
}

function setupEventListeners() {
    // Personal calculator
    document.getElementById('calculateImpact').addEventListener('click', calculatePersonalImpact);
    document.getElementById('userWage').addEventListener('input', handleWageInput);
    document.getElementById('wageType').addEventListener('change', handleWageInput);
    
    // Chart controls
    document.getElementById('startYear').addEventListener('input', updateSliderDisplays);
    document.getElementById('endYear').addEventListener('input', updateSliderDisplays);
    document.getElementById('showUserWage').addEventListener('change', updatePersonalChart);
    document.getElementById('resetToDefaults').addEventListener('click', resetToDefaults);
    
    // Solution actions
    document.getElementById('shareAnalysis').addEventListener('click', shareAnalysis);
    
    // Auto-update data every 5 minutes
    setInterval(loadRealTimeData, 300000);
}

function loadHistoricalData() {
    goldData = HISTORICAL_DATA.gold;
    silverData = HISTORICAL_DATA.silver;
    debtData = HISTORICAL_DATA.debt;
    
    // Interpolate missing years
    goldData = interpolateData(goldData, 1900, 2025);
    silverData = interpolateData(silverData, 1900, 2025);
    debtData = interpolateData(debtData, 1900, 2025);
}

function interpolateData(data, startYear, endYear) {
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
                const value = before.price || before.debt || before.wage;
                const nextValue = after.price || after.debt || after.wage;
                const interpolated = value + (nextValue - value) * ratio;
                
                const newPoint = {year};
                if (before.price !== undefined) newPoint.price = interpolated;
                if (before.debt !== undefined) newPoint.debt = interpolated;
                if (before.wage !== undefined) newPoint.wage = interpolated;
                
                result.push(newPoint);
            }
        }
    }
    
    return result;
}

async function loadRealTimeData() {
    try {
        await Promise.all([loadGoldPrice(), loadSilverPrice()]);
        updateDashboard();
    } catch (error) {
        console.log('Using fallback prices:', error);
        currentGoldPrice = API_CONFIG.fallback.gold;
        currentSilverPrice = API_CONFIG.fallback.silver;
        updateDashboard();
    }
}

async function loadGoldPrice() {
    try {
        const response = await fetch(API_CONFIG.gold);
        if (response.ok) {
            const data = await response.json();
            currentGoldPrice = data.price || currentGoldPrice;
        }
    } catch (error) {
        console.log('Gold API error, using fallback');
    }
}

async function loadSilverPrice() {
    try {
        const response = await fetch(API_CONFIG.silver);
        if (response.ok) {
            const data = await response.json();
            currentSilverPrice = data.price || currentSilverPrice;
        }
    } catch (error) {
        console.log('Silver API error, using fallback');
    }
}

function updateDashboard() {
    // Update current prices
    document.getElementById('currentGold').textContent = `$${currentGoldPrice.toFixed(2)}`;
    document.getElementById('currentSilver').textContent = `$${currentSilverPrice.toFixed(2)}`;
    
    // Calculate changes (mock data for demo)
    const goldChangePercent = ((currentGoldPrice - 35) / 35 * 100);
    const silverChangePercent = ((currentSilverPrice - 1.39) / 1.39 * 100);
    
    document.getElementById('goldChange').textContent = `+${goldChangePercent.toFixed(0)}% since 1971`;
    document.getElementById('silverChange').textContent = `+${silverChangePercent.toFixed(0)}% since 1971`;
    
    // Update gold change class
    document.getElementById('goldChange').className = 'metric-change positive';
    document.getElementById('silverChange').className = 'metric-change positive';
}

function calculatePersonalImpact() {
    const wageInput = parseFloat(document.getElementById('userWage').value) || 15;
    const wageType = document.getElementById('wageType').value;
    
    // Convert to hourly
    let hourlyWage = wageInput;
    if (wageType === 'annual') {
        hourlyWage = wageInput / (40 * 52); // 40 hours/week, 52 weeks/year
    }
    
    // Store user wage data
    userWageData.hourly = hourlyWage;
    userWageData.annual = hourlyWage * 40 * 52;
    
    // Calculate 1968 purchasing power equivalents
    const goldOuncesPerHour1968 = 1.60 / 35; // 1968 min wage / 1968 gold price
    const silverOuncesPerHour1968 = 1.60 / 1.39; // 1968 min wage / 1968 silver price
    
    const goldAdjustedWage = goldOuncesPerHour1968 * currentGoldPrice;
    const silverAdjustedWage = silverOuncesPerHour1968 * currentSilverPrice;
    
    // Calculate theft amounts
    const goldTheftPerHour = goldAdjustedWage - hourlyWage;
    const silverTheftPerHour = silverAdjustedWage - hourlyWage;
    
    // Use the higher theft amount (gold is typically higher)
    const theftPerHour = Math.max(goldTheftPerHour, silverTheftPerHour);
    const monthlyTheft = theftPerHour * 40 * 4.33; // 40 hours/week, 4.33 weeks/month
    const annualTheft = theftPerHour * 40 * 52;
    const lifetimeTheft = annualTheft * 40; // 40-year career
    
    // Update UI
    document.getElementById('shouldEarn').textContent = `$${goldAdjustedWage.toFixed(2)}/hour`;
    document.getElementById('actualEarn').textContent = `$${hourlyWage.toFixed(2)}/hour`;
    document.getElementById('stolenAmount').textContent = `$${theftPerHour.toFixed(2)}/hour`;
    document.getElementById('monthlyTheft').textContent = `$${monthlyTheft.toLocaleString()} per month`;
    document.getElementById('lifetimeTheft').textContent = `$${(lifetimeTheft/1000000).toFixed(1)} Million`;
    
    // Show results
    const resultsDiv = document.getElementById('theftResults');
    resultsDiv.style.display = 'grid';
    resultsDiv.classList.add('fade-in');
    
    // Update personal theft counter
    personalTheftCounter = theftPerHour / 24; // Per hour to per minute for counter
    
    // Update personal chart if visible
    updatePersonalChart();
}

function startCounters() {
    // Federal interest counter - $1.1T annually = ~$3M per day
    const dailyFederalInterest = 1100000000000 / 365;
    const perSecondFederalInterest = dailyFederalInterest / (24 * 60 * 60);
    
    setInterval(() => {
        federalInterestCounter += perSecondFederalInterest;
        document.getElementById('federalInterest').textContent = 
            `$${Math.floor(federalInterestCounter).toLocaleString()}`;
        
        if (personalTheftCounter > 0) {
            const personalDaily = personalTheftCounter * 24;
            document.getElementById('personalShare').textContent = 
                `$${personalDaily.toFixed(0)}`;
        }
    }, 1000);
}

function initializeCharts() {
    createMasterChart();
    createPersonalChart();
    createConstitutionalChart();
    createTimelineChart();
    createCumulativeChart();
    updateAllCharts();
}

function createMasterChart() {
    const ctx = document.getElementById('masterChart').getContext('2d');
    charts.master = new Chart(ctx, {
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
                            let label = context.dataset.label || '';
                            if (label) {
                                label += ': ';
                            }
                            if (context.dataset.yAxisID === 'y1') {
                                label += `$${context.parsed.y.toFixed(2)}T`;
                            } else {
                                label += `$${context.parsed.y.toFixed(2)}`;
                            }
                            return label;
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

function createPersonalChart() {
    const ctx = document.getElementById('personalChart').getContext('2d');
    charts.personal = new Chart(ctx, {
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
                    label: 'Gold-Adjusted Wage (What You Should Earn)',
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

function createConstitutionalChart() {
    const ctx = document.getElementById('constitutionalChart').getContext('2d');
    charts.constitutional = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [
                {
                    label: 'Gold/Silver Ratio',
                    data: [],
                    borderColor: '#f39c12',
                    backgroundColor: 'rgba(243, 156, 18, 0.1)',
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

function createTimelineChart() {
    const ctx = document.getElementById('timelineChart').getContext('2d');
    charts.timeline = new Chart(ctx, {
        type: 'scatter',
        data: {
            datasets: [{
                label: 'Major Events',
                data: HISTORICAL_EVENTS.map(event => ({
                    x: event.year,
                    y: Math.random() * 0.5 + 0.5, // Random y position for visibility
                    title: event.title,
                    description: event.description
                })),
                backgroundColor: '#3498db',
                borderColor: '#2980b9',
                pointRadius: 10,
                pointHoverRadius: 15
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false
                },
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
    
    // Create timeline events display
    createTimelineEvents();
}

function createTimelineEvents() {
    const eventsContainer = document.getElementById('timelineEvents');
    eventsContainer.innerHTML = HISTORICAL_EVENTS.map(event => `
        <div class="timeline-event">
            <h4>${event.year}: ${event.title}</h4>
            <p>${event.description}</p>
        </div>
    `).join('');
}

function createCumulativeChart() {
    const ctx = document.getElementById('cumulativeChart').getContext('2d');
    charts.cumulative = new Chart(ctx, {
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

function updateAllCharts() {
    const startYear = parseInt(document.getElementById('startYear').value);
    const endYear = parseInt(document.getElementById('endYear').value);
    
    updateMasterChart(startYear, endYear);
    updatePersonalChart();
    updateConstitutionalChart(startYear, endYear);
    updateCumulativeChart(startYear, endYear);
    calculateCorrelations(startYear, endYear);
}

function updateMasterChart(startYear, endYear) {
    const filteredGold = goldData.filter(d => d.year >= startYear && d.year <= endYear);
    const filteredSilver = silverData.filter(d => d.year >= startYear && d.year <= endYear);
    const filteredDebt = debtData.filter(d => d.year >= startYear && d.year <= endYear);
    
    const years = filteredGold.map(d => d.year);
    
    charts.master.data.labels = years;
    charts.master.data.datasets[0].data = filteredGold.map(d => d.price);
    charts.master.data.datasets[1].data = filteredSilver.map(d => d.price);
    charts.master.data.datasets[2].data = filteredDebt.map(d => d.debt);
    charts.master.update();
}

function updatePersonalChart() {
    if (!charts.personal) return;
    
    const showUserWage = document.getElementById('showUserWage').checked;
    const startYear = parseInt(document.getElementById('startYear').value);
    const endYear = parseInt(document.getElementById('endYear').value);
    
    const years = [];
    const actualWages = [];
    const goldAdjustedWages = [];
    const silverAdjustedWages = [];
    
    for (let year = startYear; year <= endYear; year += 5) {
        years.push(year);
        
        // Get historical minimum wage or user wage
        let wage = 7.25; // Current minimum wage default
        if (showUserWage && userWageData.hourly) {
            wage = userWageData.hourly;
        } else {
            const historicalWage = HISTORICAL_DATA.minimumWage.find(w => w.year <= year);
            if (historicalWage) wage = historicalWage.wage;
        }
        
        actualWages.push(wage);
        
        // Calculate gold and silver adjusted wages
        const goldPrice = goldData.find(g => g.year === year)?.price || 35;
        const silverPrice = silverData.find(s => s.year === year)?.price || 1.39;
        
        const goldOuncesPerHour1968 = 1.60 / 35;
        const silverOuncesPerHour1968 = 1.60 / 1.39;
        
        goldAdjustedWages.push(goldOuncesPerHour1968 * goldPrice);
        silverAdjustedWages.push(silverOuncesPerHour1968 * silverPrice);
    }
    
    charts.personal.data.labels = years;
    charts.personal.data.datasets[0].data = actualWages;
    charts.personal.data.datasets[1].data = goldAdjustedWages;
    charts.personal.data.datasets[2].data = silverAdjustedWages;
    charts.personal.update();
}

function updateConstitutionalChart(startYear, endYear) {
    const years = [];
    const ratios = [];
    const historicalAverage = [];
    
    for (let year = startYear; year <= endYear; year += 2) {
        const gold = goldData.find(g => g.year === year)?.price || 35;
        const silver = silverData.find(s => s.year === year)?.price || 1.39;
        
        years.push(year);
        ratios.push(gold / silver);
        historicalAverage.push(16); // Historical 16:1 ratio
    }
    
    charts.constitutional.data.labels = years;
    charts.constitutional.data.datasets[0].data = ratios;
    charts.constitutional.data.datasets[1].data = historicalAverage;
    charts.constitutional.update();
}

function updateCumulativeChart(startYear, endYear) {
    const years = [];
    const cumulativeTransfer = [];
    let cumulative = 0;
    
    for (let year = startYear; year <= endYear; year += 5) {
        const debt = debtData.find(d => d.year === year)?.debt || 0;
        
        years.push(year);
        
        // Simplified wealth transfer calculation (interest payments)
        if (year > startYear) {
            const prevDebt = debtData.find(d => d.year === year - 5)?.debt || 0;
            const avgDebt = (debt + prevDebt) / 2;
            const transfer = avgDebt * 0.05 * 5; // 5% average interest over 5 years
            cumulative += transfer;
        }
        
        cumulativeTransfer.push(cumulative);
    }
    
    charts.cumulative.data.labels = years;
    charts.cumulative.data.datasets[0].data = cumulativeTransfer;
    charts.cumulative.update();
}

function calculateCorrelations(startYear, endYear) {
    const filteredGold = goldData.filter(d => d.year >= startYear && d.year <= endYear);
    const filteredSilver = silverData.filter(d => d.year >= startYear && d.year <= endYear);
    const filteredDebt = debtData.filter(d => d.year >= startYear && d.year <= endYear);
    
    if (filteredGold.length < 3 || filteredDebt.length < 3) return;
    
    const goldPrices = filteredGold.map(d => d.price);
    const silverPrices = filteredSilver.map(d => d.price);
    const debtValues = filteredDebt.map(d => d.debt);
    
    const goldDebtCorr = calculateCorrelation(goldPrices, debtValues);
    const silverDebtCorr = calculateCorrelation(silverPrices, debtValues);
    
    document.getElementById('goldDebtCorr').textContent = goldDebtCorr.toFixed(3);
    document.getElementById('silverDebtCorr').textContent = silverDebtCorr.toFixed(3);
}

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
    
    updateAllCharts();
}

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

function setDateRange(start, end) {
    document.getElementById('startYear').value = start;
    document.getElementById('endYear').value = end;
    updateSliderDisplays();
}

function resetToDefaults() {
    setDateRange(1900, 2025);
    document.getElementById('showUserWage').checked = true;
    updateAllCharts();
}

function handleWageInput() {
    // Auto-calculate if wage is entered
    const wage = document.getElementById('userWage').value;
    if (wage && parseFloat(wage) > 0) {
        calculatePersonalImpact();
    }
}

function shareAnalysis() {
    const url = window.location.href;
    const text = `I just discovered I've been systematically robbed of $${(userWageData.hourly * 40 * 52 * 40 / 1000000).toFixed(1)} million over my lifetime through monetary manipulation. See the mathematical proof:`;
    
    if (navigator.share) {
        navigator.share({
            title: 'The $3.5 Quadrillion Theft - Mathematical Proof',
            text: text,
            url: url
        });
    } else {
        // Fallback - copy to clipboard
        navigator.clipboard.writeText(`${text} ${url}`).then(() => {
            alert('Analysis copied to clipboard! Share it everywhere.');
        });
    }
}

// Auto-calculate initial impact with default wage
setTimeout(() => {
    calculatePersonalImpact();
}, 1000);

console.log('Wealth Extraction Analysis Tool 2.0 loaded successfully');

// Updated API Configuration with your keys
const API_CONFIG = {
    fred: {
        key: '455899376e41be09aa5f0910efb2c113',
        baseUrl: 'https://api.stlouisfed.org/fred/series/observations',
        series: {
            debt: 'GFDEBTN', // Federal Debt Total Public Debt
            gdp: 'GDP', // Gross Domestic Product
            cpi: 'CPIAUCSL', // Consumer Price Index
            m2: 'M2SL' // Money Supply M2
        }
    },
    metals: {
        key: 'fd9f5f9b02a9ab882530fc61b3d726d2',
        baseUrl: 'https://api.metalpriceapi.com/v1/latest',
        symbols: 'XAU,XAG' // Gold (XAU) and Silver (XAG)
    },
    fallback: {
        gold: 3300,
        silver: 33,
        debt: 36250
    }
};

// Updated real-time data loading
async function loadRealTimeData() {
    try {
        console.log('Loading real-time data...');
        await Promise.all([
            loadMetalPrices(),
            loadFredData()
        ]);
        updateDashboard();
        console.log('Real-time data loaded successfully');
    } catch (error) {
        console.error('Error loading real-time data:', error);
        // Use fallback data
        currentGoldPrice = API_CONFIG.fallback.gold;
        currentSilverPrice = API_CONFIG.fallback.silver;
        updateDashboard();
    }
}

async function loadMetalPrices() {
    try {
        const url = `${API_CONFIG.metals.baseUrl}?access_key=${API_CONFIG.metals.key}&base=USD&symbols=${API_CONFIG.metals.symbols}`;
        
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Metal API HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.success && data.rates) {
            // Metal API returns rates per ounce in USD
            currentGoldPrice = 1 / data.rates.XAU; // Convert from rate to price
            currentSilverPrice = 1 / data.rates.XAG;
            
            console.log(`Updated prices: Gold $${currentGoldPrice.toFixed(2)}, Silver $${currentSilverPrice.toFixed(2)}`);
        } else {
            throw new Error('Invalid metal API response');
        }
    } catch (error) {
        console.log('Metal API error, using fallback:', error);
        currentGoldPrice = API_CONFIG.fallback.gold;
        currentSilverPrice = API_CONFIG.fallback.silver;
    }
}

async function loadFredData() {
    try {
        // Load latest federal debt data
        const debtUrl = `${API_CONFIG.fred.baseUrl}?series_id=${API_CONFIG.fred.series.debt}&api_key=${API_CONFIG.fred.key}&file_type=json&limit=10&sort_order=desc`;
        
        const response = await fetch(debtUrl);
        if (!response.ok) {
            throw new Error(`FRED API HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.observations && data.observations.length > 0) {
            // Get the latest observation
            const latestDebt = data.observations[0];
            if (latestDebt.value !== '.') {
                const debtBillions = parseFloat(latestDebt.value);
                const debtTrillions = debtBillions / 1000;
                
                // Update current debt display
                document.getElementById('currentDebt').textContent = `$${debtTrillions.toFixed(2)}T`;
                
                // Update historical data with latest point
                const latestYear = new Date(latestDebt.date).getFullYear();
                const existingIndex = debtData.findIndex(d => d.year === latestYear);
                
                if (existingIndex >= 0) {
                    debtData[existingIndex].debt = debtTrillions;
                } else {
                    debtData.push({ year: latestYear, debt: debtTrillions });
                    debtData.sort((a, b) => a.year - b.year);
                }
                
                console.log(`Updated debt: $${debtTrillions.toFixed(2)}T for ${latestYear}`);
            }
        }
    } catch (error) {
        console.log('FRED API error, using fallback:', error);
    }
}

// Enhanced dashboard update with API data
function updateDashboard() {
    // Update current prices with real API data
    document.getElementById('currentGold').textContent = `$${currentGoldPrice.toFixed(2)}`;
    document.getElementById('currentSilver').textContent = `$${currentSilverPrice.toFixed(2)}`;
    
    // Calculate actual changes from 1971
    const goldChangePercent = ((currentGoldPrice - 35) / 35 * 100);
    const silverChangePercent = ((currentSilverPrice - 1.39) / 1.39 * 100);
    
    document.getElementById('goldChange').textContent = `+${goldChangePercent.toFixed(0)}% since 1971`;
    document.getElementById('silverChange').textContent = `+${silverChangePercent.toFixed(0)}% since 1971`;
    
    // Update change classes
    document.getElementById('goldChange').className = 'metric-change positive';
    document.getElementById('silverChange').className = 'metric-change positive';
    
    // Update total theft calculation based on real prices
    const realTheftPercentage = ((currentGoldPrice - 35) / currentGoldPrice * 100);
    document.getElementById('totalTheft').textContent = `${realTheftPercentage.toFixed(1)}%`;
}

// Add more frequent API updates for real-time feel
function startEnhancedCounters() {
    // Update metal prices every 5 minutes
    setInterval(loadMetalPrices, 300000);
    
    // Update FRED data every hour
    setInterval(loadFredData, 3600000);
    
    // Enhanced theft counters with real data
    const dailyFederalInterest = 1100000000000 / 365; // $1.1T annually
    const perSecondFederalInterest = dailyFederalInterest / (24 * 60 * 60);
    
    let federalCounter = 0;
    
    setInterval(() => {
        federalCounter += perSecondFederalInterest;
        document.getElementById('federalInterest').textContent = 
            `$${Math.floor(federalCounter).toLocaleString()}`;
        
        if (personalTheftCounter > 0) {
            const personalDaily = personalTheftCounter * 24;
            document.getElementById('personalShare').textContent = 
                `$${personalDaily.toFixed(0)}`;
        }
    }, 1000);
}
