import 'dotenv/config'

// Retrieve configuration values from environment variables
export default () => ({
  host: process.env.HOST,
  port: Number(process.env.PORT),
  limitCount: Number(process.env.LIMIT_COUNT),
  saltRounds: Number(process.env.SALT_ROUNDS),
  dbType: process.env.DB_TYPE,
  dbHost: process.env.DB_HOST,
  dbPort: Number(process.env.DB_PORT),
  dbUser: process.env.DB_USER,
  dbPass: process.env.DB_PASS,
  dbName: process.env.DB_NAME,
})
