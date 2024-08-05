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

    const finishedScores = ["30", "31", "13", "03", "32", "23"];

    // Create the table header row
    const tabHead = table.createTHead();
    const headerRow = tabHead.insertRow();
    const tabBody = table.createTBody();

    headerRow.insertCell().textContent = ""; // Empty cell for player names

    // Add table headers for "Matches Played", "Wins", "Draws", and "Points"
    const statHeaders = ["Matches<BR/>Played", "Match<BR/>Wins", "Games<BR/>Won", "Total<BR/>Points"];
    for (const statHeader of statHeaders) {
        const cell = headerRow.appendChild(document.createElement("th"));
        cell.setAttribute('scope', 'col');
        cell.innerHTML = statHeader;
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
            matchWins: 0,
            gameWins: 0,
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
                if (matchScore === "31" || matchScore === "30" || matchScore === "32") {
                    // Player 1 wins
                    playerStats[p1index].matchWins++;
                    playerStats[p1index].gameWins += 3;
                    playerStats[p1index].points += 5;
                    // Add losing players games won - second digit of match score
                    playerStats[p2index].gameWins += Number(matchScore[1]);
                    playerStats[p2index].points += Number(matchScore[1]);
                } else {
                    // Player 2 wins
                    playerStats[p2index].matchWins++;
                    playerStats[p2index].gameWins += 3;
                    playerStats[p2index].points += 5;
                    // Add losing players games won - first digit of match score
                    playerStats[p1index].gameWins += Number(matchScore[0]);
                    playerStats[p1index].points += Number(matchScore[0]);

                }
            }

        })
    })

    // Sort the array by points, then wins, then name
    playerStats.sort((a, b) => {
        if (b.points !== a.points) {
            return b.points - a.points;
        } else if (b.matchWins !== a.matchWins) {
            return b.matchWins - a.matchWins;
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
        row.insertCell().textContent = player.matchWins;
        row.insertCell().textContent = player.gameWins;
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

