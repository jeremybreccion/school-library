var express = require('express');
var router = express.Router();
var languages = require('../../config/language.json');

router.get('/getLanguages', function(req, res, next){
    res.status(200).send({languages: languages});
});

//setting each user's language is on routes/users.js

module.exports = router;