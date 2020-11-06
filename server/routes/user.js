const express = require('express');
const passport = require('passport');
const { User } = require('../models');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const { TokenExpiredError } = require('jsonwebtoken');
const router = express.Router();

router.post('/signup', async (req, res) => {
    const { username, password, email } = req.body;

    // this new user should be an admin if there are 0 users currently
    const userCount = await User.estimatedDocumentCount();
    

    User.register(new User({ username, email, verified: false, admin: userCount === 0 }), password, (err, user) => {
        if (err) res.send(err); // TODO: error handling
        var token = new Token({ email: user.email, token: crypto.randomBytes(16).toString('hex') });

        token.save(function(err){
            if (err) res.send(err);
            var transporter = nodemailer.createTransport({ service: 'Sendgrid', auth: { user: process.env.SENDGRID_USERNAME, pass: process.env.SENDGRID_PASSWORD } });
            var mailOptions = { from: 'no-reply@cassettenet.com', to: user.email, subject: 'Account Verification Token', text: 'Hello,\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/' + req.headers.host + '\/confirmation\/' + token.token + '.\n' };
            transporter.sendMail(mailOptions, function (err) {
                if (err) { return res.status(500).send({ msg: err.message }); }
                res.status(200).send('A verification email has been sent to ' + user.email + '.');
            });
        });

        passport.authenticate('local')(req, res, () => res.send(user));
    });
});

router.post('/login', passport.authenticate('local'), (req, res) => {
    const { username, uniqueId } = req.user
    res.json({
        username,
        uniqueId, // convert number to base36 to get alphanumeric id
    });
});


module.exports = router;
