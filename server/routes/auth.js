const express = require('express');
const passport = require('passport');
const crypto = require('crypto');
const { InboxMessage, User } = require('../models');
const { sendPasswordResetEmail, sendVerificationEmail } = require('../email/email');

const router = express.Router();

const CLIENT_ROOT_URL = process.env.CLIENT_ROOT_URL || 'http://localhost:3000';

router.post('/signup', async (req, res) => {
    //const { username, password, email } = req.body;
    const { email, username, password } = req.body;
    // this new user should be an admin if there are 0 users currently
    const userCount = await User.estimatedDocumentCount();

    // generate email verification token
    const token = crypto.randomBytes(64).toString('hex');

    // auto-verify users in dev env
    const isDev = process.env.NODE_ENV !== 'production';

    User.register(new User({ username, email, token, verified: isDev || userCount === 0, admin: userCount === 0, local: true }), password, async (err, user) => {
        if (err) return res.status(500).send(err); // TODO: error handling
        if (process.env.NODE_ENV === 'production') { // only send email in production deployment (i.e. heroku)
            try {
                await sendVerificationEmail(email, token);
            } catch(err) {
                console.log(err); // TODO: error handling    
            }
        }
        let responsePayload;
        // send back full user object if running in development.
        // otherwise don't, due to security
        if (process.env.NODE_ENV === 'production') {
            responsePayload = 'signup successful';
        } else {
            responsePayload = user;
        }
        passport.authenticate('local')(req, res, () => res.send(responsePayload));
    });
});



router.post('/login', passport.authenticate('local'), async (req, res) => {
    const { verified } = req.user;
    if (!verified) {
        return res.status(400).send('user not verified.');
    }
    res.send('logged in');
});

router.post('/logout', (req, res) => {
    req.logout(); // passport method to clear jwt from user's cookie
    res.send('logged out.');
});

router.put('/verify', async (req, res) => {
    const { token } = req.body;
    try {
        await User.updateOne({ token }, { verified: true, token: null });
        res.send('user verified');
    } catch (err) {
        res.status(500).send(err)
    }
});

/**
 * Resets a password via the forgot password email workflow.
 * See other route for resetting password through view account page.
 */
router.put('/resetPassword', async (req, res) => {
    const { password, token, email } = req.body;
    if (token && password) {
        try {
            const user = await User.findOne({ token });
            if (!user) return res.status(404).send('not found');
            await user.setPassword(password);
            user.token = null;
            await user.save();
            return res.send('password reset successfully.');
        } catch (err) {
            return res.status(500).send(err);
        }
    }
    if (!email) return res.status(400).send('invalid request.');

    // generate password reset token
    const pwResetToken = crypto.randomBytes(64).toString('hex');

    const user = await User.findOne({ email });

    if (user) {
        user.token = pwResetToken;
        user.save();
        if (process.env.NODE_ENV === 'production') { // only send email in production deployment (i.e. heroku)
            try {
                await sendPasswordResetEmail(email, pwResetToken);
                return res.send('sent password reset email.')
            } catch(err) {
                console.log(err);
                return res.status(500).send(err);  
            }
        }
        return res.send(token); // send reset token back in development mode
    }
    return res.status(404).send('user not found.');
});

/**
 * Resets a password via the change password button on a logged in user's account page.
 * See other route for resetting password through forgot password/email workflow.
 */
router.put('/changePassword', async (req, res) => {
    if (!req.user || !req.body.currentPassword || !req.body.newPassword) return res.status(401).send('unauthorized');
    
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).send('user not found');
        try {
            await user.changePassword(req.body.currentPassword, req.body.newPassword);
            await user.save();
            return res.send('password changed successfully');
        } catch (err) {
            return res.status(401).send('incorrect password');
        }
    } catch (err) {
        return res.status(500).send('server error');
    }
});

router.get('/login/success', async (req, res) => {
    if (!req.user) return res.status(401).send('unauthorized');
    const { username, uniqueId, _id, favoritedMixtapes, followedUsers, admin, createdAt, updatedAt, verified, strategy } = req.user;
    if (!verified) {
        return res.status(400).send('user not verified.');
    }
    const followedUsersDenormalized = [];
    for (const userId of followedUsers) {
        const user = await User.findById(userId).lean();
        const createdAt = new Date(user.createdAt);
        const updatedAt = new Date(user.updatedAt);
        followedUsersDenormalized.push({
            _id: userId,
            uniqueId: user.uniqueId,
            username: user.username,
            createdAt: `${createdAt.getMonth()+1}/${createdAt.getDate()}/${createdAt.getFullYear()}`,
            updatedAt: `${updatedAt.getMonth()+1}/${updatedAt.getDate()}/${updatedAt.getFullYear()}`,
            followers: user.followers, 
        });
    }
    const followers = req.user.followers;
    const inboxMessages = await InboxMessage.find({ recipient: req.user.id }).lean();
    res.json({
        _id,
        favoritedMixtapes,
        followedUsers: followedUsersDenormalized,
        followers,
        username,
        uniqueId, // convert number to base36 to get alphanumeric id
        admin,
        createdAt,
        updatedAt,
        inboxMessages,
        strategy,
    });
});

router.put('/setOAuthUsername', async (req, res) => {
    if (!req.user) return res.status(401).send('Unauthorized');
    if (!req.body.username) return res.status(400).send('missing username');
    const { username } = req.body;
    try {
        const user = await User.findById(req.user.id);
        if (user.username || user.local) {
            return res.status(400).send('username already set.');
        } else {
            // this new user should be an admin if there are 0 users currently
            const userCount = await User.estimatedDocumentCount();
            user.username = username;
            user.verified = true;
            user.admin = userCount === 1; // oauth user is already signed up so usercount will be 1
            await user.save();
            return res.send('successfully set username');
        }
    } catch (err) {
        console.log(err);
        return res.status(500).send(err);
    }
});

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/redirect', passport.authenticate('google', { failureRedirect: new URL('/login', CLIENT_ROOT_URL).href}),
(req, res) => {
    if (!req.user.username) return res.redirect(new URL('/login/oauth', CLIENT_ROOT_URL).href);
    return res.redirect(new URL('/login/success', CLIENT_ROOT_URL).href);
});

router.get('/facebook', passport.authenticate('facebook', { scope : ['email'] }));

router.get('/facebook/redirect', passport.authenticate('facebook', { failureRedirect: new URL('/login', CLIENT_ROOT_URL).href}),
(req, res) => {
    if (!req.user.username) return res.redirect(new URL('/login/oauth', CLIENT_ROOT_URL).href);
    return res.redirect(new URL('/login/success', CLIENT_ROOT_URL).href);
});

module.exports = router;
