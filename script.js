// Enhanced API integration and tooltip system

// Global variables and configuration
let charts = {};
let goldData = [];
let silverData = [];
let debtData = [];
let currentGoldPrice = 3300;
let currentSilverPrice = 33;
let currentDebt = 36250000000000; // $36.25T
let userWageData = { hourly: 15, annual: 31200 };
let personalTheftCounter = 0;
let federalInterestCounter = 0;
let debtCounter = 36250000000000;
let lastUpdate = new Date();

// Enhanced API Configuration with multiple sources
const API_CONFIG = {
    metals: {
        primary: 'https://api.metals.live/v1/spot',
        backup: 'https://api.metalpriceapi.com/v1/latest',
        fallback: { gold: 3300, silver: 33 }
    },
    debt: {
        primary: 'https://api.fiscaldata.treasury.gov/services/api/fiscal_service/accounting/od/debt_to_penny',
        backup: 'https://api.stlouisfed.org/fred/series/observations',
        fallback: 36250000000000
    },
    fred: {
        apiKey: '455899376e41be09aa5f0910efb2c113', // Users can get free key from FRED
        baseUrl: 'https://api.stlouisfed.org/fred'
    }
};

// Information content for tooltips
const INFO_CONTENT = {
    'wage-input': {
        title: 'Your Current Wage',
        content: `
            <p>Enter your current hourly wage or annual salary to see your personal theft calculation.</p>
            <h4>Why This Matters:</h4>
            <ul>
                <li>Shows you exactly how much purchasing power you've lost</li>
                <li>Compares your wage to what it should be in real money (gold/silver)</li>
                <li>Reveals the personal impact of monetary debasement</li>
            </ul>
            <div class="example">
                <strong>Example:</strong> If you earn $15/hour, you should be earning $151/hour 
                if wages kept pace with gold since 1968.
            </div>
        `
    },
    'should-earn': {
        title: 'What You Should Be Earning',
        content: `
            <p>This is what your wage would be if purchasing power kept pace with gold since 1968.</p>
            <h4>The Calculation:</h4>
            <div class="formula">
                1968 Minimum Wage: $1.60/hour<br>
                1968 Gold Price: $35/ounce<br>
                Gold per hour: 0.046 ounces<br>
                Today's Gold: $3,300/ounce<br>
                Should Earn: 0.046 × $3,300 = $151/hour
            </div>
            <h4>What This Proves:</h4>
            <ul>
                <li>Money has been systematically debased</li>
                <li>Your purchasing power has been stolen</li>
                <li>The theft is measurable and provable</li>
            </ul>
        `
    },
    'theft-amount': {
        title: 'How Much They Stole',
        content: `
            <p>This is the difference between what you should earn (gold-adjusted) and what you actually earn.</p>
            <h4>The Theft Mechanism:</h4>
            <ul>
                <li><strong>Federal Reserve creates money from nothing</strong></li>
                <li><strong>New money goes to banks and government first</strong></li>
                <li><strong>By the time it reaches you, prices have already risen</strong></li>
                <li><strong>Your wages don't keep up with real inflation</strong></li>
            </ul>
            <div class="example">
                This is called the "Cantillon Effect" - those closest to money creation benefit, 
                while everyone else loses purchasing power.
            </div>
        `
    },
    'lifetime-theft': {
        title: 'Your Lifetime Theft',
        content: `
            <p>This is the total amount of purchasing power stolen from you over a 40-year career.</p>
            <h4>The Calculation:</h4>
            <div class="formula">
                Hourly Theft × 40 hours/week × 52 weeks/year × 40 years
            </div>
            <h4>What This Represents:</h4>
            <ul>
                <li>The house you could have bought easily</li>
                <li>The retirement you could have afforded</li>
                <li>The financial security that was stolen</li>
                <li>The generational wealth that was prevented</li>
            </ul>
            <p><strong>This is why your grandparents' generation lived better on one income 
            while you struggle on two incomes.</strong></p>
        `
    },
    'real-time-theft': {
        title: 'Real-Time Wealth Theft',
        content: `
            <p>This shows money being stolen from Americans in real-time through the Federal Reserve system.</p>
            <h4>How It Works:</h4>
            <ul>
                <li><strong>Federal Interest:</strong> $1.1 trillion annually paid to bondholders</li>
                <li><strong>Your Share:</strong> Your portion of daily interest payments</li>
                <li><strong>Total Debt:</strong> Growing by $1+ trillion annually</li>
            </ul>
            <h4>The Process:</h4>
            <ol>
                <li>Government needs money</li>
                <li>Treasury issues bonds</li>
                <li>Federal Reserve creates money from nothing</li>
                <li>Taxpayers pay interest on money that never existed</li>
            </ol>
            <p><strong>This counter shows your wealth being stolen every second.</strong></p>
        `
    },
    'gold-price': {
        title: 'Gold Price - Real Money',
        content: `
            <p>Gold has been money for 5,000 years. Its price increase shows dollar debasement.</p>
            <h4>Key Facts:</h4>
            <ul>
                <li><strong>1971:</strong> $35/ounce (when dollar was linked to gold)</li>
                <li><strong>Today:</strong> $3,300+/ounce (94× increase)</li>
                <li><strong>This isn't gold going up - it's dollars going down</strong></li>
            </ul>
            <h4>Constitutional Fact:</h4>
            <p>Article 1, Section 10 of the Constitution requires states to use only gold and silver as money. 
            The Federal Reserve system violates the Constitution.</p>
            <div class="example">
                Gold's price is the thermometer showing how sick our currency has become.
            </div>
        `
    },
    'silver-price': {
        title: 'Silver Price - Constitutional Money',
        content: `
            <p>Silver is constitutional money alongside gold. Its suppression is even more extreme.</p>
            <h4>The Silver Manipulation:</h4>
            <ul>
                <li><strong>Historical ratio:</strong> 16 ounces of silver = 1 ounce of gold</li>
                <li><strong>Current ratio:</strong> 80+ ounces of silver = 1 ounce of gold</li>
                <li><strong>This means silver is more suppressed than gold</strong></li>
            </ul>
            <h4>Why They Suppress Silver:</h4>
            <ul>
                <li>More accessible to ordinary people</li>
                <li>Historically used for daily transactions</li>
                <li>Would expose the currency fraud more obviously</li>
            </ul>
            <p><strong>If wages tracked silver, you'd earn $300+/hour.</strong></p>
        `
    },
    'federal-debt': {
        title: 'Federal Debt - The Slavery System',
        content: `
            <p>Federal debt represents claims on future American labor - it's a form of slavery.</p>
            <h4>The Debt Explosion:</h4>
            <ul>
                <li><strong>1971:</strong> $398 billion</li>
                <li><strong>Today:</strong> $36+ trillion</li>
                <li><strong>Growth rate:</strong> 91× increase in 54 years</li>
            </ul>
            <h4>Who Owns This Debt:</h4>
            <ul>
                <li>Federal Reserve (private banks): $5+ trillion</li>
                <li>Foreign governments: $7+ trillion</li>
                <li>Banks and financial institutions: $15+ trillion</li>
            </ul>
            <div class="example">
                Every dollar of debt is a claim on your future labor. 
                You are working to pay interest to bondholders.
            </div>
        `
    },
    'total-theft': {
        title: 'Total Wealth Theft',
        content: `
            <p>Conservative estimate of total wealth transferred from productive Americans to financial elite.</p>
            <h4>How We Calculate $3.5 Quadrillion:</h4>
            <ul>
                <li><strong>Currency debasement:</strong> $400T</li>
                <li><strong>Interest payments:</strong> $50T</li>
                <li><strong>Banking system profits:</strong> $100T</li>
                <li><strong>International extraction:</strong> $200T</li>
                <li><strong>Regulatory costs:</strong> $150T</li>
                <li><strong>Healthcare overcharges:</strong> $100T</li>
                <li><strong>And much more...</strong></li>
            </ul>
            <div class="example">
                This represents $10+ million stolen from every American citizen 
                through systematic monetary manipulation.
            </div>
        `
    },
    'correlation-chart': {
        title: 'Mathematical Proof of Coordination',
        content: `
            <p>This chart proves the theft is systematic, not accidental.</p>
            <h4>What Correlation Means:</h4>
            <ul>
                <li><strong>0.90+ correlation</strong> between gold and debt</li>
                <li><strong>Statistically impossible</strong> to occur naturally</li>
                <li><strong>Proves coordination</strong> between debt creation and gold suppression</li>
            </ul>
            <h4>In Normal Markets:</h4>
            <ul>
                <li>Correlations above 0.7 are considered strong</li>
                <li>Correlations above 0.9 indicate systematic relationship</li>
                <li>This level of correlation cannot be coincidence</li>
            </ul>
            <div class="example">
                When correlation is this perfect, it proves conscious coordination, not market forces.
            </div>
        `
    },
    'personal-chart': {
        title: 'Your Personal Wealth Destruction',
        content: `
            <p>This shows how your purchasing power has been systematically destroyed over time.</p>
            <h4>What the Lines Mean:</h4>
            <ul>
                <li><strong>Red Line:</strong> Your actual wages (flat or slowly rising)</li>
                <li><strong>Gold Line:</strong> What you should earn (exponentially rising)</li>
                <li><strong>Silver Line:</strong> Alternative constitutional money measure</li>
            </ul>
            <h4>The Wealth Gap:</h4>
            <p>The space between the red line and the gold line represents wealth stolen from you through monetary manipulation.</p>
            <div class="example">
                Your grandfather could afford a house, car, and family on one income. 
                You can't afford rent on two incomes. This chart shows why.
            </div>
        `
    },
    'constitutional-chart': {
        title: 'Constitutional Money Violation',
        content: `
            <p>The Constitution requires gold and silver money. This chart shows how they violated it.</p>
            <h4>Constitutional Text:</h4>
            <div class="formula">
                "No State shall make any Thing but gold and silver Coin a Tender in Payment of Debts"
                - Article 1, Section 10
            </div>
            <h4>Gold/Silver Ratio Manipulation:</h4>
            <ul>
                <li><strong>Historical average:</strong> 16:1 (16 ounces silver = 1 ounce gold)</li>
                <li><strong>Current ratio:</strong> 80:1+ (massively suppressed silver)</li>
                <li><strong>This shows coordinated suppression of both metals</strong></li>
            </ul>
            <p><strong>The Federal Reserve system is unconstitutional.</strong></p>
        `
    },
    'timeline-chart': {
        title: '125 Years of Systematic Theft',
        content: `
            <p>This timeline shows how the theft was implemented step by step.</p>
            <h4>Key Phases:</h4>
            <ul>
                <li><strong>1900-1913:</strong> Gold standard era (stable, prosperous)</li>
                <li><strong>1913:</strong> Federal Reserve created (theft begins)</li>
                <li><strong>1933:</strong> Gold confiscated from citizens</li>
                <li><strong>1971:</strong> Gold standard completely abandoned</li>
                <li><strong>2008-2020:</strong> Acceleration phase (massive theft)</li>
            </ul>
            <h4>The Pattern:</h4>
            <p>Each crisis was used to expand the theft system and reduce your economic freedom.</p>
        `
    },
    'cumulative-chart': {
        title: 'Total Wealth Transferred',
        content: `
            <p>This shows the cumulative wealth transfer from productive Americans to the financial elite.</p>
            <h4>How Wealth is Transferred:</h4>
            <ul>
                <li><strong>Interest payments</strong> on created money</li>
                <li><strong>Inflation tax</strong> on savings</li>
                <li><strong>Asset price manipulation</strong> favoring capital owners</li>
                <li><strong>Regulatory capture</strong> preventing competition</li>
            </ul>
            <div class="example">
                The bar chart shows how the theft accelerated over time, 
                especially after 1971 when the gold standard ended.
            </div>
        `
    },
    'solutions': {
        title: 'How to Fight Back',
        content: `
            <p>Constitutional and practical solutions to end the systematic theft.</p>
            <h4>Article V Convention:</h4>
            <ul>
                <li>Bypass corrupt Congress entirely</li>
                <li>Require 34 states to call convention</li>
                <li>Can mandate balanced budgets and constitutional money</li>
            </ul>
            <h4>Personal Protection:</h4>
            <ul>
                <li><strong>Gold/Silver:</strong> Constitutional money, can't be debased</li>
                <li><strong>Bitcoin:</strong> Decentralized, limited supply</li>
                <li><strong>Real assets:</strong> Land, productive property</li>
                <li><strong>Skills:</strong> Practical abilities, education</li>
            </ul>
            <div class="example">
                The system depends on your ignorance and compliance. 
                Knowledge + action = freedom.
            </div>
        `
    }
};

