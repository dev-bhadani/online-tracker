import {scrapeOnlineUsers} from "./studip-scraper";

// Runs the scraper in a visible, slowed-down browser and prints the result. Nothing is written to the DB.
(async () => {
    console.log('Scraping Stud.IP (headed, no DB writes)...');
    const users = await scrapeOnlineUsers({headless: false, slowMo: 500});
    console.log(`Found ${users.length} online user(s)`);
    console.table(users);
})();
