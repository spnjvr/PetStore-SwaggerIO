// required modules
const mongoose = require('mongoose');
const multer = require('multer');
const mv = require('mv');
const path = require('path');
const formidable = require('formidable');

// models
const pet = mongoose.model('petInfo');

// other
const petImage = multer({
  dest: "../images/pet"
});

// validation function
function validatePetId(petId) {
  if (!typeof(petId) === 'number' || !isFinite(petId) || !Math.round(petId) === petId) {
    return false;
  }
  return true;
}

// api calls
exports.findPetById = function(req, res) {
  // prepare to update data
  var petId = req.params.petId;

  // validate petId input
  if (!validatePetId(petId)) {
    return res.status(400).send("Invalid ID supplied");
  }
    // find pet by id
    pet.find({'id': petId}, function(err, result) {
      // cannot find pet by supplied id
      if (err || result === undefined || result.length == 0) {
        return res.status(404).send("Pet not found");
      }
      // found pet
      return res.status(200).json(result);
    });
};

exports.updatePetById = function(req, res) {
  // prepare to update data
  var petId = req.params.petId;
  var form = new formidable.IncomingForm().parse(req);
  var newPetName = form.on('field', function(name, field){
    return name;
  });
  var newPetStatus = form.on('field', function(status, field){
    return status;
  });

  // validate input
  if(!validatePetId(petId) || newPetName === "" || newPetName == undefined
      || newPetStatus === "" || newPetStatus == undefined) {
    return res.status(405).send("Invalid input");
  }

  // update the data
  pet.findOneAndUpdate(
    {'id': petId},
    {$set: {name: newPetName, status: newPetStatus}},
    {new: true},
    function(err, result) {
      if(err) return res.status(405).send("Invalid input");
        return res.status(200).json(result);
    });
};

exports.deletePetById = function(req, res) {
  // prepare variables
  var apiKey = req.header.api_key;
  var petId = req.params.petId;

  // validate input
  if(!validatePetId(petId)) {
    return res.status(405).send("Invalid input");
  }

  // remove pet by id
  pet.remove({
    'id': petId
  }, function(err, result) {
    if (err || result === undefined || result.length == 0) {
      return res.status(404).send("Pet not found");
    }
    res.status(200).json({ message: 'Pet successfully deleted' });
  });
};

exports.uploadPetImage = function(req, res) {
  // prepare to upload an image
  var petId = req.params.petId;
  var form = new formidable.IncomingForm();
  var additionalMetadata = form.parse(req, function(err, fields, files) {
    return fields.additionalMetadata;
  });

  if(!validatePetId(petId)) {
    return res.status(405).send("Invalid input");
  }

  form.parse(req, function (err, fields, files) {
    var tempImagePath = files.file.path;
    var targetImagePath = path.join(__dirname, "../images/pet" + files.file.name);
    mv(tempImagePath, targetImagePath, function (err) {
      if(err) return res.status(500).send("An error occurred");
        // update the data
        pet.findOneAndUpdate(
          {'id': petId},
          {$set: {photoUrls: [targetImagePath]}},
          {new: true},
          function(err, result) {
            if(err) return res.status(405).send("Invalid input");
              return res.status(200).json(result);
          });
    });
  });
};

exports.addNewPet = function(req, res) {
  var new_pet = new pet(req.body);
  new_pet.save(function(err, result) {
    if (err)
      res.status(405).send("Invalid input");
    res.status(200).json(result);
  });
};

exports.updateExistingPet = function(req, res) {
  // prepare to update data
  var petId = req.body.id;

  // validate petId input
  if (!validatePetId(petId)) {
    return res.status(400).send("Invalid ID supplied");
  }

  // remove id element before update
  var updatingData = req.body;
  delete updatingData['id'];

  pet.findOneAndUpdate({id: petId}, updatingData, {new: true}, function(err, result) {
    if (err) {
      return res.status(405).send("Validation exception");
    }
    if (result == undefined) {
      return res.status(404).send("Pet not found");
    }
    res.json(result);
  });
};

exports.findPetByStatus = function(req, res) {
  var statusToFind = req.query.status;
  if(statusToFind == undefined || ['available', 'pending', 'sold'].indexOf(statusToFind) < 0) {
    res.status(400).send("Invalid status value");
  }
  pet.find({status: {'$in' : statusToFind}}, function(err, result) {
    if (err) return res.status(500).send("An error occurred");
    res.status(200).json(result);
  });
};
