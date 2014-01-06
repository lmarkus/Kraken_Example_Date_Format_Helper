'use strict';


var IndexModel = require('../models/index');


module.exports = function (app) {

    var model = new IndexModel();


    app.get('/', function (req, res) {

        var languages = ['en-US', 'fr-CA', 'es-ES'];
        res.locals.context = {
            locality: languages[ parseInt(Math.random() * languages.length, 10) ]
        };

        model.theDate = new Date();
        res.render('index', model);

    });

};
