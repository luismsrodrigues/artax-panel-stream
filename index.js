const express = require('express');
const app = express();
const port = 3000

const MORGAN = require('morgan');
const PANEL_HTTP = require('./modules/panel-http-module');
const OBS_API = require('./modules/obs-api-module');
const GLOBAL_STATE = require('./modules/state-module');
const CS_INTEGRATIONS_HTTP = require('./modules/cs-integrations-module').Http;

app.use(MORGAN('combined'));
app.use('/static', express.static('public'));

app.use(PANEL_HTTP.Routes);
app.use("/api", OBS_API.Routes);
app.use("/api", CS_INTEGRATIONS_HTTP.Routes);


app.get('/global_status', async (req, res) => {
  try {
      res.json(GLOBAL_STATE);
  } catch (error) {
      DISCORD_INTEGRATIONS.Error(error);
      res.status(500).json({error, status: "error"});
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});