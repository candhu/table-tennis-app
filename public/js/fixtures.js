const fixturesTab = document.getElementById('fixturesTab');
const scoresModal = document.getElementById('scoresEditModal');
const scoresForm = document.getElementById('saveScoresForm');

fixturesTab.addEventListener('click', function (event) {
    let target = event.target;

    while (target && target.tagName !== 'TD') {
        target = target.parentNode;
    }
    //console.log(target);

    if (target && target.dataset.bsToggle === 'modal') {
        populateModal(target);
    }
});

scoresForm.addEventListener('submit', function (e) {

    e.preventDefault(); //to prevent form submission

    const formData = new FormData(scoresForm);
    const modalScores = scoresForm.querySelectorAll('.modal-score');
    const scoreInputs = scoresForm.querySelectorAll('.modal-score-input');
    var reverseFix = scoresModal.dataset.modalInverse === 'true';

    //scoresForm.checkValidity()
    let isValid = true; // Flag to track overall validity

    // Validate the entered score values
    scoreInputs.forEach((input) => {
        const inputValue = input.value.trim();
        let errorMessage = input.parentElement.querySelector(".invalid-feedback");

        if (inputValue !== "" && (isNaN(inputValue) || parseInt(inputValue) < 0 || parseInt(inputValue) > 3)) {
            isValid = false; // Set flag to false if any input is invalid

            // Add error styling and message
            input.classList.add("is-invalid");
            if (errorMessage === null) {
                errorMessage = document.createElement("div");
            }
            errorMessage.classList.add("invalid-feedback");
            errorMessage.textContent = "Please enter a number between 0 and 3.";
            input.parentElement.appendChild(errorMessage);
        } else {
            // Remove error styling and message if previously added
            input.classList.remove("is-invalid");
            if (errorMessage) {
                errorMessage.remove();
            }
        }
    });

    if (!isValid) {
        return; // Prevent form submission if any input is invalid
    }

    //Save data
    const fixtureJSON = {
        id: scoresModal.dataset.modalFixtureId,
        players: [scoresModal.dataset.modalPlayer1, scoresModal.dataset.modalPlayer2],
        matches: []
    };

    let counter = 0;
    modalScores.forEach((modalScore) => {
        let p1score = formData.get(`p1s${counter}`) - 0;
        let p2score = formData.get(`p2s${counter}`) - 0;
        if ((p1score + p2score) > 0) {
            fixtureJSON.matches.push({
                scores: (!reverseFix) ? [p1score, p2score] : [p2score, p1score]
            });
        }
        counter++;
    });

    saveScores(fixtureJSON);

    //Re-draw fixtures
    displayFixtures();

    //dismiss modal
    const modal = bootstrap.Modal.getInstance(scoresModal);
    modal.hide();
});

async function saveScores(fixtureData) {
    await putScores(fixtureData);
}

function createScoreDivElement(scoreNum, p1score = "", p2score = "", matchId = "", inverse = 'false') {
    const reverseFix = (inverse === "true");
    const modalDivElementText = `
<div class="row align-middle text-center p-1 modal-score" data-modal-match-id="${matchId}">
    <div class="col">
        <input type="text" class="form-control text-center modal-score-input" name="p1s${scoreNum}" id="p1s${scoreNum}" value="${!reverseFix ? p1score : p2score}">
    </div>
    <div class="col">-</div>
    <div class="col">
        <input type="text" class="form-control text-center modal-score-input" name="p2s${scoreNum}" id="p2s${scoreNum}" value="${!reverseFix ? p2score : p1score}">
    </div>
</div > `;

    const div = document.createElement('template');
    div.innerHTML = modalDivElementText;
    return div.content.cloneNode(true);
}

