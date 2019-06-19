const rp = require('request-promise');

/**
 * Retrieves the serialized form of a user's timetable by following the share 
 * URL given by NUSMods' Share/Sync button. The short share URLr edirects to a
 * URL containing the serialized timetable; the function then extracts that 
 * query string.
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
