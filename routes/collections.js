const {Card, validate} = require('../models/card'); 
const {Subject, subjectValidate} = require('../models/subject');

const express = require('express');
const router = express.Router();

//get a specific card by by id
router.get('/:id', async (req, res) => {   
    try {
        const card = await Card.findById(req.params.id);
        if (!card)
            return res.status(400).send(`The card with id "${req.params.id}" does not exist.`);
        return res.send(card);
    } catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`);
    }
});


//get request to return all cards in the collection
router.get('/', async (req, res) => { 
    try {
        const cards = await Card.find();
        return res.send(cards); 
    } catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`); 
    }
});

//get request to return all subject documents in the db
router.get('/subject/all', async (req, res) => { 
    try {
        const subjects = await Subject.find();
        return res.send(subjects); 
    } catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`); 
    }
});



//get request to return a subject's (collections) array of cards by providing a subject id 
router.get('/subject/:subjectId', async (req, res) => { 
    try {
        const subject = await Subject.findById(req.params.subjectId);
        if (!subject) return res.status(400).send(`The subject with id "${req.params.subjectId}" does not exist.`);
        
        return res.send(subject.cardArray); } catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`); 
    }
});

//get request takes in subject id and card id and returns the specific flashcard
router.get('/subject/:subjectId/:cardId', async (req, res) => { 
    try {
        const subject = await Subject.findById(req.params.subjectId);
        if (!subject) return res.status(400).send(`The subject with id "${req.params.subjectId}" does not exist.`);
        
       
        let flashcard = subject.cardArray.id(req.params.cardId)
        if(!flashcard)
        return res.status(400).send(`The card with id "${req.params.cardId}" does not exist in the "${subject.name}" collections`);
        
        return res.send(flashcard); } catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`); 
    }
});



//post request to add a card
router.post('/', async (req, res) => { 
    
    try {
        //need to validate body before continuing
      
        const { error } = validate(req.body);
        if(error)
            return res.status(400).send(error);

        const card = new Card({
            title: req.body.title,
            description: req.body.description,
       
    });

    await card.save();
    return res.send(card);
    } catch (ex) {
    return res.status(500).send(`Internal Server Error: ${ex}`);
    } });


//put request to update card attributes
router.put('/:id', async (req, res) => { 
    try {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error);

    const card = await Card.findByIdAndUpdate( 
        req.params.id,
        {
            title: req.body.title,
            description: req.body.description,
            
        },
          { new: true }
        );
        if (!card)
            return res.status(400).send(`The card with id "${req.params.id}" does not exist.`);
        await card.save();
        return res.send(card);  
    } catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`); 
    }
});

//put request to update card attributes within a specific subject (based off its id)
router.put('/:subjectId/:cardId', async (req, res) => { 
    try {
        const { error } = validate(req.body);
        if (error) return res.status(400).send(error);

        const subject = await Subject.findById(req.params.subjectId);
        if (!subject) return res.status(400).send(`The subject with id "${req.params.subjectId}" does not exist.`);

        let flashcard = subject.cardArray.id(req.params.cardId);
        if(!flashcard)
            return res.status(400).send(`The card with id "${req.params.cardId}" does not exist in the "${subject.name}" collections`);

            flashcard.title = req.body.title;
            flashcard.description = req.body.description;

        await subject.save();
        return res.send(flashcard);
        }  catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`); 
        }

});
//delete request to delete a card from the card collection
router.delete('/:id', async (req, res) => {    
    try {
        const card = await Card.findByIdAndRemove(req.params.id);
        if (!card)
            return res.status(400).send(`The card with id "${req.params.id}" does not exist.`);
        return res.send(card);
        } catch (ex) {
            return res.status(500).send(`Internal Server Error: ${ex}`);
        }
    });


//delete request to delete a card from the SUBJECT collection
router.delete('/:subjectId/:cardId', async (req, res) => {    
    try {
       

        //validate that subject id exists
        const subject = await Subject.findById(req.params.subjectId);
        if (!subject) return res.status(400).send(`The subject with id "${req.params.subjectId}" does not exist.`);   

        //find flashcard in the array
        let flashcard = subject.cardArray.id(req.params.cardId);
        if(!flashcard)
            return res.status(400).send(`The card with id "${req.params.cardId}" does not exist in the "${subject.name}" collections`);

        //remove flashcard from colllection 
        flashcard = await flashcard.remove();

        //save changes in subject collection
        await subject.save()
        return res.send(flashcard); 
    } catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`); 
    }
});



//post request to add an existing card to an existing subject collection
router.post('/:subjectId/addcard/:cardId', async (req, res) => { 
    try {
        const subject = await Subject.findById(req.params.subjectId);
        if (!subject) return res.status(400).send(`The subject with id "${req.params.subjectId}" does not exist.`);
        const card = await Card.findById(req.params.cardId);
        if (!card) return res.status(400).send(`The product with id "${req.params.cardId}" does not exist.`);
        
        subject.cardArray.push(card);

        await subject.save();
        return res.send(subject.cardArray); } catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`); 
    }
});

//post request to add a new card to an existing subject collection
router.post('/:subjectId/addcard/', async (req, res) => { 
    
    try {
        //need to validate body before continuing
        const { error } = validate(req.body);
        if(error)
            return res.status(400).send(error);

        //validate that suibject id exists
        const subject = await Subject.findById(req.params.subjectId);
        if (!subject) return res.status(400).send(`The subject with id "${req.params.subjectId}" does not exist.`);   

        //create card through body params
        const card = new Card({
            title: req.body.title,
            description: req.body.description,

        });

        //push card to the specific subject collection
        subject.cardArray.push(card);

        //save new colllection 
        await subject.save();
        return res.send(card); } catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`); 
    }
});

    //post request to add a new  subject collection
    router.post('/subject/addnew', async (req, res) => { 
    
    try {
        //need to validate body before continuing
      

    

        //create card through body params
        const subject = new Subject({
            name: req.body.name,

        });

      

        //save new colllection 
        await subject.save();
        return res.send(subject); } catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`); 
    }




});



module.exports = router;