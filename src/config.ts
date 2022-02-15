// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

export default {
  port: process.env.PORT,
  mongoUrl: process.env.MONGO_URL,
  jwt: {
    secretKey: 'YoMan',
    tokenExpirationTime: 123,
  },
};
