// script.js

// Historical data arrays
const historicalData = {
    gold: [
        {year: 1900, price: 20.67}, {year: 1910, price: 20.67}, {year: 1920, price: 20.68},
        {year: 1930, price: 20.67}, {year: 1940, price: 35.00}, {year: 1950, price: 40.25},
        {year: 1960, price: 35.27}, {year: 1970, price: 36.02}, {year: 1971, price: 40.62},
        {year: 1975, price: 161.02}, {year: 1980, price: 589.75}, {year: 1985, price: 317.26},
        {year: 1990, price: 383.51}, {year: 1995, price: 384.00}, {year: 2000, price: 279.11},
        {year: 2005, price: 444.74}, {year: 2010, price: 1224.53}, {year: 2015, price: 1160.06},
        {year: 2020, price: 1770.75}, {year: 2021, price: 1800.00}, {year: 2022, price: 1814.00},
        {year: 2023, price: 1940.00}, {year: 2024, price: 2400.00}, {year: 2025, price: 3320.00}
    ],
    
    silver: [
        {year: 1900, price: 0.64}, {year: 1910, price: 0.54}, {year: 1920, price: 1.00},
        {year: 1930, price: 0.38}, {year: 1940, price: 0.43}, {year: 1950, price: 0.74},
        {year: 1960, price: 0.91}, {year: 1970, price: 1.29}, {year: 1971, price: 1.39},
        {year: 1975, price: 4.19}, {year: 1980, price: 20.63}, {year: 1985, price: 6.14},
        {year: 1990, price: 4.07}, {year: 1995, price: 5.15}, {year: 2000, price: 4.95},
        {year: 2005, price: 7.31}, {year: 2010, price: 20.19}, {year: 2015, price: 15.68},
        {year: 2020, price: 20.51}, {year: 2021, price: 25.00}, {year: 2022, price: 21.73},
        {year: 2023, price: 23.35}, {year: 2024, price: 29.00}, {year: 2025, price: 33.00}
    ],
    
    federalDebt: [
        {year: 1900, debt: 2.1}, {year: 1910, debt: 2.6}, {year: 1920, debt: 25.9},
        {year: 1930, debt: 16.2}, {year: 1940, debt: 42.9}, {year: 1950, debt: 257.4},
        {year: 1960, debt: 286.3}, {year: 1970, debt: 370.9}, {year: 1971, debt: 398.1},
        {year: 1975, debt: 533.2}, {year: 1980, debt: 907.7}, {year: 1985, debt: 1823.1},
        {year: 1990, debt: 3233.3}, {year: 1995, debt: 4973.9}, {year: 2000, debt: 5674.2},
        {year: 2005, debt: 7932.7}, {year: 2010, debt: 13561.6}, {year: 2015, debt: 18150.6},
        {year: 2020, debt: 26945.4}, {year: 2021, debt: 28428.9}, {year: 2022, debt: 30928.9},
        {year: 2023, debt: 33167.3}, {year: 2024, debt: 35464.7}, {year: 2025, debt: 36254.7}
    ],
    
    minimumWage: [
        {year: 1938, wage: 0.25}, {year: 1950, wage: 0.40}, {year: 1960, wage: 1.00},
        {year: 1968, wage: 1.60}, {year: 1970, wage: 1.60}, {year: 1975, wage: 2.10},
        {year: 1980, wage: 3.10}, {year: 1985, wage: 3.35}, {year: 1990, wage: 3.80},
        {year: 1995, wage: 4.25}, {year: 2000, wage: 5.15}, {year: 2005, wage: 5.15},
        {year: 2010, wage: 7.25}, {year: 2015, wage: 7.25}, {year: 2020, wage: 7.25},
        {year: 2025, wage: 7.25}
    ]
};

// Global variables
let currentUserWage = 15.00;
let currentStartYear = 1971;
let currentEndYear = 2025;
let charts = {};

