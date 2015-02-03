//document.getElementById("foot01").innerHTML =
//"<p>&copy;  " + new Date().getFullYear() + " UCSD COGS120/CSE170. All rights reserved.</p>";


(function () {
    var app = angular.module('myApp', []);

    app.controller('TabController', function () {
        this.tab = 1;

        this.setTab = function (tabId) {
            this.tab = tabId;
        };

        this.isSet = function (tabId) {
            return this.tab === tabId;
        };
    });
})();