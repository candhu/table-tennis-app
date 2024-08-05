var { fixturesCollection, playersCollection, historyCollection } = require("./config.js");


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
    return (resolvedEntries);
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
    return (resolvedEntries);
}

async function saveScores(fixtureData) {
    const fixtureRef = fixturesCollection.doc(fixtureData.id);
    await fixtureRef.set(fixtureData, { merge: true });

}

// Populate history
async function getTournamentsData() {
    console.log('Reading tournament history data');
    try {
        const tournamentsData = await historyCollection.get();

        tournamentsData.docs.forEach(doc => {
            const tournamentData = doc.data();
            historyCache.push({
                id: doc.id,
                start: doc.data().start,
                end: doc.data().end,
                tableData: JSON.parse(doc.data().historicalTableData)
            });
        });

        return JSON.stringify(historyCache);
    } catch (error) {
        console.error("Error getting tournaments data:", error);
        throw error;
    }
}

getTournamentsData()
    // .then(() => {
    //     console.log("Tournaments data (JSON):", historyCache);
    // })
    .catch(error => {
        console.error("Error:", error);
    });

module.exports = { getFixtures, getPlayers, saveScores };