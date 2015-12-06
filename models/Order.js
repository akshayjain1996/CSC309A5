var mongoose = require('mongoose');

/* 
Status:
	1 - Placed
	2 - Accepted
	3 - Completed

*/


var orderSchema = new mongoose.Schema({
	
	id: Number,
	details: String,
	contact_info: String,
	placed_time: String,
	fulfillment_time: String,
	delivery_details: String,
	catererid: String,
	client_id: String,
	status: Number
});

module.exports = mongoose.model('Order', orderSchema);