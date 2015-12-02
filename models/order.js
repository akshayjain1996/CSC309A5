var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/db10');

var orderSchema = new mongoose.Schema({
	
	id: Number,
	details: String,
	contact_info: String,
	placed_time: String,
	fulfillment_time: String,
	delivery_details: String,
	caterer_id: Number,
	status: Number
});

module.exports = mongoose.model('Order', orderSchema);