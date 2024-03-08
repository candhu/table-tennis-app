var { fixturesCollection, playersCollection } = require("./config.js");


async function getFixtures() {
    console.log('Reading fixtures data');

    const snapshot = await fixturesCollection.get();
    const entries = snapshot.docs.map(async (doc) => {
        const fixturesData = {
            id: doc.id,
            ...doc.data(),
        };

        return { ...fixturesData };

    });

    // Wait for all promises to resolve before sending response
    const resolvedEntries = await Promise.all(entries);
    return(resolvedEntries);
}

async function getPlayers() {
    console.log('Reading players data');
    const snapshot = await playersCollection.get();
    const entries = snapshot.docs.map(async (doc) => {
        const playersData = {
            id: doc.id,
            ...doc.data(),
        };

        return { ...playersData };
    });

    // Wait for all promises to resolve before sending response
    const resolvedEntries = await Promise.all(entries);
    return(resolvedEntries);
}

async function saveScores(fixtureData) {
    const fixtureRef = fixturesCollection.doc(fixtureData.id);
    await fixtureRef.set(fixtureData, { merge: true });

}

module.exports = { getFixtures , getPlayers, saveScores };