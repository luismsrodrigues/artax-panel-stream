function WhitAnimation(element) {
  element
  .hide()
  .fadeIn(1000);
}

//OVERLAY
const OVERLAY_REF = $("#overlay");

const OVERLAY = {
  Start: () => OVERLAY_REF.fadeIn("slow", function() {
      OVERLAY_REF.css('display', 'block'); 
  }),
  Stop: () => OVERLAY_REF.fadeOut("slow", function() {
    OVERLAY_REF.css('display', 'none'); 
  }),
}

//LOGGER
const LOGGER_REF = $("#logger");

function AddLog(message, type) {

  function AppendWithType(type, span) {
    WhitAnimation($(`<a href=\"#\" class=\"list-group-item list-group-item-action shadow-sm\"><span class=\"badge badge-${type}\">${span}</span> ${message}</a>`)
    .appendTo(LOGGER_REF));
  }

  switch (type.toUpperCase()) {

    case 'ERROR':
        AppendWithType("danger", "ERROR");
        break;
    case 'SUCCESS':
        AppendWithType("success", "SUCCESS");
        break;
    case 'INFO':
    default:
        AppendWithType("info", "INFO");
        break;
  }

  LOGGER_REF.scrollTop(LOGGER_REF[0].scrollHeight);
}

setInterval(() => {
  AddLog("TEST LOGGER 123", "INFO");
}, 500);

$(document).ready(function(){
  $('.toast').toast('show');
  OVERLAY.Stop();
});

//OBS PROVIDER

const OBS_PROVIDER_BUTTON = $("#obs-provider-connect");
const OBS_PROVIDER_STATUS = $("#obs-provider-status");

const OBS_PROVIDER_STATE = {
  Connected: false,
  OnConnect: () => {
    WhitAnimation(OBS_PROVIDER_BUTTON);
    OBS_PROVIDER_BUTTON.text("CONNECTED");
    OBS_PROVIDER_BUTTON.removeClass("btn-outline-success");
    OBS_PROVIDER_BUTTON.addClass("btn-success");

    WhitAnimation(OBS_PROVIDER_STATUS);
    OBS_PROVIDER_STATUS.text("ON");
    OBS_PROVIDER_STATUS.removeClass("badge-danger");
    OBS_PROVIDER_STATUS.addClass("badge-success");

    OBS_PROVIDER_STATE.Connected = true;
  },
  OnDisconnect: () => {
    WhitAnimation(OBS_PROVIDER_BUTTON);
    OBS_PROVIDER_BUTTON.text("CONNECT");
    OBS_PROVIDER_BUTTON.removeClass("btn-success");
    OBS_PROVIDER_BUTTON.addClass("btn-outline-success");

    WhitAnimation(OBS_PROVIDER_STATUS);
    OBS_PROVIDER_STATUS.text("OFF");
    OBS_PROVIDER_STATUS.removeClass("badge-success");
    OBS_PROVIDER_STATUS.addClass("badge-danger");

    OBS_PROVIDER_STATE.Connected = false;
  }
}

OBS_PROVIDER_BUTTON.click(() => {

  if(OBS_PROVIDER_STATE.Connected){
    return;
  }

  OVERLAY.Start();

  setTimeout(() => {
    OBS_PROVIDER_STATE.OnConnect();

    setTimeout(() => {
      OBS_PROVIDER_STATE.OnDisconnect();
    }, 2000);

    OVERLAY.Stop();
  }, 2000);
});

// const SERVER_INPUT = $("#server-ip");
// const OBS_STATUS = $("#obs-status");
// const CSGO_STATUS = $("#csgo-status");

// const START_STERAM = $("#start-stream");
// const IN_GAME = $("#in-game");
// const PRE_STOP = $("#pre-stop");
// const STOP_STERAM = $("#stop-stream");

// $('body').append('<div style="" id="loadingDiv"><div class="loader">Loading...</div></div>');

// function ChangeStatusToConnected(input) {
//     input.text("CONNECTED");
//     input.removeClass("text-danger");
//     input.addClass("text-success");
// }

// function ChangeStatusToNotConnected(input) {
//     input.text("NOT CONNECTED");
//     input.removeClass("text-success");
//     input.addClass("text-danger");
// }

// $(window).on('load', function(){
//   $.get(`/api/stream/connect`, function(data, status){
//         alert("OBS CONNECTED");
//         ChangeStatusToConnected(OBS_STATUS);
//     })
//     .fail(function () {
//         alert("Error on connect to OBS");
//         ChangeStatusToNotConnected(OBS_STATUS);
//     })
//     .always(function () {
//         removeLoader();
//     });
// });

// function removeLoader(){
//     $( "#loadingDiv" ).fadeOut(500, function() {
//       $( "#loadingDiv" ).remove(); 
//   });  
// }

// $( "#server-submit" ).click(function() {
//     $('body').append('<div style="" id="loadingDiv"><div class="loader">Loading...</div></div>');
//     $.get(`/api/csgo/start/${SERVER_INPUT.val()}`, function(data, status){
//         alert("Cs go open!");
//         ChangeStatusToConnected(CSGO_STATUS);
//     })
//     .fail(function () {
//         alert("Error on connect to server");
//         ChangeStatusToNotConnected(CSGO_STATUS);
//     })
//     .always(function () {
//         removeLoader();
//     });
// });

// START_STERAM.click(function () {
//     $('body').append('<div style="" id="loadingDiv"><div class="loader">Loading...</div></div>');
//     $.get(`/api/stream/start`, function(data, status){
//         alert("Stream started!");
//     })
//     .fail(function () {
//         alert("Error on started stream");
//     })
//     .always(function () {
//         removeLoader();
//     });
// })

// IN_GAME.click(function () {
//     $('body').append('<div style="" id="loadingDiv"><div class="loader">Loading...</div></div>');
//     $.get(`/api/stream/game`, function(data, status){
//         alert("Stream change to in game!");
//     })
//     .fail(function () {
//         alert("Error on change to in game stream");
//     })
//     .always(function () {
//         removeLoader();
//     });
// })

// PRE_STOP.click(function () {
//     $('body').append('<div style="" id="loadingDiv"><div class="loader">Loading...</div></div>');
//     $.get(`/api/stream/pre-stop`, function(data, status){
//         alert("Stream change to pre stop!");
//     })
//     .fail(function () {
//         alert("Error on change to pre stop stream");
//     })
//     .always(function () {
//         removeLoader();
//     });
// })

// STOP_STERAM.click(function () {
//     $('body').append('<div style="" id="loadingDiv"><div class="loader">Loading...</div></div>');
//     $.get(`/api/stream/stop`, function(data, status){
//         alert("Stream stopped!");
//     })
//     .fail(function () {
//         alert("Error on stop stream");
//     })
//     .always(function () {
//         removeLoader();
//     });
// })