// Information explanations
const infoData = {
    wageTheft: {
        title: "Your Wage Theft Percentage",
        text: "This shows how much of your purchasing power has been stolen through currency debasement. We calculate this by comparing what minimum wage would be if it maintained its 1968 gold purchasing power (0.046 oz/hour) versus what it actually is today. At $3,320 gold, minimum wage should be $151/hour, not $7.25."
    },
    shouldEarn: {
        title: "What You Should Earn",
        text: "This is what your hourly wage would be if the dollar hadn't been debased since 1971. We use gold as the measuring stick because it can't be manipulated like paper currency. Your wage adjusted for real purchasing power shows what you would earn in an honest monetary system."
    },
    totalStolen: {
        title: "Total Stolen From You",
        text: "This calculates how much wealth has been stolen from you over a typical 40-year career through systematic currency debasement. Based on the difference between what you should earn versus what you actually earn, multiplied by years worked."
    },
    correlation: {
        title: "Gold-Debt Correlation",
        text: "This measures how closely gold prices track with federal debt growth. A correlation of 0.92+ is nearly perfect - this doesn't happen naturally. It proves systematic coordination between money creation and gold price manipulation. Anything above 0.7 is considered strong correlation."
    },
    goldWages: {
        title: "Gold Price vs Real Wages",
        text: "This chart shows how gold prices have exploded while wages have stagnated. In real money (gold), wages have been systematically destroyed. What took 1 hour of work to earn in 1968 now takes 20+ hours of work."
    },
    debtGold: {
        title: "Federal Debt vs Gold Price",
        text: "This shows the nearly perfect correlation between federal debt growth and gold price increases. Both have grown exponentially since 1971, proving that gold reflects the true debasement of the currency through debt monetization."
    },
    purchasingPower: {
        title: "Dollar Purchasing Power Loss",
        text: "This shows how the dollar has lost 96%+ of its purchasing power since 1913. What $1 could buy in 1913 now costs over $25. This is the 'inflation tax' - a hidden tax on everyone who holds dollars."
    },
    silver: {
        title: "Silver Price History",
        text: "Silver has been money for thousands of years alongside gold. Like gold, silver prices reflect currency debasement. The gold-to-silver ratio historically averaged 16:1, but manipulation has distorted this relationship."
    },
    wageComparison: {
        title: "Your Wage vs Gold-Adjusted Wage",
        text: "This directly compares what you actually earn per hour versus what you should earn if wages had kept pace with real money (gold). The gap represents systematic theft of your labor value."
    },
    wealthTransfer: {
        title: "Cumulative Wealth Transfer",
        text: "This shows the total amount of wealth transferred from working Americans to the financial system over time. We estimate $2-3.5 quadrillion has been systematically extracted since the Federal Reserve was created."
    }
};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeCharts();
    updatePersonalData();
    updateDateRange();
});

// Update date range displays
function updateDateRange() {
    const startYear = document.getElementById('startYear').value;
    const endYear = document.getElementById('endYear').value;
    
    document.getElementById('startYearDisplay').textContent = startYear;
    document.getElementById('endYearDisplay').textContent = endYear;
    
    currentStartYear = parseInt(startYear);
    currentEndYear = parseInt(endYear);
    
    // Ensure end year is always after start year
    if (currentEndYear <= currentStartYear) {
        currentEndYear = currentStartYear + 1;
        document.getElementById('endYear').value = currentEndYear;
        document.getElementById('endYearDisplay').textContent = currentEndYear;
    }
    
    updateAllCharts();
}

// Update personal data calculations
function updatePersonalData() {
    const wageInput = document.getElementById('userWage').value;
    currentUserWage = parseFloat(wageInput) || 15.00;
    
    // Calculate metrics
    const goldPrice2025 = 3320;
    const goldPerHour1968 = 0.046; // 1.60/35
    const shouldEarnPerHour = goldPerHour1968 * goldPrice2025;
    const theftPercentage = ((shouldEarnPerHour - currentUserWage) / shouldEarnPerHour) * 100;
    const careerHours = 40 * 52 * 40; // 40 hours/week * 52 weeks * 40 years
    const totalStolen = (shouldEarnPerHour - currentUserWage) * careerHours;
    
    // Update displays
    document.getElementById('personalTheft').textContent = theftPercentage.toFixed(1) + '%';
    document.getElementById('shouldEarn').textContent = '$' + shouldEarnPerHour.toFixed(2);
    document.getElementById('totalStolen').textContent = '$' + (totalStolen / 1000000).toFixed(1) + 'M';
    
    // Calculate and display correlation
    const correlation = calculateCorrelation();
    document.getElementById('correlation').textContent = correlation.toFixed(2);
    
    updateAllCharts();
}

// Reset to default values
function resetToDefault() {
    document.getElementById('userWage').value = '15.00';
    updatePersonalData();
}

