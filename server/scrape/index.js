const puppeteer = require('puppeteer');

async function scrape(shareurl) {
    console.log(`Received url ${shareurl}`);
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(shareurl);
    
    const timetableurl = await page.evaluate(() => {
        // The dropdown menu will either have id=downshift-0 or id=downshift1. Try both
        const element0 = document.getElementById("downshift-0-item-0");
        const element1 = document.getElementById("downshift-1-item-0");
        return element0 ? element0.href : element1.href;
    });
    await browser.close();
    return timetableurl;
}

module.exports = scrape;