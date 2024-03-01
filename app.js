var express = require('express');
var indexRouter = require('./routes/index.js');
var dataRouter = require('./routes/data.js');
const { auth , requiresAuth} = require('express-openid-connect');
require('dotenv').config();

const auth0config = {
    authRequired: false,
    auth0Logout: true,
    baseURL: process.env.BASEURL,
    clientID: process.env.CLIENTID,
    issuerBaseURL: process.env.ISSUER,
    secret: process.env.SECRET
  };

var app = express ();
const port = process.env.PORT || 3000;

app.set('views','views');
app.set('view engine','ejs');
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static('public'));

// auth router attaches /login, /logout, and /callback routes to the baseURL
app.use(auth(auth0config));

app.get('/', (req, res) => {
  res.redirect('/table');
});

app.use('/', indexRouter);
app.use('/data', dataRouter);

const server = app.listen(port, () => {
    console.log(`Express is running on port ${port}`);
})

