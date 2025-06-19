import {config} from './config';
import {Page, chromium} from 'playwright';
import {expect} from 'playwright/test';

export type OnlineUser = {
    username: string;
    fullName: string;
};

export async function login(page: Page): Promise<void> {
    await page.goto(`${config.studip.url}/index.php`);
    await expect(page.getByRole('button', {name: 'English'})).toBeVisible();
    await page.getByRole('button', {name: 'English'}).click();

    await expect(page.getByRole('textbox', {name: 'Username*'})).toBeVisible();
    await page.getByRole('textbox', {name: 'Username*'}).fill(config.studip.user);

    await expect(page.getByRole('textbox', {name: 'Password* Show password'})).toBeVisible();
    await page.getByRole('textbox', {name: 'Password* Show password'}).fill(config.studip.pass);

    await expect(page.getByRole('button', {name: 'Login'})).toBeVisible();
    await page.getByRole('button', {name: 'Login'}).click();

    await expect(page.getByRole('link', {name: 'Who is online?'})).toBeVisible();
    await page.getByRole('link', {name: 'Who is online?'}).click();

    await expect(page.getByLabel('Sidebar').getByText('Who is online?')).toBeVisible();
}

export async function scrapePage(page: Page, pageIndex: number): Promise<OnlineUser[]> {
    const pagedUrl = `${config.studip.url}/dispatch.php/online?page=${pageIndex}`;
    await page.goto(pagedUrl, {waitUntil: 'domcontentloaded'});

    return await page.$$eval('#online_buddies tbody tr', rows =>
        rows
            .map(row => {
                const anchor = row.querySelector('td:nth-child(2) a');
                const href = anchor?.getAttribute('href') || '';
                const match = href.match(/username=([\w\-]+)/);
                const username = match ? match[1] : '';
                const fullName = anchor?.textContent?.trim() || '';
                return {username, fullName};
            })
            .filter(u => u.username !== '')
    );
}

export async function scrapeOnlineUsers(): Promise<OnlineUser[]> {
    const browser = await chromium.launch({headless: true});
    const page = await browser.newPage();

    await login(page);
    const allUsers: OnlineUser[] = [];
    let pageIndex = 0;

    while (true) {
        const users = await scrapePage(page, pageIndex);
        allUsers.push(...users);

        const hasNext = await page.$('.pagination li.next a');
        if (!hasNext) break;
        pageIndex++;
    }
    await expect(page.getByRole('button', { name: 'Profile menu' })).toBeVisible();
    await page.getByRole('button', { name: 'Profile menu' }).click();
    await page.getByRole('link', { name: 'Logout' }).click();
    await browser.close();
    return allUsers;
}
