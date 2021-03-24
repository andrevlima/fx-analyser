import * as AccUtils from "../accUtils";
import * as ko from "knockout";
import * as ArrayDataProvider from 'ojs/ojarraydataprovider';
// import 'ojs/ojselectsingle';
import "ojs/ojselectcombobox";
declare var TradingView;
declare var $;



class DashboardViewModel {
  public firstEconomy: ko.Observable<string>;
  public secondEconomy: ko.Observable<string>;
  public economies: any;
  public economiesDP: ArrayDataProvider<unknown, unknown>;
  public mapKeyToTitle: { balance: string; inflation: string; interest: string; gdp: string; manufactoringPmi: string; };
  public currentEco: (currency: any) => {} | any;
  refreshedCalendar: any;
  infoByKey: any;
  calendarInvestingUrl: ko.Computed<string>;
  calendarTradingViewUrl: ko.Computed<string>;
  switchCurrencies: () => void;
  loadCalendarInitial: () => void;

  public selectedCalendarView: ko.Observable<string>;
  calendarViews: ArrayDataProvider<string, string>;

  constructor() {
    const self = this;

    self.selectedCalendarView = ko.observable("week");

    self.calendarViews = new ArrayDataProvider([
      { name: "Hoje", id: "today" },
      { name: "Esta Semana", id: "week" },
      { name: "Tudo Nesta Semana", id: "allThisWeek" },
    ], { keyAttributes: "id" });


    self.firstEconomy = ko.observable("USD");
    self.secondEconomy = ko.observable("JPY");

    self.switchCurrencies = function () {
      const first = self.firstEconomy();
      self.firstEconomy(self.secondEconomy());
      self.secondEconomy(first);
    }

    const findTradingView = () => {
      return new Promise(function (resolve, rej) {
        const interval = setInterval(function () {
          if (TradingView) {
            clearInterval(interval);
            resolve(void(0));
          }
        }, 200);
      });
    }

    const createWidget = (interval) => {
      new TradingView.widget(
        {
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
        }
      );
    }

    $(document).ready(function () {
      findTradingView().then(function () {
        ko.computed(() => {
          createWidget("D");
          createWidget("M");
          createWidget("30");
          createWidget("W");
        })
      })
    })



    const baseUrl = "https://d3fy651gv2fhd3.cloudfront.net/charts/embed.png";
    const tradingEconomicsUrl = "https://tradingeconomics.com";

    self.mapKeyToTitle = {
      balance: "Balança Comercial",
      inflation: "Inflação",
      interest: "Taxa de Juros",
      gdp: "PIB",
      manufactoringPmi: "Manufactoring PMI",
    }

    self.infoByKey = {
      balance: {
        name: "Balança Comercial",
        description: "Importações VS Exportações, quando a tendência é de subida, ou seja, positiva, MELHOR é para a moeda. O inverso, tendência negativa, PIOR é para a moeda"
      },
      inflation: {
        name: "Inflação",
        description: "Quando aumenta a economia está aquecida, em geral o BC irá aumentar a taxa de juros para arrefecer a economia (desistimular o emprestimo) ou seja, diminuir a inflação, para economias desenvolvidas é aceitavel níveis entre os 2% (Maior inflação, irá atrair taxas de juros maiores)"
      },
      interest: {
        name: "Taxa de Juro",
        description: "Maior taxa, mais investimento estrangeiro entra (Carry Trading), aumenta demanda pela moeda. Porém, altas taxas podem assinalar alta inflação, o que pode depreciar a moeda também por sua vez. "
      },
      gdp: {
        name: "PIB",
        description: "Produto interno bruto, sua subida indica um economia forte, MELHOR para a moeda"
      },
      manufactoringPmi: {
        name: "PMI Industrial",
        description: "Quão aquecido está o setor industrial, níveis superiores a 50 > MELHOR para a moeda, significa uma economia aquecida"
      },
      servicesPmi: {
        name: "PMI Serviços",
        description: "Quão aquecido está o setor de serviços, níveis superiores a 50 > MELHOR para a moeda, significa uma economia aquecida"
      },
      cpi: {
        name: "Consumer Price Index (CPI)",
        description: "Indica a subida ou descida de preço dos bens comumente consumidos numa ecônomia (CPI Basket of Good) pela maioria das pessoas, este indicador ajuda a rastrear a inflação"
      },
      unemploymentRate:  {
        name: "Nível de Desemprego",
        description: "Quanto MAIOR será PIOR para a moeda, pois o Governo(BC) irá adotar medidas pró pleno emprego, baixando a taxa de juros, aumentando as despesas, imprimindo moeda para injetar estimulos ou subsídios que no fim acabam depreciando a moeda"
      }
    }

    const getInfo = (key) => {
      const info = this.infoByKey[key];
      return info || {
        name: key
      }
    }

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
          { name: "servicesPmi", info: getInfo("servicesPmi"), url: (other) => `${baseUrl}?s=euroareaserpmi`, link: (other) => `${tradingEconomicsUrl}/${other}/services-pmi` },
        ],
        partners: [
          "USD", "CNY", "CHF"
        ]
      },
      {
        name: "CHF (Suiça)",
        currency: "CHF",
        urlPath: "switzerland",
        urls: [
          { name: "unemploymentRate", info: getInfo("unemploymentRate"), url: (other) => `${baseUrl}?s=szueuea`, link: (other) => `${tradingEconomicsUrl}/${other}/unemployment-rate` },
          { name: "gdp", info: getInfo("gdp"), url: (other) => `${baseUrl}?s=szgdpcqq`, link: (other) => `${tradingEconomicsUrl}/${other}/gdp-growth` },
          { name: "interest", info: getInfo("interest"), url: (other) => `${baseUrl}?s=szlttr`, link: (other) => `${tradingEconomicsUrl}/${other}/interest-rate` },
          { name: "inflation", info: getInfo("inflation"), url: (other) => `${baseUrl}?s=szcpiyoy`, link: (other) => `${tradingEconomicsUrl}/${other}/inflation-cpi` },
          { name: "cpi", info: getInfo("cpi"), url: (other) => `${baseUrl}?s=switzerlanconpriindc`, link: (other) => `${tradingEconomicsUrl}/${other}/consumer-price-index-cpi` },
          { name: "balance", info: getInfo("balance"), url: (other) => `${baseUrl}?s=sztbal`, link: (other) => `${tradingEconomicsUrl}/${other}/balance-of-trade` },
          { name: "manufactoringPmi", info: getInfo("manufactoringPmi"), url: (other) => `${baseUrl}?s=switzerlanmanpmi`, link: (other) => `${tradingEconomicsUrl}/${other}/manufacturing-pmi` },
          { name: "servicesPmi", info: getInfo("servicesPmi"), url: (other) => `${baseUrl}?s=switzerlanserpmi`, link: (other) => `${tradingEconomicsUrl}/${other}/services-pmi` },
        ],
        partners: [
          "EUR", "USD", "RMB"
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
          { name: "servicesPmi", info: getInfo("servicesPmi"), url: (other) => `${baseUrl}?s=canadaserpmi`, link: (other) => `${tradingEconomicsUrl}/${other}/services-pmi` },
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
          { name: "servicesPmi", info: getInfo("servicesPmi"), url: (other) => `${baseUrl}?s=unitedkinserpmi`, link: (other) => `${tradingEconomicsUrl}/${other}/services-pmi` },
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
          { name: "servicesPmi", info: getInfo("servicesPmi"), url: (other) => `${baseUrl}?s=newzealanserpmi`, link: (other) => `${tradingEconomicsUrl}/${other}/services-pmi` },
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
          { name: "servicesPmi", info: getInfo("servicesPmi"), url: (other) => `${baseUrl}?s=australiaserpmi`, link: (other) => `${tradingEconomicsUrl}/${other}/services-pmi` },
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
          { name: "servicesPmi", info: getInfo("servicesPmi"), url: (other) => `${baseUrl}?s=japanserpmi`, link: (other) => `${tradingEconomicsUrl}/${other}/services-pmi` },
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
          { name: "servicesPmi", info: getInfo("servicesPmi"), url: (other) => `${baseUrl}?s=unitedstaserpmi`, link: (other) => `${tradingEconomicsUrl}/${other}/services-pmi` },
        ],
        partners: [
          "EUR", "CAD", "CNY", "MXN", "JPY"
        ]
      },
      {
        name: "SGD (Singapura/China)",
        currency: "SGD",
        urlPath: "singapore",
        urls: [
          { name: "unemploymentRate", info: getInfo("unemploymentRate"), url: (other) => `${baseUrl}?s=siqutota`, link: (other) => `${tradingEconomicsUrl}/${other}/unemployment-rate` },
          { name: "gdp", info: getInfo("gdp"), url: (other) => `${baseUrl}?s=sgdpqoq`, link: (other) => `${tradingEconomicsUrl}/${other}/gdp-growth` },
          { name: "interest", info: getInfo("interest"), url: (other) => `${baseUrl}?s=sibcon`, link: (other) => `${tradingEconomicsUrl}/${other}/interest-rate` },
          { name: "inflation", info: getInfo("inflation"), url: (other) => `${baseUrl}?s=sicpiyoy`, link: (other) => `${tradingEconomicsUrl}/${other}/inflation-cpi` },
          { name: "cpi", info: getInfo("cpi"), url: (other) => `${baseUrl}?s=singaporeconpriindcp`, link: (other) => `${tradingEconomicsUrl}/${other}/consumer-price-index-cpi` },
          { name: "balance", info: getInfo("balance"), url: (other) => `${baseUrl}?s=strde`, link: (other) => `${tradingEconomicsUrl}/${other}/balance-of-trade` },
          { name: "manufactoringPmi", info: getInfo("manufactoringPmi"), url: (other) => `${baseUrl}?s=singaporemanpmi`, link: (other) => `${tradingEconomicsUrl}/${other}/manufacturing-pmi` },
          { name: "servicesPmi", info: getInfo("servicesPmi"), url: (other) => `${baseUrl}?s=singaporeserpmi`, link: (other) => `${tradingEconomicsUrl}/${other}/services-pmi` },
        ],
        partners: [
          "EUR", "CAD", "CNY", "MXN", "JPY"
        ]
      }
    ];

    self.currentEco = (currency) => {
      return self.economies.find((e: any) => e.currency == currency);
    }

    const countryIdByCurrency = {
      "EUR": 72, "GBP": 4, "USD": 5, "CAD": 6, "NZD": 43, "AUD": 25, "JPY": 35, "CHF": 12
    }

    function getCurrentBrowserOffsetTimezoneId() {
      const timezoneByOffset = {"0":"56","1":"60","2":"61","3":"19","4":"21","5":"24","6":"26","7":"27","8":"113","9":"90","10":"30","11":"32","12":"1","13":"33","-11":"35","-10":"3","-9":"4","-8":"5","-7":"6","-6":"41","-5":"43","-4":"46","-3":"47","-1":"53"};
      const currentOffset = new Date().getTimezoneOffset();
        
        return timezoneByOffset[currentOffset];
    }

    self.calendarInvestingUrl = ko.computed(() => {

      const timeframe = () => {
        switch (self.selectedCalendarView()) {
          case "week":
          case "allThisWeek":
            return "week";
            break;
          case "today":
            return "day"
            break;
          default:
            break;
        }
      }

      return "https://sslecal2.forexprostools.com?" +
        "columns=exc_flags," + "exc_currency," + "exc_importance," + "exc_actual," + "exc_forecast," + "exc_previous" +
        "&importance=2,3" +
        "&features=datepicker,timezone,timeselector,filters" +
        (self.selectedCalendarView() != "allThisWeek" ? "&countries=" + [countryIdByCurrency[self.secondEconomy()], countryIdByCurrency[self.firstEconomy()]].join(",") : "") +
        "&calType=" + timeframe() +
        "&timeZone=" + getCurrentBrowserOffsetTimezoneId() +
        "&lang=12";
    })

    self.calendarTradingViewUrl = ko.computed(() => {
      return "https://s.tradingview.com/embed-widget/events/?locale=br#" + encodeURI(JSON.stringify({
        "colorTheme": "light",
        "isTransparent": false,
        "width": "100%",
        "height": "100%",
        "importanceFilter": "0,1",
        "currencyFilter": (function () { return [self.secondEconomy(), self.firstEconomy()].join(",") })(),
        "utm_source": "br.tradingview.com",
        "utm_medium": "widget_new",
        "utm_campaign": "events"
      }))
    })


    function getCalendarPageDoc() {
      let iframe: any = document.getElementById('mql5-calendar');

      let doc = null;
      if (iframe.contentDocument) {
        doc = iframe.contentDocument;
      } else if (iframe.contentWindow) {
        doc = iframe.contentWindow.document;
      }
      return doc;
    }

    function updatePreview(data) {
      const i = <any>document.getElementById('mql5-calendar');
      i.src=null;
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

          doc.querySelectorAll(".item").forEach(function (row: any) {
            if (row.querySelector(".col-currency").innerText.trim() != self.firstEconomy() && row.querySelector(".col-currency").innerText.trim() != self.secondEconomy()) {
              row.remove()
            }
          });

          doc.querySelectorAll(".col-event > a").forEach((a: any) => a.href = a.href.replace(window.location, "https://www.tradays.com/"));
        }, 1000);
      })
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
    })
  }

  /**
   * Optional ViewModel method invoked after the View is inserted into the
   * document DOM.  The application can put logic that requires the DOM being
   * attached here.
   * This method might be called multiple times - after the View is created
   * and inserted into the DOM and after the View is reconnected
   * after being disconnected.
   */
  connected(): void {
    AccUtils.announce("Dashboard page loaded.");
    document.title = "Dashboard";
    // implement further logic if needed
  }

  /**
   * Optional ViewModel method invoked after the View is disconnected from the DOM.
   */
  disconnected(): void {
    // implement if needed
  }

  /**
   * Optional ViewModel method invoked after transition to the new View is complete.
   * That includes any possible animation between the old and the new View.
   */
  transitionCompleted(): void {
    // implement if needed
  }


}

export = DashboardViewModel;
