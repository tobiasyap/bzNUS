/**
 * Module with database functions for interacting with Timetable objects.
 */

const db = require('../database');

function findByTimetableUrl(timetableurl) {
    return db.one('SELECT * FROM timetableurl_timetables WHERE timetableurl = $1', timetableurl);
}

function insert(t) {
    return db.none('INSERT INTO timetableurl_timetables (timetableurl, timetable) VALUES (${url}, ${tt})', {
        url: t.timetableurl,
        tt: t.timetable
    });
}

module.exports = {
    findByTimetableUrl: findByTimetableUrl,
    insert: insert
};
