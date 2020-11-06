const express = require('express');
const passport = require('passport');
const { User } = require('../models');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const router = express.Router();

router.post('/signup', async (req, res) => {
    const { username, password, email } = req.body;

    // this new user should be an admin if there are 0 users currently
    const userCount = await User.estimatedDocumentCount();

    User.register(new User({ username, email, verified: false, admin: userCount === 0 }), password, (err, user) => {
        if (err) res.send(err); // TODO: error handling

        passport.authenticate('local')(req, res, () => res.send(user));
    });
        var token =  crypto.randomBytes(16).toString('hex');
        //TODO: add token to database
            var transporter = nodemailer.createTransport({ service: 'Gmail', auth: { user: "Your Gmail ID", pass: "Gmail Pass"} });
            var mailOptions = { from: 'no-reply@cassettenet.com', to: 'hiimprat@gmail.com', subject: 'Account Verification Token', text: 'Hello,\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/' + token + '.\n' };
        transporter.sendMail(mailOptions, function (err) {
        if (err) { return res.status(500).send({ msg: err.message }); }
        res.status(200).send('A verification email has been sent to ' + user.email + '.');
    });
});

router.post('/login', passport.authenticate('local'), (req, res) => {
    const { username, uniqueId } = req.user
    res.json({
        username,
        uniqueId, // convert number to base36 to get alphanumeric id
    });
});

router.post('/logout', (req, res) => {
    req.logout(); // passport method to clear jwt from user's cookie
    res.redirect('/');
});

module.exports = router;
