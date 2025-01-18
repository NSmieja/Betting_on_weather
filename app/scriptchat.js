let wallet = 100;
let citiesUsed = [];
let giftClaimed = false;
let betCount = 0; // Counter to track number of bets made

// Market configuration
const markets = {
    rain: { oddsRange: { yes: [1.2, 1.8], no: [2.0, 3.0] }, keywords: /rain/i },
    clouds: { oddsRange: { yes: [1.5, 2.0], no: [2.5, 3.5] }, keywords: /cloud/i },
    fog: { oddsRange: { yes: [1.3, 1.7], no: [2.2, 3.2] }, keywords: /fog/i },
};

// State for markets
let activeMarket = null;
let odds = {};
let isYes = false;

// Function to update wallet display
function updateWallet() {
    document.getElementById('walletAmount').textContent = Number(wallet.toFixed(3));
}

// Function to generate random odds within a range
function getRandomOdds(min, max) {
    return parseFloat((Math.random() * (max - min) + min).toFixed(2));
}

// Function to calculate odds for a given market
function calculateOdds(weatherDescription, market) {
    const { oddsRange, keywords } = markets[market];
    isYes = keywords.test(weatherDescription);

    odds = {
        yes: getRandomOdds(...oddsRange.yes),
        no: getRandomOdds(...oddsRange.no),
    };

    // Display odds
    document.getElementById('oddsYes').textContent = `Odds for ${market.charAt(0).toUpperCase() + market.slice(1)}: ${odds.yes}`;
    document.getElementById('oddsNo').textContent = `Odds for No ${market.charAt(0).toUpperCase() + market.slice(1)}: ${odds.no}`;
}

// Fetch weather data for the city
async function fetchWeather(city, market) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=6f1e4fbbbdc9773df141bce119a0c2fd`);
        if (!response.ok) throw new Error('City not found');
        const data = await response.json();
        const weatherDescription = data.weather[0].description;

        activeMarket = market; // Set active market
        calculateOdds(weatherDescription, market); // Calculate odds for the market

        // Show betting options
        document.getElementById('bettingOptions').style.display = 'block';
        document.getElementById('cityInput').style.display = 'none';
    } catch (error) {
        alert('Error fetching weather data. Please try again.');
        document.getElementById('cityInput').style.display = 'block';
        document.getElementById('bettingOptions').style.display = 'none';
    }
}

// Handle betting logic
function handleBet(betType) {
    const betAmount = Number(prompt('Enter the amount you want to bet:'));
    if (isNaN(betAmount) || betAmount <= 0) {
        alert('Please enter a valid amount.');
        return;
    }

    if (betAmount > wallet) {
        alert('Sorry, not enough funds.');
        return;
    }

    let resultMessage;
    if ((betType === 'yes' && isYes) || (betType === 'no' && !isYes)) {
        const profit = betAmount * odds[betType] - betAmount;
        wallet += profit;
        resultMessage = `You won! Your profit: $${Number(profit).toFixed(2)}`;
    } else {
        wallet -= betAmount;
        resultMessage = 'You lost the bet.';
    }

    // Display results
    document.getElementById('resultMessage').textContent = resultMessage;
    document.getElementById('result').style.display = 'block';
    document.getElementById('bettingOptions').style.display = 'none';

    // Check for gift
    if (wallet < 20 && !giftClaimed) {
        document.getElementById('claimGift').style.display = 'block';
    }

    updateWallet();
}

// Claim gift logic
document.getElementById('claimGiftButton').addEventListener('click', () => {
    wallet += 50;
    giftClaimed = true;
    document.getElementById('claimGift').style.display = 'none';
    updateWallet();
});

// Top up wallet
document.getElementById('topUp').addEventListener('click', () => {
    wallet += 50;
    updateWallet();
});

// Submit city
document.getElementById('submitCity').addEventListener('click', () => {
    const city = document.getElementById('city').value.trim();
    const market = document.getElementById('marketSelect').value; // Get selected market

    if (!city || !market) {
        alert('Please enter a valid city and select a market.');
        return;
    }

    if (!citiesUsed.includes(city)) {
        citiesUsed.push(city);
    }

    fetchWeather(city, market);
});

// Add event listeners to the betting buttons
document.getElementById('betYes').addEventListener('click', () => {
    handleBet('yes');
});

document.getElementById('betNo').addEventListener('click', () => {
    handleBet('no');
});

// Play again
document.getElementById('playAgain').addEventListener('click', () => {
    document.getElementById('cityInput').style.display = 'block';
    document.getElementById('result').style.display = 'none';
});
