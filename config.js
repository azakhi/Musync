const env = process.env.NODE_ENV || "dev";

const dev = {
  db: {
    host: process.env.DEV_DB_HOST || 'localhost',
    port: parseInt(process.env.DEV_DB_PORT) || 27017,
    name: process.env.DEV_DB_NAME || 'musync',
    user: process.env.DEV_DB_USER || '',
    pass: process.env.DEV_DB_PASS || ''
  }
};

const test = {
  db: {
    host: process.env.TEST_DB_HOST || 'localhost',
    port: parseInt(process.env.TEST_DB_PORT) || 27017,
    name: process.env.TEST_DB_NAME || 'musync_test',
    user: process.env.TEST_DB_USER || '',
    pass: process.env.TEST_DB_PASS || ''
  }
};

const config = {
  dev,
  test
};

module.exports = config[env];