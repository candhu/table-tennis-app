const leagueTab = document.getElementById('leagueTab');

// Function to update UI 
async function displayLeague() {

    // Draw empty table
    populateLeague();
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
    const playerStats = tournament.historicalTableData;

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

    console.log(JSON.stringify(playerStats));

}

displayLeague();

