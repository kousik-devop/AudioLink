import {config as dotenvConfig} from 'dotenv';

dotenvConfig();

const _config = {
    MONGO_URI: process.env.MONGO_URI,
    JWT_SECRET: process.env.JWT_SECRET,
    GOOGLE_CLIENT_ID: process.env.CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.CLIENT_SECRET,
    CLOUDAMQP_URL: process.env.CLOUDAMQP_URL
}

export default _config;