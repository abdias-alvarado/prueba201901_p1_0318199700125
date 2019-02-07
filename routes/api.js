var express = require('express');
var router = express.Router();

var empresas = require('./api/empresas');


router.use('/empresas', empresas);


module.exports = router;
