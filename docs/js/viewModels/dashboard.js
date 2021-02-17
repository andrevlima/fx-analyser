define(["require", "exports", "../accUtils", "knockout", "ojs/ojselectcombobox"], function (require, exports, AccUtils, ko) {
    "use strict";
    class DashboardViewModel {
        constructor() {
            const self = this;
            self.firstEconomy = ko.observable("USD");
            self.secondEconomy = ko.observable("JPY");
            self.switchCurrencies = function () {
                const first = self.firstEconomy();
                self.firstEconomy(self.secondEconomy());
                self.secondEconomy(first);
            };
            const findTradingView = () => {
                return new Promise(function (resolve, rej) {
                    const interval = setInterval(function () {
                        if (TradingView) {
                            clearInterval(interval);
                            resolve();
                        }
                    }, 200);
                });
            };
            const createWidget = (interval) => {
                new TradingView.widget({
                    "autosize": true,
                    "symbol": `${self.firstEconomy()}${self.secondEconomy()}`,
                    "interval": interval,
                    "timezone": "Etc/UTC",
                    "theme": "light",
                    "style": "1",
                    "locale": "br",
                    "toolbar_bg": "#f1f3f6",
                    "enable_publishing": false,
                    "hide_side_toolbar": false,
                    "allow_symbol_change": true,
                    "hotlist": true,
                    "calendar": true,
                    "show_popup_button": true,
                    "popup_width": "1000",
                    "popup_height": "650",
                    "container_id": "chart_" + String(interval).toLowerCase().toString()
                });
            };
            $(document).ready(function () {
                findTradingView().then(function () {
                    ko.computed(() => {
                        createWidget("D");
                        createWidget("M");
                        createWidget("30");
                        createWidget("W");
                    });
                });
            });
            const baseUrl = "https://d3fy651gv2fhd3.cloudfront.net/charts/embed.png";
            const tradingEconomicsUrl = "https://tradingeconomics.com";
            self.mapKeyToTitle = {
                balance: "Balanca Comercial",
                inflation: "Inflacao",
                interest: "Taxa de Juros",
                gdp: "PIB",
                manufactoringPmi: "Manufactoring PMI",
            };
            self.infoByKey = {
                balance: {
                    name: "Balanca Comercial",
                    description: "Importações versus Exportações, positivo é MELHOR para a moeda, negativo é mau"
                },
                inflation: {
                    name: "Inflacao",
                    description: "Inflação, quanto mais positivo PIOR é para a moeda, economias desenvolvidas é aceitavel até níveis entre os 2% (Maior inflação vem acompanhado de taxas de juros maiores)"
                },
                interest: {
                    name: "Taxa de Juro",
                    description: "Bom = Maior taxa, mais investimento estrangeiro entra, MELHOR para a moeda\nMau = Menor taxa, menos investimento estrangeiro entra\n(Ter em atencao a inflação, se aumenta muito tem o efeito inverso)"
                },
                gdp: {
                    name: "PIB",
                    description: "Produto interno bruto, sua subida indica um economia forte, MELHOR para a moeda"
                },
                manufactoringPmi: {
                    name: "Manufactoring PMI",
                    description: "Quão aquecido está o setor industrial, 50 > MELHOR para a moeda"
                },
                servicesPmi: {
                    name: "Services PMI",
                    description: "Quão aquecido está o setor de serviços, 50 > MELHOR para a moeda"
                },
                cpi: {
                    name: "Consumer Price Index (CPI)",
                    description: ""
                },
                unemploymentRate: {
                    name: "Nível de Desemprego",
                    description: "Quanto MAIOR será PIOR para a moeda, pois o Governo(BC) irá adotar medidas pró pleno emprego, baixando a taxa de juros e no fim depreciando a moeda"
                }
            };
            const getInfo = (key) => {
                const info = this.infoByKey[key];
                return info || {
                    name: key
                };
            };
            self.economies = [
                {
                    name: "EUR (Euro)",
                    currency: "EUR",
                    urlPath: "euro-area",
                    urls: [
                        { name: "unemploymentRate", info: getInfo("unemploymentRate"), url: (other) => `${baseUrl}?s=umrtemu`, link: (other) => `${tradingEconomicsUrl}/${other}/unemployment-rate` },
                        { name: "gdp", info: getInfo("gdp"), url: (other) => `${baseUrl}?s=eugnemuq`, link: (other) => `${tradingEconomicsUrl}/${other}/gdp-growth` },
                        { name: "interest", info: getInfo("interest"), url: (other) => `${baseUrl}?s=eurr002w`, link: (other) => `${tradingEconomicsUrl}/${other}/interest-rate` },
                        { name: "inflation", info: getInfo("inflation"), url: (other) => `${baseUrl}?s=eccpemuy`, link: (other) => `${tradingEconomicsUrl}/${other}/inflation-cpi` },
                        { name: "cpi", info: getInfo("cpi"), url: (other) => `${baseUrl}?s=euroareaconpriindcp`, link: (other) => `${tradingEconomicsUrl}/${other}/consumer-price-index-cpi` },
                        { name: "balance", info: getInfo("balance"), url: (other) => `${baseUrl}?s=xttbez`, link: (other) => `${tradingEconomicsUrl}/${other}/balance-of-trade` },
                        { name: "manufactoringPmi", info: getInfo("manufactoringPmi"), url: (other) => `${baseUrl}?s=euroareamanpmi`, link: (other) => `${tradingEconomicsUrl}/${other}/manufacturing-pmi` },
                        { name: "servicesPmi", info: getInfo("servicesPmi"), url: (other) => `${baseUrl}?s=euroareamanpmi`, link: (other) => `${tradingEconomicsUrl}/${other}/services-pmi` },
                    ],
                    partners: [
                        "USD", "CNY", "CHF"
                    ]
                },
                {
                    name: "CAD (Canada)",
                    currency: "CAD",
                    urlPath: "canada",
                    urls: [
                        { name: "unemploymentRate", info: getInfo("unemploymentRate"), url: (other) => `${baseUrl}?s=canlxemr`, link: (other) => `${tradingEconomicsUrl}/${other}/unemployment-rate` },
                        { name: "gdp", info: getInfo("gdp"), url: (other) => `${baseUrl}?s=cge9qoq`, link: (other) => `${tradingEconomicsUrl}/${other}/gdp-growth` },
                        { name: "interest", info: getInfo("interest"), url: (other) => `${baseUrl}?s=cclr`, link: (other) => `${tradingEconomicsUrl}/${other}/interest-rate` },
                        { name: "inflation", info: getInfo("inflation"), url: (other) => `${baseUrl}?s=cacpiyoy`, link: (other) => `${tradingEconomicsUrl}/${other}/inflation-cpi` },
                        { name: "cpi", info: getInfo("cpi"), url: (other) => `${baseUrl}?s=canadaconpriindcpi`, link: (other) => `${tradingEconomicsUrl}/${other}/consumer-price-index-cpi` },
                        { name: "balance", info: getInfo("balance"), url: (other) => `${baseUrl}?s=catbtotb`, link: (other) => `${tradingEconomicsUrl}/${other}/balance-of-trade` },
                        { name: "manufactoringPmi", info: getInfo("manufactoringPmi"), url: (other) => `${baseUrl}?s=canadamanpmi`, link: (other) => `${tradingEconomicsUrl}/${other}/manufacturing-pmi` },
                        { name: "servicesPmi", info: getInfo("servicesPmi"), url: (other) => `${baseUrl}?s=canadamanpmi`, link: (other) => `${tradingEconomicsUrl}/${other}/services-pmi` },
                    ],
                    partners: [
                        "USD", "CNY", "MZD"
                    ]
                },
                {
                    name: "GBP (Great Britain)",
                    currency: "GBP",
                    urlPath: "united-kingdom",
                    urls: [
                        { name: "unemploymentRate", info: getInfo("unemploymentRate"), url: (other) => `${baseUrl}?s=ukueilor`, link: (other) => `${tradingEconomicsUrl}/${other}/unemployment-rate` },
                        { name: "gdp", info: getInfo("gdp"), url: (other) => `${baseUrl}?s=ukgrybzq`, link: (other) => `${tradingEconomicsUrl}/${other}/gdp-growth` },
                        { name: "interest", info: getInfo("interest"), url: (other) => `${baseUrl}?s=ukbrbase`, link: (other) => `${tradingEconomicsUrl}/${other}/interest-rate` },
                        { name: "inflation", info: getInfo("inflation"), url: (other) => `${baseUrl}?s=ukrpcjyr`, link: (other) => `${tradingEconomicsUrl}/${other}/inflation-cpi` },
                        { name: "cpi", info: getInfo("cpi"), url: (other) => `${baseUrl}?s=unitedkinconpriindcp`, link: (other) => `${tradingEconomicsUrl}/${other}/consumer-price-index-cpi` },
                        { name: "balance", info: getInfo("balance"), url: (other) => `${baseUrl}?s=uktbttba`, link: (other) => `${tradingEconomicsUrl}/${other}/balance-of-trade` },
                        { name: "manufactoringPmi", info: getInfo("manufactoringPmi"), url: (other) => `${baseUrl}?s=unitedkinmanpmi`, link: (other) => `${tradingEconomicsUrl}/${other}/manufacturing-pmi` },
                        { name: "servicesPmi", info: getInfo("servicesPmi"), url: (other) => `${baseUrl}?s=unitedkinmanpmi`, link: (other) => `${tradingEconomicsUrl}/${other}/services-pmi` },
                    ],
                    partners: [
                        "USD", "EUR", "CNY"
                    ]
                },
                {
                    name: "NZD (New Zeland)",
                    currency: "NZD",
                    urlPath: "new-zealand",
                    urls: [
                        { name: "unemploymentRate", info: getInfo("unemploymentRate"), url: (other) => `${baseUrl}?s=nzlfuner`, link: (other) => `${tradingEconomicsUrl}/${other}/unemployment-rate` },
                        { name: "gdp", info: getInfo("gdp"), url: (other) => `${baseUrl}?s=nzntgdpc`, link: (other) => `${tradingEconomicsUrl}/${other}/gdp-growth` },
                        { name: "interest", info: getInfo("interest"), url: (other) => `${baseUrl}?s=nzocrs`, link: (other) => `${tradingEconomicsUrl}/${other}/interest-rate` },
                        { name: "inflation", info: getInfo("inflation"), url: (other) => `${baseUrl}?s=nzcpiyoy`, link: (other) => `${tradingEconomicsUrl}/${other}/inflation-cpi` },
                        { name: "cpi", info: getInfo("cpi"), url: (other) => `${baseUrl}?s=newzealanconpriindcp`, link: (other) => `${tradingEconomicsUrl}/${other}/consumer-price-index-cpi` },
                        { name: "balance", info: getInfo("balance"), url: (other) => `${baseUrl}?s=nzmtbal`, link: (other) => `${tradingEconomicsUrl}/${other}/balance-of-trade` },
                        { name: "manufactoringPmi", info: getInfo("manufactoringPmi"), url: (other) => `${baseUrl}?s=newzealanmanpmi`, link: (other) => `${tradingEconomicsUrl}/${other}/manufacturing-pmi` },
                        { name: "servicesPmi", info: getInfo("servicesPmi"), url: (other) => `${baseUrl}?s=newzealanmanpmi`, link: (other) => `${tradingEconomicsUrl}/${other}/services-pmi` },
                    ],
                    partners: [
                        "AUD", "USD", "CNY", "JPY"
                    ]
                },
                {
                    name: "AUD (Australian)",
                    currency: "AUD",
                    urlPath: "australia",
                    urls: [
                        { name: "unemploymentRate", info: getInfo("unemploymentRate"), url: (other) => `${baseUrl}?s=aulfunem`, link: (other) => `${tradingEconomicsUrl}/${other}/unemployment-rate` },
                        { name: "gdp", info: getInfo("gdp"), url: (other) => `${baseUrl}?s=aunagdpc`, link: (other) => `${tradingEconomicsUrl}/${other}/gdp-growth` },
                        { name: "interest", info: getInfo("interest"), url: (other) => `${baseUrl}?s=rbatctr`, link: (other) => `${tradingEconomicsUrl}/${other}/interest-rate` },
                        { name: "inflation", info: getInfo("inflation"), url: (other) => `${baseUrl}?s=aucpiyoy`, link: (other) => `${tradingEconomicsUrl}/${other}/inflation-cpi` },
                        { name: "cpi", info: getInfo("cpi"), url: (other) => `${baseUrl}?s=australiaconpriindcp`, link: (other) => `${tradingEconomicsUrl}/${other}/consumer-price-index-cpi` },
                        { name: "balance", info: getInfo("balance"), url: (other) => `${baseUrl}?s=auitgsb`, link: (other) => `${tradingEconomicsUrl}/${other}/balance-of-trade` },
                        { name: "manufactoringPmi", info: getInfo("manufactoringPmi"), url: (other) => `${baseUrl}?s=australiamanpmi`, link: (other) => `${tradingEconomicsUrl}/${other}/manufacturing-pmi` },
                        { name: "servicesPmi", info: getInfo("servicesPmi"), url: (other) => `${baseUrl}?s=australiamanpmi`, link: (other) => `${tradingEconomicsUrl}/${other}/services-pmi` },
                    ],
                    partners: [
                        "CNY", "JPY", "USD", "NZD"
                    ]
                },
                {
                    name: "JPY (Japan)",
                    currency: "JPY",
                    urlPath: "japan",
                    urls: [
                        { name: "unemploymentRate", info: getInfo("unemploymentRate"), url: (other) => `${baseUrl}?s=jnue`, link: (other) => `${tradingEconomicsUrl}/${other}/unemployment-rate` },
                        { name: "gdp", info: getInfo("gdp"), url: (other) => `${baseUrl}?s=jgdpagdp`, link: (other) => `${tradingEconomicsUrl}/${other}/gdp-growth` },
                        { name: "interest", info: getInfo("interest"), url: (other) => `${baseUrl}?s=bojdtr`, link: (other) => `${tradingEconomicsUrl}/${other}/interest-rate` },
                        { name: "inflation", info: getInfo("inflation"), url: (other) => `${baseUrl}?s=jncpiyoy`, link: (other) => `${tradingEconomicsUrl}/${other}/inflation-cpi` },
                        { name: "cpi", info: getInfo("cpi"), url: (other) => `${baseUrl}?s=japanconpriindcpi`, link: (other) => `${tradingEconomicsUrl}/${other}/consumer-price-index-cpi` },
                        { name: "balance", info: getInfo("balance"), url: (other) => `${baseUrl}?s=jntbal`, link: (other) => `${tradingEconomicsUrl}/${other}/balance-of-trade` },
                        { name: "manufactoringPmi", info: getInfo("manufactoringPmi"), url: (other) => `${baseUrl}?s=japanmanpmi`, link: (other) => `${tradingEconomicsUrl}/${other}/manufacturing-pmi` },
                        { name: "servicesPmi", info: getInfo("servicesPmi"), url: (other) => `${baseUrl}?s=japanmanpmi`, link: (other) => `${tradingEconomicsUrl}/${other}/services-pmi` },
                    ],
                    partners: [
                        "CNY", "USD", "AUD"
                    ]
                },
                {
                    name: "USD (United States)",
                    currency: "USD",
                    urlPath: "united-states",
                    urls: [
                        { name: "unemploymentRate", info: getInfo("unemploymentRate"), url: (other) => `${baseUrl}?s=usurtot`, link: (other) => `${tradingEconomicsUrl}/${other}/unemployment-rate` },
                        { name: "gdp", info: getInfo("gdp"), url: (other) => `${baseUrl}?s=gdp+cqoq`, link: (other) => `${tradingEconomicsUrl}/${other}/gdp-growth` },
                        { name: "interest", info: getInfo("interest"), url: (other) => `${baseUrl}?s=fdtr`, link: (other) => `${tradingEconomicsUrl}/${other}/interest-rate` },
                        { name: "inflation", info: getInfo("inflation"), url: (other) => `${baseUrl}?s=cpi+yoy`, link: (other) => `${tradingEconomicsUrl}/${other}/inflation-cpi` },
                        { name: "cpi", info: getInfo("cpi"), url: (other) => `${baseUrl}?s=unitedstaconpriindcp`, link: (other) => `${tradingEconomicsUrl}/${other}/consumer-price-index-cpi` },
                        { name: "balance", info: getInfo("balance"), url: (other) => `${baseUrl}?s=ustbtot`, link: (other) => `${tradingEconomicsUrl}/${other}/balance-of-trade` },
                        { name: "manufactoringPmi", info: getInfo("manufactoringPmi"), url: (other) => `${baseUrl}?s=unitedstamanpmi`, link: (other) => `${tradingEconomicsUrl}/${other}/manufacturing-pmi` },
                        { name: "servicesPmi", info: getInfo("servicesPmi"), url: (other) => `${baseUrl}?s=unitedstamanpmi`, link: (other) => `${tradingEconomicsUrl}/${other}/services-pmi` },
                    ],
                    partners: [
                        "EUR", "CAD", "CNY", "MXN", "JPY"
                    ]
                }
            ];
            self.currentEco = (currency) => {
                return self.economies.find((e) => e.currency == currency);
            };
            const countryIdByCurrency = {
                "EUR": 72, "GBP": 4, "USD": 5, "CAD": 6, "NZD": 43, "AUD": 25, "JPY": 35, "CHF": 12
            };
            self.calendarInvestingUrl = ko.computed(() => {
                return "https://sslecal2.forexprostools.com?" +
                    "columns=exc_flags," + "exc_currency," + "exc_importance," + "exc_actual," + "exc_forecast," + "exc_previous" +
                    "&importance=2,3" +
                    "&features=datepicker,timezone,timeselector,filters" +
                    "&countries=" + [countryIdByCurrency[self.secondEconomy()], countryIdByCurrency[self.firstEconomy()]].join(",") +
                    "&calType=week" +
                    "&timeZone=12" +
                    "&lang=12";
            });
            self.calendarTradingViewUrl = ko.computed(() => {
                return "https://s.tradingview.com/embed-widget/events/?locale=br#" + encodeURI(JSON.stringify({
                    "colorTheme": "light",
                    "isTransparent": false,
                    "width": "100%",
                    "height": "100%",
                    "importanceFilter": "0,1",
                    "currencyFilter": (function () { return [self.secondEconomy(), self.firstEconomy()].join(","); })(),
                    "utm_source": "br.tradingview.com",
                    "utm_medium": "widget_new",
                    "utm_campaign": "events"
                }));
            });
            function getCalendarPageDoc() {
                let iframe = document.getElementById('mql5-calendar');
                let doc = null;
                if (iframe.contentDocument) {
                    doc = iframe.contentDocument;
                }
                else if (iframe.contentWindow) {
                    doc = iframe.contentWindow.document;
                }
                return doc;
            }
            function updatePreview(data) {
                const i = document.getElementById('mql5-calendar');
                i.src = null;
                const doc = getCalendarPageDoc();
                doc.open();
                doc.write(data);
                doc.close();
            }
            function loadPage(url) {
                return $.getJSON(url, function (data) {
                    updatePreview(data.contents);
                });
            }
            function loadCalendarInitial() {
                loadPage('http://api.allorigins.win/get?url=https%3A//www.tradays.com/pt/economic-calendar/widget%3Fmode%3D2%26dateFormat%3DDMY&callback=?').then(function () {
                    setTimeout(function () {
                        const doc = getCalendarPageDoc();
                        doc.querySelectorAll(".item").forEach(function (row) {
                            if (row.querySelector(".col-currency").innerText.trim() != self.firstEconomy() && row.querySelector(".col-currency").innerText.trim() != self.secondEconomy()) {
                                row.remove();
                            }
                        });
                        doc.querySelectorAll(".col-event > a").forEach((a) => a.href = a.href.replace(window.location, "https://www.tradays.com/"));
                    }, 1000);
                });
            }
            self.loadCalendarInitial = loadCalendarInitial;
            self.refreshedCalendar = ko.observable(true);
            ko.computed(() => {
                self.calendarInvestingUrl();
                self.calendarTradingViewUrl();
                self.refreshedCalendar(false);
                loadCalendarInitial();
                setTimeout(function () {
                    self.refreshedCalendar(true);
                }, 200);
            });
        }
        /**
         * Optional ViewModel method invoked after the View is inserted into the
         * document DOM.  The application can put logic that requires the DOM being
         * attached here.
         * This method might be called multiple times - after the View is created
         * and inserted into the DOM and after the View is reconnected
         * after being disconnected.
         */
        connected() {
            AccUtils.announce("Dashboard page loaded.");
            document.title = "Dashboard";
            // implement further logic if needed
        }
        /**
         * Optional ViewModel method invoked after the View is disconnected from the DOM.
         */
        disconnected() {
            // implement if needed
        }
        /**
         * Optional ViewModel method invoked after transition to the new View is complete.
         * That includes any possible animation between the old and the new View.
         */
        transitionCompleted() {
            // implement if needed
        }
    }
    return DashboardViewModel;
});
//# sourceMappingURL=dashboard.js.map