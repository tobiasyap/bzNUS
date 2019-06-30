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

const db = require('../database');

const Todo = require('./Todo');

function findByGroupID(group_id) {
    return db.one('SELECT * FROM projectgroups WHERE group_id = $1', group_id)
        .then((g) => {
            return new Promise(async (resolve, reject) => {
                try {
                    const user_ids = await db.any('SELECT user_id FROM group_users WHERE group_id = $1', group_id);
                    const todos = await db.any('SELECT * FROM todos WHERE todo_id = SELECT todo_id FROM group_todos WHERE group_id = $1', group_id);
                    g.user_ids = user_ids;
                    g.todos = todos;
                    resolve(g);
                }
                catch(err) {
                    console.error(`Error fetching group ${group_id}`);
                    reject(err);
                }
            });
        });
}

function insert(group) {
    return db.one(
        `SELECT * FROM projectgroups WHERE group_id = 
            INSERT INTO group_users (group_id, user_id) 
                VALUES (INSERT INTO projectgroups (group_name) VALUES ($1) RETURNING group_id, $2)
                RETURNING group_id;`, 
        group.name, group.user_ids[0]
    );
}

function insertUserID(group_id, user_id) {
    return db.one(
        `BEGIN;
        INSERT INTO group_users (group_id, user_id) VALUES ($1, $2);
        SELECT * FROM group_users WHERE group_id = $1 AND user_id = $2;
        COMMIT;`,
        group_id, user_id
    );
}

function updateName(group_id, name) {
    return db.tx(t => {
        return t.batch([
            t.none('UPDATE projectgroups SET name = $1 WHERE group_id = $2', name, group_id),
            t.one('SELECT * FROM projectgroups WHERE group_id = $1', group_id)
        ]);
    });
}

function remove(group_id) {
    return db.tx(t => {
        return t.batch([
            t.none('DELETE FROM projectgroups WHERE group_id = $1', group_id),
            t.none('SELECT * FROM projectgroups WHERE group_id = $1', group_id),
            t.none('SELECT * FROM group_users WHERE group_id = $1', group_id)
        ]);
    });
}

function removeUserID(user_id) {
    return db.tx(t => {
        return t.batch([
            t.none('DELETE FROM group_users WHERE user_id = $1', user_id),
            t.none('SELECT * FROM group_users WHERE user_id = $1', user_id)
        ]);
    });
}

module.exports = {
    findByGroupID: findByGroupID,
    insert: insert,
    insertUserID: insertUserID,
    updateName: updateName,
    remove: remove,
    removeUserID: removeUserID,
};
