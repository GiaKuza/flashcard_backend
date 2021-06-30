const Card = require('../models/card'); 
const express = require('express');
const router = express.Router();
router.post('/', async (req, res) => { 
    try {
        //need to validate body before continuing

        const card = new Card({
        title: req.body.title,
        description: req.body.description,
        collection: req.body.collection,
        
    });

    await card.save();
    return res.send(card);
    } catch (ex) {
    return res.status(500).send(`Internal Server Error: ${ex}`);
    } });

module.exports = router;