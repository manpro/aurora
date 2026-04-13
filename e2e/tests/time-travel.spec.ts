
import { test, expect } from '@playwright/test';

test.describe('Aurora Time Travel - Network Verification', () => {
    test.beforeEach(async ({ page }) => {
        // App running on port 34370 per previous discovery
        await page.goto('http://localhost:34370');
        // Ensure map is loaded before testing
        await page.waitForSelector('.leaflet-container', { state: 'visible', timeout: 30000 });
    });

    test('WMS Request contains TIME parameter on slider change', async ({ page }) => {
        // 1. Enable Cloud Layer to ensure requests are actually made
        // Open layers menu
        await page.click('button[aria-label="Map Layers"]');
        // Click the toggle (assuming generic switch logic, or specific ID)
        await page.click('#cloud-toggle');

        // 2. Setup Network Interception
        // We expect a request to Met.no WMS when we change the time
        // Note: The WMS layer might fire immediately on enable, so we define the promise BEFORE the slider move
        const wmsRequestPromise = page.waitForRequest(request =>
            request.url().includes('wms.met.no') &&
            request.url().includes('TIME=')
        );

        // 3. Move slider to +3h
        const slider = page.locator('#timeline-slider');
        await slider.evaluate((el: HTMLInputElement) => {
            el.value = '3';
            el.dispatchEvent(new Event('input', { bubbles: true }));
            el.dispatchEvent(new Event('change', { bubbles: true }));
        });

        // 4. Await the specific WMS request triggered by the slider change
        // Increasing timeout slightly to be safe
        const request = await wmsRequestPromise.catch(() => null);

        if (!request) {
            throw new Error('Timeout waiting for WMS request to met.no');
        }

        const url = request.url();
        console.log(`[TEST] Intercepted WMS URL: ${url}`);

        // 5. Verification
        expect(url).toContain('service=WMS');
        expect(url).toContain('TIME=');

        // Extract time param and verify format
        // The implementation rounds to nearest hour: YYYY-MM-DDTHH:00:00.000Z
        const urlObj = new URL(url);
        const timeParam = urlObj.searchParams.get('time');

        console.log(`[TEST] Extracted TIME param: ${timeParam}`);

        expect(timeParam).toBeTruthy();
        // Regex for ISO string ending in :00:00.000Z (roughly)
        // Matches: 2026-01-24T15:00:00.000Z
        expect(timeParam).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:00:00\.\d{3}Z$/);
    });
});
