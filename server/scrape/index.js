const request = require('request-promise');
const qs = require('query-string');

async function scrape(shareurl) {
    console.log(`Received url ${shareurl}`);
    const options = {
        url: shareurl,
        transform: (body, response) => {
            return response;
        }
    };
    const response = await request(options);
    return qs.parse(response.request.uri.query);
}

module.exports = scrape;