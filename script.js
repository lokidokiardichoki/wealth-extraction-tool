// Global Application State
const AppState = {
    charts: {},
    data: {
        gold: [],
        silver: [],
        debt: [],
        minimumWage: []
    },
    current: {
        goldPrice: 3300,
        silverPrice: 33,
        federalDebt: 36250
    },
    user: {
        hourlyWage: 15,
        annualWage: 31200
    },
    counters: {
        federalInterest: 0,
        personalTheft: 0
    },
    status: {
        metalAPI: 'connecting',
        fredAPI: 'connecting',
        lastUpdate: null
    }
};

// API Configuration with your keys
const API_CONFIG = {
    fred: {
        key: '455899376e41be09aa5f0910efb2c113',
        baseUrl: 'https://api.stlouisfed.org/fred/series/observations',
        series: {
            debt: 'GFDEBTN',
            gdp: 'GDP',
            cpi: 'CPIAUCSL',
            m2: 'M2SL'
        }
    },
    metals: {
        key: 'fd9f5f9b02a9ab882530fc61b3d726d2',
        baseUrl: 'https://api.metalpriceapi.com/v1/latest',
        symbols: 'XAU,XAG'
    },
    fallback: {
        gold: 3300,
        silver: 33,
        debt: 36250
    }
};

// Historical Data - Complete dataset
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

// Historical Events for Timeline
const HISTORICAL_EVENTS = [
    {year: 1910, title: "Jekyll Island Conspiracy", description: "Secret meeting creates Federal Reserve plan"},
    {year: 1913, title: "Federal Reserve Act", description: "Private banking cartel given control of money supply"},
    {year: 1933, title: "Gold Confiscation", description: "FDR bans private gold ownership, price manipulation begins"},
    {year: 1944, title: "Bretton Woods", description: "Dollar becomes global reserve currency"},
    {year: 1971, title: "Nixon Shock", description: "Gold standard completely abandoned, pure fiat begins"},
    {year: 2008, title: "Financial Crisis", description: "$700B+ bank bailouts, wealth transfer acceleration"},
    {year: 2020, title: "COVID Wealth Transfer", description: "$4T+ to corporations, small business destruction"}
];

