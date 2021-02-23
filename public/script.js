const SERVER_INPUT = $("#server-ip");
const OBS_STATUS = $("#obs-status");
const CSGO_STATUS = $("#csgo-status");

const START_STERAM = $("#start-stream");
const IN_GAME = $("#in-game");
const PRE_STOP = $("#pre-stop");
const STOP_STERAM = $("#stop-stream");

$('body').append('<div style="" id="loadingDiv"><div class="loader">Loading...</div></div>');

function ChangeStatusToConnected(input) {
    input.text("CONNECTED");
    input.removeClass("text-danger");
    input.addClass("text-success");
}

function ChangeStatusToNotConnected(input) {
    input.text("NOT CONNECTED");
    input.removeClass("text-success");
    input.addClass("text-danger");
}

$(window).on('load', function(){
  $.get(`/api/stream/connect`, function(data, status){
        alert("OBS CONNECTED");
        ChangeStatusToConnected(OBS_STATUS);
    })
    .fail(function () {
        alert("Error on connect to OBS");
        ChangeStatusToNotConnected(OBS_STATUS);
    })
    .always(function () {
        removeLoader();
    });
});

function removeLoader(){
    $( "#loadingDiv" ).fadeOut(500, function() {
      $( "#loadingDiv" ).remove(); 
  });  
}

$( "#server-submit" ).click(function() {
    $('body').append('<div style="" id="loadingDiv"><div class="loader">Loading...</div></div>');
    $.get(`/api/csgo/start/${SERVER_INPUT.val()}`, function(data, status){
        alert("Cs go open!");
        ChangeStatusToConnected(CSGO_STATUS);
    })
    .fail(function () {
        alert("Error on connect to server");
        ChangeStatusToNotConnected(CSGO_STATUS);
    })
    .always(function () {
        removeLoader();
    });
});

START_STERAM.click(function () {
    $('body').append('<div style="" id="loadingDiv"><div class="loader">Loading...</div></div>');
    $.get(`/api/stream/start`, function(data, status){
        alert("Stream started!");
    })
    .fail(function () {
        alert("Error on started stream");
    })
    .always(function () {
        removeLoader();
    });
})

IN_GAME.click(function () {
    $('body').append('<div style="" id="loadingDiv"><div class="loader">Loading...</div></div>');
    $.get(`/api/stream/game`, function(data, status){
        alert("Stream change to in game!");
    })
    .fail(function () {
        alert("Error on change to in game stream");
    })
    .always(function () {
        removeLoader();
    });
})

PRE_STOP.click(function () {
    $('body').append('<div style="" id="loadingDiv"><div class="loader">Loading...</div></div>');
    $.get(`/api/stream/pre-stop`, function(data, status){
        alert("Stream change to pre stop!");
    })
    .fail(function () {
        alert("Error on change to pre stop stream");
    })
    .always(function () {
        removeLoader();
    });
})

STOP_STERAM.click(function () {
    $('body').append('<div style="" id="loadingDiv"><div class="loader">Loading...</div></div>');
    $.get(`/api/stream/stop`, function(data, status){
        alert("Stream stopped!");
    })
    .fail(function () {
        alert("Error on stop stream");
    })
    .always(function () {
        removeLoader();
    });
})