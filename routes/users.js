const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');

const userRouter = express.Router();

//When the user sends a post request to this route, passport authenticates the user based on the
//middleware created previously
userRouter.post('/signup', passport.authenticate('signup', { session : false }) , async (req, res, next) => {
  res.json({ 
    message : 'Signup successful',
    user : req.user 
  });
});

userRouter.post('/login', async (req, res, next) => {
  passport.authenticate('login', async (err, user, info) => {     try {
      if(err || !user){
        const error = new Error('An Error occurred')
        return next(error);
      }
      req.login(user, { session : false }, async (error) => {
        if( error ) return next(error)
        const body = { _id : user._id, email : user.email };
        const token = jwt.sign({ user : body },'top_secret');
        return res.json({ token });
      });     } catch (error) {
      return next(error);
    }
  })(req, res, next);
});

userRouter.get('/profile', passport.authenticate('jwt', { session : false }), (req, res, next) => {
  res.json({
    message : 'Logged In!',
    user : req.user,
  })
});

module.exports = userRouter;
