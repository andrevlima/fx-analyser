define(["require", "exports", "knockout", "./appController", "ojs/ojknockout", "ojs/ojmodule", "ojs/ojnavigationlist", "ojs/ojbutton", "ojs/ojtoolbar"], function (require, exports, ko, appController_1) {
    "use strict";
    return class Root {
        static init() {
            function _init() {
                // bind your ViewModel for the content of the whole page body.
                ko.applyBindings(appController_1.default, document.getElementById("globalBody"));
            }
            // if running in a hybrid (e.g. Cordova) environment, we need to wait for the deviceready
            // event before executing any code that might interact with Cordova APIs or plugins.
            if (document.body.classList.contains("oj-hybrid")) {
                document.addEventListener("deviceready", _init);
            }
            else {
                _init();
            }
        }
    };
});
//# sourceMappingURL=root.js.map