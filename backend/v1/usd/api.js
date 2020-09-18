const crawler = require("./crawler");

const currency = "usd";
exports.api = function (app) {
    app.get(`/currencies/${currency}/info`, async function (req, res) {
        crawler.getGDP().then(function(gdpList) {
            res.json({
                gdp: {
                    status: gdpList[0].actual_percentage >= 3 ? "growing" :
                            gdpList[0].actual_percentage >= 0.5  ? "ok" :
                            "recession",
                    list: gdpList,
                },
            });
        })
    });
}