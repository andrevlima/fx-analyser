const moment = require('moment');

const suffix = '/api/v1';

exports.bootstrap = (dependencies) => {

    const { app, puppeteer } = dependencies;

    const endpoint = `${suffix}/gdp-growth-rate`
    console.log(`Registered endpoint: ${endpoint}`);
    app.get(endpoint, (req, res) => {
        const target = req.query.target;
            
        console.log(`UR - request received - query target ${target}`);

        (async () => {
            const browser = await puppeteer.launch({ headless: true });
            const page = await browser.newPage();

            await page.goto(`https://tradingeconomics.com/${target}/gdp-growth`);
            try {
                await page.waitForSelector("table#calendar");
                console.log(`UR - request OK - query target ${target}`);
            } catch (ex) {
                res.status(404).send({
                    result: "invalid target"
                })

                console.log(`UR - request NOT OK - query target ${target}`);
                return;
            }

            console.log(`UR - webcrawling... - query target ${target}`);

            let tableJSON = await page.evaluate(() => {
                var rows = $("table#calendar").find("tr.an-estimate-row");

                return rows.map((i, tr) => {
                    return {
                        "date": $(tr).find("td")[0].innerText,
                        "time": $(tr).find("td")[1].innerText,
                        "reference": $(tr).find("td")[3].innerText,
                        "actual": $(tr).find("td")[4].innerText,
                        "previous": $(tr).find("td")[5].innerText,
                        "consensus": $(tr).find("td")[6].innerText,
                    }
                }).toArray()
            });

            const numberNormalizer = (n) => Number(String(n).match(/\-|[0-9]+\.|[0-9]+/g).join(""));

            let lastRow = {};
            tableJSON.forEach((row) => {
                row.details = {
                    fromNow: moment(`${row.date} ${row.time}`, "YYYY-MM-DD hh:mm A").fromNow()
                }

                
                if(row.actual == "" && lastRow.actual) {
                    lastRow.details.current = true;
                    row.details.next = true;

                    const currentValue = numberNormalizer(lastRow.actual || lastRow.consensus);
                    const previousValue = numberNormalizer(lastRow.previous);

                    lastRow.status = currentValue > previousValue ?
                                     "positive" :
                                     currentValue < previousValue ?
                                     "negative" :
                                     /* else */
                                     "neutral";
                }
                lastRow = row;
            })

            console.log(`UR - webcrawling finished - query target ${target}`);

            res.send(tableJSON);

            await browser.close();
        })();

    })
}
