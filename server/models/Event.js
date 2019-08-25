/*
    Module with database functions for interacting with Event objects.

    If found, will return an Event object with the following fields:
    {
      event_id: primary key 
	    title:
      description:
      minutes:
      start_timestamp:
      end_timestamp:
    }
*/

const db = require("../database");

function findByEventID(event_id) {
  return db.one("SELECT * FROM events WHERE event_id = $1", event_id);
}

function findByGroupID(group_id) {
  return db.any(
    "SELECT * FROM events WHERE event_id IN (SELECT event_id FROM group_events WHERE group_id = $1)",
    group_id
  );
}

function findByGroupIDTimes(group_id, start_timestamp, end_timestamp) {
  return db.any(
    "SELECT * FROM events WHERE (event_id IN (SELECT event_id FROM group_events WHERE group_id = $1) AND (start_timestamp >= $2 AND start_timestamp <= $3))",
    [group_id, start_timestamp, end_timestamp]
  );
}

function insert(group_id, event) {
  return db.tx(t => {
    t.one(
      "INSERT INTO events (title, description, minutes, start_timestamp, end_timestamp) VALUES ($1, $2, $3, $4, $5) RETURNING event_id",
      [
        event.title,
        event.description,
        event.minutes,
        event.start_timestamp,
        event.end_timestamp
      ]
    )
      .then(row => {
        t.none(
          "INSERT INTO group_events (group_id, event_id) VALUES ($1, $2)",
          [group_id, row.event_id]
        );
        return row.event_id;
      })
      .then(event_id => {
        return t.one("SELECT * FROM events WHERE event_id = $1", event_id);
      });
  });
}

function update(event) {
  return db.tx(t => {
    t.none(
      "UPDATE events SET title = $1, description = $2, minutes = $3, start_timestamp = $4, end_timestamp = $5 WHERE event_id = $6",
      [
        event.title,
        event.description,
        event.minutes,
        event.start_timestamp,
        event.end_timestamp,
        event.event_id
      ]
    ).then(() => {
      t.one("SELECT * FROM events WHERE event_id = $1", event.event_id);
    });
  });
}

function remove(event_id) {
  return db.tx(t => {
    t.none("DELETE * FROM events WHERE event_id = $1", event_id).then(() => {
      t.none("SELECT * FROM events WHERE event_id = $1", event_id);
      t.none("SELECT * FROM group_events WHERE event_id = $1", event_id);
    });
  });
}

module.exports = {
  findByEventID: findByEventID,
  findByGroupID: findByGroupID,
  findByGroupIDTimes: findByGroupIDTimes,
  insert: insert,
  update: update,
  remove: remove
};
