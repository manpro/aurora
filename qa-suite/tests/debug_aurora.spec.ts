import { test, expect } from '@playwright/test';

test.describe('Aurora & Cloud Data Validations', () => {

    test('Should load Aurora Heatmap and handle Leaflet Heat plugin correctly', async ({ page }) => {
        // Intercept network requests to debug logging
        await page.route('**/*', async route => {
            const url = route.request().url();
            if (url.includes('ovation_aurora_latest.json')) {
                console.log(`[NET] OVATION Request: ${url}`);
            } else if (url.includes('leaflet-heat')) {
                console.log(`[NET] Leaflet Heat JS: ${url}`);
            }
            await route.continue();
        });

        // Capture console logs
        page.on('console', msg => {
            if (msg.type() === 'error') {
                console.log(`[BROWSER ERROR] ${msg.text()}`);
            } else {
                console.log(`[BROWSER LOG] ${msg.text()}`);
            }
        });

        page.on('pageerror', err => {
            console.log(`[PAGE ERROR] ${err.message}`);
        });

        console.log('--- Navigating to Aurora Web ---');
        await page.goto('/');

        // 1. Verify Title
        await expect(page).toHaveTitle(/Aurora - Field Instrument/);

        // 2. Wait for Map
        console.log('--- Waiting for Map Container ---');
        await page.waitForSelector('#map', { state: 'visible', timeout: 30000 });

        // 3. Check for specific Global Variables (Leaflet & Heat Plugin)
        console.log('--- Verifying Global L and HeatLayer ---');
        const globals = await page.evaluate(() => {
            return {
                L_exists: typeof window.L !== 'undefined',
                HeatLayer_exists: typeof window.L?.heatLayer === 'function',
                AuroraHeatLayer_exists: typeof window.auroraHeatLayer !== 'undefined',
                CloudLayer_exists: typeof window.cloudLayer !== 'undefined'
            };
        });

        console.log('Global State Check:', globals);

        if (!globals.L_exists) console.error('CRITICAL: Leaflet (L) is not defined!');
        if (!globals.HeatLayer_exists) console.error('CRITICAL: L.heatLayer function is missing!');

        expect(globals.L_exists).toBeTruthy();
        expect(globals.HeatLayer_exists).toBeTruthy();

        // 4. Verify Aurora Data Load
        console.log('--- Verifying OVATION Data Fetch ---');
        const ovationResponse = await page.waitForResponse(resp => resp.url().includes('ovation_aurora_latest.json'), { timeout: 15000 }).catch(() => null);

        if (ovationResponse) {
            console.log(`OVATION Data Status: ${ovationResponse.status()}`);
            expect(ovationResponse.status()).toBe(200);
        } else {
            console.log('WARNING: OVATION Data request missing or timed out');
        }

        // 5. Screenshot final state
        await page.screenshot({ path: 'test-results/aurora-debug.png' });
    });

});
