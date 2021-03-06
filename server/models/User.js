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

const db = require("../database");

function findByUserID(user_id) {
  return db
    .one("SELECT * FROM users WHERE user_id = $1", user_id)
    .then(user => (user ? _attachGroupIDs(user) : null));
}

function findByNusnetID(nusnet_id) {
  return db
    .one("SELECT * FROM users WHERE nusnet_id = $1", nusnet_id)
    .then(user => (user ? _attachGroupIDs(user) : null));
}

function findByUsername(username) {
  return db
    .one("SELECT * FROM users WHERE username = $1", username)
    .then(user => (user ? _attachGroupIDs(user) : null));
}

function insert(u) {
  return db
    .one(
      `INSERT INTO users (nusnet_id, username, fullname, email, timetableurl) 
        VALUES ($(nusnet_id), $(username), $(fullname), $(email), $(timetableurl)) RETURNING user_id`,
      {
        nusnet_id: u.nusnet_id,
        username: u.username,
        fullname: u.fullname,
        email: u.email,
        timetableurl: u.timetableurl
      }
    )
    .then(user => {
      return db.one("SELECT * FROM users WHERE user_id = $1", user.user_id);
    });
}

function update(u) {
  return db
    .oneOrNone("SELECT * FROM users WHERE username = $1", u.username)
    .then(cu => {
      if (cu && cu.user_id !== u.user_id) {
        throw new Error("Username already in use");
        return;
      }
    })
    .then(() => {
      return db.tx(t => {
        return t
          .none(
            `UPDATE users SET username = $(username), fullname = $(fullname),
                        email = $(email), timetableurl = $(timetableurl) WHERE user_id = $(user_id)`,
            {
              username: u.username,
              fullname: u.fullname,
              email: u.email,
              timetableurl: u.timetableurl,
              user_id: u.user_id
            }
          )
          .then(() => {
            return t.one("SELECT * FROM users WHERE user_id = $1", u.user_id);
          });
      });
    })
    .then(user => _attachGroupIDs(user));
}

function updateTimetableURL(user_id, timetableurl) {
  return db
    .tx(t => {
      return t
        .none("UPDATE users SET timetableurl = $1 WHERE user_id = $2", [
          timetableurl,
          user_id
        ])
        .then(() => t.one("SELECT * FROM users WHERE user_id = $1", user_id));
    })
    .then(user => _attachGroupIDs(user));
}

function _getGroupIDs(user_id) {
  return db.map(
    "SELECT group_id FROM group_users WHERE user_id = $1",
    user_id,
    row => row.group_id
  );
}

async function _attachGroupIDs(user) {
  try {
    const group_ids = await _getGroupIDs(user.user_id);
    user.group_ids = group_ids;
  } catch (err) {
    console.error(`Error fetching groups for user ${user.user_id}`);
    console.error(err);
  }
  return user;
}

module.exports = {
  findByUserID: findByUserID,
  findByNusnetID: findByNusnetID,
  findByUsername: findByUsername,
  insert: insert,
  update: update,
  updateTimetableURL: updateTimetableURL
};
