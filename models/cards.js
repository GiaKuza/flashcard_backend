const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({ 
    title: { type: String, required: true, minlength: 2, maxlength: 255 }, 
    description: { type: String, required: true },
    collection: {collectionSchema},
    
});