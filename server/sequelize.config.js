require('dotenv').config();

module.exports = {
  dev: {
    url: process.env.POSTGRES_URI,
    dialect: 'postgres',       // ← обязательно!
  },
  prod: {
    url: process.env.POSTGRES_URI,
    dialect: 'postgres',       // ← обязательно!
  },
};