// Initialize application with enhanced features
document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing Enhanced Wealth Extraction Analysis Tool...');
    initializeApp();
});

async function initializeApp() {
    try {
        setupEventListeners();
        setupTooltipSystem();
        loadHistoricalData();
        updateAPIStatus('loading', 'Connecting to real-time data...');
        await loadRealTimeData();
        initializeCharts();
        updateDashboard();
        startRealTimeCounters();
        updateSliderDisplays();
        setupEraButtons();
        updateAPIStatus('success', 'Connected to real-time data');
        console.log('Application initialized successfully');
    } catch (error) {
        console.error('Initialization error:', error);
        updateAPIStatus('error', 'Using fallback data');
        // Use fallback data
        currentGoldPrice = API_CONFIG.metals.fallback.gold;
        currentSilverPrice = API_CONFIG.metals.fallback.silver;
        currentDebt = API_CONFIG.debt.fallback;
        initializeCharts();
        updateDashboard();
        startRealTimeCounters();
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
    
    // Auto-update data every 5 minutes during market hours
    setInterval(loadRealTimeData, 300000);
    
    // Update counters every second
    setInterval(updateRealTimeCounters, 1000);
}

function setupTooltipSystem() {
    // Add click listeners to all info icons
    const infoIcons = document.querySelectorAll('.info-icon');
    const modal = document.getElementById('infoModal');
    const closeBtn = document.querySelector('.info-close');
    
    infoIcons.forEach(icon => {
        icon.addEventListener('click', function(e) {
            e.preventDefault();
            const infoKey = this.getAttribute('data-info');
            showInfoModal(infoKey);
        });
    });
    
    // Close modal events
    closeBtn.addEventListener('click', hideInfoModal);
    
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            hideInfoModal();
        }
    });
    
    // Close on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.style.display === 'block') {
            hideInfoModal();
        }
    });
}

