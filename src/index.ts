import {scrapeOnlineUsers} from "./studip-scraper";
import {closeStaleSessions, disconnectDB, startOrContinueSession, upsertLatestLogin} from "./db";

(async () => {
    console.log('Scraping Stud.IP...');
    const users = await scrapeOnlineUsers();
    console.log(`Found ${users.length} online user(s)`);

    for (const {username, fullName} of users) {
        await upsertLatestLogin(username, fullName);
        await startOrContinueSession(username);
    }

    await closeStaleSessions(users.map(u => u.username));
    await disconnectDB();
    console.log('Done');
})();
