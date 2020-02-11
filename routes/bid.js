const express = require('express');
const passport = require('passport');
const BidModel = require('../model/bid.model');
const AuctionItemModel = require('../model/auction.item.module')

const bidRouter = express.Router();

bidRouter.get('/', passport.authenticate('jwt', { session: false }), (req, res, next) => {
    //get all bids of the user
    BidModel.find({ user: req.user._id }).populate("item").populate("user").then(bids => {
        if (bids.length == 0) {
            res.status(404);
            res.json({
                message: "There is no Bid. Start Bidding!"
            });
        } else {
            res.status(200);
            res.json({
                message: "Bids List",
                data: bids
            });
        }
    }).catch(err => {
        return next(err);
    });
})

bidRouter.route('/:auctionItemId')
    .get(passport.authenticate('jwt', { session: false }), (req, res, next) => {
        //get user bid of particular auction item
        BidModel.findOne({ user: req.user._id, item: req.params.auctionItemId })
            .populate("item").populate("user")
            .then(bid => {
                if (bid) {
                    res.status(200);
                    res.json({
                        message: "Bid of the auction: " + req.params.auctionItemId,
                        data: bid
                    });
                } else {
                    res.status(404);
                    res.json({
                        message: "There is no Bid for the auction: " + req.params.auctionItemId
                    });
                }
            })
            .catch(err => {
                return next(err);
            })
    })
    .post(passport.authenticate('jwt', { session: false }), (req, res, next) => {
        // Post a bid for Auction item if it is open
        AuctionItemModel.findById(req.params.auctionItemId).then(item => {
            if (item) {
                if (item.auctionStatus != "open") {
                    res.status(404);
                    res.json({
                        message: "The auction: " + req.params.auctionItemId + " is closed."
                    });
                } else if(req.body.amount >= item.startingAmount){
                    console.log(req.body)
                    let bidRequest = req.body;
                    bidRequest.item = req.params.auctionItemId;
                    bidRequest.user = req.user._id;
                    let bid = new BidModel(bidRequest);
                    bid.save().then(bidResult => {
                        res.status(200);
                        res.json({
                            message: "Bid of the auction: " + req.params.auctionItemId,
                            data: bid
                        });
                    }).catch(err => {
                        return next(err);
                    })
                }else{
                    res.status(500);
                    res.json({
                        message: "For the auction: " + req.params.auctionItemId + " Starting Amount is " +  item.startingAmount
                    });
                }
            } else {
                res.status(404);
                res.json({
                    message: "There is no  auction for Id: " + req.params.auctionItemId
                });
            }
        })
            .catch(err => {
                return next(err);
            })

    })


module.exports = bidRouter;