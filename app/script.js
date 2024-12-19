let wallet = 100;
let citiesUsed = [];
let rainOdds;
let noRainOdds;
let isRain;
let winOdds;
let giftClaimed = false;
let freezeAmount = 90;
let cashedOutAmount = 50;
let cashedOutOddsLevel = 1.5;
let cashedValue = 0.4;
let freezeOddsLevel = cashedOutOddsLevel;
let betCount = 0; // Counter to track number of bets made

// Function to update wallet display
function updateWallet() {
    document.getElementById('walletAmount').textContent = Number(wallet.toFixed(3));
}

// Function to generate random odds within a given range
function getRandomOdds(min, max) {
    return parseFloat((Math.random() * (max - min) + min).toFixed(2)); // Random number with 2 decimal places
}

// Function to determine odds based on current weather
function calculateOdds(weatherDescription) {
    if (/rain/i.test(weatherDescription)) { // If the description contains "rain"
        isRain = true;
        rainOdds = getRandomOdds(1.2, 1.8); // Lower odds for "Rain"
        noRainOdds = getRandomOdds(2.0, 3.0); // Higher odds for "No Rain"
        winOdds = rainOdds;
    } else { // If it doesn't contain "rain"
        isRain = false;
        rainOdds = getRandomOdds(2.0, 3.0); // Higher odds for "Rain"
        noRainOdds = getRandomOdds(1.2, 1.8); // Lower odds for "No Rain"
        winOdds = noRainOdds;
    }

    // Update the odds display
    document.getElementById('oddsRain').textContent = `Odds for Rain: ${rainOdds}`;
    document.getElementById('oddsNoRain').textContent = `Odds for No Rain: ${noRainOdds}`;
}

// Fetch weather data for the city
async function fetchWeather(city) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=6f1e4fbbbdc9773df141bce119a0c2fd`);
        if (!response.ok) throw new Error('City not found');
        const data = await response.json();
        const weatherDescription = data.weather[0].description;

        calculateOdds(weatherDescription); // Calculate odds based on weather description

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
    // Call randomizeOdds before processing the bet
    randomizeOdds();

    const betAmount = Number(prompt('Enter the amount you want to bet:'));
    // console.log("➡️ Value, type of value:", betAmount, typeof betAmount);

    if (isNaN(betAmount) || typeof betAmount !== 'number' || betAmount <= 0) {
        alert('Please enter a valid amount.');
        return;
    }

    if (betAmount > wallet) {
        alert('Sorry, not enough funds.');
        return;
    }

    // Check if it's raining in the selected city
    // const isRain = rainOdds < noRainOdds; // Rain odds are lower when it's raining

    let resultMessage;
    let profit;

    console.log("☑️ Wallet before bet:", wallet, typeof wallet);

    if ((betType === 'rain' && isRain) || (betType === 'no-rain' && !isRain)) {
        if (winOdds > freezeOddsLevel && betAmount >= freezeAmount) {
            resultMessage = 'The betting market is suspended. Your bet amount has been refunded.';
        } else if (winOdds > cashedOutOddsLevel && betAmount >= cashedOutAmount) {
            const cashOut = confirm('Cash out option: Get your bet amount back plus 40% more. Do you agree?');
            if (cashOut) {
                profit = betAmount * cashedValue;
                wallet += profit;
                resultMessage = `You cashed out successfully! Cash out profit: $${Number(profit).toFixed(2)}.`;
            } else {
                profit = betAmount * winOdds - betAmount;
                console.log("➡️ Profit:", Number(profit).toFixed(2));
                wallet += profit;
                resultMessage = `You won! Your profit: $${Number(profit).toFixed(2)}`;
            }
        } else {
            profit = betAmount * winOdds - betAmount;
            wallet += profit;
            resultMessage = `You won! Your profit: $${Number(profit).toFixed(2)}`;
        }
    } else {
        wallet -= betAmount;
        resultMessage = 'You lost the bet.';
    }

    console.log("☑️ Wallet after bet:", wallet, typeof wallet);


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

// Submit city:
// 1) Submit city by clicking button or pressing Enter
document.getElementById('submitCity').addEventListener('click', () => {
    const city = document.getElementById('city').value.trim();
    // if (!city || citiesUsed.includes(city)) {
    if (!city) {
        alert('Please enter a valid city name.');
        return;
    }
    if (!citiesUsed.includes(city)) {
        citiesUsed.push(city);
    }
    fetchWeather(city);
});

// 2) Add event listener to handle the Enter key press
document.getElementById('city').addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {  // Check if the pressed key is Enter
        event.preventDefault(); // Prevent form submission
        const city = document.getElementById('city').value.trim();
        // if (!city || citiesUsed.includes(city)) {
        if (!city) {
            alert('Please enter a valid city name.');
            return;
        }
        if (!citiesUsed.includes(city)) {
            citiesUsed.push(city);
        }
        fetchWeather(city);
    }
});

// Play again
document.getElementById('playAgain').addEventListener('click', () => {
    document.getElementById('cityInput').style.display = 'block';
    document.getElementById('result').style.display = 'none';
});

// Adding event listeners to the betting buttons
document.getElementById('betRain').addEventListener('click', () => {
    handleBet('rain');
});

document.getElementById('betNoRain').addEventListener('click', () => {
    handleBet('no-rain');
});

// Random switch of the odds (to make results more unpredictable - without it, bets on lower odds will always win)
// Function to randomly switch odds between rain and no-rain
function randomizeOdds() {
    betCount++;
    if (betCount >= 5 && betCount <= 10 && Math.random() < 0.5) {
        // Swap rain and no-rain odds
        let temp = rainOdds;
        rainOdds = noRainOdds;
        noRainOdds = temp;

        // Update the odds display
        document.getElementById('oddsRain').textContent = `Odds for Rain: ${rainOdds}`;
        document.getElementById('oddsNoRain').textContent = `Odds for No Rain: ${noRainOdds}`;

        betCount = 0; // Reset the counter after switching
    }
}
