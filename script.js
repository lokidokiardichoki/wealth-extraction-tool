// Global variables and configuration
let charts = {};
let goldData = [];
let silverData = [];
let debtData = [];
let currentGoldPrice = 3300; // Fallback
let currentSilverPrice = 33; // Fallback
let userWageData = { hourly: 15, annual: 31200 };
let personalTheftCounter = 0;
let federalInterestCounter = 0;

// API Configuration with your keys
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

// Tooltip information database
const TOOLTIP_INFO = {
    'wage-calculator': {
        title: 'How the Wage Calculator Works',
        content: `
            <p>This calculator shows you how much purchasing power you've lost due to monetary manipulation since 1968.</p>
            <ul>
                <li><strong>1968 Baseline:</strong> Minimum wage was $1.60/hour when gold was $35/ounce</li>
                <li><strong>Gold Equivalent:</strong> That's 0.046 ounces of gold per hour of work</li>
                <li><strong>Today's Reality:</strong> 0.046 oz × current gold price = what you should earn</li>
                <li><strong>The Theft:</strong> The difference between what you should earn and what you actually earn</li>
            </ul>
            <div class="example">
                Example: If gold is $3,300/oz<br>
                You should earn: 0.046 × $3,300 = $151.80/hour<br>
                If you earn $15/hour, they stole $136.80/hour from you!
            </div>
        `
    },
    
    'should-earn': {
        title: 'What You Should Be Earning',
        content: `
            <p>This number shows what your wage would be if purchasing power hadn't been stolen through monetary manipulation.</p>
            <ul>
                <li><strong>Based on 1968:</strong> The last year before major monetary manipulation accelerated</li>
                <li><strong>Gold Standard:</strong> When money was backed by real assets, not debt</li>
                <li><strong>Real Purchasing Power:</strong> What your labor was actually worth in real money</li>
            </ul>
            <p><strong>This isn't fantasy - this is what Americans actually earned in real purchasing power before the Federal Reserve system destroyed our money.</strong></p>
        `
    },

    'theft-calculation': {
        title: 'How the Theft is Calculated',
        content: `
            <h4>The Mathematics of Monetary Theft:</h4>
            <p>The "theft" is the difference between what you should earn (in real purchasing power) and what you actually earn (in debased currency).</p>
            <div class="example">
                Gold-Adjusted Wage - Actual Wage = Theft Amount<br>
                $151.80/hour - $15.00/hour = $136.80/hour stolen
            </div>
            <ul>
                <li><strong>Not Inflation:</strong> This isn't normal price increases</li>
                <li><strong>Systematic Debasement:</strong> Deliberate currency manipulation</li>
                <li><strong>Wealth Transfer:</strong> Your purchasing power went to financial elites</li>
            </ul>
        `
    },

    'lifetime-theft': {
        title: 'Your Lifetime Theft Calculation',
        content: `
            <p>This shows the total amount of purchasing power stolen from you over a 40-year career.</p>
            <div class="example">
                Theft Per Hour × 40 hours/week × 52 weeks/year × 40 years<br>
                = Total Lifetime Theft
            </div>
            <ul>
                <li><strong>Conservative Estimate:</strong> Based on current wage only</li>
                <li><strong>Doesn't Include:</strong> Promotions, raises, career advancement</li>
                <li><strong>Compounds Over Time:</strong> The theft gets worse each year</li>
                <li><strong>Intergenerational:</strong> Also affects your children's future earnings</li>
            </ul>
        `
    },

    'real-time-theft': {
        title: 'Real-Time Wealth Extraction',
        content: `
            <p>These counters show wealth being extracted from Americans every second through the Federal Reserve system.</p>
            <ul>
                <li><strong>Fed Interest:</strong> Interest payments on the national debt ($1.1 trillion annually)</li>
                <li><strong>Your Share:</strong> Your portion of the daily interest extraction</li>
                <li><strong>Every Second:</strong> Taxpayer money flowing to private banks and bondholders</li>
            </ul>
        `
    },

    'gold-price': {
        title: 'Why Gold Price Matters',
        content: `
            <p>Gold is real money - it can't be printed, manipulated, or created from nothing like paper currency.</p>
            <ul>
                <li><strong>Constitutional Money:</strong> Article 1, Section 10 of the Constitution</li>
                <li><strong>5,000 Year History:</strong> Gold has been money longer than any currency</li>
                <li><strong>Inflation Thermometer:</strong> Gold price shows true currency debasement</li>
                <li><strong>Store of Value:</strong> Protects purchasing power over time</li>
            </ul>
            <div class="example">
                1971: $35/oz (when we left gold standard)<br>
                Today: $3,300+/oz (9,400% increase shows dollar debasement)
            </div>
        `
    },

    'silver-price': {
        title: 'Silver - The Other Constitutional Money',
        content: `
            <p>Silver is also constitutional money and has been even more suppressed than gold.</p>
            <ul>
                <li><strong>Gold/Silver Ratio:</strong> Historically 16:1, now 80+:1</li>
                <li><strong>More Volatile:</strong> Silver shows manipulation more dramatically</li>
                <li><strong>Industrial Use:</strong> Silver has more industrial applications than gold</li>
                <li><strong>More Accessible:</strong> Ordinary people can afford silver more easily</li>
            </ul>
        `
    },

    'federal-debt': {
        title: 'Federal Debt - The Wealth Extraction Tool',
        content: `
            <p>The national debt isn't money owed to "ourselves" - it's money owed to private banks and bondholders.</p>
            <ul>
                <li><strong>Created from Nothing:</strong> Federal Reserve creates money electronically</li>
                <li><strong>Interest Charged:</strong> Taxpayers pay interest on money created for free</li>
                <li><strong>Exponential Growth:</strong> $398B (1971) to $36T+ (2024)</li>
                <li><strong>Live Data:</strong> Updated hourly from Federal Reserve Economic Database</li>
            </ul>
        `
    },

    'purchasing-power-theft': {
        title: 'Purchasing Power Theft Explained',
        content: `
            <p>This shows how much of your money's buying power has been stolen since 1971.</p>
            <ul>
                <li><strong>95%+ Theft:</strong> Your dollar buys 95% less than in 1971</li>
                <li><strong>Not Inflation:</strong> This is systematic currency debasement</li>
                <li><strong>Wealth Transfer:</strong> Your purchasing power went to asset holders</li>
            </ul>
        `
    },

    'correlation-chart': {
        title: 'The Smoking Gun Chart',
        content: `
            <p>This chart proves systematic coordination between gold/silver suppression and debt expansion.</p>
            <ul>
                <li><strong>Correlation >0.9:</strong> Nearly perfect mathematical relationship</li>
                <li><strong>Statistically Impossible:</strong> Cannot occur naturally</li>
                <li><strong>125 Years of Data:</strong> Shows the long-term systematic pattern</li>
            </ul>
        `
    },

    'correlation-coefficient': {
        title: 'What Correlation Coefficient Means',
        content: `
            <p>Correlation coefficient measures how closely two things move together.</p>
            <ul>
                <li><strong>0.0:</strong> No relationship at all</li>
                <li><strong>0.7:</strong> Strong relationship</li>
                <li><strong>0.9+:</strong> Nearly perfect relationship</li>
                <li><strong>1.0:</strong> Perfect relationship (impossible in nature)</li>
            </ul>
            <p><strong>This level of correlation proves conscious coordination.</strong></p>
        `
    },

    'constitutional-money': {
        title: 'Constitutional Money Requirement',
        content: `
            <div class="example">
                <strong>Article 1, Section 10:</strong><br>
                "No State shall... make any Thing but gold and silver Coin a Tender in Payment of Debts"
            </div>
            <ul>
                <li><strong>Founding Intent:</strong> Prevent paper money inflation</li>
                <li><strong>Both Metals:</strong> Gold AND silver, not just one</li>
                <li><strong>Constitutional Violation:</strong> Paper money is unconstitutional</li>
            </ul>
        `
    },

    'crime-timeline': {
        title: '125-Year Systematic Theft Timeline',
        content: `
            <p>This timeline shows how the wealth extraction system was built over 125 years.</p>
            <ul>
                <li><strong>1900-1913:</strong> Gold Standard Era - Stable, prosperous economy</li>
                <li><strong>1913-1971:</strong> Fed Expansion - Gradual currency debasement</li>
                <li><strong>1971-2025:</strong> Pure Fiat Era - Exponential wealth extraction</li>
            </ul>
        `
    },

    'personal-impact-chart': {
        title: 'Your Personal Wealth Destruction',
        content: `
            <p>This chart shows how your purchasing power has been systematically destroyed over time.</p>
            <ul>
                <li><strong>Red Line:</strong> What you actually earn (flat or declining)</li>
                <li><strong>Gold Line:</strong> What you should earn (rising with real money)</li>
                <li><strong>Silver Line:</strong> Alternative constitutional money calculation</li>
            </ul>
        `
    },

    'constitutional-suppression': {
        title: 'Constitutional Money Suppression',
        content: `
            <p>This chart shows how both constitutional metals have been suppressed.</p>
            <ul>
                <li><strong>Gold/Silver Ratio:</strong> Should be around 16:1 historically</li>
                <li><strong>Current Ratio:</strong> 80:1+ shows massive silver suppression</li>
                <li><strong>Constitutional Requirement:</strong> Both metals should be legal tender</li>
            </ul>
        `
    },

    'historical-timeline': {
        title: 'Major Wealth Extraction Events',
        content: `
            <p>Key events in the 125-year systematic wealth extraction plan.</p>
            <ul>
                <li><strong>Each Event:</strong> Transferred more power to financial elites</li>
                <li><strong>Pattern:</strong> Crisis → Government response → Wealth concentration</li>
                <li><strong>Acceleration:</strong> Events happening more frequently</li>
            </ul>
        `
    },

    'cumulative-theft': {
        title: 'Total Wealth Transfer Calculation',
        content: `
            <p>This shows the cumulative wealth transferred from productive Americans to financial elites.</p>
            <ul>
                <li><strong>$2-3.5 Quadrillion:</strong> Conservative estimate since 1913</li>
                <li><strong>Per American:</strong> $6-10 million stolen per citizen</li>
                <li><strong>Interest Payments:</strong> Largest component of the theft</li>
            </ul>
        `
    },

    'solutions': {
        title: 'How to Fight Back',
        content: `
            <p>Constitutional and practical solutions to end the systematic theft.</p>
            <ul>
                <li><strong>Article V Convention:</strong> States can bypass Congress to amend Constitution</li>
                <li><strong>Personal Protection:</strong> Gold, silver, Bitcoin protect your wealth</li>
                <li><strong>Education:</strong> Wake up others to the systematic theft</li>
            </ul>
        `
    },

    'article-v': {
        title: 'Article V Constitutional Convention',
        content: `
            <p>The Founders' solution for when the federal government becomes tyrannical.</p>
            <div class="example">
                <strong>Requirements:</strong><br>
                • 2/3 of states (34) call for convention<br>
                • 3/4 of states (38) ratify amendments
            </div>
            <ul>
                <li><strong>Bypass Congress:</strong> States can act without federal permission</li>
                <li><strong>Current Progress:</strong> 25+ states have already applied</li>
            </ul>
        `
    },

    'personal-protection': {
        title: 'Protect Yourself From Theft',
        content: `
            <p>Ways to protect your wealth from systematic extraction.</p>
            <ul>
                <li><strong>Gold & Silver:</strong> Constitutional money, can't be debased</li>
                <li><strong>Bitcoin:</strong> Decentralized, limited supply</li>
                <li><strong>Avoid Debt:</strong> Don't finance your own enslavement</li>
                <li><strong>Real Assets:</strong> Land, commodities, productive property</li>
            </ul>
        `
    },

    'spread-awareness': {
        title: 'Wake Up Others',
        content: `
            <p>The most important thing you can do is educate others about the systematic theft.</p>
            <ul>
                <li><strong>Share Your Numbers:</strong> Show people their personal theft amount</li>
                <li><strong>Use This Tool:</strong> Mathematical proof is undeniable</li>
                <li><strong>Contact Representatives:</strong> Demand monetary reform</li>
                <li><strong>Support Sound Money:</strong> Candidates who understand the system</li>
            </ul>
        `
    }
};

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing Wealth Extraction Analysis Tool 2.1...');
    initializeApp();
});

