
import { test, expect } from '@playwright/test';

test('verify forecast mode timeline and kp display', async ({ page }) => {
    // 1. Load Page with explicit error handling
    console.log('Navigating to http://aurora-web:80 ...');
    try {
        await page.goto('http://aurora-web:80', { timeout: 10000 });
    } catch (e) {
        throw new Error(`NAVIGATION FAILED: ${e.message}`);
    }

    // 2. Initial State
    page.on('console', msg => console.log('PAGE LOG:', msg.type(), msg.text()));
    page.on('pageerror', err => console.log('PAGE ERROR:', err.message));

    console.log('Page loaded. Title:', await page.title());
    const content = await page.content();
    console.log('Page content length:', content.length);

    if (content.length < 500) {
        console.log('PAGE CONTENT DUMP:', content);
    } else {
        console.log('Checking for #timeline-slider in content:', content.includes('id="timeline-slider"'));
    }

    const forecastLabel = page.locator('#forecast-time-display');
    await expect(forecastLabel).toContainText('Forecast: Live');

    // 3. Move Slider
    console.log('Moving timeline slider...');
    const slider = page.locator('#timeline-slider');
    await expect(slider).toBeVisible();

    // Set slider to valid future value (e.g. 3 hours)
    // Input range is typically 0 to 6
    await slider.fill('3');
    // Trigger change event just in case
    await slider.dispatchEvent('input');
    await slider.dispatchEvent('change');

    // 4. Verify Updates
    console.log('Waiting for "Forecast for:" text...');
    try {
        // Text should change from "Live" to "Forecast for:"
        await expect(forecastLabel).toContainText('Forecast for:', { timeout: 10000 });
        console.log('SUCCESS: "Forecast for:" found.');

        // Check for Kp estimate
        console.log('Waiting for "(Est. Kp:" text...');
        await expect(forecastLabel).toContainText('(Est. Kp:', { timeout: 10000 });
        console.log('SUCCESS: Kp estimate found.');
    } catch (e) {
        const text = await forecastLabel.textContent();
        console.log('FAILURE: Current label text:', text);
        throw e;
    }

    const text = await forecastLabel.textContent();
    console.log('Final Forecast Label:', text);
});
