import {scrapeOnlineUsers} from '../src/studip-scraper.js';
import {upsertLatestLogin, disconnectDB, logUserSession} from '../src/db.js';
import {expect, test} from "playwright/test";

test.describe('StudIP – Who is online', () => {
    test('scrapes all users and persists them', async () => {
        const allUsers = await scrapeOnlineUsers();
        for (const {username, fullName} of allUsers) {
            await upsertLatestLogin(username, fullName);
            await logUserSession(username);
        }
        await disconnectDB();
        console.log(`Scraped and stored ${allUsers.length} users`);
        expect(allUsers.length).toBeGreaterThan(0);
    });
});
