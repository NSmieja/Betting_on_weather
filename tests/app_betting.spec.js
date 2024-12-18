// @ts-check
const { test, expect } = require('@playwright/test');
const { error } = require('console');
const path = require('path');

const API_BASE_URL = 'https://api.openweathermap.org/data/2.5';
const API_KEY = '6f1e4fbbbdc9773df141bce119a0c2fd';
const BASE_URL = 'http://localhost:8080';
const CITIES = ['London', 'Wrocław', 'Dubai', 'Vancouver', 'paris', 'los angeles', 'cairo', 'kathmandu',];


async function accessingBets(page) {
  // Simulate entering a city and pressing Enter (this triggers the fetchWeather function)
  await page.locator('#city').fill('London');
  await page.locator('#city').press('Enter');

  // Wait for the odds to be displayed (simulate odds based on the API response)
  await page.waitForSelector('#betRain');
  await expect(page.locator('#betRain')).toBeVisible();
  await page.waitForSelector('#oddsRain:has-text(":")');
}

async function extraxtingOdds(page) {
  // Extract the odds generated by the app
  let rainText = await page.locator('#oddsRain').textContent();
  let rainOdds = parseFloat(rainText.split(': ')[1]);
  console.log('➡️ ODDS - RAIN:', rainOdds);
  let noRainText = await page.locator('#oddsNoRain').textContent();
  let noRainOdds = parseFloat(noRainText.split(': ')[1]);
  console.log('➡️ ODDS - NO RAIN:', noRainOdds);

  return [rainOdds, noRainOdds];
}


test.beforeEach(async ({ page }) => {
  await page.goto(`${BASE_URL}/index.html`);
});


