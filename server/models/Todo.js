/*
    Module with database functions for interacting with Todo objects.

    If found, will return a Todo object with the following fields:
    {
        todo_id: primary key 
	    title:
	    description:
	    created_at: creation timestamp
    }
*/

const db = require('../database');

function findByTodoID(todo_id) {
    return db.one('SELECT * FROM todos WHERE todo_id = $1', todo_id);
}

function findByGroupID(group_id) {
    return db.any('SELECT * FROM todos WHERE todo_id = SELECT todo_id FROM group_todos WHERE group_id = $1', group_id);
}

function insert(group_id, todo) {
    return db.one(
        `SELECT * FROM todos WHERE todo_id =
            INSERT INTO group_todos (group_id, todo_id) 
                VALUES ($1, INSERT INTO todos (title, description) VALUES ($2, $3) RETURNING todo_id)
                RETURNING todo_id`,
        [group_id, todo.title, todo.description]
    );
}

function update(todo) {
    return db.tx(t => {
        return db.batch([
            db.none('UPDATE todos SET title = $1, description = $2 WHERE todo_id = $3',
                [todo.title, todo.description, todo.todo_id]),
            db.one('SELECT * FROM todos WHERE todo_id = $1', todo.todo_id)
        ]);
    });
}

function remove(todo_id) {
    return db.tx(t => {
        return t.batch([
            db.none('DELETE FROM todos WHERE todo_id = $1', todo_id),
            db.none('SELECT * FROM todos WHERE todo_id = $1', todo_id),
            db.none('SELECT * FROM group_todos WHERE todo_id = $1', todo_id)
        ]);
    });
}

module.exports = {
    findByTodoID: findByTodoID,
    findByGroupID: findByGroupID,
    insert: insert,
    update: update,
    remove: remove,
};