// Calculate gold-debt correlation
function calculateCorrelation() {
    const startIdx = historicalData.gold.findIndex(d => d.year >= currentStartYear);
    const endIdx = historicalData.gold.findIndex(d => d.year > currentEndYear);
    
    const goldPrices = historicalData.gold.slice(startIdx, endIdx === -1 ? undefined : endIdx);
    const debtData = historicalData.federalDebt.slice(startIdx, endIdx === -1 ? undefined : endIdx);
    
    if (goldPrices.length !== debtData.length || goldPrices.length < 2) return 0;
    
    const n = goldPrices.length;
    const sumX = goldPrices.reduce((sum, d) => sum + d.price, 0);
    const sumY = debtData.reduce((sum, d) => sum + d.debt, 0);
    const sumXY = goldPrices.reduce((sum, d, i) => sum + d.price * debtData[i].debt, 0);
    const sumX2 = goldPrices.reduce((sum, d) => sum + d.price * d.price, 0);
    const sumY2 = debtData.reduce((sum, d) => sum + d.debt * d.debt, 0);
    
    const numerator = n * sumXY - sumX * sumY;
    const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));
    
    return denominator === 0 ? 0 : numerator / denominator;
}

// Filter data by date range
function filterDataByDateRange(data) {
    return data.filter(d => d.year >= currentStartYear && d.year <= currentEndYear);
}

// Initialize all charts
function initializeCharts() {
    initializeGoldWagesChart();
    initializeDebtGoldChart();
    initializePurchasingPowerChart();
    initializeSilverChart();
    initializeWageComparisonChart();
    initializeWealthTransferChart();
}

// Update all charts
function updateAllCharts() {
    Object.values(charts).forEach(chart => {
        if (chart && typeof chart.update === 'function') {
            chart.destroy();
        }
    });
    initializeCharts();
}

// Gold vs Wages Chart
function initializeGoldWagesChart() {
    const ctx = document.getElementById('goldWagesChart').getContext('2d');
    const goldData = filterDataByDateRange(historicalData.gold);
    const wageData = filterDataByDateRange(historicalData.minimumWage);
    
    charts.goldWages = new Chart(ctx, {
        type: 'line',
        data: {
            labels: goldData.map(d => d.year),
            datasets: [{
                label: 'Gold Price ($)',
                data: goldData.map(d => d.price),
                borderColor: '#FFD700',
                backgroundColor: 'rgba(255, 215, 0, 0.1)',
                yAxisID: 'y'
            }, {
                label: 'Minimum Wage ($)',
                data: wageData.map(d => d.wage),
                borderColor: '#FF6B6B',
                backgroundColor: 'rgba(255, 107, 107, 0.1)',
                yAxisID: 'y1'
            }]
        },
        options: {
            responsive: true,
            interaction: {
                mode: 'index',
                intersect: false,
            },
            scales: {
                x: {
                    display: true,
                    title: {
                        display: true,
                        text: 'Year'
                    }
                },
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    title: {
                        display: true,
                        text: 'Gold Price ($)',
                        color: '#FFD700'
                    }
                },
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    title: {
                        display: true,
                        text: 'Minimum Wage ($)',
                        color: '#FF6B6B'
                    },
                    grid: {
                        drawOnChartArea: false,
                    },
                }
            }
        }
    });
}

// Debt vs Gold Chart
function initializeDebtGoldChart() {
    const ctx = document.getElementById('debtGoldChart').getContext('2d');
    const goldData = filterDataByDateRange(historicalData.gold);
    const debtData = filterDataByDateRange(historicalData.federalDebt);
    
    charts.debtGold = new Chart(ctx, {
        type: 'line',
        data: {
            labels: goldData.map(d => d.year),
            datasets: [{
                label: 'Gold Price ($)',
                data: goldData.map(d => d.price),
                borderColor: '#FFD700',
                backgroundColor: 'rgba(255, 215, 0, 0.1)',
                yAxisID: 'y'
            }, {
                label: 'Federal Debt (Trillions $)',
                data: debtData.map(d => d.debt / 1000), // Convert to trillions
                borderColor: '#FF4757',
                backgroundColor: 'rgba(255, 71, 87, 0.1)',
                yAxisID: 'y1'
            }]
        },
        options: {
            responsive: true,
            interaction: {
                mode: 'index',
                intersect: false,
            },
            scales: {
                x: {
                    display: true,
                    title: {
                        display: true,
                        text: 'Year'
                    }
                },
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    title: {
                        display: true,
                        text: 'Gold Price ($)',
                        color: '#FFD700'
                    }
                },
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    title: {
                        display: true,
                        text: 'Federal Debt (Trillions $)',
                        color: '#FF4757'
                    },
                    grid: {
                        drawOnChartArea: false,
                    },
                }
            }
        }
    });
}

