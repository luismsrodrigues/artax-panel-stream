const ROUTER = require('express').Router();
const CSGOGSI = require("node-csgo-gsi");
const { spawnSync } = require('child_process');
const DISCORD_INTEGRATIONS = require("./discord-integrations-module")();

function validateNum(input, min, max) {
    var num = +input;
    return num >= min && num <= max && input === num.toString();
}

function validateIpAndPort(input) {
    var parts = input.split(":");
    var ip = parts[0].split(".");
    var port = parts[1];
    return validateNum(port, 1, 65535) &&
        ip.length == 4 &&
        ip.every(function (segment) {
            return validateNum(segment, 0, 255);
        });
}

const GLOBAL_STATE = {
    Connected: {
        value: false,
        get: function () {
            return this.value;
        },
        set: function (value) {
            this.value = value;
        }
    },
    Server: {
        value: false,
        get: function () {
            return this.value;
        },
        set: function (value) {
            if(!validateIpAndPort(value)){
                throw "Invalid ip server " + value;
            }
            this.value = value;
        }
    },
    CS_GO_STATE: {
        value: null,
        get: function () {
            return this.value;
        },
        set: function (value) {
            this.value = value;
        }
    },
}

const GSI = new CSGOGSI({ port: 31313, authToken: 'Q79v5tcxVQ8u'});
GSI.on("all", function(data){
    GLOBAL_STATE.CS_GO_STATE.set(data);
});

async function KillAllProcessCsGo() {
    await spawnSync('powershell.exe', ['Stop-Process -Name "csgo"']);
    GLOBAL_STATE.CS_GO_STATE.set(null);
}

async function CheckSuccessConnectedToServer() {
    return new Promise(async (resolve, reject) => {
        let count = 0;

        let interval = await setInterval(async function() {
            if(count <= 10){
                if(GLOBAL_STATE.CS_GO_STATE.get() != null && GLOBAL_STATE.CS_GO_STATE.get()["map"]){
                    clearInterval(interval);
                    console.log(`Connected on server ${GLOBAL_STATE.Server.get()}`);
                    DISCORD_INTEGRATIONS.Info(`Connected on server ${GLOBAL_STATE.Server.get()}`);
                    resolve({connected: true});
                }
            }else{
                console.log(`Error on connect to server ${GLOBAL_STATE.Server.get()}`);
                DISCORD_INTEGRATIONS.Error(`Error on connect to server ${GLOBAL_STATE.Server.get()}`);
                clearInterval(interval);

                await KillAllProcessCsGo();
                reject({connected: false, error: true, errorMessage: "Fatal error trying connect server " + GLOBAL_STATE.Server.get()});
            }
            count++;
        }, 5000);
    });
}

ROUTER.get('/start/csgo/:ip', async (req, res) => {
    try {
        GLOBAL_STATE.Server.set(req.params["ip"]);

        console.log(`Start-Process steam://run/730//+connect ${req.params["ip"]}%20-window`);
        DISCORD_INTEGRATIONS.Info(`Open CS GO on server ${req.params["ip"]}`);
    
        await spawnSync('powershell.exe', [`Start-Process "steam://run/730//+connect ${req.params["ip"]} %20-window"`]);
        
        await CheckSuccessConnectedToServer();
        
        res.json({status: 'open'});
    } catch (error) {
        DISCORD_INTEGRATIONS.Error(error);
        res.json({error, status: "error"});
    }
});

ROUTER.get('/stop/csgo', async (req, res) => {
    await KillAllProcessCsGo();
    res.json({status: 'true'});
});

module.exports = {
    Http: {
        Routes: ROUTER
    }
}