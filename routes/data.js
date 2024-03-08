var express = require('express');
var router = express.Router();
var { saveScores } = require('../firebase.js');
const { requiresAuth } = require('express-openid-connect');

// Route to save a fixture
router.post('/saveFixtureScores', requiresAuth(), async (req, res) => {

    const fixtureData = req.body;

    try {
        await saveScores(fixtureData);
        // Success response
        res.status(201).json({ message: "Scores saved successfully!" });
    } catch (error) {
        console.error(`Error writing document: ${error}`, req.body);
        res.status(500).json({ message: "Error saving scores" });
    }

});

module.exports = router;