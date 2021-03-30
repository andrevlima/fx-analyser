const moment = require('moment');

const suffix = '/api/v1';

exports.bootstrap = (dependencies) => {

    const { app, puppeteer } = dependencies;

    const endpoint = `${suffix}/interest-rate`;
    console.log(`Registered endpoint: ${endpoint}`);
    app.get(endpoint, (req, res) => {
        const target = req.query.target;
        console.log(`Interest - request received - query target ${target}`);

        (async () => {
            const browser = await puppeteer.launch({ headless: true });
            const page = await browser.newPage();

            await page.goto(`https://tradingeconomics.com/${target}/interest-rate`);
            try {
                await page.waitForSelector("table#calendar");
                console.log(`Interest - request OK - query target ${target}`);
            } catch (ex) {
                res.status(404).send({
                    result: "invalid target"
                })

                console.log(`Interest - request NOT OK - query target ${target}`);
                return;
            }

            console.log(`Interest - webcrawling... - query target ${target}`);

            let tableJSON = await page.evaluate(() => {
                var rows = $("table#calendar").find("tr.an-estimate-row");

                return rows.map((i, tr) => {
                    return {
                        "date": $(tr).find("td")[0].innerText,
                        "time": $(tr).find("td")[1].innerText,
                        "reference": $(tr).find("td")[2].innerText,
                        "actual": $(tr).find("td")[4].innerText,
                        "previous": $(tr).find("td")[5].innerText,
                        "consensus": $(tr).find("td")[6].innerText,
                    }
                }).toArray()
            });

            tableJSON.forEach((row) => {
                row.details = {
                    fromNow: moment(`${row.date} ${row.time}`, "YYYY-MM-DD hh:mm A").fromNow()
                }
            })

            console.log(`Interest - webcrawling finished - query target ${target}`);

            res.send(tableJSON);

            await browser.close();
        })();

    })
}