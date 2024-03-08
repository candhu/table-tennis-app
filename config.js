require('dotenv').config();

// Express
const express = require('express');
var app = express();
var server = require('http').createServer(app);

//Auth0
const auth0config = {
    authRequired: false,
    auth0Logout: true,
    baseURL: process.env.BASEURL,
    clientID: process.env.CLIENTID,
    issuerBaseURL: process.env.ISSUER,
    secret: process.env.SECRET
};

// Firebase
var firebaseadmin = require("firebase-admin");
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
firebaseadmin.initializeApp({ credential: firebaseadmin.credential.cert(serviceAccount) });
const db = firebaseadmin.firestore();

const fixturesCollection = db.collection('fixtures');
const playersCollection = db.collection('players');

module.exports = { app, server, auth0config, serviceAccount, fixturesCollection, playersCollection, db };