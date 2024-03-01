var players = {};
var fixtures = {};

async function fetchPlayers() {
    try {
        const response = await fetch('/data/getPlayers');
        players = await response.json();

    } catch (error) {
        console.error(error);
    }
}

async function fetchFixtures() {
    try {
        const response = await fetch('/data/getFixtures');
        fixtures = await response.json();

    } catch (error) {
        console.error(error);
    }
}