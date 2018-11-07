const db = require('../models');
const bcrypt = require('bcrypt');
const passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy;
const keys= require('../config/config');

module.exports = function (app) {
  app.get('/api/keys/:key', function(req, res){
    if (req.params.key === ":tmdb"){
      res.json({ key: keys.tmdb_key});
    } else if (req.params.key === ":igdb"){
      res.json({ key: keys.igdb_key});
    }
  });

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
        profileImage: req.profile_image,
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

  app.get('/api/users/:id', function(req,res){
    db.User.find({where: { id: parseInt(req.params.id)}})
      .then(function(response){
        res.json(response);
      });
  })
  app.get('/api/friend/:user', function(req, res){
    db.User.findAll({ where: {username: req.params.user}})
    .then(function(response){
      console.log(response);
        res.json(response);
    });

  });
  app.get('/api/friendList/:user', function(req, res){
    db.Friends.findAll({ where: {UserId: parseInt(req.params.user)}})
    .then(function(response){
        res.json(response);
    });
  });

  app.delete('/api/friendList/:user', function(req, res){
    db.Friends.destroy({ where: {id: parseInt(req.params.user)}})
    .then(function(){
        res.json({success:'success'});
    });
  });

  app.get('/api/checkFriends', function(req, res){
      db.Friends.findAll({ where: {UserId: parseInt(req.query.user), username: req.query.username}})
      .then(function(response){
        if (response.length > 0){
          res.json({success: 'success'})
        } else {
        res.json({ success: 'failed'});
        };
      });
  });
  
  app.post('/api/user/addFriend', function(req, res){
    db.Friends.create({
      username: req.body.username,
      email: req.body.email,
      profileImage: req.body.profile_image,
      UserId: parseInt(req.body.userId)
    }).then(function(){
      res.json({ success: 'success'});
    });
  });

  app.get('/api/inventory/:user', function(req, res){
    db.Inventory.findAll({ where: {UserId: parseInt(req.params.user)}})
      .then(function(response){
        res.json(response);
      });
  });

  app.post('/api/newInvite/', function(req, res){
    db.Invite.create({
      name: req.body.name,
      date: req.body.date,
      UserId: parseInt(req.body.UserId)
    }).then(function(){
      res.json({ success: 'success'});
    });
  });

  app.get('/api/invites/:user', function(req, res){
    db.Invite.findAll({ where: {UserId: parseInt(req.params.user)}})
      .then(function(response){
        res.json(response);
      });
  })
};