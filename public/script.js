//UTILS
const ALERT_REF = $("#alert");

function object_equals( x, y ) {
  if ( x === y ) return true;
    // if both x and y are null or undefined and exactly the same

  if ( ! ( x instanceof Object ) || ! ( y instanceof Object ) ) return false;
    // if they are not strictly equal, they both need to be Objects

  if ( x.constructor !== y.constructor ) return false;
    // they must have the exact same prototype chain, the closest we can do is
    // test there constructor.

  for ( var p in x ) {
    if ( ! x.hasOwnProperty( p ) ) continue;
      // other properties were tested using x.constructor === y.constructor

    if ( ! y.hasOwnProperty( p ) ) return false;
      // allows to compare x[ p ] and y[ p ] when set to undefined

    if ( x[ p ] === y[ p ] ) continue;
      // if they have the same strict value or identity then they are equal

    if ( typeof( x[ p ] ) !== "object" ) return false;
      // Numbers, Strings, Functions, Booleans must be strictly equal

    if ( ! object_equals( x[ p ],  y[ p ] ) ) return false;
      // Objects and Arrays must be tested recursively
  }

  for ( p in y )
    if ( y.hasOwnProperty( p ) && ! x.hasOwnProperty( p ) )
      return false;
        // allows x[ p ] to be set to undefined

  return true;
}

function WhitAnimation(element) {
  element
  .hide()
  .fadeIn(500);
}