function showInfoModal(infoKey) {
    const modal = document.getElementById('infoModal');
    const title = document.getElementById('infoTitle');
    const content = document.getElementById('infoContent');
    
    const info = INFO_CONTENT[infoKey];
    if (info) {
        title.textContent = info.title;
        content.innerHTML = info.content;
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }
}

function hideInfoModal() {
    const modal = document.getElementById('infoModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto'; // Restore scrolling
}

async function loadRealTimeData() {
    const startTime = Date.now();
    
    try {
        // Load precious metals prices
        await Promise.all([
            loadGoldPrice(),
            loadSilverPrice(),
            loadCurrentDebt()
        ]);
        
        updateDashboard();
        lastUpdate = new Date();
        updateAPIStatus('success', `Data updated - ${formatTime(lastUpdate)}`);
        
        console.log(`Data loaded in ${Date.now() - startTime}ms`);
    } catch (error) {
        console.error('Error loading real-time data:', error);
        updateAPIStatus('error', `Error loading data - using fallback`);
        
        // Use fallback data
        currentGoldPrice = API_CONFIG.metals.fallback.gold;
        currentSilverPrice = API_CONFIG.metals.fallback.silver;
        currentDebt = API_CONFIG.debt.fallback;
        updateDashboard();
    }
}

async function loadGoldPrice() {
    try {
        // Try primary API
        const response = await fetch(`${API_CONFIG.metals.primary}/gold`);
        if (response.ok) {
            const data = await response.json();
            currentGoldPrice = data.price || data.rates?.USD || currentGoldPrice;
            return;
        }
        throw new Error('Primary API failed');
    } catch (error) {
        // Try backup API
        try {
            const response = await fetch(`${API_CONFIG.metals.backup}?api_key=fd9f5f9b02a9ab882530fc61b3d726d2&base=XAU&symbols=USD`);
            if (response.ok) {
                const data = await response.json();
                currentGoldPrice = 1 / (data.rates?.USD || 1/currentGoldPrice);
                return;
            }
        } catch (backupError) {
            console.log('Using fallback gold price');
            currentGoldPrice = API_CONFIG.metals.fallback.gold;
        }
    }
}

async function loadSilverPrice() {
    try {
        const response = await fetch(`${API_CONFIG.metals.primary}/silver`);
        if (response.ok) {
            const data = await response.json();
            currentSilverPrice = data.price || data.rates?.USD || currentSilverPrice;
            return;
        }
        throw new Error('Primary API failed');
    } catch (error) {
        console.log('Using fallback silver price');
        currentSilverPrice = API_CONFIG.metals.fallback.silver;
    }
}

async function loadCurrentDebt() {
    try {
        // Try Treasury Direct API
        const response = await fetch(`${API_CONFIG.debt.primary}?filter=record_date:eq:${getCurrentDate()}&sort=-record_date&page[size]=1`);
        if (response.ok) {
            const data = await response.json();
            if (data.data && data.data.length > 0) {
                currentDebt = parseFloat(data.data[0].tot_pub_debt_out_amt) || currentDebt;
                return;
            }
        }
        throw new Error('Treasury API failed');
    } catch (error) {
        // Use estimated growth rate
        const dailyGrowth = 3000000000; // ~$3B per day average growth
        const daysSinceBase = Math.floor((Date.now() - new Date('2025-01-01').getTime()) / (1000 * 60 * 60 * 24));
        currentDebt = 36250000000000 + (dailyGrowth * daysSinceBase);
    }
}

function getCurrentDate() {
    return new Date().toISOString().split('T')[0];
}

function updateAPIStatus(status, message) {
    const indicator = document.getElementById('statusIndicator');
    const text = document.getElementById('statusText');
    const lastUpdateEl = document.getElementById('lastUpdate');
    
    indicator.className = `status-indicator ${status}`;
    text.textContent = message;
    
    if (status === 'success') {
        lastUpdateEl.textContent = formatTime(new Date());
    }
}

function formatTime(date) {
    return date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
    });
}

