const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({ 
    subject: { type: String, required: true, minlength: 2, maxlength: 50 }, 
  
});

const Subject = mongoose.model('Subject', subjectSchema);


function validateSubject(subject) {
    const schema = Joi.object({
        subject: Joi.string().min(2).max(50).required(),
        
    });
    return schema.validate(subject); 
}
exports.Subject = Subject;
exports.validate = validateSubject;
exports.subjectSchema = subjectSchema;