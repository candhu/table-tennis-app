var express = require('express');
var router = express.Router();

const { requiresAuth } = require('express-openid-connect');

router.get('/table', requiresAuth(), (req, res) => {
    res.render('table', {
        title: "League Table",
        isAuthenticated: req.oidc.isAuthenticated(),
    });
})

router.get('/fixtures', requiresAuth(), (req, res) => {
    res.render('fixtures', {
        title: "Fixtures",
        isAuthenticated: req.oidc.isAuthenticated(),
    });
})

router.get('/history', requiresAuth(), (req, res) => {
    const tournamentID = req.query.id;
    const tournament = historyCache.find(item => item.id === tournamentID);

    // Handle case where tournament is not found
    if (!tournament) {
        return res.status(404).send('Historical tournament data not found');
    }

    res.render('history', {
        title: "History (" + tournament.start + " - " + tournament.end + ")",
        tournament: tournament,
        isAuthenticated: req.oidc.isAuthenticated(),
    });
})

module.exports = router;