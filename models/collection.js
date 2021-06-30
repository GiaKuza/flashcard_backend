const mongoose = require('mongoose');

const collectionSchema = new mongoose.Schema({ 
    subject: { type: String, required: true, minlength: 2, maxlength: 50 }, 
  
});

const Collection = mongoose.model('Collection', collectionSchema);


function validateCollection(collection) {
    const schema = Joi.object({
        subject: Joi.string().min(2).max(50).required(),
        
    });
    return schema.validate(collection); 
}
exports.Collection = Collection;
exports.validate = validateCollection;
exports.collectionSchema = collectionSchema;