/*
    This file is adapted from nusmodifications/nusmods/website/src/utils/timetables.ts
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

function parseModuleConfig(serialized) {
    const config = {};
    if(!serialized) return config;

    Object.entries(serialized).forEach((serializedModule) => {
        const [moduleCode, serializedConfig] = serializedModule;
        config[moduleCode] = {};
        console.log(serializedConfig);
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

function deserializeTimetable(serialized) {
    const timetable = qs.parse(serialized);
    return parseModuleConfig(timetable);
}

module.exports.deserializeTimetable = deserializeTimetable;