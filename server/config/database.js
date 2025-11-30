const Sequelize = require('sequelize');
require('dotenv').config(); // Load .env for local development

const sequelize = new Sequelize(
  process.env.DB_NAME || 'sustainability_db', // Use Render var OR local name
  process.env.DB_USER || 'root',              // Use Render var OR local user
  process.env.DB_PASS || '',                  // Use Render var OR local password
  {
    host: process.env.DB_HOST || 'localhost', // Use Render var OR local host
    dialect: 'mysql',
    port: process.env.DB_PORT || 3306,
    dialectOptions: {
      ssl: {
        require: true, // TiDB requires SSL
        rejectUnauthorized: false // Fix for some self-signed cert issues
      }
    },
    logging: false
  }
);

module.exports = sequelize;
