const puppeteer = require('puppeteer');
const qs = require('query-string');

async function scrape(shareurl) {
    console.log(`Received url ${shareurl}`);
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(shareurl);
    await browser.close();
    return qs.parseUrl(page.url()).query;
}

module.exports = scrape;