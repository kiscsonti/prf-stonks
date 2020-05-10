const router = require('express').Router();
const passport = require('passport');
const fs = require('fs');
const mongoose = require('mongoose');
const userModel = mongoose.model('user');

router.route('/login').post((req, res) => {
    if (req.body.username && req.body.password) {
        passport.authenticate('local', (error, user) => {
            if (error) {
                return res.status(500).json({ error: error });
            } else {
                req.logIn(user, (error) => {
                    if (error)
                        return res.status(500).json({ error: error });
                    return res.status(200).json({ error: "" });
                });
            }
        })(req, res);
    } else {
        res.status(400).json({ error: "Username or password is missing" });
    }
});

router.route('/logout').post((req, res) => {
    if (req.isAuthenticated()) {
        req.logout();
        res.status(200).json({ error: "" });
    } else {
        res.status(403).json({ error: "Log in, before you log out" })
    }
});

router.route('/register').post((req, res) => {
    if (req.body.username && req.body.password) {
        const user = new userModel({
            username: req.body.username,
            password: req.body.password
        });
        user.save(function (error) {
            if (error)
                return res.status(500).json({ error: error });

            return res.status(200).json({ error: "" });
        })
    } else {
        return res.status(400).json({ error: "Username or password is missing" });
    }
});

module.change_code = 1;
module.exports = router;
