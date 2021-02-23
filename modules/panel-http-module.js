const ROUTER = require('express').Router();
const PATH = require('path');

ROUTER.get('/', function(req, res) {
    res.sendFile(PATH.join(__dirname, '..' ,'/public/index.html'));
});

module.exports = {
    Routes: ROUTER
}