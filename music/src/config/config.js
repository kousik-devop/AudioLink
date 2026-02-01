import {config as dotenvConfig} from 'dotenv';

dotenvConfig();

const config = {
    PORT: process.env.PORT || 5002,
    MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017/musicdb',
    JWT_SECRET: process.env.JWT_SECRET,
    AWS_REGION: process.env.AWS_REGION,
    AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY
}

export default config;