const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
    from: String,
    to: String,
    value: String,
    hash: String,
    chain: String,
    gas: String,
    gasPrice: String,
    blockNumber: String,
    blockTimestamp: Date,
    receiptStatus: Number,  
    alert:{ 
      type: Boolean,
      default: false
    }
});

const Address = mongoose.model('Address', addressSchema);

module.exports = Address;