const UTIL = {
  Animation: (element) => WhitAnimation(element),
  Alert: (message, type, timeout) => {
    UTIL.Animation(ALERT_REF);

    function RemoveAllClass() {
      ALERT_REF.removeClass("alert-danger");
      ALERT_REF.removeClass("alert-success");
      ALERT_REF.removeClass("alert-info");
    }
    
    switch (type.toUpperCase()) {

      case 'ERROR':
        RemoveAllClass();
        ALERT_REF.addClass("alert-danger");
          break;
      case 'SUCCESS':
        RemoveAllClass();
        ALERT_REF.addClass("alert-success");
          break;
      case 'INFO':
        RemoveAllClass();
        ALERT_REF.addClass("alert-info");
      default:
          break;
    }

    ALERT_REF.text(message);

    $(`<button type="button" class="close"><span aria-hidden="true">&times;</span></button>`)
    .appendTo(ALERT_REF)

    if(timeout){
      setTimeout(() => {
        ALERT_REF.fadeOut("slow", function() {
          ALERT_REF.css('display', 'none'); 
        });
      }, timeout);
    }
  }
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
    UTIL.Animation($(`<a href=\"#\" class=\"list-group-item list-group-item-action shadow-sm\"><span class=\"badge badge-${type}\">${span}</span> ${message}</a>`)
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

function LoadLogsFromStore(store) {
  console.log(store);
  if(!store || !store.LOG || !store.LOG.value){
    return;
  }

  store.LOG.value.forEach(log => {
    AddLog(log.message, log.type);
  });
}
$(document).ready(function(){
  $('.toast').toast('show');
  OVERLAY.Stop();
});

//CLIENT

async function GetMethod(path) {
  OVERLAY.Start();

  try {
    const result = await $.ajax({
      url: path,
      type: 'GET'
    });

    return result;
  } catch (error) {
    throw error.responseJSON;
  }
}

const CLIENT = {
  OBS: {
    Connect: async () => {
      let result = await GetMethod("/api/stream/connect");
      return result;
    }
  },
  CSGO: {
    Connect: async (ip) => {
      let result = await GetMethod("/api/csgo/start/" + ip);
      return result;
    },
    Stop: async () => {
      let result = await GetMethod("/api/csgo/stop");
      return result;
    },
  }
}
  
//OBS PROVIDER
const OBS_PROVIDER_BUTTON = $("#obs-provider-connect");
const OBS_PROVIDER_STATUS = $("#obs-provider-status");

const OBS_PROVIDER_STATE = {
  Connected: false,
  OnConnect: () => {
    OBS_PROVIDER_BUTTON.addClass("list-group-item-success");
    OBS_PROVIDER_BUTTON.text("OBS CONNECT (connected)");
    CSGO_PROVIDER_STATE.Connected = true;

    UTIL.Animation(OBS_PROVIDER_STATUS);
    OBS_PROVIDER_STATUS.text("ON");
    OBS_PROVIDER_STATUS.removeClass("badge-danger");
    OBS_PROVIDER_STATUS.addClass("badge-success");

    OBS_PROVIDER_STATE.Connected = true;
  },
  OnDisconnect: () => {
    OBS_PROVIDER_BUTTON.removeClass("list-group-item-success");
    OBS_PROVIDER_BUTTON.text("OBS CONNECT (disconnected)");

    UTIL.Animation(OBS_PROVIDER_STATUS);
    OBS_PROVIDER_STATUS.text("OFF");
    OBS_PROVIDER_STATUS.removeClass("badge-success");
    OBS_PROVIDER_STATUS.addClass("badge-danger");

    OBS_PROVIDER_STATE.Connected = false;
  },
  Init: (state) => {
    if(state.OBS_PROVIDER.Connected.value){
      OBS_PROVIDER_STATE.OnConnect();
    }else{
      OBS_PROVIDER_STATE.OnDisconnect();
    }
  }
}

OBS_PROVIDER_BUTTON.click(async () => {

  if(OBS_PROVIDER_STATE.Connected){
    return;ç
  }

  try {
    await CLIENT.OBS.Connect();
    OBS_PROVIDER_STATE.OnConnect();
  } catch (error) {
    OBS_PROVIDER_STATE.OnDisconnect();
  }
});

//CS GO PROVIDER

const CSGO_PROVIDER_START_BUTTON = $("#csgo-provider-start");
const CSGO_PROVIDER_STOP_BUTTON = $("#csgo-provider-stop");

const CSGO_PROVIDER_STATE = {
  Connected: false,
  OnConnect: () => {
    UTIL.Animation(OBS_PROVIDER_BUTTON);
    CSGO_PROVIDER_START_BUTTON.addClass("list-group-item-success");
    CSGO_PROVIDER_START_BUTTON.text("START/CONNECT CSGO (running)");
    CSGO_PROVIDER_STATE.Connected = true;
  },
  OnDisconnect: () => {
    UTIL.Animation(OBS_PROVIDER_BUTTON);
    CSGO_PROVIDER_START_BUTTON.removeClass("list-group-item-success");
    CSGO_PROVIDER_START_BUTTON.text("START/CONNECT CSGO (stopped)");
    CSGO_PROVIDER_STATE.Connected = false;
  },
  Init: (state) => {
    if(state.CSGO.Running.value){
      CSGO_PROVIDER_STATE.OnConnect();
    }else{
      CSGO_PROVIDER_STATE.OnDisconnect();
    }
  }
}

CSGO_PROVIDER_START_BUTTON.click(async () => {
  if(CSGO_PROVIDER_STATE.Connected){
    return;
  }

  try {
    await CLIENT.CSGO.Connect("192.168.1.9:25254");
    CSGO_PROVIDER_STATE.OnConnect();
  } catch (error) {
    CSGO_PROVIDER_STATE.OnDisconnect();
  }
});

CSGO_PROVIDER_STOP_BUTTON.click(async () => {
  if(!CSGO_PROVIDER_STATE.Connected){
    return;
  }

  try {
    await CLIENT.CSGO.Stop();
    CSGO_PROVIDER_STATE.OnDisconnect();
  } catch (error) {
  }
});

//WEBSOCKET
const WS_CLIENT = new WebSocket("ws://localhost:3001");

WS_CLIENT.addEventListener("open", () => {
  AddLog("Connected to websocket server.","SUCCESS");
});

WS_CLIENT.addEventListener("error", () => {
  AddLog("Error on trying connect to websocket server","ERROR");
});

let globalState = {};

WS_CLIENT.addEventListener("message", ({data}) => {
  let temp = JSON.parse(data);

  console.log(temp);

  switch (temp[0]) {
    case "PROCESS_MANAGER":
      if(temp[1]){
        OVERLAY.Start();
      }else{
        OVERLAY.Stop();
      }
      break;
      case "LOG_UPDATE":
          AddLog(temp[1].message, temp[1].type);
        break;
    case "UPDATE_STATE":
      if(!object_equals(temp[1], globalState)){
        globalState = temp[1];
        OBS_PROVIDER_STATE.Init(globalState);
        CSGO_PROVIDER_STATE.Init(globalState);
      }
      break;
    case "FIRST_TIME":
          globalState = temp[1];
          OBS_PROVIDER_STATE.Init(globalState);
          CSGO_PROVIDER_STATE.Init(globalState);
          LoadLogsFromStore(globalState);

          if(globalState.PROCESSING.value){
            OVERLAY.Start();
          }else{
            OVERLAY.Stop();
          }
        break;
    case "ALERT_UPDATE":
        UTIL.Alert(temp[1], temp[2], 5000);
        break;
    default:
      break;
  }
});

WS_CLIENT.addEventListener("processing", ({data}) => {
 console.log("processing", data);
});
