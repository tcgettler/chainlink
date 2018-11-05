const bcrypt = require('bcrypt');
const LocalStrategy = require('passport-local').Strategy;

module.exports = function(passport, user){
  let User = user;
  passport.serializeUser(function (user, done) {
    console.log("serialize")
    done(null, user.id);
  });


  passport.deserializeUser(function(id, done) {
    User.findById(id).then(function(user) {
      if(user){
        done(null, user.get());
      }
      else{
        done(user.errors,null);
      }
    });

}); 
  //LOCAL SIGNIN
  passport.use('local-signin', new LocalStrategy(
    
    {
    passReqToCallback : true // allows us to pass back the entire request to the callback
    },
  
    function(req, username, password, done) {
  
      var User = user;
  
      var isValidPassword = function(userpass,password){
        return bcrypt.compareSync(password, userpass);
      }
  
      User.findOne({ where : { username: username}}).then(function (user) {
        if (!user) {
          return done(null, false, { message: 'Email does not exist' });
        }
  
        if (!isValidPassword(user.password,password)) {
  
          return done(null, false, { message: 'Incorrect password.' });
  
        }
  
        var userinfo = user.get();
        console.log("On to the next one");
        return done(null,userinfo);
  
      }).catch(function(err){
  
        console.log("Error:",err);
  
        return done(null, false, { message: 'Something went wrong with your Signin' });
  
  
      });
  
    }
    ));
};