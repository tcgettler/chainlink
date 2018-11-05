const express = require('express');
const passport = require("passport");
const session  = require('express-session')
const db = require('./models');
const path = require('path');

const app = express();

var PORT = process.env.PORT || 8080;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ secret: 'keyboard cat',resave: true, saveUninitialized:true})); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

require('./routes/api-routes.js')(app, passport);
require('./routes/html-routes.js')(app);
require("./config/passport.js")(passport, db.User);




db.sequelize.sync().then(function() {
    app.listen(PORT, function(){
        console.log("Listening on Port: "+ PORT);
    });
});