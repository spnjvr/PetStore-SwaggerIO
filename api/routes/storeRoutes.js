module.exports = function(app) {
  var order = require('../controllers/storeController');

  // perStore order routes
  app.route('/store/order/:orderId')
  .get(order.findOrderById)
  .delete(order.deleteOrderById);

  app.route('/store/order')
  .post(order.placeAnOrder);

  app.route('/store/inventory')
  .get(order.getPetInventoryByStatus);
}
