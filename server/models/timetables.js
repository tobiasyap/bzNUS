const db = require('../database');

function getTimetable(timetableurl) {
    return db.one('SELECT * FROM timetableurl_timetables WHERE timetableurl = $1', timetableurl);
}

function insertTimetable(timetableurl, timetable) {
    return db.none('INSERT INTO timetableurl_timetables(timetableurl, timetable) VALUES(${url}, ${tt})', {
        url: timetableurl,
        tt: timetable
    });
}

module.exports = {
    getTimetable: getTimetable,
    insertTimetable: insertTimetable
};
