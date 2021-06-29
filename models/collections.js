const mongoose = require('mongoose');

const collectionSchema = new mongoose.Schema({ 
    subject: { type: String, required: true, minlength: 2, maxlength: 255 }, 
  
});

const cardSchema = new mongoose.Schema({ 
    title: { type: String, required: true, minlength: 2, maxlength: 255 }, 
    description: { type: String, required: true },
    collection: {collectionSchema},
    
});