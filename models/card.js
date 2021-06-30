import Collection from './collection';
const Joi = require('joi');
const mongoose = require('mongoose');


const cardSchema = new mongoose.Schema({ 
    title: { type: String, required: true, minlength: 2, maxlength: 50 }, 
    description: { type: String, required: true },
    collection: {Collection},
    dateModified: { type: Date, default: Date.now },
    
});

const Card = mongoose.model('Card', cardSchema);

function validateCard(card) {
    const schema = Joi.object({
        title: Joi.string().min(2).max(50).required(),
        description: Joi.string().required(),
        
    });
    return schema.validate(card); 
}
exports.Card = Card;
exports.validate = validateCard;
exports.cardSchema = cardSchema;