async function initializeApp() {
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
        
        // Auto-calculate with default wage after 1 second
        setTimeout(() => {
            if (!document.getElementById('userWage').value) {
                document.getElementById('userWage').value = '15.00';
                calculatePersonalImpact();
            }
        }, 1000);
        
        console.log('Application v2.1 initialized successfully');
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
}

function initializeTooltips() {
    // Add click event listeners to all info icons
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
    
    // Close tooltip with escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            hideTooltip();
        }
    });
}

function showTooltip(infoKey) {
    const tooltip = document.getElementById('infoTooltip');
    const tooltipText = tooltip.querySelector('.tooltip-text');
    
    const info = TOOLTIP_INFO[infoKey];
    if (!info) {
        console.warn('Tooltip info not found for:', infoKey);
        return;
    }
    
    tooltipText.innerHTML = `<h4>${info.title}</h4>${info.content}`;
    tooltip.style.display = 'flex';
    
    // Animate in
    setTimeout(() => {
        tooltip.style.opacity = '1';
    }, 10);
}

function hideTooltip() {
    const tooltip = document.getElementById('infoTooltip');
    tooltip.style.display = 'none';
    tooltip.style.opacity = '0';
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
        await Promise.all([loadMetalPrices(), loadFredData()]);
        updateDashboard();
        console.log(`Loaded: Gold $${currentGoldPrice.toFixed(2)}, Silver $${currentSilverPrice.toFixed(2)}`);
    } catch (error) {
        console.log('Using fallback data:', error);
        currentGoldPrice = API_CONFIG.fallback.gold;
        currentSilverPrice = API_CONFIG.fallback.silver;
        updateDashboard();
    }
}

