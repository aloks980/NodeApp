const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BidSchema = new Schema({
    item:{
        type :Schema.Types.ObjectId, 
        ref: 'auction_item',
        required: true
    },
    user:{
        type :Schema.Types.ObjectId, 
        ref: 'user',
        required: true
    },
    amount:{
        type:Number,
        required:true
    }
});

const BidModel = mongoose.model('bid', BidSchema);

module.exports = BidModel;