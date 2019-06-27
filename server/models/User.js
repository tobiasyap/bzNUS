/*
    Module with database functions for interacting with User objects.

    If found, will return a User object with the following fields:
    {
        user_id: integer primary key
        nusnet_id: NUSNET ID 
        username: unique display name
        fullname: full name given by NUSNet OpenID. Shouldn’t need to modify.
        email:
        timetableurl: the share URL input by the user
        group_ids: array of group_ids 
    } 
*/

const db = require('../database');

function findByUserID(user_id) {
    return db.oneOrNone('SELECT * FROM users WHERE user_id = $1', user_id)
        .then((user) => user ? _attachGroupIDs(user) : null);
}

function findByNusnetID(nusnet_id) {
    return db.oneOrNone('SELECT * FROM users WHERE nusnet_id = $1', nusnet_id)
        .then((user) => user ? _attachGroupIDs(user) : null);
}

function insert(u) {
    return db.one(`INSERT INTO users (nusnet_id, username, fullname, email, timetableurl) 
        VALUES ($(nusnet_id), $(username), $(fullname), $(email), $(timetableurl)) RETURNING user_id`, {
            nusnet_id: u.nusnet_id,
            username: u.username,
            fullname: u.fullname,
            email: u.email,
            timetableurl: u.timetableurl
        })
        .then((user_id) => {
            return db.one('SELECT * FROM users WHERE user_id = $1', user_id);
        });
}

function _getGroupIDs(user_id) {
    return db.any('SELECT group_id FROM group_users WHERE user_id = $1', user_id);
}

async function _attachGroupIDs(user) {
    try {
        const group_ids = await _getGroupIDs(user.user_id);
        user.group_ids = group_ids;
    }
    catch(err) {
        console.error(`Error fetching groups for user ${user.user_id}`);
        console.error(err);
    }
    return user;
}

module.exports = {
    findByUserID: findByUserID,
    findByNusnetID: findByNusnetID,
    insert: insert
};
