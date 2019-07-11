/**
 * Module with database functions for interacting with Timetable objects.
 */

const db = require("../database");

function findByTimetableUrl(timetableurl) {
  return db
    .one(
      "SELECT timetable FROM timetableurl_timetables WHERE timetableurl = $1",
      timetableurl
    )
    .then(row => row.timetable);
}

function insert(timetableurl, timetable) {
  return db.none(
    "INSERT INTO timetableurl_timetables (timetableurl, timetable) VALUES ($1, $2)",
    [timetableurl, timetable]
  );
}

module.exports = {
  findByTimetableUrl: findByTimetableUrl,
  insert: insert
};
