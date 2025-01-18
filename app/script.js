let wallet = 100;
let citiesUsed = [];

let winOdds;
let giftClaimed = false;
let freezeAmount = 90;
let cashedOutAmount = 50;
let cashedOutOddsLevel = 1.5;
let cashedValue = 0.4;
let freezeOddsLevel = cashedOutOddsLevel;
let betCount = 0; // Counter to track number of bets made

const markets = [
    { name: "rain", oddsRange: { yes: [1.2, 1.8], no: [2.0, 3.0] }, keywords: /rain/i, elementIds: ["oddsRain", "oddsNoRain"] },
    { name: "clouds", oddsRange: { yes: [1.5, 2.0], no: [2.5, 3.5] }, keywords: /cloud/i, elementIds: ["oddsClouds", "oddsNoClouds"] },
    { name: "fog", oddsRange: { yes: [1.3, 1.9], no: [2.2, 3.2] }, keywords: /fog/i, elementIds: ["oddsFog", "oddsNoFog"] },
];

// let isCondition;  // isRain, isCloudy, isFoggy
// let positiveOdds;  // rainOdds, cloudsOdds, fogOdds
// let negativeOdds;  // noRainOdds, noCloudOdds, noFogOdds
let conditions = [
    { name: "rain", odds: { trueOdds: 0, falseOdds: 0, winOdds: null }, isCondition: false, elementIds: ["oddsRain", "oddsNoRain", "betRain", "betNoRain"] },
    { name: "clouds", odds: { trueOdds: 0, falseOdds: 0, winOdds: null }, isCondition: false, elementIds: ["oddsClouds", "oddsNoClouds", "betClouds", "betNoClouds"] },
    { name: "fog", odds: { trueOdds: 0, falseOdds: 0, winOdds: null }, isCondition: false, elementIds: ["oddsFog", "oddsNoFog", "betFog", "betNoFog"] },
];



let rainOdds;
let noRainOdds;
let isRain;

let cloudsOdds;
let noCloudsOdds;
let isCloudy;

