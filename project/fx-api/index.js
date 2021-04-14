const express = require('express')
const app = express()
const port = 3000;
const puppeteer = require('puppeteer');
var cors = require('cors');

app.use(cors());

// APIs
require('./api/v1/balance-of-trades').bootstrap({
    puppeteer, app
})
require('./api/v1/interest-rate').bootstrap({
    puppeteer, app
})
require('./api/v1/unemployment-rate').bootstrap({
    puppeteer, app
})
require('./api/v1/inflation-rate').bootstrap({
    puppeteer, app
})
require('./api/v1/gdp-growth-rate').bootstrap({
    puppeteer, app
})


app.listen(port, () => console.log(`Economic Statistics server listening on port ${port}!`))