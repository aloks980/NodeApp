const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const UserModel = require('../model/user.model');

//Passport middleware to handle user registration
passport.use('signup', new localStrategy({
  usernameField : 'email',
  passwordField : 'password',
  passReqToCallback: true
}, async (req, email, password, done) => {
    try {
      let userData = new UserModel({
        "email" : email,
        "password":password,
        "fullName":req.body.fullName
      })
      const user = await userData.save();
      return done(null, user);
    } catch (error) {
      done(error);
    }
}));

//Passport middleware to handle user login
passport.use('login', new localStrategy({
    usernameField : 'email',
    passwordField : 'password'
  }, async (email, password, done) => {
    try {
      const user = await UserModel.findOne({ email });
      if( !user ){
        return done(null, false, { message : 'User not found'});
      }
      const validate = await user.isValidPassword(password);
      if( !validate ){
        return done(null, false, { message : 'Wrong Password'});
      }
      return done(null, user, { message : 'Logged in Successfully'});
    } catch (error) {
      return done(error);
    }
  }));

const JWTstrategy = require('passport-jwt').Strategy;
//We use this to extract the JWT sent by the user
const ExtractJWT = require('passport-jwt').ExtractJwt;

//This verifies that the token sent by the user is valid
passport.use(new JWTstrategy({
  secretOrKey : 'top_secret',
  jwtFromRequest : ExtractJWT.fromAuthHeaderAsBearerToken()
}, async (token, done) => {
  try {
    return done(null, token.user);
  } catch (error) {
    done(error);
  }
}));