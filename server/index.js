const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const expressSession = require('express-session');
const mongoose = require('mongoose');
const hotswap = require('hotswap');
const cors = require('cors'); // Zoli


const app = express();

require('./user.model');
require('./record.model');
const userModel = mongoose.model('user');

mongoose.connection.on('connected', function () {
    console.log('Connected to MongoDB database.');
});

mongoose.connection.on('error', function (error) {
    console.log('Error during the database connection.', error);
});

// Zoli: eredeti mongo adatbázisra nem tudtam felcsatlakozni, úgyhogy csináltam egy másikat magamnak
const dbUrl = 'mongodb://root:root00@ds217970.mlab.com:17970/prf-kotprog';
// const dbUrl = 'mongodb+srv://root:root@cluster0-rgh2w.mongodb.net/test?retryWrites=true&w=majority';

mongoose.connect(dbUrl);

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors( { credentials: true, origin: ['http://localhost:4200', 'http://192.168.1.8:4200'] } )); // Zoli

passport.serializeUser((user, done) => {
    if (!user)
        return done("Error - we have no user", undefined);

    return done(null, user);
});

passport.deserializeUser((user, done) => {
    if (!user)
        return done("Error - no user object to deserialize", undefined);

    return done(null, user);
});

passport.use('local', new localStrategy((username, password, done) => {
    userModel.findOne({ username: username }, function (err, user) {
        if (err)
            return done('There was an error while retrieving the user');

        if (user) {
            user.comparePasswords(password, function (error, isMatch) {
                if (error || !isMatch)
                    return done('There was an error when comparing the passwords or wrong password');

                return done(null, user);
            })
        } else {
            return done('There is no registered user with that username');
        }
    })
}));

app.use(expressSession({ secret: 'tobehonestimajavadevelopersoimmabituncomfortableinnodejs' }));
app.use(passport.initialize());
app.use(passport.session());

app.use('/api/', require('./public_api'));

const authenticationChecker = (req, res, next) => {
    if (!req.isAuthenticated()) {
        res.status(403).send('You must be logged in first.');
    } else {
        next();
    }
}
app.use('/api/', authenticationChecker);
app.use('/api/', require('./protected_api'));

const lastResort = (req, res, next) => {
    res.status(404).send('Error 404 - request cannot be fulfilled');
};
app.use(lastResort);

app.listen(3000, () => {
    console.log('the server is running');
});

// node index.js runs the project
