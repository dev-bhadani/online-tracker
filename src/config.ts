import * as dotenv from 'dotenv';

dotenv.config();

export const config = {
    db: {
        url: process.env.SUPABASE_DB_URL!,
    },
    studip: {
        url: process.env.STUDIP_URL!,
        user: process.env.STUDIP_USER!,
        pass: process.env.STUDIP_PASS!,
    },
};