function updateDashboard() {
    // Update current prices with enhanced formatting
    document.getElementById('currentGold').textContent = `$${currentGoldPrice.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
    document.getElementById('currentSilver').textContent = `$${currentSilverPrice.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
    document.getElementById('currentDebt').textContent = `$${(currentDebt / 1000000000000).toFixed(2)}T`;
    
    // Calculate changes since 1971
    const goldChange = ((currentGoldPrice - 35) / 35 * 100);
    const silverChange = ((currentSilverPrice - 1.39) / 1.39 * 100);
    
    document.getElementById('goldChange').textContent = `+${goldChange.toFixed(0)}% since 1971`;
    document.getElementById('silverChange').textContent = `+${silverChange.toFixed(0)}% since 1971`;
    
    // Update change classes
    document.getElementById('goldChange').className = 'metric-change positive';
    document.getElementById('silverChange').className = 'metric-change positive';
    
    // Update debt counter
    debtCounter = currentDebt;
}

function startRealTimeCounters() {
    // Federal interest counter - $1.1T annually
    const dailyFederalInterest = 1100000000000 / 365;
    const perSecondFederalInterest = dailyFederalInterest / (24 * 60 * 60);
    
    // Debt growth counter - approximately $3B daily
    const perSecondDebtGrowth = 3000000000 / (24 * 60 * 60);
    
    federalInterestCounter = 0; // Reset daily counter
    
    console.log('Started real-time counters');
}

function updateRealTimeCounters() {
    // Update federal interest counter
    const dailyFederalInterest = 1100000000000 / 365;
    const perSecondFederalInterest = dailyFederalInterest / (24 * 60 * 60);
    
    federalInterestCounter += perSecondFederalInterest;
    document.getElementById('federalInterest').textContent = 
        `$${Math.floor(federalInterestCounter).toLocaleString()}`;
    
    // Update debt counter
    const perSecondDebtGrowth = 3000000000 / (24 * 60 * 60); // ~$3B daily
    debtCounter += perSecondDebtGrowth;
    document.getElementById('totalDebtNow').textContent = 
        `$${Math.floor(debtCounter).toLocaleString()}`;
    
    // Update personal share if calculated
    if (personalTheftCounter > 0) {
        const personalDaily = personalTheftCounter * 24;
        document.getElementById('personalShare').textContent = 
            `$${personalDaily.toFixed(0)}`;
    }
}

// [Keep all the existing chart and calculation functions from the previous version]
// [Space saving - include all the functions from the previous script.js]

// Enhanced personal impact calculation with real-time updates
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
    
    // Calculate with current real-time prices
    const goldOuncesPerHour1968 = 1.60 / 35;
    const silverOuncesPerHour1968 = 1.60 / 1.39;
    
    const goldAdjustedWage = goldOuncesPerHour1968 * currentGoldPrice;
    const silverAdjustedWage = silverOuncesPerHour1968 * currentSilverPrice;
    
    // Use the higher adjusted wage
    const adjustedWage = Math.max(goldAdjustedWage, silverAdjustedWage);
    const theftPerHour = adjustedWage - hourlyWage;
    const monthlyTheft = theftPerHour * 40 * 4.33;
    const annualTheft = theftPerHour * 40 * 52;
    const lifetimeTheft = annualTheft * 40;
    
    // Update UI with real-time calculations
    document.getElementById('shouldEarn').textContent = `$${adjustedWage.toFixed(2)}/hour`;
    document.getElementById('actualEarn').textContent = `$${hourlyWage.toFixed(2)}/hour`;
    document.getElementById('stolenAmount').textContent = `$${theftPerHour.toFixed(2)}/hour`;
    document.getElementById('monthlyTheft').textContent = `$${monthlyTheft.toLocaleString()} per month`;
    document.getElementById('lifetimeTheft').textContent = `$${(lifetimeTheft/1000000).toFixed(1)} Million`;
    
    // Show results with animation
    const resultsDiv = document.getElementById('theftResults');
    resultsDiv.style.display = 'grid';
    resultsDiv.classList.add('fade-in');
    
    // Update personal theft counter for real-time display
    personalTheftCounter = theftPerHour / 24; // Convert to per hour for daily display
    
    // Update personal chart
    updatePersonalChart();
}

// [Include all remaining functions from previous version]
// [The rest of the code remains the same - all chart functions, data loading, etc.]

// Auto-calculate initial impact
setTimeout(() => {
    if (document.getElementById('userWage').value) {
        calculatePersonalImpact();
    }
}, 2000);

console.log('Enhanced Wealth Extraction Analysis Tool loaded successfully');
