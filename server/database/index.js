const pgp = require('pg-promise')({});

// Database connection details
const cn = {
    host: 'localhost',
    port: 5432,
    database: 'bznus-db',
    user: 'postgres',
    password: 'devpassword'
};
const CONNECTION_STRING = process.env.DATABASE_URL 
    || 'postgresql://postgres:postgres@localhost:5432/bznus-db';
const SSL = process.env.NODE_ENV === 'production';

const db = pgp(cn);

module.exports = db;
