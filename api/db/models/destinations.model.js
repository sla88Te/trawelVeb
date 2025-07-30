const mongoose = require('mongoose');

const DestinationsSchema = new mongoose.Schema({
    /*title: {
        type: 'string',
        required: true
    }*/
    
    destinations: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true
    },
    
    /*_userId: {
        type: mongoose.Types.ObjectId,
        required: true
    }*/
})

const Destinations = mongoose.model('Destinations', DestinationsSchema);

module.exports = { Destinations };