let fogOdds;
let noFogOdds;
let isFoggy;

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
    for (var i = 0; i < markets.length; i++) {
        let currentMarket = markets[i].name;
        console.log("✅ MARKET:", markets[i]);
        console.log("✅ MARKET:", markets[i].name);
        console.log("✅ MARKET:", currentMarket);

        console.log(markets[i].keywords.test(weatherDescription));
        // conditions.currentMarket.isCondition = markets[i].keywords.test(weatherDescription);
        console.log("1", conditions[i].name);
        console.log("2", conditions[i].isCondition);

        for (var i = 0; i < conditions.length; i++) {
            if (currentMarket == conditions[i].name) {
                isConditionPositive = markets[i].keywords.test(weatherDescription);
                conditions[i].isCondition = isConditionPositive;

                if (isConditionPositive) {
                    conditions[i].odds.trueOdds = getRandomOdds(markets[i].oddsRange.yes[0], markets[i].oddsRange.yes[1]);
                    conditions[i].odds.falseOdds = getRandomOdds(markets[i].oddsRange.no[0], markets[i].oddsRange.no[1]);
                    conditions[i].odds.winOdds = conditions[i].odds.trueOdds;
                }
                else {
                    conditions[i].odds.trueOdds = getRandomOdds(markets[i].oddsRange.no[0], markets[i].oddsRange.no[1]);
                    conditions[i].odds.falseOdds = getRandomOdds(markets[i].oddsRange.yes[0], markets[i].oddsRange.yes[1]);
                    conditions[i].odds.winOdds = conditions[i].odds.falseOdds;
                }

                break
            }
        }


    }

    // if (/rain/i.test(weatherDescription)) { // If the description contains "rain"
    //     isRain = true;
    //     rainOdds = getRandomOdds(1.2, 1.8); // Lower odds for "Rain"
    //     noRainOdds = getRandomOdds(2.0, 3.0); // Higher odds for "No Rain"
    //     winOdds = rainOdds;
    // } else { // If it doesn't contain "rain"
    //     isRain = false;
    //     rainOdds = getRandomOdds(2.0, 3.0); // Higher odds for "Rain"
    //     noRainOdds = getRandomOdds(1.2, 1.8); // Lower odds for "No Rain"
    //     winOdds = noRainOdds;
    // }

    // if (/cloud/i.test(weatherDescription)) { // Cloud odds
    //     isCloudy = true;
    //     cloudsOdds = getRandomOdds(1.5, 2.0);
    //     noCloudsOdds = getRandomOdds(2.0, 2.5);
    // } else { // No cloud odds
    //     isCloudy = false;
    //     cloudsOdds = getRandomOdds(2.0, 2.5);
    //     noCloudsOdds = getRandomOdds(1.5, 2.0);
    // }

    // if (/fog/i.test(weatherDescription)) { // Fog odds
    //     isFoggy = true;
    //     fogOdds = getRandomOdds(1.5, 2.0);
    //     noFogOdds = getRandomOdds(2.0, 2.5);
    // } else { // No fog odds
    //     isFoggy = false;
    //     fogOdds = getRandomOdds(2.0, 2.5);
    //     noFogOdds = getRandomOdds(1.5, 2.0);
    // }

    console.log("CONDITIONS:", conditions);

    for (var i = 0; i < conditions.length; i++) {
        if (conditions[i].isCondition) {
            document.getElementById(conditions[i].elementIds[0]).textContent = `Odds: ${conditions[i].odds.trueOdds}`;
            document.getElementById(conditions[i].elementIds[1]).textContent = `Odds: ${conditions[i].odds.falseOdds}`;
        } else {
            document.getElementById(conditions[i].elementIds[1]).textContent = `Odds: ${conditions[i].odds.trueOdds}`;
            document.getElementById(conditions[i].elementIds[0]).textContent = `Odds: ${conditions[i].odds.falseOdds}`;
        }
    }

    // Update the odds display
    // document.getElementById('oddsRain').textContent = `Odds for Rain: ${rainOdds}`;
    // document.getElementById('oddsNoRain').textContent = `Odds for No Rain: ${noRainOdds}`;
    // document.getElementById('oddsClouds').textContent = `Odds for Clouds: ${cloudsOdds}`;
    // document.getElementById('oddsNoClouds').textContent = `Odds for No Clouds: ${noCloudsOdds}`;
    // document.getElementById('oddsFog').textContent = `Odds for Fog: ${fogOdds}`;
    // document.getElementById('oddsNoFog').textContent = `Odds for No Fog: ${noFogOdds}`;
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

    for (var i = 0; i < conditions.length; i++) {
        winOdds = conditions[i].odds.winOdds;
        if (
            (conditions[i].isCondition && betType === 'yes') ||
            (!conditions[i].isCondition && betType === 'no')
        )

        // if (
        //     (betType === 'rain' && isRain) ||
        //     (betType === 'no-rain' && !isRain) ||
        //     (betType === 'clouds' && isCloudy) ||
        //     (betType === 'no-clouds' && !isCloudy) ||
        //     (betType === 'fog' && isFoggy) ||
        //     (betType === 'no-fog' && !isFoggy)
        // ) 
        {
            console.log("CONDITION IS TRUE - betting on winning market");
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
for (var i = 0; i < conditions.length; i++) {
    document.getElementById(conditions[i].elementIds[2]).addEventListener('click', () => {
        handleBet('yes');
    });
    document.getElementById(conditions[i].elementIds[3]).addEventListener('click', () => {
        handleBet('no');
    });
}


// document.getElementById('betRain').addEventListener('click', () => {
//     handleBet('rain');
// });

// document.getElementById('betNoRain').addEventListener('click', () => {
//     handleBet('no-rain');
// });

// document.getElementById('betClouds').addEventListener('click', () => {
//     handleBet('clouds');
// });

// document.getElementById('betNoClouds').addEventListener('click', () => {
//     handleBet('no-clouds');
// });

// document.getElementById('betFog').addEventListener('click', () => {
//     handleBet('fog');
// });

// document.getElementById('betNoFog').addEventListener('click', () => {
//     handleBet('no-fog');
// });

// Random switch of the odds (to make results more unpredictable - without it, bets on lower odds will always win)
// Function to randomly switch odds between rain and no-rain
function randomizeOdds() {
    betCount++;
    if (betCount >= 5 && betCount <= 10 && Math.random() < 0.5) {
        // Swap rain and no-rain odds
        let temp = rainOdds;
        rainOdds = noRainOdds;
        noRainOdds = temp;

        // Swap clouds and no-clouds odds
        let tempClouds = cloudsOdds;
        cloudsOdds = noCloudsOdds;
        noCloudsOdds = tempClouds;

        // Swap fog and no-fog odds
        let tempFog = fogOdds;
        fogOdds = noFogOdds;
        noFogOdds = tempFog;

        // Update the odds display
        document.getElementById('oddsRain').textContent = `Odds for Rain: ${rainOdds}`;
        document.getElementById('oddsNoRain').textContent = `Odds for No Rain: ${noRainOdds}`;
        document.getElementById('oddsClouds').textContent = `Odds for Clouds: ${cloudsOdds}`;
        document.getElementById('oddsNoClouds').textContent = `Odds for No Clouds: ${noCloudsOdds}`;
        document.getElementById('oddsFog').textContent = `Odds for Fog: ${fogOdds}`;
        document.getElementById('oddsNoFog').textContent = `Odds for No Fog: ${noFogOdds}`;


        betCount = 0; // Reset the counter after switching
    }
}
