const db = require('../models');
const bcrypt = require('bcrypt');
const passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy;

module.exports = function (app) {

  app.post('/api/newUser', function (req, res) {
    let hash = bcrypt.hashSync(req.body.password, 10);
    db.User.create({
      username: req.body.name,
      password: hash,
      email: req.body.email
    }).then(function (response) {
      res.json(response);
    });
  });

  app.post('/login',
    passport.authenticate('local-signin'),
    function (req, res) {
      res.json({
        user: req.user,
        profile_image: req.profile_image,
        success: true
      });
    });

  function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
      return next();
    res.redirect('/signin' );
  }

  app.get('/login', isLoggedIn, function(req, res){
      res.json(req.user);
  })

  app.post('/inventory/addNew', function(req, res) {
    
      db.Inventory.create({
        type: req.body.type,
        mediaID: parseInt(req.body.mediaID),
        coverArt:req.body.coverArt,
        owned: req.body.owned,
        UserId: parseInt(req.body.userId)
      }).then(function(response){
          res.json({success: true});
      });
  })

  app.get('/api/checkInventory', function(req, res){
        db.Inventory.find({ where: {UserId: parseInt(req.query.user), mediaId: parseInt(req.query.mediaID)}})
        .then(function(response){
            res.json(response);
        });
  });

  app.put('/api/updateInventory', function(req, res){
    db.Inventory.update({owned: req.body.owned}, {where: {UserId: parseInt(req.body.UserId), mediaId: parseInt(req.body.mediaID)}})
      .then(function(){
         res.json({ success: "success"});
      });
  })
};