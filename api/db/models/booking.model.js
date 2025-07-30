const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
    /*title: {
        type: 'string',
        required: true
    }*/
    
    destination: {
        type: String,
        required: true
    },
    startDate: {
        type: String,
        required: true
    },
    endDate: {
        type: String,
        required: true
    },
    numberOfGuests: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    
    
    _userId: {
        type: mongoose.Types.ObjectId,
        required: true
    }
})

const Booking = mongoose.model('Booking', BookingSchema);

module.exports = { Booking };