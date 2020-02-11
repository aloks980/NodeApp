const express = require('express');
const auctionRouter = express.Router();
const passport = require('passport');
const AuctionItemModel = require('../model/auction.item.module');
const BidModel = require('../model/bid.model');

function sendEmailsToAllBidsUser(bids){
  //write the code here for the mail configuration and send
  //unable to implement this functionality as do not have personal laptop
  // currently using compny laptop in which cannot implement email functionality for outside mail.

  console.log("all mail can be send here");
}

/* GET home page. */
auctionRouter.route('/')
  .get(passport.authenticate('jwt', { session: false }), (req, res, next) => {
    AuctionItemModel.find().populate('owner').populate('winner').then(items => {
      if (items.length == 0) {
        res.status(404);
        res.json({
          message: "Auction items not found!"
        });
      } else {
        res.status(200);
        res.json({
          message: "Auction items List",
          data: items
        });
      }
    }).catch(err => {
      return next(err);
    });
  })
  .post(passport.authenticate('jwt', { session: false }), (req, res, next) => {
    let itemRequest = req.body;
    itemRequest.owner = req.user._id;
    itemRequest.startTime = new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
    itemRequest.auctionStatus = "open";
    let startTime = new Date(itemRequest.startTime);
    let endTime = new Date(itemRequest.endTime);
    if(endTime.getTime() - startTime.getTime() < 0){
      res.status(500);
        res.json({
          message: "Invalid End Time. End time sould be a future date and time.",
        });
    }else{
    let auctionItem = new AuctionItemModel(itemRequest);
    auctionItem.save().then(data => {
      
      console.log(endTime.getTime() - startTime.getTime());
      setTimeout(() => {
        console.log(data.endTime, data.startTime);
        BidModel.find({ item: data._id }).then(bids => {
          if(bids.length === 0){
            AuctionItemModel.findByIdAndUpdate({ _id: data._id }, { auctionStatus: "closed"})
              .then(item => {
                console.log("Auction closed without any bid");
              }).catch(err => {
                console.log(err);
              });
          }else{
            let winnerBid = bids.reduce((prev, current)=>{
              return (prev.amount > current.amount) ? prev : current
            });
            AuctionItemModel.findByIdAndUpdate({ _id: data._id }, { auctionStatus: "closed", winner: winnerBid.user }).populate('winner').populate('owner')
              .then(item => {
                console.log("Winner details", );
                sendEmailsToAllBidsUser(bids);
              }).catch(err => {
                console.log(err);
              });
          }
        }).catch(err => {
          console.log(err);
        });
      }, endTime.getTime() - startTime.getTime());
      res.status(200);
      res.json({
        message: "Auction created.",
        data: data
      })
    }).catch(err => {
      return next(err);
    });
  }});

auctionRouter.get('/:auctionItemId', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  AuctionItemModel.findById(req.params.auctionItemId).populate('owner').populate('winner').then(item => {
    if (item) {
      res.status(200);
      res.json({
        message: "Auction item by Id",
        data: item
      });
    } else {
      res.status(404);
      res.json({
        message: "There is no  auction for Id: " + req.params.auctionItemId
      });
    }
  }).catch(err => {
    return next(err);
  });
})



module.exports = auctionRouter;
