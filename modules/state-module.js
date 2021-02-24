function validateNum(input, min, max) {
    var num = +input;
    return num >= min && num <= max && input === num.toString();
}

function validateIpAndPort(input) {
    if(input){
        var parts = input.split(":");
        var ip = parts[0].split(".");
        var port = parts[1];
        return validateNum(port, 1, 65535) &&
            ip.length == 4 &&
            ip.every(function (segment) {
                return validateNum(segment, 0, 255);
            });
    }else{
        return false;
    }
}


let GLOBAL_STATE = {
    LOG:{
        value: [],
        set: function (type, message) {
            GLOBAL_STATE.LOG.value.push({
                type,
                message
            });
            WEBSOCKET.LogUpdate({
                type,
                message
            });
        }
    },
    PROCESSING:{
        value: false,
        set: function (value) {
            GLOBAL_STATE.PROCESSING.value = value;
            WEBSOCKET.ProcessManager(value);
        }
    },
    OBS_PROVIDER: {
        Connected: {
            value: null,
            get: function () {
                return this.value;
            },
            set: function (value) {
                this.value = value;
                WEBSOCKET.Notify(GLOBAL_STATE);
            }
        },
        Errors: {
            value: null,
            get: function () {
                return this.value;
            },
            set: function (value) {
                this.value = value;
                WEBSOCKET.Notify(GLOBAL_STATE);
            }
        },
    },
    CSGO:{
        Running: {
            value: null,
            get: function () {
                return this.value;
            },
            set: function (value) {
                this.value = value;
                WEBSOCKET.Notify(GLOBAL_STATE);
            }
        },
        Server: {
            value: null,
            get: function () {
                return this.value;
            },
            set: function (value) {
                if(!validateIpAndPort(value)){
                    throw "Invalid ip server " + value;
                }
                this.value = value;
                WEBSOCKET.Notify(GLOBAL_STATE);
            }
        },
        State: {
            value: null,
            get: function () {
                return this.value;
            },
            set: function (value) {
                this.value = value;
                // WEBSOCKET.Notify(GLOBAL_STATE);
            }
        },
        Errors: {
            value: null,
            get: function () {
                return this.value;
            },
            set: function (value) {
                this.value = value;
                // WEBSOCKET.Notify(GLOBAL_STATE);
            }
        },
    },
    STREAM:{
        Running: {
            value: null,
            get: function () {
                return this.value;
            },
            set: function (value) {
                this.value = value;
                // WEBSOCKET.Notify(GLOBAL_STATE);
            }
        },
        Scenes: {
            value: null,
            get: function () {
                return this.value;
            },
            set: function (value) {
                this.value = value;
                // WEBSOCKET.Notify(GLOBAL_STATE);
            }
        },
        SceneActive: {
            value: null,
            get: function () {
                return this.value;
            },
            set: function (value) {
                this.value = value;
                // // WEBSOCKET.Notify(GLOBAL_STATE);
            }
        },
    },
}

const WEBSOCKET = require('./ws-integrations-module')();

module.exports = GLOBAL_STATE;