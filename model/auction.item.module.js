const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AuctionItemSchema = new Schema({
    owner:{
        type :Schema.Types.ObjectId, 
        ref: 'user'
    },
    name:{
        type : String,
        required : true,
        unique : true
    },
    description: {
        type : String,
        required : true,
    },
    startTime: {
        type : String,
        required : true,
    },
    endTime: {
        type : String,
        required : true,
    },
    imageURL: {
        type : String
    },
    startingAmount: {
        type : Number,
        required : true,
    },
    winner: {
        type :Schema.Types.ObjectId, 
        ref: 'user'
    },
    auctionStatus: {
        type: String
    }
});

const AuctionItemModel = mongoose.model('auction_item',AuctionItemSchema);
  
module.exports = AuctionItemModel;