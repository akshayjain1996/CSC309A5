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
	caterer_id: Number,
	client_id: Number,
	status: Number
});

module.exports = mongoose.model('Order', orderSchema);