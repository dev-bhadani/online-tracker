import {defineConfig} from "playwright/test";
import {devices} from "playwright";

export default defineConfig({
    testDir: './tests',
    testMatch: ['**/*.setup.ts', '**/*.spec.ts'],
    outputDir: 'test-results',
    reporter: [
        ['html', {outputFolder: 'playwright-report', open: 'never'}],
        // ['junit', {outputFile: 'test-results/results.xml'}],
        // ['allure-playwright'],
    ],
    fullyParallel: false,
    forbidOnly: !!process.env.CI,
    retries: 0,
    workers: 1,
    use: {
        trace: 'on-first-retry',
        video: {
            mode: 'on-first-retry',
            size: {width: 2560, height: 1440},
        }
    },
    projects: [
        {
            name: 'chromium',
            use: {
                ...devices['Desktop Chrome'],
                // deviceScaleFactor: undefined,
                viewport: {width: 2560, height: 1440},
                // viewport: null,
                launchOptions: {
                    headless: true,
                    args: ["--start-maximized"],
                }
            },
        },
    ]
});
