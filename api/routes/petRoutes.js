module.exports = function(app) {
  var pet = require('../controllers/petController');

  // petStore pet routes
  app.route('/pet/findByStatus')
  .get(pet.findPetByStatus);

  app.route('/pet/:petId/uploadImage')
  .post(pet.uploadPetImage);

  app.route('/pet/:petId')
  .get(pet.findPetById)
  .post(pet.updatePetById)
  .delete(pet.deletePetById);

  app.route('/pet')
  .post(pet.addNewPet)
  .put(pet.updateExistingPet);
}
