/**
 * Module with database functions for interacting with Todo objects.
 */

const db = require('../database');

function findByGroupID(group_id) {
    return db.any('SELECT * FROM todos WHERE todo_id = SELECT todo_id FROM group_todos WHERE group_id = $1', group_id);
}

module.exports = {
    findByGroupID: findByGroupID
};
