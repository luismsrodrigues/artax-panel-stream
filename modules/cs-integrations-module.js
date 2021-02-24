const ROUTER = require('express').Router();
const CSGOGSI = require("node-csgo-gsi");
const { spawnSync } = require('child_process');
const DISCORD_INTEGRATIONS = require("./discord-integrations-module")();
const { CSGO, LOG, PROCESSING } = require('./state-module');

const GSI = new CSGOGSI({ port: 31313, authToken: 'Q79v5tcxVQ8u'});
GSI.on("all", function(data){
    CSGO.State.set(data);
});

async function KillAllProcessCsGo() {
    await spawnSync('powershell.exe', ['Stop-Process -Name "csgo"']);
    CSGO.State.set(null);
}

async function CheckSuccessConnectedToServer() {
    return new Promise(async (resolve, reject) => {
        let count = 0;

        let interval = await setInterval(async function() {
            if(count <= 10){
                if(CSGO.State.get() != null && CSGO.State.get()["map"]){
                    clearInterval(interval);
                    console.log(`Connected on server ${CSGO.Server.get()}`);
                    DISCORD_INTEGRATIONS.Info(`Connected on server ${CSGO.Server.get()}`);
                    resolve({connected: true});
                }
            }else{
                console.log(`Error on connect to server ${CSGO.Server.get()}`);
                DISCORD_INTEGRATIONS.Error(`Error on connect to server ${CSGO.Server.get()}`);
                clearInterval(interval);

                await KillAllProcessCsGo();
                reject({connected: false, error: true, errorMessage: "Fatal error trying connect server " + CSGO.Server.get()});
            }
            count++;
        }, 5000);
    });
}

ROUTER.get('/csgo/start/:ip', async (req, res) => {
    try {
        PROCESSING.set(true);
        LOG.set("INFO", "CONNECTING TO CS GO ON IP " + req.params["ip"]);
        CSGO.Server.set(req.params["ip"]);

        console.log(`Start-Process steam://run/730//+connect ${req.params["ip"]}%20-window`);
        DISCORD_INTEGRATIONS.Info(`Open CS GO on server ${req.params["ip"]}`);
    
        await spawnSync('powershell.exe', [`Start-Process "steam://run/730//+connect ${req.params["ip"]} %20-window"`]);
        
        await CheckSuccessConnectedToServer();
        
        CSGO.Running.set(true);
        CSGO.Errors.set([]);
        PROCESSING.set(false);
        LOG.set("SUCCESS", "CONNECTED ON CS GO | IP " + req.params["ip"]);
        res.json(CSGO);
        return;
    } catch (error) {
        DISCORD_INTEGRATIONS.Error(error);

        CSGO.Running.set(false);
        CSGO.Errors.set(error);
        PROCESSING.set(false);
        LOG.set("ERROR", "FATAL ERROR ON TRYING CONNECT TO CS GO | IP " + req.params["ip"]);
        res.status(500).json(CSGO);
    }
});

ROUTER.get('/csgo/stop', async (req, res) => {
    PROCESSING.set(true);
    LOG.set("INFO", "SHUTDOWN CS GO");
    await KillAllProcessCsGo();
    LOG.set("SUCCESS", "CS GO SHUTDOWN COMPLETED");
    PROCESSING.set(false);
    res.json({status: 'true'});
});

module.exports = {
    Http: {
        Routes: ROUTER
    }
}