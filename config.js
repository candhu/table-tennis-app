require('dotenv').config();

// Express
const express = require('express');
const https = require('https');
const fs = require('fs');
var app = express();

// Read SSL certificate files
const sslOptions = {
    key: fs.readFileSync(process.env.KEYFILE),
    cert: fs.readFileSync(process.env.CERTFILE),
  };
  
var httpsServer = https.createServer(sslOptions, app);

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
const historyCollection = db.collection('tournaments');

// Global cache
global.historyCache = [];  // History wont change outside of a server bounce, so fine to cache it globally

module.exports = { app, httpsServer, auth0config, serviceAccount, fixturesCollection, playersCollection, historyCollection, db };