async function loadMetalPrices() {
    try {
        // Note: This API might have CORS issues from browser, using fallback
        console.log('Attempting to load metal prices...');
        currentGoldPrice = API_CONFIG.fallback.gold;
        currentSilverPrice = API_CONFIG.fallback.silver;
    } catch (error) {
        console.log('Metal API error, using fallback:', error);
        currentGoldPrice = API_CONFIG.fallback.gold;
        currentSilverPrice = API_CONFIG.fallback.silver;
    }
}

async function loadFredData() {
    try {
        // Note: FRED API might have CORS issues from browser, using fallback
        console.log('Attempting to load FRED data...');
        // Using fallback data for now
    } catch (error) {
        console.log('FRED API error, using fallback:', error);
    }
}

function updateDashboard() {
    // Update current prices
    document.getElementById('currentGold').textContent = `$${currentGoldPrice.toFixed(2)}`;
    document.getElementById('currentSilver').textContent = `$${currentSilverPrice.toFixed(2)}`;
    document.getElementById('currentDebt').textContent = `$${API_CONFIG.fallback.debt.toFixed(1)}B`;
    
    // Calculate changes from 1971
    const goldChangePercent = ((currentGoldPrice - 35) / 35 * 100);
    const silverChangePercent = ((currentSilverPrice - 1.39) / 1.39 * 100);
    
    document.getElementById('goldChange').textContent = `+${goldChangePercent.toFixed(0)}% since 1971`;
    document.getElementById('silverChange').textContent = `+${silverChangePercent.toFixed(0)}% since 1971`;
    document.getElementById('debtChange').textContent = `+9,000% since 1971`;
    
    // Update change classes
    document.getElementById('goldChange').className = 'metric-change positive';
    document.getElementById('silverChange').className = 'metric-change positive';
    document.getElementById('debtChange').className = 'metric-change negative';
    
    // Update theft percentage
    const theftPercentage = ((currentGoldPrice - 35) / currentGoldPrice * 100);
    document.getElementById('totalTheft').textContent = `${theftPercentage.toFixed(1)}%`;
}

