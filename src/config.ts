import * as fs from 'fs';
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

export default {
  port: process.env.PORT,
  mongoUrl: process.env.MONGO_URL,
  apiUrl: process.env.API_URL,
  jwt: {
    secretKey: process.env.JWT_SECRET_KEY,
    expirationTime: Number(process.env.JWT_EXP),
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
};