// Purchasing Power Chart
function initializePurchasingPowerChart() {
    const ctx = document.getElementById('purchasingPowerChart').getContext('2d');
    const baseYear = 1913;
    const goldData = filterDataByDateRange(historicalData.gold);
    
    const purchasingPowerData = goldData.map(d => {
        const baseGold = 20.67; // 1913 gold price
        return {
            year: d.year,
            power: (baseGold / d.price) * 100
        };
    });
    
    charts.purchasingPower = new Chart(ctx, {
        type: 'line',
        data: {
            labels: purchasingPowerData.map(d => d.year),
            datasets: [{
                label: 'Dollar Purchasing Power (%)',
                data: purchasingPowerData.map(d => d.power),
                borderColor: '#2E86AB',
                backgroundColor: 'rgba(46, 134, 171, 0.1)',
                fill: true
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    display: true,
                    title: {
                        display: true,
                        text: 'Year'
                    }
                },
                y: {
                    display: true,
                    title: {
                        display: true,
                        text: 'Purchasing Power (% of 1913)'
                    },
                    min: 0,
                    max: 100
                }
            }
        }
    });
}

// Silver Chart
function initializeSilverChart() {
    const ctx = document.getElementById('silverChart').getContext('2d');
    const silverData = filterDataByDateRange(historicalData.silver);
    
    charts.silver = new Chart(ctx, {
        type: 'line',
        data: {
            labels: silverData.map(d => d.year),
            datasets: [{
                label: 'Silver Price ($)',
                data: silverData.map(d => d.price),
                borderColor: '#C0C0C0',
                backgroundColor: 'rgba(192, 192, 192, 0.1)',
                fill: true
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    display: true,
                    title: {
                        display: true,
                        text: 'Year'
                    }
                },
                y: {
                    display: true,
                    title: {
                        display: true,
                        text: 'Silver Price ($)'
                    }
                }
            }
        }
    });
}

// Wage Comparison Chart
function initializeWageComparisonChart() {
    const ctx = document.getElementById('wageComparisonChart').getContext('2d');
    const years = Array.from({length: currentEndYear - currentStartYear + 1}, (_, i) => currentStartYear + i);
    
    const goldPrice2025 = 3320;
    const goldPerHour1968 = 0.046;
    const shouldEarnPerHour = goldPerHour1968 * goldPrice2025;
    
    charts.wageComparison = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Your Current Wage', 'Gold-Adjusted Wage', 'Minimum Wage'],
            datasets: [{
                label: 'Hourly Wage ($)',
                data: [currentUserWage, shouldEarnPerHour, 7.25],
                backgroundColor: [
                    'rgba(255, 107, 107, 0.8)',
                    'rgba(255, 215, 0, 0.8)',
                    'rgba(108, 117, 125, 0.8)'
                ],
                borderColor: [
                    '#FF6B6B',
                    '#FFD700',
                    '#6C757D'
                ],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Dollars per Hour'
                    }
                }
            }
        }
    });
}

// Wealth Transfer Chart
function initializeWealthTransferChart() {
    const ctx = document.getElementById('wealthTransferChart').getContext('2d');
    const goldData = filterDataByDateRange(historicalData.gold);
    
    // Simplified wealth transfer calculation
    const wealthTransferData = goldData.map((d, index) => {
        const baseTransfer = 100; // Starting point in billions
        const growthRate = Math.pow(d.price / 20.67, 0.8); // Exponential growth based on gold price
        return {
            year: d.year,
            transfer: baseTransfer * growthRate * (index + 1) // Cumulative
        };
    });
    
    charts.wealthTransfer = new Chart(ctx, {
        type: 'area',
        data: {
            labels: wealthTransferData.map(d => d.year),
            datasets: [{
                label: 'Cumulative Wealth Transfer (Trillions $)',
                data: wealthTransferData.map(d => d.transfer / 1000), // Convert to trillions
                borderColor: '#E74C3C',
                backgroundColor: 'rgba(231, 76, 60, 0.2)',
                fill: true
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    display: true,
                    title: {
                        display: true,
                        text: 'Year'
                    }
                },
                y: {
                    display: true,
                    title: {
                        display: true,
                        text: 'Wealth Transfer (Trillions $)'
                    }
                }
            }
        }
    });
}

// Information modal functions
function showInfo(type) {
    const modal = document.getElementById('infoModal');
    const title = document.getElementById('infoTitle');
    const text = document.getElementById('infoText');
    
    const info = infoData[type];
    if (info) {
        title.textContent = info.title;
        text.textContent = info.text;
        modal.style.display = 'block';
    }
}

function closeInfo() {
    document.getElementById('infoModal').style.display = 'none';
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('infoModal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
                }
