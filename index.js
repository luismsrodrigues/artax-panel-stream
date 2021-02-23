const EXPRESS = require('express');
const DEBUG = require('debug')("APP");
const APP = EXPRESS();
const PORT = 3000;

const PANEL_HTTP = require('./modules/panel-http-module');
const OBS_API = require('./modules/obs-api-module');
const GLOBAL_STATE = require('./modules/state-module');
const CS_INTEGRATIONS_HTTP = require('./modules/cs-integrations-module').Http;

APP.use('/static', EXPRESS.static('public'));

APP.use(PANEL_HTTP.Routes);
APP.use("/api", OBS_API.Routes);
APP.use("/api", CS_INTEGRATIONS_HTTP.Routes);


APP.get('/global_status', async (req, res) => {
  try {
      res.json(GLOBAL_STATE);
  } catch (error) {
      DISCORD_INTEGRATIONS.Error(error);
      res.status(500).json({error, status: "error"});
  }
});

APP.listen(PORT, () => {
  DEBUG(`Example app listening at http://localhost:${PORT}`);
});