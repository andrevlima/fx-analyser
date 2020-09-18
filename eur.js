const pupeteer = require('puppeteer');
const fs = require("fs");
const { getTable } = require("./backend/v1/utils/get-table");

(async () => {
    const tableSelector = "#aspnetForm > div.container > div > div.col-lg-8.col-md-9 > div.panel.panel-default > div > table";
    const browser = await pupeteer.launch({
        headless: 1,
        ignoreHTTPSErrors: true,
        devtools: true,
        defaultViewport: null
    });
    const page = await browser.newPage();
    await page.goto('https://tradingeconomics.com/european-union/gdp-growth');
    const table = await getTable(page, tableSelector);

    // fs.writeFileSync('news.json', JSON.stringify(news, null, 2));
    // fs.writeFileSync('gdp.json', JSON.stringify(table, null, 2));
    await browser.close();

})();