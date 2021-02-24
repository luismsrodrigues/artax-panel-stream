const WebSocket = require('ws');

const wss = new WebSocket.Server({
  port: 3001,
  perMessageDeflate: {
    zlibDeflateOptions: {
      // See zlib defaults.
      chunkSize: 1024,
      memLevel: 7,
      level: 3
    },
    zlibInflateOptions: {
      chunkSize: 10 * 1024
    },
    // Other options settable:
    clientNoContextTakeover: true, // Defaults to negotiated value.
    serverNoContextTakeover: true, // Defaults to negotiated value.
    serverMaxWindowBits: 10, // Defaults to negotiated value.
    // Below options specified as default values.
    concurrencyLimit: 10, // Limits zlib concurrency for perf.
    threshold: 1024 // Size (in bytes) below which messages
    // should not be compressed.
  }
});

module.exports = () =>{
return {
  Setup: (GLOBAL_STATE) => {
    wss.on('connection', function connection(ws) {
      ws.send(JSON.stringify(["FIRST_TIME" , GLOBAL_STATE]));
    });
  },
  Notify: (GLOBAL_STATE) => {
    wss.clients.forEach((client) => {
      client.send(JSON.stringify(["UPDATE_STATE" , GLOBAL_STATE]));
    })
  },
  ProcessManager: (value) => {
    wss.clients.forEach((client) => {
      client.send(JSON.stringify(["PROCESS_MANAGER" , value]));
    })
  },
  LogUpdate: (type, message) => {
    wss.clients.forEach((client) => {
      client.send(JSON.stringify(["LOG_UPDATE" , type, message]));
    })
  }
}};