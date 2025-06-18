import * as dotenv from 'dotenv';

dotenv.config();

export const config = {
    db: {
        host: process.env.DB_HOST!,
        port: parseInt(process.env.DB_PORT!),
        user: process.env.DB_USER!,
        password: process.env.DB_PASSWORD!,
        database: process.env.DB_NAME!,
    },
    studip: {
        url: process.env.STUDIP_URL!,
        user: process.env.STUDIP_USER!,
        pass: process.env.STUDIP_PASS!,
    },
};
