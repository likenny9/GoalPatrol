
$(document).ready(function() {
    myFunction();
    //doFakeAlert();
    doFakeAcceptReject();

});

function myFunction() {
    var x;
    if (confirm("Press a button!") == true) {
        x = "You pressed OK!";
    } else {
        x = "You pressed Cancel!";
    }
    document.getElementById("demo").innerHTML = x;
}

/*function doFakeAlert() {
    

    $('#inspire1').click(function() {
        alert('You have been inspired!');
    });
    $('#inspire2').click(function() {
        alert('You have been inspired!');
    });

};*/

function doFakeAcceptReject() {
    $('.AccRej').on('click', function() {
        $(this).parents('div').hide();
        alert('Done');
    });
};

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