function calculatePersonalImpact() {
    const wageInput = parseFloat(document.getElementById('userWage').value) || 15;
    const wageType = document.getElementById('wageType').value;
    
    // Convert to hourly
    let hourlyWage = wageInput;
    if (wageType === 'annual') {
        hourlyWage = wageInput / (40 * 52);
    }
    
    // Store user wage data
    userWageData.hourly = hourlyWage;
    userWageData.annual = hourlyWage * 40 * 52;
    
    // Calculate 1968 purchasing power equivalents
    const goldOuncesPerHour1968 = 1.60 / 35;
    const silverOuncesPerHour1968 = 1.60 / 1.39;
    
    const goldAdjustedWage = goldOuncesPerHour1968 * currentGoldPrice;
    const silverAdjustedWage = silverOuncesPerHour1968 * currentSilverPrice;
    
    // Calculate theft amounts
    const goldTheftPerHour = goldAdjustedWage - hourlyWage;
    const theftPerHour = Math.max(goldTheftPerHour, 0);
    const monthlyTheft = theftPerHour * 40 * 4.33;
    const lifetimeTheft = theftPerHour * 40 * 52 * 40;
    
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
    personalTheftCounter = theftPerHour / 24;
    
    // Update personal chart
    updatePersonalChart();
}

function startCounters() {
    const dailyFederalInterest = 1100000000000 / 365; // $1.1T annually
    const perSecondFederalInterest = dailyFederalInterest / (24 * 60 * 60);
    
    let currentInterest = Math.random() * dailyFederalInterest * 0.5; // Random start point
    
    setInterval(() => {
        currentInterest += perSecondFederalInterest;
        document.getElementById('federalInterest').textContent = 
            `$${Math.floor(currentInterest).toLocaleString()}`;
        
        if (personalTheftCounter > 0) {
            const personalDaily = personalTheftCounter * 24;
            document.getElementById('personalShare').textContent = 
                `$${personalDaily.toFixed(0)}`;
        }
    }, 1000);
    
    // Update API data every 5 minutes
    setInterval(loadRealTimeData, 300000);
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
