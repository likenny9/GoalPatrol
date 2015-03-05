'use strict';
// Call this function when the page loads (the "ready" event)
$(document).ready(function() {
    initializePage();
})

function initializePage() {
    $(".a_version_home_click").click(function(){    
        woopra.track("a_version_home_click");
    })

    $(".b_version_home_click").click(function(){
        woopra.track("b_version_home_click");
    })
}

function doInspireMe() {
    var x;
    if (confirm("Today's inspiring message") == true) {
        x = "You pressed OK!";
    } else {
        x = "You pressed Cancel!";
    }
    //document.getElementById("demo").innerHTML = x;
}

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

$(function() {

    $('[id="logout"]').click(function(evt) {
        evt.preventDefault();

        $.get('/logout', afterLogout);

        function afterLogout(err) {
            window.location.href = '/index';
        }
    });

});