// Tooltip Information Database
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
            <p><strong>This is money that should have been in your bank account, invested for your retirement, or used to buy a home.</strong></p>
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
                <li><strong>Your Theft:</strong> Based on your personal wage calculation</li>
            </ul>
            <p><strong>This isn't theoretical - this is happening right now while you watch.</strong></p>
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
            <p><strong>Live Price:</strong> Updated every 5 minutes from real precious metals markets.</p>
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
            <p><strong>The suppression of silver price shows the same systematic manipulation as gold.</strong></p>
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
                <li><strong>Impossible to Repay:</strong> Designed to grow forever</li>
            </ul>
            <p><strong>Live Data:</strong> Updated hourly from Federal Reserve Economic Database (FRED)</p>
            <div class="example">
                Every $1 trillion in debt = $3,000 per American citizen<br>
                $36 trillion debt = $108,000 per citizen in bondage
            </div>
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
                <li><strong>Compound Effect:</strong> Gets worse every year</li>
            </ul>
            <div class="example">
                1971: $1 could buy what $20+ buys today<br>
                Your $100 today has the buying power of $5 in 1971
            </div>
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
                <li><strong>All Three Lines:</strong> Gold, Silver, and Debt moving in lockstep</li>
            </ul>
            <p><strong>Natural market forces don't create 0.9+ correlations over 125 years.</strong></p>
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
            <div class="example">
                Gold-Debt Correlation: 0.92+<br>
                Probability of Natural Occurrence: Less than 1 in 1 million
            </div>
            <p><strong>This level of correlation proves conscious coordination.</strong></p>
        `
    },
    
    'constitutional-money': {
        title: 'Constitutional Money Requirement',
        content: `
            <p>The U.S. Constitution requires gold and silver as legal tender.</p>
            <div class="example">
                <strong>Article 1, Section 10:</strong><br>
                "No State shall... make any Thing but gold and silver Coin a Tender in Payment of Debts"
            </div>
            <ul>
                <li><strong>Founding Intent:</strong> Prevent paper money inflation</li>
                <li><strong>Both Metals:</strong> Gold AND silver, not just one</li>
                <li><strong>Constitutional Violation:</strong> Paper money is unconstitutional</li>
                <li><strong>Historical Wisdom:</strong> Founders knew paper money leads to theft</li>
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
                <li><strong>The Gap:</strong> Shows your stolen wealth growing over time</li>
            </ul>
            <p><strong>The gap between lines shows exactly how much has been stolen from you each year.</strong></p>
        `
    },
    
    'constitutional-suppression': {
        title: 'Constitutional Money Suppression',
        content: `
            <p>This chart shows how the gold-to-silver ratio has been manipulated away from its natural 16:1 level.</p>
            <ul>
                <li><strong>Historical Ratio:</strong> 16 ounces of silver = 1 ounce of gold</li>
                <li><strong>Current Manipulation:</strong> Often 80:1 or higher</li>
                <li><strong>Both Suppressed:</strong> Silver more than gold</li>
                <li><strong>Constitutional Violation:</strong> Both metals should be legal tender</li>
            </ul>
        `
    },
    
    'historical-timeline': {
        title: '125 Years of Systematic Extraction',
        content: `
            <p>This timeline shows key events in the systematic takeover of American money.</p>
            <ul>
                <li><strong>1910:</strong> Jekyll Island - Secret meeting plans Fed</li>
                <li><strong>1913:</strong> Federal Reserve Act - Private control established</li>
                <li><strong>1933:</strong> Gold confiscation - Citizens robbed of real money</li>
                <li><strong>1971:</strong> Nixon Shock - Last link to gold severed</li>
                <li><strong>2008:</strong> Financial Crisis - Wealth transfer acceleration</li>
            </ul>
        `
    },
    
    'cumulative-theft': {
        title: 'Total Wealth Transfer Calculation',
        content: `
            <p>This shows the cumulative wealth extracted from Americans since 1913.</p>
            <ul>
                <li><strong>Interest Payments:</strong> Trillions paid on debt created from nothing</li>
                <li><strong>Purchasing Power Loss:</strong> 96% since 1971</li>
                <li><strong>Conservative Estimate:</strong> $2-3.5 quadrillion total</li>
                <li><strong>Per Person:</strong> $6-10 million stolen per American</li>
            </ul>
        `
    },
    
    'crime-timeline': {
        title: 'The 125-Year Crime Timeline',
        content: `
            <p>This section shows how the systematic theft of American wealth unfolded over 125 years.</p>
            <ul>
                <li><strong>Gold Standard Era (1900-1933):</strong> Relatively stable prices</li>
                <li><strong>Fed Expansion (1913-1971):</strong> Gradual currency debasement</li>
                <li><strong>Pure Fiat Era (1971-2025):</strong> Exponential wealth extraction</li>
            </ul>
        `
    },
    
    'solutions': {
        title: 'Constitutional Solutions Available',
        content: `
            <p>The Constitution provides mechanisms to fix this system:</p>
            <ul>
                <li><strong>Article V Convention:</strong> States can bypass Congress</li>
                <li><strong>Constitutional Money:</strong> Return to gold/silver requirement</li>
                <li><strong>Balanced Budget:</strong> End deficit spending addiction</li>
                <li><strong>End the Fed:</strong> Return money creation to Congress</li>
            </ul>
        `
    },
    
    'article-v': {
        title: 'Article V Constitutional Convention',
        content: `
            <p>Article V allows states to bypass Congress and directly amend the Constitution.</p>
            <div class="example">
                <strong>Requirements:</strong><br>
                • 2/3 of states (34) call for convention<br>
                • 3/4 of states (38) ratify amendments
            </div>
            <ul>
                <li><strong>Founders' Safety Valve:</strong> When federal government becomes tyrannical</li>
                <li><strong>Congress Bypass:</strong> States can act without federal permission</li>
                <li><strong>Historical Precedent:</strong> Original Constitution was Article V convention</li>
                <li><strong>Current Progress:</strong> 25+ states have already applied</li>
            </ul>
        `
    },
    
    'personal-protection': {
        title: 'How to Protect Yourself',
        content: `
            <p>Practical steps to preserve your wealth:</p>
            <ul>
                <li><strong>Physical Gold/Silver:</strong> Constitutional money, can't be printed</li>
                <li><strong>Bitcoin:</strong> Decentralized, limited supply, outside government control</li>
                <li><strong>Real Assets:</strong> Land, productive property, commodities</li>
                <li><strong>Debt Avoidance:</strong> Don't finance your own slavery</li>
                <li><strong>Skills/Community:</strong> Build relationships and practical abilities</li>
            </ul>
        `
    },
    
    'spread-awareness': {
        title: 'Why Spreading Awareness Matters',
        content: `
            <p>Education is the key to stopping this system:</p>
            <ul>
                <li><strong>Critical Mass:</strong> Need enough people to understand the theft</li>
                <li><strong>Political Pressure:</strong> Representatives respond to educated constituents</li>
                <li><strong>Economic Resistance:</strong> People can protect themselves when they understand</li>
                <li><strong>Constitutional Solutions:</strong> Article V requires widespread support</li>
            </ul>
            <p><strong>Share your personal theft number - it wakes people up fast!</strong></p>
        `
    }
};

// Application Initialization and Main Functions
document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing Wealth Extraction Analysis Tool v2.1...');
    initializeApp();
});

async function initializeApp() {
    try {
        showLoadingIndicator();
        
        // Initialize core systems
        setupEventListeners();
        initializeTooltips();
        loadHistoricalData();
        
        // Load live data
        await loadRealTimeData();
        
        // Initialize UI components
        initializeCharts();
        updateDashboard();
        startCounters();
        updateSliderDisplays();
        setupEraButtons();
        
        // Auto-calculate with default wage
        setTimeout(() => {
            calculatePersonalImpact();
        }, 1000);
        
        hideLoadingIndicator();
        console.log('Application initialized successfully');
        
    } catch (error) {
        console.error('Initialization error:', error);
        handleInitializationError();
        hideLoadingIndicator();
    }
}

function showLoadingIndicator() {
    const indicator = document.getElementById('loadingIndicator');
    if (indicator) {
        indicator.classList.remove('hidden');
    }
}

function hideLoadingIndicator() {
    const indicator = document.getElementById('loadingIndicator');
    if (indicator) {
        indicator.classList.add('hidden');
    }
}

function handleInitializationError() {
    // Use fallback data
    AppState.current.goldPrice = API_CONFIG.fallback.gold;
    AppState.current.silverPrice = API_CONFIG.fallback.silver;
    AppState.current.federalDebt = API_CONFIG.fallback.debt;
    
    updateStatus('metalStatus', 'Offline - Using Backup Data', 'error');
    updateStatus('fredStatus', 'Offline - Using Backup Data', 'error');
    
    // Initialize with fallback data
    initializeCharts();
    updateDashboard();
}

// Event Listeners Setup
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
    const showUserWageCheckbox = document.getElementById('showUserWage');
    const resetBtn = document.getElementById('resetToDefaults');
    const updateBtn = document.getElementById('updateCharts');
    
    if (startYearSlider) startYearSlider.addEventListener('input', updateSliderDisplays);
    if (endYearSlider) endYearSlider.addEventListener('input', updateSliderDisplays);
    if (showUserWageCheckbox) showUserWageCheckbox.addEventListener('change', updatePersonalChart);
    if (resetBtn) resetBtn.addEventListener('click', resetToDefaults);
    if (updateBtn) updateBtn.addEventListener('click', updateAllCharts);
    
    // Solution actions
    const shareBtn = document.getElementById('shareAnalysis');
    if (shareBtn) shareBtn.addEventListener('click', shareAnalysis);
    
    // Auto-update intervals
    setInterval(loadRealTimeData, 300000); // 5 minutes
    setInterval(loadFredData, 3600000);    // 1 hour
}

// Data Loading Functions
function loadHistoricalData() {
    AppState.data.gold = interpolateData(HISTORICAL_DATA.gold, 1900, 2025, 'price');
    AppState.data.silver = interpolateData(HISTORICAL_DATA.silver, 1900, 2025, 'price');
    AppState.data.debt = interpolateData(HISTORICAL_DATA.debt, 1900, 2025, 'debt');
    AppState.data.minimumWage = interpolateData(HISTORICAL_DATA.minimumWage, 1900, 2025, 'wage');
    
    console.log('Historical data loaded and interpolated');
}

function interpolateData(data, startYear, endYear, valueKey) {
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
                const beforeValue = before[valueKey];
                const afterValue = after[valueKey];
                const interpolatedValue = beforeValue + (afterValue - beforeValue) * ratio;
                
                const newPoint = { year };
                newPoint[valueKey] = interpolatedValue;
                result.push(newPoint);
            } else if (before) {
                const newPoint = { year };
                newPoint[valueKey] = before[valueKey];
                result.push(newPoint);
            } else if (after) {
                const newPoint = { year };
                newPoint[valueKey] = after[valueKey];
                result.push(newPoint);
            }
        }
    }
    
    return result;
}

async function loadRealTimeData() {
    console.log('Loading real-time data...');
    
    try {
        await Promise.all([
            loadMetalPrices(),
            loadFredData()
        ]);
        
        updateDashboard();
        updateStatus('lastUpdate', new Date().toLocaleTimeString(), 'connected');
    } catch (error) {
        console.error('Error loading real-time data:', error);
    }
}

async function loadMetalPrices() {
    try {
        updateStatus('metalStatus', 'Connecting...
