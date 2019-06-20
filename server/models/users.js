/**
 * Module with database functions for interacting with User objects.
 */

const db = require('../database');

function getUser(username) {
    return db.one('SELECT * FROM users WHERE username = $1', username);
}

module.exports = {
    getUser: getUser
};
