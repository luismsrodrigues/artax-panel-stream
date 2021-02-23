const ROUTER = require('express').Router();
const DISCORD = require('./discord-integrations-module')();
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
    let result = {
        connected: false
    };

    try {
        await obs.connect({
            address: 'localhost:4444',
            password: 'camelo123'
        });   

        console.log("OBS connected.");
        result.connected = true;
    } catch (error) {
        result.connected = false;
        console.error("Error on trying connect." + error);
        DISCORD.Error(error);
    }

    res.json(result);
});


module.exports = {
    Routes: ROUTER
}