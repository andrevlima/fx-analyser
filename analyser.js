const pupeteer = require('puppeteer');
const fs = require("fs");

(async () => {
    const tableSelector = "#aspnetForm > div.container > div > div.col-lg-8.col-md-9 > div.panel.panel-default > div > table";

    const options = {
        width: 1200,
        height: 1268
    };
    const browser = await pupeteer.launch({
        headless: 1,
        ignoreHTTPSErrors: true,
        devtools: true,
        defaultViewport: null
        //args: [`--window-size=${options.width},${options.height}`] // new option
    });
    const page = await browser.newPage();
    await page.goto('https://tradingeconomics.com/european-union/gdp-growth');
    await page.waitForSelector(tableSelector);

    const table = await page.evaluate((tableSelector) => {
        function getColumnsFromTable(selector) {
            let columns = {};
            function camelfy(txt) {
                return txt.trim().toLowerCase().replace(/[ ]/g, '_');
            }
            let currentI = 0;
            $(selector).find("thead > tr > th").each(function (i, colum) {
                const size = $(colum).prop("colSpan");

                Array.from(Array(size).keys()).forEach((times) => {
                    currentI = currentI + times;
                    columns[currentI] = camelfy($(colum).text());

                })

                currentI++;
            });
            return columns;
        }

        function getDataFromTable(selector) {
            let columns = getColumnsFromTable(selector);


            const data = $(selector).find("tbody > tr").map(function (i, row) {
                const rowData = {};

                $(row).find("td").each((iCell, cell) => {
                    const content = $(cell).text().trim();
                    const columName = columns[iCell];
                    if (columName in rowData) {
                        const previousContent = rowData[columName];
                        rowData[columName] = [].concat(previousContent).concat(content);
                    } else {
                        rowData[columName] = content;
                    }
                });

                return rowData;
            });

            return data.get();
        }

        return getDataFromTable(tableSelector);
    }, tableSelector);

    // await page.waitForSelector("#ctl00_ContentPlaceHolder1_ctl00_ctl01_Panel1");
    // const news = await page.evaluate(() => {
    //     const data = $("#ctl00_ContentPlaceHolder1_ctl00_ctl01_Panel1").find(".list-group-item").map((i, row) => {
    //         return {
    //             title: $(row).find(">b").text(),
    //             content: $(row).find(">.comment").text(),
    //             date: $(row).find(">small").text()
    //         }
    //     });

    //     return data.get();
    // })
    // fs.writeFileSync('news.json', JSON.stringify(news, null, 2));

    fs.writeFileSync('gdp.json', JSON.stringify(table, null, 2));
    await browser.close();

})();