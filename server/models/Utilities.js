const db = require('../database');

function getNow() {
    return db.one('SELECT NOW()');
}

module.exports = {
    getNow: getNow
};