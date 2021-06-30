const Collection = require('../models/collection'); 
const express = require('express');
const router = express.Router();
router.post('/', async (req, res) => { 
    
    try {
        //need to validate body before continuing

        const collection = new Collection({
        subject: req.body.subject,
        
    });

    await collection.save();
    return res.send(collection);
    } catch (ex) {
    return res.status(500).send(`Internal Server Error: ${ex}`);
    } });

module.exports = router;