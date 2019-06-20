/*
    Module containing utilities for working with timetables in various formats.
    Parts of this file are adapted from 
    https://github.com/nusmodifications/nusmods/blob/42222559f411cdd7b3e0e157943435313202a7ea/website/src/utils/timetables.ts
*/

const qs = require('query-string');

const LESSON_TYPE_ABBREV = {
    'Design Lecture': 'DLEC',
    Laboratory: 'LAB',
    Lecture: 'LEC',
    'Packaged Lecture': 'PLEC',
    'Packaged Tutorial': 'PTUT',
    Recitation: 'REC',
    'Sectional Teaching': 'SEC',
    'Seminar-Style Module Class': 'SEM',
    Tutorial: 'TUT',
    'Tutorial Type 2': 'TUT2',
    'Tutorial Type 3': 'TUT3',
    Workshop: 'WS',
};

// Reverse lookup map of LESSON_TYPE_ABBREV
const LESSON_ABBREV_TYPE = invertObject(LESSON_TYPE_ABBREV);
  
const LESSON_TYPE_SEP = ':';
const LESSON_SEP = ',';

function invertObject(obj) {
    const ret = {};
    Object.keys(obj).forEach((key) => {
        ret[obj[key]] = key;
    });
    return ret;
}

/**
 * Parses the given query string into an object containing classNos for each
 * module in the timetable.
 * @param {string} serialized - Serialized timetable in query string format.
 * @returns {Object} - Object containing the timings for each module in the
 *     timetable in classNo format.
 */
function parseModuleConfig(serialized) {
    const config = {};
    if(!serialized) return config;

    Object.entries(serialized).forEach((serializedModule) => {
        const [moduleCode, serializedConfig] = serializedModule;
        config[moduleCode] = {};
        serializedConfig.split(LESSON_SEP).forEach((lesson) => {
            const [lessonTypeAbbr, classNo] = lesson.split(LESSON_TYPE_SEP);
            const lessonType = LESSON_ABBREV_TYPE[lessonTypeAbbr];
            // ignore unparseable/invalid keys
            if(!lessonType) return;
            config[moduleCode][lessonType] = classNo;
        });
    });

    return config;
}

/**
 * Converts the serialized timetable into an object containing timings for each
 * module in classNo format.
 * @param {string} serialized - Serialized timetable as a percent-encoded URL.
 * @returns {Object} - Object containing the timings for each module in the
 *     timetable in classNo format.
 */
function deserializeTimetable(serialized) {
    // Extract the query string from the URL
    const timetable = qs.parse(serialized);
    return parseModuleConfig(timetable);
}

/**
 * Returns an object containing the relevant class info for the given module.
 * The given codedTimes must correspond to valid classNos in moduleData, and
 * the module must be conducted in the given semester.
 * @param {Object} moduleData - Full JSON object containing all info for the
 *      desired object, obtained from the NUSMods API.
 * @param {number} semester - Number indicating the desired semester.
 * @param {Object} codedTimes - Object containing the timings for each module in 
 *     the timetable in classNo format.
 * @returns {Object} - An object with timings and other info about each 
 *     class taken.
 */
function decodeTimes(moduleData, semester, codedTimes) {
    const targetSem = moduleData.semesterData.find((s) => {
        return s.semester === semester;
    });
    let decodedTimes = [];
    for(const classNo of Object.values(codedTimes)) {
        // get the set of classes for this classNo group
        // e.g. lecture group 1 may have two lecture slots per week to attend
        const classData = targetSem.timetable.filter((c) => {
            return c.classNo === classNo;
        });
        for(data of classData) {
            decodedTimes.push(data);
        }
    }
    return decodedTimes;
}

module.exports.deserializeTimetable = deserializeTimetable;
module.exports.decodeTimes = decodeTimes;
