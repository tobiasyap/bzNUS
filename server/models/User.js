/**
 * Module with database functions for interacting with User objects.
 */

const db = require('../database');

function findByUsername(username) {
    return db.one('SELECT * FROM users WHERE username = $1', username);
}

function findByNusnetID(nusnet_id) {
    const query = 'SELECT * FROM users WHERE username = (SELECT username FROM nusnet_id_username WHERE nusnet_id = $1)';
    return db.oneOrNone(query, nusnet_id);
}

module.exports = {
    findByUsername: findByUsername,
    findByNusnetID: findByNusnetID
};
