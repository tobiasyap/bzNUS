/**
 * Module containing functions for interacting with the NUSMods API.
 */

const rp = require('request-promise');

/**
 * Retrieves the serialized form of a user's timetable by following the share 
 * URL given by NUSMods' Share/Sync button. The short share URL redirects to a
 * long URL containing the serialized timetable encoded as a query string, which 
 * is then extracted.
 * @param {string} shareurl - URL obtained by clicking NUSMods' Share/Sync button
 * @returns {string} - Serialized query string representation of timetable
 */
async function getSerializedTimetable(shareurl) {
    const options = {
        url: shareurl,
        transform: (body, response) => {
            return response;
        }
    };
    const response = await rp(options);
    const serialized = response.request.uri.query;
    return serialized;
}

/**
 * Retrieves detailed info about the given module from the NUSMods API.
 * @param {string} year - Academic year in '20XX-20YY' format.
 * @param {string} moduleCode - Module code in standard format.
 * @returns {string} - JSON object with module info. See
 *      https://api.nusmods.com/v2/#/Modules for details. 
 */
function getModule(year, moduleCode) {
    const options = {
        uri: `http://api.nusmods.com/v2/${year}/modules/${moduleCode}.json`,
        json: true
    };
    console.log(`Fetching module from ${options.uri}`);
    const response = rp(options);
    return response;
}

module.exports.getSerializedTimetable = getSerializedTimetable;
module.exports.getModule = getModule;
