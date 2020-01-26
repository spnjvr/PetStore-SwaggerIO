// required modules
const mongoose = require('mongoose');
const multer = require('multer');
const formidable = require('formidable');

// models
const order = mongoose.model('orderInfo');

// validation function
function validateIntegerInput(intInput) {
  if (!typeof(intInput) === 'number' || !isFinite(intInput) || !Math.round(intInput) === intInput) {
    return false;
  }
  return true;
}

// api calls
exports.findOrderById = function(req, res) {
  // prepare variables
  var orderId = req.params.orderId;

  // validate input
  if(!validateIntegerInput(orderId)) {
    return res.status(400).send("Invalid ID supplied");
  }

  // find order by order id
  order.find({'id': orderId}, function(err, result) {
    // cannot find order by supplied order id
    if (err || result === undefined || result.length == 0) {
      return res.status(404).send("Order not found");
    }
    // found order
    return res.status(200).json(result);
  });
};

exports.deleteOrderById = function(req, res) {
  // prepare variables
  var orderId = req.params.orderId;

  // validate input
  if(!validateIntegerInput(orderId)) {
    return res.status(400).send("Invalid ID supplied");
  }

  // find order by pet id
  order.remove({'id': orderId}, function(err, result) {
    // cannot find order by supplied pet id
    if (err || result === undefined || result.length == 0) {
      return res.status(404).send("Order not found");
    }
    // found pet
    return res.status(200).json(result);
  });
};

exports.placeAnOrder = function(req, res) {
  var new_order = new order(req.body);
  new_order.save(function(err, result) {
    if (err) {
      console.log(err);
      res.status(405).send("Invalid Order");
    }
    res.status(200).json(result);
  });
};

exports.getPetInventoryByStatus = function(req, res) {
  res.status(200).send("???");
};
