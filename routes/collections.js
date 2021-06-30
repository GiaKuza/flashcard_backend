const {Card, validate} = require('../models/card'); 

const express = require('express');
const router = express.Router();

//get by id
router.get('/:id', async (req, res) => {   
    try {
        const card = await Card.findById(req.params.id);
        if (!card)
            return res.status(400).send(`The product with id "${req.params.id}" does not exist.`);
        return res.send(card);
    } catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`);
    }
});



router.get('/', async (req, res) => { 
    try {
        const cards = await Card.find();
        return res.send(cards); 
    } catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`); 
    }
});


router.post('/', async (req, res) => { 
    
    try {
        //need to validate body before continuing
       /* const subject = new Subject({
            subject: req.body.subject,
        })*/
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


//put
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


//delete
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

module.exports = router;