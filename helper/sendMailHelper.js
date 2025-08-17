const sgmail = require('@sendgrid/mail');
require('dotenv').config(); // Load environment variables from .env file

sgmail.setApiKey(process.env.SENDGRID_API_KEY);

async function sendMail(user_mail, subject, htmlContent, text) {
        const msg = {
            to: user_mail,
            from: process.env.SENDGRID_MAIL, // Use the email from environment variable
            subject: subject,
            text: text,
            html: htmlContent
        };

        return await sgmail.send(msg);
    
        // sgmail.send(msg)
        // .then(() => {
        //     console.log('Email sent successfully');
        //     return { success: true, message: 'Email sent successfully' };
        // })
        // .catch((error) => {
        //     console.error('Error sending email:', error);
        //     return { success: false, message: 'Error sending email' };
        // });
}

exports.sendMail = sendMail;