const db = require('../models');
const bcrypt = require('bcrypt');
const passport = require('passport'), LocalStrategy = require('passport-local').Strategy;

module.exports = function(app){

    app.post('/api/newUser', function(req,res){
        let hash = bcrypt.hashSync(req.body.password, 10);
        db.User.create({
            username: req.body.name,
            password: hash,
            email: req.body.email
        }).then(function(response){
            res.json(response);
        });
    });

    app.post('/login',
    passport.authenticate('local', { successRedirect: '/',
                                   failureRedirect: '/login',
                                   failureFlash: true })
    );
};