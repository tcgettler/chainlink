const db = require('../models');
const igdb = require('igdb-api-node').default;
const client = igdb('5c81cc373f3f55c198577ec9cdcd18ac');
module.exports = function(app){

    app.get('/api/games', function(req,res){
        client.scrollAll('/games/?fields=name,popularity&order=popularity:desc').then(function(response){
            console.log(response);
            res.json(response);
        });
    });

};