function populateModal(target) {

    var scoreDivLocation = scoresModal.querySelector('#scoresHeader');
    const p1header = scoresModal.querySelector('#player1header');
    const p2header = scoresModal.querySelector('#player2header');

    var reverseFix = target.dataset.inverse === 'true';

    scoresModal.dataset.modalFixtureId = target.dataset.fixtureId;
    scoresModal.dataset.modalPlayer1 = target.dataset.player1;
    scoresModal.dataset.modalPlayer2 = target.dataset.player2;
    scoresModal.dataset.modalInverse = target.dataset.inverse;

    p1header.textContent = (!reverseFix) ? target.dataset.player1 : target.dataset.player2;
    p2header.textContent = (!reverseFix) ? target.dataset.player2 : target.dataset.player1;

    scoreDivs = target.querySelectorAll('div.score');

    // Clean the modal scores before re-building
    modalScoreDivs = scoresModal.querySelectorAll('div.modal-score');
    modalScoreDivs.forEach((divToBePurged) => {
        divToBePurged.remove();
    })

    for (let i = 0; i < 4; i++) {
        var modalScoreDiv = createScoreDivElement(i);
        if (scoreDivs[i]) {
            //console.log(scoreDivs[i], target.dataset.inverse);
            modalScoreDiv = createScoreDivElement(i, scoreDivs[i].dataset.p1score, scoreDivs[i].dataset.p2score, scoreDivs[i].dataset.matchId, target.dataset.inverse);
        }
        modalScoreDiv = scoreDivLocation.parentNode.appendChild(modalScoreDiv);
    }

}

// Function to update UI 
async function displayFixtures() {
    console.log('Displaying Fixture Table');

    // Draw empty table
    populateFixturesMatrix();
}

function populateFixturesMatrix() {
    // Create the HTML table element
    const table = fixturesTab;
    table.replaceChildren('');

    const finishedScores = ["30", "31", "22"];

    // Create the table header row
    const tabHead = table.createTHead();
    const headerRow = tabHead.insertRow();
    const tabBody = table.createTBody();

    //headerRow.insertCell().textContent = ""; // Empty cell for player IDs
    const emptyCell = headerRow.appendChild(document.createElement("th"));
    emptyCell.textContent = "";
    //emptyCell.classList.add('bg-secondary-subtle');

    // Add player IDs to the first column and header row
    players.forEach((player) => {
        const cell = headerRow.appendChild(document.createElement("th"));
        cell.setAttribute('scope', 'col');
        cell.textContent = player.id;
        cell.classList.add('bg-light');


        const row = tabBody.insertRow();
        const nameCell = row.appendChild(document.createElement("th"));
        nameCell.setAttribute('scope', 'row');
        nameCell.textContent = player.id;
        nameCell.classList.add('bg-light');
        var reverseFix = true;

        // Add empty cells for each player in the current row
        players.forEach((otherPlayer) => {
            const fixtureCell = row.insertCell();

            if (player === otherPlayer) {
                fixtureCell.classList.add('bg-light');
                reverseFix = false;
            } else {
                fixtureCell.textContent = "";
                fixtureCell.dataset.player1 = (!reverseFix) ? player.id : otherPlayer.id;
                fixtureCell.dataset.player2 = (!reverseFix) ? otherPlayer.id : player.id;
                fixtureCell.dataset.fixtureId = `${fixtureCell.dataset.player1}-${fixtureCell.dataset.player2}`;
                fixtureCell.dataset.inverse = reverseFix;
                fixtureCell.dataset.bsToggle = 'modal';
                fixtureCell.dataset.bsTarget = '#scoresEditModal';
                //fixtureCell.setAttribute('data-bs-target', '#scoreModal');
            }
        })
    })

    // Now populate any match results
    fixtures.forEach((fixture) => {
        //        console.log(fixture.id);
        const cells = document.querySelectorAll(`[data-fixture-id="${fixture.id}"]`);
        cells.forEach((cell) => {
            var reverseFix = cell.dataset.inverse === 'true';
            //cell.dataset.fixtureId = fixture.id;
            fixture.matches.forEach((match) => {
                //console.log(fixture.players, cell, cell.dataset.inverse, reverseFix, match);
                var scoreDiv = cell.appendChild(document.createElement('div'));
                scoreDiv.classList.add('score');

                if (!reverseFix) {
                    scoreDiv.textContent = `${match.scores[0]} - ${match.scores[1]}`;
                } else {
                    scoreDiv.textContent = `${match.scores[1]} - ${match.scores[0]}`;
                }

                var matchScore = `${match.scores[0]}${match.scores[1]}`
                var revMatchScore = matchScore.split("").reverse().join("")
                if (!finishedScores.includes(matchScore) && !finishedScores.includes(revMatchScore)) {
                    scoreDiv.classList.add('unfinished');
                }
                scoreDiv.dataset.matchId = match.id;
                scoreDiv.dataset.p1score = match.scores[0];
                scoreDiv.dataset.p2score = match.scores[1];

            })
        })
    })


}

displayFixtures();

function refreshUI() {
    displayFixtures();
}

