const leagueTab = document.getElementById('leagueTab');


// Function to update UI 
async function displayLeague() {

    // Draw empty table
    populateLeague();

    //console.log('Fixtures updated');
}

function populateLeague() {
    // Create the HTML table element
    const table = leagueTab;
    table.replaceChildren('');

    const finishedScores = ["30", "31", "13", "03", "22"];

    // Create the table header row
    const tabHead = table.createTHead();
    const headerRow = tabHead.insertRow();
    const tabBody = table.createTBody();

    headerRow.insertCell().textContent = ""; // Empty cell for player names

    // Add table headers for "Matches Played", "Wins", "Draws", and "Points"
    const statHeaders = ["Played", "Wins", "Draws", "Points"];
    for (const statHeader of statHeaders) {
        const cell = headerRow.appendChild(document.createElement("th"));
        cell.setAttribute('scope', 'col');
        cell.textContent = statHeader;
        cell.classList.add('bg-light');
    }

    // create an object to store player stats
    const playerStats = [];
    let i = 0;
    players.forEach(player => {
        playerStats[i++] = {
            playerID: player.id,
            name: player.name,
            matchesPlayed: 0,
            wins: 0,
            draws: 0,
            points: 0
        }
    });

    // Loop through fixtures and update player stats
    fixtures.forEach((fixture) => {
        const player1 = fixture.players[0];
        const player2 = fixture.players[1];
        // console.log(fixture.id);

        fixture.matches.forEach((match) => {
            const p1index = playerStats.findIndex(player => player.playerID === player1);
            const p2index = playerStats.findIndex(player => player.playerID === player2);

            // Only consider matches with finished games
            var matchScore = `${match.scores[0]}${match.scores[1]}`;
            if (finishedScores.includes(matchScore)) {
                // Update matches played
                playerStats[p1index].matchesPlayed++;
                playerStats[p2index].matchesPlayed++;

                // Update score
                if (matchScore === "22") {
                    // Match is a draw
                    playerStats[p1index].draws++;
                    playerStats[p1index].points++;
                    playerStats[p2index].draws++;
                    playerStats[p2index].points++;
                } else if (matchScore === "31" || matchScore === "30") {
                    // Player 1 wins
                    playerStats[p1index].wins++;
                    playerStats[p1index].points += 3;
                } else {
                    // Player 2 wins
                    playerStats[p2index].wins++;
                    playerStats[p2index].points += 3;
                }
            }

        })
    })

    // Sort the array by points, then wins, then name
    playerStats.sort((a, b) => {
        if (b.points !== a.points) {
            return b.points - a.points;
        } else if (b.wins !== a.wins) {
            return b.wins - a.wins;
        } else {
            return a.name.localeCompare(b.name);
        }
    });

    // Loop though sorted player stats and add them to table
    playerStats.forEach((player) => {
        const row = tabBody.insertRow();
        const nameCell = row.appendChild(document.createElement("th"));
        nameCell.setAttribute('scope', 'row');
        nameCell.textContent = player.name;
        nameCell.classList.add('bg-light');

        // Insert player stats into the table
        row.insertCell().textContent = player.matchesPlayed;
        row.insertCell().textContent = player.wins;
        row.insertCell().textContent = player.draws;
        ptsCell = row.insertCell();
        ptsCell.textContent = player.points;
        ptsCell.classList.add('bg-light');
    })

    //console.log(JSON.stringify(playerStats));

}

displayLeague();

function refreshUI() {
    displayLeague();
}

