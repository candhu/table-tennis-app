var express = require('express');
var router = express.Router();
var firebaseadmin = require("firebase-admin");
const crypto = require('crypto'); // Import crypto module for UUID generation
require('dotenv').config();

const { requiresAuth } = require('express-openid-connect');

// Initialize Firebase Admin SDK
//const serviceAccount = require("../serviceAccountKey.json");
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
firebaseadmin.initializeApp({ credential: firebaseadmin.credential.cert(serviceAccount) });
const db = firebaseadmin.firestore();
const fixturesCollection = db.collection('fixtures');
const playersCollection = db.collection('players');

function generateUuid() {
    return crypto.randomBytes(16).toString('hex'); // Generate UUID using crypto
}

// Route to fixtures
router.get('/getFixtures', requiresAuth(), async (req, res) => {
    try {
        const snapshot = await fixturesCollection.get();
        const entries = snapshot.docs.map(async (doc) => {
            const fixturesData = {
                id: doc.id,
                ...doc.data(),
            };

            // Fetch matches for each blog entry
            const matchesSnapshot = await doc.ref.collection('matches').get();
            const matches = matchesSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));

            fixturesData.matches = matches;

            return fixturesData;
        });

        // Wait for all promises to resolve before sending response
        const resolvedEntries = await Promise.all(entries);
        res.json(resolvedEntries);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching fixture entries');
    }
});

// Route to players
router.get('/getPlayers', requiresAuth(), async (req, res) => {
    try {
        const snapshot = await playersCollection.get();
        const entries = snapshot.docs.map(async (doc) => {
            const playersData = {
                id: doc.id,
                ...doc.data(),
            };

            return playersData;
        });

        // Wait for all promises to resolve before sending response
        const resolvedEntries = await Promise.all(entries);
        res.json(resolvedEntries);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching player entries');
    }
});

router.post('/saveFixtureScores', requiresAuth(), async (req, res) => {

    const rawFixtureData = req.body;
    const fixtureId = rawFixtureData.ID || fixturesCollection.doc().id;
    const fixtureData = { ID: fixtureId, players: rawFixtureData.players };

    const fixtureRef = fixturesCollection.doc(fixtureId);

    try {
        await fixtureRef.set(fixtureData, { merge: true })
            .then(() => {
                const rawMatchesData = rawFixtureData.matches;

                // Create or update matches subcollection
                const batch = db.batch();
                let counter = 1; // Initialize counter for ordering
                rawMatchesData.forEach(match => {
                    if (match.scores[0] || match.scores[1]) {
                        const matchId = `${counter++}-${generateUuid()}`; // Combine counter and UUID
                        const matchRef = fixtureRef.collection('matches').doc(match.ID || matchId);
                        batch.set(matchRef, { scores: [match.scores[0] || 0, match.scores[1] || 0] }, { merge: true }); // Merge existing data if present
                    }
                });

                return batch.commit();
            })
            .then(() => {
                //console.log(`Fixture document written with ID: ${fixtureRef.id}`);

            });
        // Success response
        res.status(201).json({ message: "Scores saved successfully!" });
    } catch (error) {
        console.error(`Error writing document: ${error}`);
        res.status(500).json({ message: "Error saving scores" });
    }

});

module.exports = router;