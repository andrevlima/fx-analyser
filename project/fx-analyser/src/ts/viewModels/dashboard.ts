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
  calendarUrl: ko.Computed<string>;

  constructor() {
    const self = this;

    self.firstEconomy = ko.observable("USD");
    self.secondEconomy = ko.observable("JPY");

    const findTradingView = () => {
      return new Promise(function (resolve, rej) {
        const interval = setInterval(function () {
          if (TradingView) {
            clearInterval(interval);
            resolve();
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
      balance: "Balanca Comercial",
      inflation: "Inflacao",
      interest: "Taxa de Juros",
      gdp: "PIB",
      manufactoringPmi: "Manufactoring PMI",
    }
    self.economies = [
      {
        name: "EUR (Euro)",
        currency: "EUR",
        urlPath: "euro-area",
        urls: [
          { name: "Balanca Comercial", url: (other) => `${baseUrl}?s=xttbez&url2=/${other}/balance-of-trade&h=300&w=600`, link: (other) => `${tradingEconomicsUrl}/${other}/balance-of-trade` },
          { name: "Inflacao", url: (other) => `${baseUrl}?s=eccpemuy&url2=/${other}/inflation-cpi&h=300&w=600`, link: (other) => `${tradingEconomicsUrl}/${other}/inflation-cpi` },
          { name: "Taxa de Juro", url: (other) => `${baseUrl}?s=eurr002w&url2=/${other}/interest-rate&h=300&w=600`, link: (other) => `${tradingEconomicsUrl}/${other}/interest-rate` },
          { name: "PIB", url: (other) => `${baseUrl}?s=eugnemuq&url2=/${other}/gdp-growth&h=300&w=600`, link: (other) => `${tradingEconomicsUrl}/${other}/gdp-growth` },
          { name: "Manufactoring PMI", url: (other) => `${baseUrl}?s=euroareamanpmi&url2=/${other}/manufacturing-pmi&h=300&w=600`, link: (other) => `${tradingEconomicsUrl}/${other}/manufacturing-pmi` },
          { name: "Services PMI", url: (other) => `${baseUrl}?s=euroareamanpmi&url2=/${other}/services-pmi&h=300&w=600`, link: (other) => `${tradingEconomicsUrl}/${other}/services-pmi` },
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
          { name: "Balanca Comercial", url: (other) => `${baseUrl}?s=catbtotb&url2=/${other}/balance-of-trade&h=300&w=600`, link: (other) => `${tradingEconomicsUrl}/${other}/balance-of-trade` },
          { name: "Inflacao", url: (other) => `${baseUrl}?s=cacpiyoy&url2=/${other}/inflation-cpi&h=300&w=600`, link: (other) => `${tradingEconomicsUrl}/${other}/inflation-cpi` },
          { name: "Taxa de Juro", url: (other) => `${baseUrl}?s=cclr&url2=/${other}/interest-rate&h=300&w=600`, link: (other) => `${tradingEconomicsUrl}/${other}/interest-rate` },
          { name: "PIB", url: (other) => `${baseUrl}?s=cge9qoq&url2=/${other}/gdp-growth&h=300&w=600`, link: (other) => `${tradingEconomicsUrl}/${other}/gdp-growth` },
          { name: "Manufactoring PMI", url: (other) => `${baseUrl}?s=canadamanpmi&url2=/${other}/manufacturing-pmi&h=300&w=600`, link: (other) => `${tradingEconomicsUrl}/${other}/manufacturing-pmi` },
          { name: "Services PMI", url: (other) => `${baseUrl}?s=canadamanpmi&url2=/${other}/services-pmi&h=300&w=600`, link: (other) => `${tradingEconomicsUrl}/${other}/services-pmi` },
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
          { name: "Balanca Comercial", url: (other) => `${baseUrl}?s=uktbttba&url2=/${other}/balance-of-trade&h=300&w=600`, link: (other) => `${tradingEconomicsUrl}/${other}/balance-of-trade` },
          { name: "Inflacao", url: (other) => `${baseUrl}?s=ukrpcjyr&url2=/${other}/inflation-cpi&h=300&w=600`, link: (other) => `${tradingEconomicsUrl}/${other}/inflation-cpi` },
          { name: "Taxa de Juro", url: (other) => `${baseUrl}?s=ukbrbase&url2=/${other}/interest-rate&h=300&w=600`, link: (other) => `${tradingEconomicsUrl}/${other}/interest-rate` },
          { name: "PIB", url: (other) => `${baseUrl}?s=ukgrybzq&url2=/${other}/gdp-growth&h=300&w=600`, link: (other) => `${tradingEconomicsUrl}/${other}/gdp-growth` },
          { name: "Manufactoring PMI", url: (other) => `${baseUrl}?s=unitedkinmanpmi&url2=/${other}/manufacturing-pmi&h=300&w=600`, link: (other) => `${tradingEconomicsUrl}/${other}/manufacturing-pmi` },
          { name: "Services PMI", url: (other) => `${baseUrl}?s=unitedkinmanpmi&url2=/${other}/services-pmi&h=300&w=600`, link: (other) => `${tradingEconomicsUrl}/${other}/services-pmi` },
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
          { name: "Balanca Comercial", url: (other) => `${baseUrl}?s=nzmtbal&url2=/${other}/balance-of-trade&h=300&w=600`, link: (other) => `${tradingEconomicsUrl}/${other}/balance-of-trade` },
          { name: "Inflacao", url: (other) => `${baseUrl}?s=nzcpiyoy&url2=/${other}/inflation-cpi&h=300&w=600`, link: (other) => `${tradingEconomicsUrl}/${other}/inflation-cpi` },
          { name: "Taxa de Juro", url: (other) => `${baseUrl}?s=nzocrs&url2=/${other}/interest-rate&h=300&w=600`, link: (other) => `${tradingEconomicsUrl}/${other}/interest-rate` },
          { name: "PIB", url: (other) => `${baseUrl}?s=nzntgdpc&url2=/${other}/gdp-growth&h=300&w=600`, link: (other) => `${tradingEconomicsUrl}/${other}/gdp-growth` },
          { name: "Manufactoring PMI", url: (other) => `${baseUrl}?s=newzealanmanpmi&url2=/${other}/manufacturing-pmi&h=300&w=600`, link: (other) => `${tradingEconomicsUrl}/${other}/manufacturing-pmi` },
          { name: "Services PMI", url: (other) => `${baseUrl}?s=newzealanmanpmi&url2=/${other}/services-pmi&h=300&w=600`, link: (other) => `${tradingEconomicsUrl}/${other}/services-pmi` },
        ],
        partners: [
          "AUD", "USD", "CNY"
        ]
      },
      {
        name: "AUD (Australian)",
        currency: "AUD",
        urlPath: "australia",
        urls: [
          { name: "Balanca Comercial", url: (other) => `${baseUrl}?s=auitgsb&url2=/${other}/balance-of-trade&h=300&w=600`, link: (other) => `${tradingEconomicsUrl}/${other}/balance-of-trade` },
          { name: "Inflacao", url: (other) => `${baseUrl}?s=aucpiyoy&url2=/${other}/inflation-cpi&h=300&w=600`, link: (other) => `${tradingEconomicsUrl}/${other}/inflation-cpi` },
          { name: "Taxa de Juro", url: (other) => `${baseUrl}?s=rbatctr&url2=/${other}/interest-rate&h=300&w=600`, link: (other) => `${tradingEconomicsUrl}/${other}/interest-rate` },
          { name: "PIB", url: (other) => `${baseUrl}?s=aunagdpc&url2=/${other}/gdp-growth&h=300&w=600`, link: (other) => `${tradingEconomicsUrl}/${other}/gdp-growth` },
          { name: "Manufactoring PMI", url: (other) => `${baseUrl}?s=australiamanpmi&url2=/${other}/manufacturing-pmi&h=300&w=600`, link: (other) => `${tradingEconomicsUrl}/${other}/manufacturing-pmi` },
          { name: "Services PMI", url: (other) => `${baseUrl}?s=australiamanpmi&url2=/${other}/services-pmi&h=300&w=600`, link: (other) => `${tradingEconomicsUrl}/${other}/services-pmi` },
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
          { name: "Balanca Comercial", url: (other) => `${baseUrl}?s=jntbal&url2=/${other}/balance-of-trade&h=300&w=600`, link: (other) => `${tradingEconomicsUrl}/${other}/balance-of-trade` },
          { name: "Inflacao", url: (other) => `${baseUrl}?s=jncpiyoy&url2=/${other}/inflation-cpi&h=300&w=600`, link: (other) => `${tradingEconomicsUrl}/${other}/inflation-cpi` },
          { name: "Taxa de Juro", url: (other) => `${baseUrl}?s=bojdtr&url2=/${other}/interest-rate&h=300&w=600`, link: (other) => `${tradingEconomicsUrl}/${other}/interest-rate` },
          { name: "PIB", url: (other) => `${baseUrl}?s=jgdpagdp&url2=/${other}/gdp-growth&h=300&w=600`, link: (other) => `${tradingEconomicsUrl}/${other}/gdp-growth` },
          { name: "Manufactoring PMI", url: (other) => `${baseUrl}?s=japanmanpmi&url2=/${other}/manufacturing-pmi&h=300&w=600`, link: (other) => `${tradingEconomicsUrl}/${other}/manufacturing-pmi` },
          { name: "Services PMI", url: (other) => `${baseUrl}?s=japanmanpmi&url2=/${other}/services-pmi&h=300&w=600`, link: (other) => `${tradingEconomicsUrl}/${other}/services-pmi` },
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
          { name: "Balanca Comercial", url: (other) => `${baseUrl}?s=ustbtot&url2=/${other}/balance-of-trade&h=300&w=600`, link: (other) => `${tradingEconomicsUrl}/${other}/balance-of-trade` },
          { name: "Inflacao", url: (other) => `${baseUrl}?s=cpi+yoy&url2=/${other}/inflation-cpi&h=300&w=600`, link: (other) => `${tradingEconomicsUrl}/${other}/inflation-cpi` },
          { name: "Taxa de Juro", url: (other) => `${baseUrl}?s=fdtr&url2=/${other}/interest-rate&h=300&w=600`, link: (other) => `${tradingEconomicsUrl}/${other}/interest-rate` },
          { name: "PIB", url: (other) => `${baseUrl}?s=gdp+cqoq&url2=/${other}/gdp-growth&h=300&w=600`, link: (other) => `${tradingEconomicsUrl}/${other}/gdp-growth` },
          { name: "Manufactoring PMI", url: (other) => `${baseUrl}?s=unitedstamanpmi&url2=/${other}/manufacturing-pmi&h=300&w=600`, link: (other) => `${tradingEconomicsUrl}/${other}/manufacturing-pmi` },
          { name: "Services PMI", url: (other) => `${baseUrl}?s=unitedstamanpmi&url2=/${other}/services-pmi&h=300&w=600`, link: (other) => `${tradingEconomicsUrl}/${other}/services-pmi` },
        ],
        partners: [
          "EUR", "CAD", "CNY", "MXN", "JPY"
        ]
      }
    ];

    self.currentEco = (currency) => {
      return self.economies.find((e: any) => e.currency == currency);
    }

    self.calendarUrl = ko.computed(() => {
      return "https://s.tradingview.com/embed-widget/events/?locale=br#" + encodeURI(JSON.stringify({
        "colorTheme": "light",
        "isTransparent": false,
        "width": "100%",
        "height": "100%",
        "importanceFilter": "0,1",
        "currencyFilter": (function () { debugger; return [self.secondEconomy(), self.firstEconomy()].join(",") })(),
        "utm_source": "br.tradingview.com",
        "utm_medium": "widget_new",
        "utm_campaign": "events"
      }))
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
