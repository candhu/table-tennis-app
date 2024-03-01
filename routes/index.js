var express = require('express');
var router = express.Router();

const { requiresAuth } = require('express-openid-connect');

router.get('/table', requiresAuth(), (req, res) => {
    res.render('table', {
        title: "SKY Table Tennis - League Table",
        isAuthenticated: req.oidc.isAuthenticated(),
        user: req.oidc.user,
    });
})

router.get('/fixtures', requiresAuth(), (req, res) => {
    res.render('fixtures', {
        title: "SKY Table Tennis - Fixtures",
        isAuthenticated: req.oidc.isAuthenticated(),
        user: req.oidc.user,
    });
})

module.exports = router;