test.describe('', () => {
  test('SCENARIO: Application fetches the data from API and calculates odds correctly', async ({ page }) => {
    // For each city, if the weather description contains the word 'rain' (case insensitive), odds should be lower for betting on rain
    for (let i = 0; i < CITIES.length; i++) {
      // Fetching API response
      const response = await fetch(`${API_BASE_URL}/weather?q=${CITIES[i]}&appid=${API_KEY}`);
      const data = await response.json();
      const weatherDescription = data.weather[0].description;
      console.log('➡️ WEATHER DESCRIPTION:', weatherDescription);

      // Extracting the odds from the app
      await page.locator('#city').fill(CITIES[i]);
      await page.locator('#city').press('Enter');
      await page.waitForSelector('#oddsRain:has-text(":")');
      await page.waitForSelector('#oddsNoRain:has-text(":")');

      let [rainOdds, noRainOdds] = await extraxtingOdds(page);

      // Checking the odds 
      if (/rain/i.test(weatherDescription)) {
        expect(rainOdds).toBeLessThan(noRainOdds);
        expect(rainOdds).toBeLessThanOrEqual(1.8);
        expect(rainOdds).toBeGreaterThanOrEqual(1.2);
        expect(noRainOdds).toBeGreaterThanOrEqual(2.0);
        expect(noRainOdds).toBeLessThanOrEqual(3.0);
      }
      else {
        expect(noRainOdds).toBeLessThan(rainOdds);
        expect(noRainOdds).toBeLessThanOrEqual(1.8);
        expect(noRainOdds).toBeGreaterThanOrEqual(1.2);
        expect(rainOdds).toBeGreaterThanOrEqual(2.0);
        expect(rainOdds).toBeLessThanOrEqual(3.0);
      }

      // Refreshing the page
      await page.reload();
    }
  });


  test('SCENARIO: Winning bets are calculated correctly', async ({ page }) => {
    // Wait for the odds to be displayed (simulate odds based on the API response)
    await accessingBets(page);

    // Extract odds values
    let [rainOdds, noRainOdds] = await extraxtingOdds(page);

    // Wait for the prompt to show up, bet $11 amount
    page.on('dialog', async dialog => {
      console.log('☑️ Handling popup')
      if (dialog.type() === 'prompt') {
        expect(dialog.type()).toContain('prompt');
        expect(dialog.message()).toContain('Enter the amount you want to bet');;
        await dialog.accept('11');
      } else {
        throw error('🛑 Sth went wrong.')
      }
    })
    page.on('dialog', dialog => console.log('☑️☑️ DIALOG:', dialog.message()));

    // Click on bet 
    let odds;
    if (rainOdds < noRainOdds) {
      await page.locator('#betRain').click(); // Trigger a bet on rain
      odds = rainOdds;
    } else {
      await page.locator('#betNoRain').click(); // Trigger a bet on no rain
      odds = noRainOdds;
    }
    console.log('☑️ Odds:', odds)

    // Check the wallet value
    let wallet = (11 * odds + (100 - 11)).toFixed(2);
    console.log('☑️ Wallet:', wallet)
    await expect(page.locator('#walletAmount')).toContainText(wallet);
  })


  test('SCENARIO: Loosing bets are calculated correctly', async ({ page }) => {
    // Wait for the odds to be displayed (simulate odds based on the API response)
    await accessingBets(page);

    // Extract odds values
    let [rainOdds, noRainOdds] = await extraxtingOdds(page);

    // Wait for the prompt to show up, bet $10 amount
    page.on('dialog', async dialog => {
      console.log('☑️ Handling popup')
      if (dialog.type() === 'prompt') {
        expect(dialog.type()).toContain('prompt');
        expect(dialog.message()).toContain('Enter the amount you want to bet');;
        await dialog.accept('10');
      } else {
        throw error('🛑 Sth went wrong.')
      }
    })
    page.on('dialog', dialog => console.log('☑️☑️ DIALOG:', dialog.message()));

    // Click on bet 
    let odds;
    if (rainOdds > noRainOdds) {
      await page.locator('#betRain').click(); // Trigger a bet on rain
      odds = rainOdds;
    } else {
      await page.locator('#betNoRain').click(); // Trigger a bet on no rain
      odds = noRainOdds;
    }
    console.log('☑️ Odds:', odds)

    // Check the wallet value
    let wallet = String(100 - 10);
    console.log('☑️ Wallet:', wallet)
    await expect(page.locator('#walletAmount')).toContainText(wallet);
  })


  test('SCENARIO: Cash out offered for bets over $50 with odds greater than 1.50', async ({ page }) => {

    let success = false;
    while (!success) {

      // Wait for the odds to be displayed (simulate odds based on the API response)
      await accessingBets(page);

      // Extract odds values
      let oddsValues = [];
      let [rainOdds, noRainOdds] = await extraxtingOdds(page);
      oddsValues.push(rainOdds, noRainOdds);

      let minValue = Math.min(...oddsValues)
      if (minValue > 1.5) {
        success = true;
        let index = oddsValues.indexOf(minValue);


        // Wait for the prompt to show up, bet over $50 amount, accept the cash out
        page.on('dialog', async dialog => {
          console.log('☑️ Handling popup')
          if (dialog.type() === 'prompt') {
            expect(dialog.type()).toContain('prompt');
            expect(dialog.message()).toContain('Enter the amount you want to bet');;
            await dialog.accept('60');
          } else {
            expect(dialog.type()).toBe('confirm');
            expect(dialog.message()).toContain('Cash out option');;
            await dialog.accept();
          }
        })
        page.on('dialog', dialog => console.log('☑️☑️ DIALOG:', dialog.message()));

        // Click on a bet 
        if (index === 0) {
          await page.locator('#betRain').click(); // Trigger a bet on rain
        } else {
          await page.locator('#betNoRain').click(); // Trigger a bet on no rain
        }


        await expect(page.locator('#walletAmount')).toHaveText('124');  // bet amount * cash out margin (60*40% = 24)

        break

      } else {
        page.reload();
      }
    }
  });


  test('SCENARIO: Freezing the market', async ({ page }) => {

    let success = false;
    while (!success) {

      // Wait for the odds to be displayed (simulate odds based on the API response)
      await accessingBets(page);

      // Extract odds values
      let oddsValues = [];
      let [rainOdds, noRainOdds] = await extraxtingOdds(page);
      oddsValues.push(rainOdds, noRainOdds);

      let minValue = Math.min(...oddsValues)
      if (minValue > 1.5) {
        success = true;
        let index = oddsValues.indexOf(minValue);


        // Wait for the prompt to show up, bet over $50 amount, accept the cash out
        page.on('dialog', async dialog => {
          console.log('☑️ Handling popup')
          if (dialog.type() === 'prompt') {
            expect(dialog.type()).toContain('prompt');
            expect(dialog.message()).toContain('Enter the amount you want to bet');;
            await dialog.accept('95');
          } else {
            expect(dialog.type()).toBe('confirm');
            expect(dialog.message()).toContain('The betting market is suspended');;
            await dialog.accept();
          }
        })
        page.on('dialog', dialog => console.log('☑️☑️ DIALOG:', dialog.message()));

        // Click on a bet 
        if (index === 0) {
          await page.locator('#betRain').click(); // Trigger a bet on rain
        } else {
          await page.locator('#betNoRain').click(); // Trigger a bet on no rain
        }


        await expect(page.locator('#walletAmount')).toHaveText('100');

        break

      } else {
        page.reload();
      }
    }
  });
});
