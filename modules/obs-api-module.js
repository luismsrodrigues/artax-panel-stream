const ROUTER = require('express').Router();
const DISCORD = require('./discord-integrations-module')();
const { OBS_PROVIDER, LOG, PROCESSING } = require('./state-module');
const OBSWebSocket = require('obs-websocket-js');
const obs = new OBSWebSocket();

async function sendCommand(command, params) {
    try {
      return await obs.send(command, params || {});
    } catch (e) {
      console.log('Error sending command', command, ' - error is:', e);
      return {};
    }
}

ROUTER.get('/stream/scenes', async (req, res) => {
    
    let data = await sendCommand('GetSceneList');

    res.json(data);
});
    
ROUTER.get('/stream/game', async (req, res) => {
    
    await sendCommand('SetPreviewScene', { 'scene-name': "CS GO GAME"  });
    await sendCommand('TransitionToProgram');

    res.json({status: 2});
});

ROUTER.get('/stream/start', async (req, res) => {
    
    await sendCommand('SetPreviewScene', { 'scene-name': "STARTING"  });
    await sendCommand('TransitionToProgram');
    await sendCommand('StartStreaming');

    res.json({status: 'starting'});
});

ROUTER.get('/stream/pre-stop', async (req, res) => {
    
    await sendCommand('SetPreviewScene', { 'scene-name': "STOPPING"  });
    await sendCommand('TransitionToProgram');
    res.json({status: 'starting'});
});

ROUTER.get('/stream/stop', async (req, res) => {
    
    await sendCommand('StopStreaming');

    res.json({status: 'starting'});
});

ROUTER.get('/stream/connect', async (req, res) => {

    PROCESSING.set(true);
    LOG.set("INFO","CONNECTING TO OBS PROVIDER");

    try {
        await obs.connect({
            address: 'localhost:4444',
            password: 'camelo123'
        });   

        OBS_PROVIDER.Connected.set(true);
        OBS_PROVIDER.Errors.set([]);
        
    } catch (error) {
        console.error("Error on trying connect." + error);
        DISCORD.Error(error);
        
        OBS_PROVIDER.Connected.set(false);
        OBS_PROVIDER.Errors.set(error);
    
        LOG.set("ERROR", JSON.stringify(error));
        PROCESSING.set(false);
        res.status(500).json(OBS_PROVIDER);
        return;
    }

    LOG.set("SUCCESS", "OBS PROVIDER CONNECTED");
    PROCESSING.set(false);
    res.json(OBS_PROVIDER);
});


module.exports = {
    Routes: ROUTER
}