const fs = require('fs');
const path = require('path');
const mailgun = require('mailgun-js');
const ejs = require('ejs');

const resetPasswordEmailTemplate = fs.readFileSync(path.join(__dirname, 'resetPasswordEmailTemplate.ejs'), 'utf-8');
const verificationEmailTemplate = fs.readFileSync(path.join(__dirname, 'verificationEmailTemplate.ejs'), 'utf-8');

const MAILGUN_API_KEY =  process.env.MAILGUN_API_KEY;
const MAILGUN_DOMAIN = process.env.MAILGUN_DOMAIN;

let mg;
if (process.env.NODE_ENV === 'production') {
    mg = mailgun({ apiKey: MAILGUN_API_KEY, domain: MAILGUN_DOMAIN });
}

const sendVerificationEmail = async (recipient, verificationToken) => {
    const verficationUrl = `https://cassettenet.netlify.app/verify/${verificationToken}`;
    const emailBody = ejs.render(verificationEmailTemplate, { verficationUrl });
    const data = {
        from: `verify@${MAILGUN_DOMAIN}`,
        to: recipient,
        subject: 'Verify your CassetteNet account',
        html: emailBody,
    };
    try {
        await mg.messages().send(data);
    } catch(err) {
        console.log(err); // TODO: error handling
    }
}

const sendPasswordResetEmail = async (recipient, resetPasswordToken) => {
    const resetPasswordUrl = `https://cassettenet.netlify.app/resetPassword/${resetPasswordToken}`;
    const emailBody = ejs.render(resetPasswordEmailTemplate, { resetPasswordUrl });
    const data = {
        from: `verify@${MAILGUN_DOMAIN}`,
        to: recipient,
        subject: 'Reset Password',
        html: emailBody,
    };
    try {
        await mg.messages().send(data);
    } catch(err) {
        console.log(err); // TODO: error handling
    }
}

module.exports = {
    sendPasswordResetEmail,
    sendVerificationEmail,
}
