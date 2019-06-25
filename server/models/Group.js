/**
 * Module with database functions for interacting with Group objects.
 */

const db = require('../database');

const Todo = require('./Todo');

function findByGroupID(group_id) {
    return db.one('SELECT * FROM projectgroups WHERE group_id = $1', group_id)
        .then((g) => {
            return new Promise(async (resolve, reject) => {
                try {
                    const usernames = await db.any('SELECT username FROM group_users WHERE group_id = $1', group_id);
                    const todo_ids = await db.any('SELECT todo_id FROM group_todos WHERE group_id = $1', group_id);
                    g.usernames = usernames;
                    g.todo_ids = todo_ids;
                    resolve(g);
                }
                catch(err) {
                    console.error(`Error fetching group ${group_id}`);
                    reject(err);
                }
            });
        });
}

module.exports = {
    findByGroupID: findByGroupID
};
