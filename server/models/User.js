/*
    Module with database functions for interacting with User objects.

    If found, will return a User object with the following fields:
    {
        nusnet: NUSNET ID 
        username: unique display name primary key
        fullname: full name given by NUSNet OpenID. Shouldn’t need to modify.
        email:
        timetableurl: the share URL input by the user
        group_ids: array of group_ids 
    } 
*/

const db = require('../database');

function findByUsername(username) {
    return db.one('SELECT * FROM users WHERE username = $1', username)
        .then((user) => {
            return new Promise(async (resolve, reject) => {
                try {
                    const group_ids = await _getGroupIDs(username);
                    const nusnet_id = await db.oneOrNone('SELECT nusnet_id FROM nusnet_id_username WHERE username = $1', username);
                    user.group_ids = group_ids;
                    user.nusnet_id = nusnet_id;
                    resolve(user);
                }
                catch(err) {
                    console.error(`Error fetching user ${username}`);
                    reject(err);
                }
            });
        });
}

function findByNusnetID(nusnet_id) {
    const query = 'SELECT * FROM users WHERE username = (SELECT username FROM nusnet_id_username WHERE nusnet_id = $1)';
    return db.one(query, nusnet_id)
        .then((user) => {
            return new Promise(async (resolve, reject) => {
                try {
                    const group_ids = await _getGroupIDs(user.username);
                    user.nusnet_id = nusnet_id;
                    user.group_ids = group_ids;
                    resolve(user);
                }
                catch(err) {
                    console.error(`Error fetching user with NUSNET ID ${nusnet_id}`);
                    reject(err);
                }
            });
        });
}

function _getGroupIDs(username) {
    return db.any('SELECT group_id FROM group_users WHERE username = $1', username);
}

module.exports = {
    findByUsername: findByUsername,
    findByNusnetID: findByNusnetID
};
