const db = ('../models');
const bcrypt = require('bcrypt');
var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;

module.exports = function(passport, user){
passport.use(new LocalStrategy(
  function(username, password, done) {
    var isValidPassword = function(userpass, pass) {
 
        return bCrypt.compareSync(pass, userpass);
     
    };
    db.User.find({where: { username: username }}, function(err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (!isValidPassword(user.password, password)) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    });
  }
));
};