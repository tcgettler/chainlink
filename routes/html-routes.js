const path = require('path');

module.exports = function(app){
    app.get('/signup', function(req, res){
        res.sendFile(path.join(__dirname, '../public/pages/signup.html'));
    });

    app.get('/', function(req, res){
        res.sendFile(path.join(__dirname, '../public/index.html'))
    });

    app.get("/linkster", function(req, res){
        res.sendFile(path.join(__dirname, '/../public/pages/linkster.html'));
    });
    
    app.get('*', function(req, res){
        res.sendFile(path.join(__dirname, '../public/index.html'))
    })
};