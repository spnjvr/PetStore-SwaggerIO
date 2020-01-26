const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ORDERSTATUSES = ["placed", "processing", "completed"];

var order = new Schema(
  {
    "id": {
      type: Number,
      required: true,
      unique: true,
      auto: true
    },
    "petId": {
      type: Number,
      ref: 'petInfo',
      index: {unique:true}
    },
    "quantity": {
      type: Number,
      required: true
    },
    "shipDate": {
      type: Date
    },
    "status": {
      type: String,
      enum: ORDERSTATUSES,
      required: true,
      trim: true
    },
    "complete": {
      type: Boolean,
      default: false
    }
  }, {collection: 'orderInfo'}
);

module.exports = mongoose.model('orderInfo', order);
