/*
    Module with database functions for interacting with Group objects.

    If found, will return a Group object with the following fields:
    {
        group_id: primary key
	    name: group name
	    usernames: array of usernames 
	    todos: array of todos
    }
*/

const db = require("../database");

const Todo = require("./Todo");

function findByGroupID(group_id) {
  return db
    .one("SELECT * FROM projectgroups WHERE group_id = $1", group_id)
    .then(g => {
      return new Promise(async (resolve, reject) => {
        try {
          const user_ids = await db.map(
            "SELECT user_id FROM group_users WHERE group_id = $1",
            group_id,
            row => row.user_id
          );
          const todos = await db.any(
            "SELECT * FROM todos WHERE todo_id IN (SELECT todo_id FROM group_todos WHERE group_id = $1)",
            group_id
          );
          g.user_ids = user_ids;
          g.todos = todos;
          resolve(g);
        } catch (err) {
          console.error(`Error fetching group ${group_id}`);
          reject(err);
        }
      });
    });
}

function insert(group) {
  return db
    .tx(t => {
      return t
        .one(
          "INSERT INTO projectgroups (name) VALUES ($1) RETURNING group_id",
          group.name
        )
        .then(row => {
          group.group_id = row.group_id;
          return t.none(
            "INSERT INTO group_users (group_id, user_id) VALUES ($1, $2)",
            [group.group_id, group.user_ids[0]]
          );
        });
    })
    .then(() => findByGroupID(group.group_id));
}

function insertUserID(group_id, user_id) {
  return db.none('INSERT INTO group_users (group_id, user_id) VALUES ($1, $2)', [group_id, user_id])
  .then(() => {
    db.one('SELECT * FROM group_users WHERE group_id = $1 AND user_id = $2', [group_id, user_id])
  });
}

function updateName(group_id, name) {
  return db
    .none("UPDATE projectgroups SET name = $1 WHERE group_id = $2", [
      name,
      group_id
    ])
    .then(() => findByGroupID(group_id));
}

function remove(group_id) {
  return db.tx(t => {
    return t
      .none("DELETE FROM projectgroups WHERE group_id = $1", group_id)
      .then(() =>
        t.batch([
          t.none("SELECT * FROM projectgroups WHERE group_id = $1", group_id),
          t.none("SELECT * FROM group_users WHERE group_id = $1", group_id)
        ])
      );
  });
}

function removeUserID(group_id, user_id) {
  return db.tx(t => {
    return t
      .none("DELETE FROM group_users WHERE (group_id = $1 AND user_id = $2)", [group_id, user_id])
      .then(() => {
        t.none("SELECT * FROM group_users WHERE (group_id = $1 AND user_id = $2)", [group_id, user_id]);
      });
  });
}

function _getUserIDs(group_id) {
  return db.any(
    "SELECT user_id FROM group_users WHERE group_id = $1",
    group_id
  );
}

async function _attachUserIDs(group) {
  try {
    const user_ids = await _getUserIDs(group.group_id);
    group.user_ids = user_ids;
  } catch (err) {
    console.error(`Error fetching users for group ${group.group_id}`);
    console.error(err);
  }
  return group;
}

module.exports = {
  findByGroupID: findByGroupID,
  insert: insert,
  insertUserID: insertUserID,
  updateName: updateName,
  remove: remove,
  removeUserID: removeUserID
};
