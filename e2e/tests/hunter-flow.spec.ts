import { test, expect } from '@playwright/test';

test.describe('The Hunter Journey', () => {

    test('Landing Page loads with critical elements', async ({ page }) => {
        page.on('console', msg => console.log('BROWSER LOG:', msg.text()));

        console.log('Test 1: Visiting Landing Page...');
        await page.goto('/');

        console.log('Test 1: Checking Status...');
        const status = page.locator('text=STATUS:');
        await expect(status).toBeVisible({ timeout: 10000 });

        console.log('Test 1: Checking Decision...');
        const decision = page.locator('h2', { hasText: /GO|STAY|SLEEP/ });
        await expect(decision).toBeVisible();

        console.log('Test 1: Checking Map...');
        const map = page.locator('.leaflet-container');
        await expect(map).toBeVisible({ timeout: 15000 });
        console.log('Test 1: Passed');
    });

    test('Forecast Graph interacts', async ({ page }) => {
        console.log('Test 2: Setting up Mocks...');

        // Mock NOAA Forecast - Generic Match
        await page.route('*noaa-planetary-k-index-forecast.json', async (route: any) => {
            const mockRows = [["time_tag", "kp", "observed", "noaa_scale"]];
            const now = Date.now();
            for (let i = 0; i < 30; i++) {
                const d = new Date(now + i * 3600000);
                mockRows.push([
                    d.toISOString(),
                    "4.00", "observed", null
                ]);
            }
            await route.fulfill({ json: mockRows });
        });

        // Mock OpenMeteo - Generic Match
        await page.route('*open-meteo*', async (route: any) => {
            const times = [];
            const covers = [];
            const now = Date.now();
            for (let i = 0; i < 48; i++) {
                times.push(new Date(now + i * 3600000).toISOString());
                covers.push(10);
            }
            await route.fulfill({
                json: {
                    current: { cloud_cover: 10 },
                    hourly: { time: times, cloud_cover: covers }
                }
            });
        });

        console.log('Test 2: Visiting Page...');
        await page.goto('/');

        console.log('Test 2: Waiting for Load...');
        await expect(page.locator('text=STATUS:')).toBeVisible({ timeout: 15000 });

        console.log('Test 2: Scrolling to Forecast...');
        const graphTitle = page.locator('text=24H FORECAST');
        await graphTitle.scrollIntoViewIfNeeded();
        await expect(graphTitle).toBeVisible({ timeout: 15000 });

        console.log('Test 2: Verifying Graph...');
        const polyline = page.locator('svg polyline');
        await expect(polyline).toBeVisible({ timeout: 20000 });
        console.log('Test 2: Passed');
    });

});
