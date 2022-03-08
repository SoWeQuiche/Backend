import * as fs from 'fs';
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

export default {
  port: process.env.PORT,
  mongoUrl: process.env.MONGO_URL,
  apiUrl: process.env.API_URL,
  frontUrl: process.env.FRONT_URL,
  jwt: {
    secretKey: process.env.JWT_SECRET_KEY,
    expirationTime: Number(process.env.JWT_EXP),
    refreshExpirationTime: Number(process.env.REFRESH_EXP),
  },
  swa: {
    teamId: process.env.SWA_TEAM_ID,
    appId: process.env.SWA_APP_ID,
    serviceId: process.env.SWA_SERVICE_ID,
    keyId: process.env.SWA_KEY_ID,
    certKey: fs.readFileSync('swa.key', 'utf8'),
  },
  aws: {
    id: process.env.AWS_ID,
    secret: process.env.AWS_SECRET,
    bucketName: process.env.AWS_BUCKET_NAME,
  },
  mail: {
    host: process.env.EMAIL_SMTP_HOST,
    port: process.env.EMAIL_SMTP_PORT,
    user: process.env.EMAIL_SMTP_USER,
    password: process.env.EMAIL_SMTP_PASSWORD,
    secure: process.env.EMAIL_SMTP_SECURE,
    from: process.env.EMAIL_FROM,
  },
};
