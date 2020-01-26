const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const PETSTATUSES = ["available", "pending", "sold"];

var pet = new Schema(
  {
    "id": {
      type: Number,
      required: true,
      unique: true,
      auto: true
    },
    "category": {
      type: Number,
      ref: 'petCategory',
      index: {unique:true}
    },
    "name": {
      type: String,
      required: true,
      trim: true
    },
    "photoUrls": [{
      type: String,
      trim: true
    }],
    "tags": [{
      type: Number,
      ref: 'petTags',
      index: {unique:true}
    }],
    "status": {
      type: String,
      enum: PETSTATUSES,
      required: true,
      trim: true
    }
  }, {collection: 'petInfo'}
);

module.exports = mongoose.model('petInfo', pet);
