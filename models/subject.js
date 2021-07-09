const mongoose = require('mongoose');
const { cardSchema } = require('./card'); 
const Joi = require('joi');

const subjectSchema = new mongoose.Schema({ 
    name: { type: String, required: true, minlength: 2, maxlength: 50 }, 
    cardArray: { type: [cardSchema], default: [] },
  
});

const Subject = mongoose.model('Subject', subjectSchema);


function validateSubject(subject) {
    const schema = Joi.object({
        name: Joi.string().min(2).max(50).required(),
        
    });
    return schema.validate(subject); 
}
exports.Subject = Subject;
exports.subjectValidate = validateSubject;
