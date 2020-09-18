const pupeteer = require('puppeteer');
const fs = require("fs");
const { getTable } = require("./../utils/get-table");

exports.getGDP = async () => {
    const tableSelector = "#aspnetForm > div.container > div > div.col-lg-8.col-md-9 > div.panel.panel-default > div > table";
    const browser = await pupeteer.launch({
        headless: 1,
        ignoreHTTPSErrors: true,
        devtools: true,
        defaultViewport: null
    });
    const page = await browser.newPage();
    await page.goto('https://tradingeconomics.com/united-states/gdp-growth');
    const table = await getTable(page, "#calendar");

    await browser.close();

    return table.filter((gdp) => {
        return Boolean(gdp.actual);
    }).map((gdp) => {
        gdp.date = new Date(gdp.calendar);
        gdp.actual_percentage = Number(gdp.actual.trim().replace("%",""));
        return gdp;
    }).sort((a, b) => b.date - a.date);
};