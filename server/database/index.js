/**
 * Module for connecting to and returning the PostgreSQL database.
 */

const pgp = require("pg-promise")({});

// Database connection details
const localConnection = {
  host: "localhost",
  port: 5432,
  database: "bznus-db",
  user: "postgres",
  password: "devpassword"
};
const connection =
  process.env.NODE_ENV === "production"
    ? process.env.DATABASE_URL
    : localConnection;
const SSL = process.env.NODE_ENV === "production";

const db = pgp(connection);

module.exports = db;
