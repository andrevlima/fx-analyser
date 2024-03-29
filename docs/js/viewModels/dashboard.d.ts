/// <reference types="ojarraydataprovider" />
import * as ko from "knockout";
import * as ArrayDataProvider from 'ojs/ojarraydataprovider';
import "ojs/ojselectcombobox";
declare class DashboardViewModel {
    firstEconomy: ko.Observable<string>;
    secondEconomy: ko.Observable<string>;
    economies: any;
    economiesDP: ArrayDataProvider<unknown, unknown>;
    mapKeyToTitle: {
        balance: string;
        inflation: string;
        interest: string;
        gdp: string;
        manufactoringPmi: string;
    };
    currentEco: (currency: any) => {} | any;
    refreshedCalendar: any;
    infoByKey: any;
    calendarInvestingUrl: ko.Computed<string>;
    calendarTradingViewUrl: ko.Computed<string>;
    switchCurrencies: () => void;
    loadCalendarInitial: () => void;
    selectedCalendarView: ko.Observable<string>;
    calendarViews: ArrayDataProvider<string, string>;
    moreInfoIndicator: (economy: any, target: string) => void;
    getSecondEconomy: () => void;
    getCurrentBrowserOffsetTimezoneId: () => any;
    constructor();
    /**
     * Optional ViewModel method invoked after the View is inserted into the
     * document DOM.  The application can put logic that requires the DOM being
     * attached here.
     * This method might be called multiple times - after the View is created
     * and inserted into the DOM and after the View is reconnected
     * after being disconnected.
     */
    connected(): void;
    /**
     * Optional ViewModel method invoked after the View is disconnected from the DOM.
     */
    disconnected(): void;
    /**
     * Optional ViewModel method invoked after transition to the new View is complete.
     * That includes any possible animation between the old and the new View.
     */
    transitionCompleted(): void;
}
export = DashboardViewModel;
