// @ts-check
const { test, expect } = require('@playwright/test');
const path = require('path');

const BASE_URL = 'http://localhost:8080';
const CITIES = ['London', 'Wrocław', 'Dubai', 'Vancouver'];
const INCORRECT_CITY = 'Abcd';



test.describe('', () => {
  test('SCENARIO: User is able to navigate to the main page', async ({ page }) => {
    await test.step('STEP 1: Navigate to the file URL', async () => {
      await page.goto(`${BASE_URL}/index.html`);
      await page.waitForLoadState('load');
    });

    await test.step('STEP 2: Check if wallet elements are visible', async () => {
      await expect(page.locator('#topUp')).toBeVisible();
      await expect(page.locator('#topUp')).toHaveText('Top Up ($50)');
      await expect(page.locator('#walletAmount')).toHaveText('100');
    });

    await test.step('STEP 3: Check if city elements are correct', async () => {
      await expect(page.locator('#city')).toBeVisible();
      await expect(page.locator('#submitCity')).toHaveText('Submit');
    });
  });


  test('SCENARIO: User is able to see the bets after entering a city name and clicking on submit button', async ({ page }) => {
    await test.step('GIVEN: User has navigated to the main page', async () => {
      await page.goto(`${BASE_URL}/index.html`);
      await page.waitForLoadState('load');
    });

    await test.step('WHEN: User enters city name and clicks on Submit button', async () => {
      await expect(page.locator('#betRain')).not.toBeVisible();
      await expect(page.locator('#betNoRain')).not.toBeVisible();
      await page.locator('#city').fill(CITIES[0]);
      await page.locator('#submitCity').click();
    });

    await test.step('THEN: User is able to bet on the city weather', async () => {
      await expect(page.locator('#betRain')).toBeVisible();
      await expect(page.locator('#betNoRain')).toBeVisible();
    });
  });


  test('SCENARIO: User is able to see the bets after entering a city name and clicking enter', async ({ page }) => {
    await test.step('GIVEN: User has navigated to the main page', async () => {
      await page.goto(`${BASE_URL}/index.html`);
      await page.waitForLoadState('load');
    });

    await test.step('WHEN: User enters city name and clicks enter', async () => {
      await expect(page.locator('#betRain')).not.toBeVisible();
      await expect(page.locator('#betNoRain')).not.toBeVisible();
      await page.locator('#city').fill(CITIES[0]);
      await page.locator('#city').press('Enter');
    });

    await test.step('THEN: User is able to bet on the city weather', async () => {
      await expect(page.locator('#betRain')).toBeVisible();
      await expect(page.locator('#betNoRain')).toBeVisible();
    });
  });


  test('SCENARIO: User is able to see the bets after entering a city name - case insensitive', async ({ page }) => {
    await test.step('GIVEN: User has navigated to the main page', async () => {
      await page.goto(`${BASE_URL}/index.html`);
      await page.waitForLoadState('load');
    });

    await test.step('WHEN: User enters city name (case insensitive) and clicks enter', async () => {
      await expect(page.locator('#betRain')).not.toBeVisible();
      await expect(page.locator('#betNoRain')).not.toBeVisible();
      await page.locator('#city').fill('new YORK');
      await page.locator('#city').press('Enter');
    });

    await test.step('THEN: User is able to bet on the city weather', async () => {
      await expect(page.locator('#betRain')).toBeVisible();
      await expect(page.locator('#betNoRain')).toBeVisible();
    });
  });


  test('SCENARIO: User is not able to see the bets after entering incorrect city name', async ({ page }) => {
    await test.step('GIVEN: User has navigated to the main page', async () => {
      await page.goto(`${BASE_URL}/index.html`);
      await page.waitForLoadState('load');
    });

    await test.step('WHEN: User enters city name and clicks enter', async () => {
      await expect(page.locator('#betRain')).not.toBeVisible();
      await expect(page.locator('#betNoRain')).not.toBeVisible();
      await page.locator('#city').fill(INCORRECT_CITY);
      await page.locator('#city').press('Enter');
    });

    await test.step('THEN: User see the popup message with the error', async () => {
      page.on('dialog', async (dialog) => {
        expect(dialog.message()).toBe('Error fetching weather data. Please try again.');
        await dialog.accept();
      });
    });
  });


  test('SCENARIO: User is able to add $50 to the wallet by clicking on Top Up button', async ({ page }) => {
    await test.step('GIVEN: User has navigated to the main page', async () => {
      await page.goto(`${BASE_URL}/index.html`);
      await page.waitForLoadState('load');
    });

    await test.step('WHEN: User clicks on Top Up button', async () => {
      await expect(page.locator('#walletAmount')).toHaveText('100');
      await page.locator('#topUp').click();
    });

    await test.step('THEN: Value of the wallet is increased by $50', async () => {
      await expect(page.locator('#walletAmount')).toHaveText('150');
    });

    await test.step('WHEN: User clicks on Top Up button', async () => {
      await expect(page.locator('#walletAmount')).toHaveText('150');
      await page.locator('#topUp').click();
    });

    await test.step('THEN: Value of the wallet is increased by $50', async () => {
      await expect(page.locator('#walletAmount')).toHaveText('200');
    });
  });
});
