import { test, expect } from '@playwright/test';

test.describe('Phase 1.5: The Northern Upgrade', () => {

    test('TC-04: Sledgehammer Alert (Ground Truth Override)', async ({ page }) => {
        console.log('Test 4: Setting up Substorm Mock...');

        // 1. Mock TGO with EXTREME activity
        await page.route('**/*flux.phys.uit.no/last_hour.txt', async (route: any) => {
            await route.fulfill({
                json: {
                    h: 12000,
                    d: 2,
                    z: 52000,
                    db_dt: 55.5 // > 40 Trigger Threshold
                }
            });
        });

        // 2. Mock OpenMeteo with BAD weather (100% Clouds)
        // Normal logic would say "STAY". Sledgehammer should override.
        await page.route('**/*api.open-meteo*', async (route: any) => {
            const times = [];
            const covers = [];
            const now = Date.now();
            for (let i = 0; i < 48; i++) {
                times.push(new Date(now + i * 3600000).toISOString());
                covers.push(100); // 100% Clouds
            }
            await route.fulfill({
                json: {
                    current: { cloud_cover: 100 },
                    hourly: { time: times, cloud_cover: covers }
                }
            });
        });

        // 3. Mock NOAA (Quiet, to prove override works)
        await page.route('**/*noaa-planetary-k-index.json', async (route: any) => {
            const mockData = [
                ["time", "kp", "a", "count"],
                [new Date().toISOString(), "2.00", "0", "1"]
            ];
            await route.fulfill({ json: mockData });
        });

        // 4. Visit App
        console.log('Test 4: Visiting Landing Page...');
        await page.goto('/');

        // 5. Assertions
        console.log('Test 4: Checking for Sledgehammer Alert...');

        // Status should be GO despite clouds/low Kp
        const decision = page.locator('h2', { hasText: 'GO' });
        await expect(decision).toBeVisible({ timeout: 15000 });

        // Description should mention "SUBSTORM"
        const desc = page.locator('text=MAGNETIC SUBSTORM DETECTED');
        await expect(desc).toBeVisible();

        console.log('Test 4: Passed! Ground Truth overrode Satellite + Clouds.');
    });

});
