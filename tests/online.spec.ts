import {login, scrapePage, OnlineUser} from '../src/scraper';
import {upsertLatestLogin, disconnectDB} from '../src/db';
import {expect, test} from "playwright/test";

test.describe('StudIP – Who is online', () => {
    test('scrapes all pages & persists', async ({page}) => {
        await login(page);
        await page.getByRole('link', {name: 'Who is online?'}).click();

        const allUsers: OnlineUser[] = [];
        for (let i = 0; ; i++) {
            const pageUsers = await scrapePage(page, i);
            allUsers.push(...pageUsers);
            const hasNext = await page.$('.pagination li.next a');
            if (!hasNext) break;
        }

        for (const {username, fullName} of allUsers) {
            await upsertLatestLogin(username, fullName);
        }

        await disconnectDB();
        console.log('Online users scraped and stored:', allUsers.length);
        expect(allUsers.length).toBeGreaterThan(0);
    });
});
