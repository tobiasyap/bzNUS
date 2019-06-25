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
                    const usernames = await db.any('SELECT username FROM group_users WHERE group_id = $1', group_id);
                    const todos = await db.any('SELECT * FROM todos WHERE todo_id = SELECT todo_id FROM group_todos WHERE group_id = $1', group_id);
                    g.usernames = usernames;
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
            INSERT INTO group_users (group_id, username) 
                VALUES (INSERT INTO projectgroups (group_name) VALUES ($1) RETURNING group_id, $2)
                RETURNING group_id;`, 
        group.name, group.usernames[0]
    );
}

function insertUsername(group_id, username) {
    return db.one(
        `BEGIN;
        INSERT INTO group_users (group_id, username) VALUES ($1, $2);
        SELECT * FROM group_users WHERE group_id = $1 AND username = $2;
        COMMIT;`,
        group_id, username
    );
}

module.exports = {
    findByGroupID: findByGroupID,
    insert: insert,
    insertUsername: insertUsername
};
