var players = [];
var fixtures = [];

async function putScores(fixtureData) {
    try {
        const response = await fetch('data/saveFixtureScores', {
            method: "POST",
            body: JSON.stringify(fixtureData),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        });
    }catch(error){
        close.error(error);
    }
}