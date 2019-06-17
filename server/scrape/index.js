const request = require('request-promise');

async function getSerializedTimetable(shareurl) {
    console.log(`Received url ${shareurl}`);
    const options = {
        url: shareurl,
        transform: (body, response) => {
            return response;
        }
    };
    const response = await request(options);
    const serialized = response.request.uri.query;
    return serialized;
}

module.exports = getSerializedTimetable;