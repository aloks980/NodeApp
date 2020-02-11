const createError = require('http-errors');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const UserModel = require('./model/user.model');
const AuctionItemModel = require('./model/auction.item.module');
const BidModel = require('./model/bid.model');
const logger = require('morgan');

let auctionItemRouter = require('./routes/auction.item');
let usersRouter = require('./routes/users');
let bidRouter = require('./routes/bid');

var opt = {
  auth: {
      authSource: "admin",
      user:"user1",
      password:"password123"
  }
};
var mongoURL = 'mongodb://localhost:27017/assignment'

//MongoDB connection
mongoose.connect(mongoURL, opt);
mongoose.connection.on('connected', function () {
  console.log("Connection to Mongo established successfully..");
});

mongoose.connection.on('error', error => console.log(error) );
mongoose.Promise = global.Promise;

var app = express();

require('./auth/auth');

app.use( bodyParser.urlencoded({ extended : false }) );
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/auction', auctionItemRouter);
app.use('/bid', bidRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send(res.locals.message);
});

module.exports = app;
