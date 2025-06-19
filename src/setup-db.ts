import {readFileSync} from 'fs';
import {Client} from 'pg';
import {config} from './config';

(async () => {
    const client = new Client({
        connectionString: config.db.url,
        ssl: {rejectUnauthorized: false},
    });

    await client.connect();

    const checkTableQuery = `
        SELECT EXISTS (SELECT
                       FROM information_schema.tables
                       WHERE table_name = 'user_logins') AS table_exists;
    `;

    const res = await client.query(checkTableQuery);
    const tableExists = res.rows[0]?.table_exists;

    if (!tableExists) {
        const sql = readFileSync('./init.sql', 'utf8');
        await client.query(sql);
        console.log('Supabase schema created (user_logins table)');
    } else {
        console.log('Supabase schema already exists (user_logins table)');
    }

    await client.end();
})();
