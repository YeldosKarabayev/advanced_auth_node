const nodemailer = require('nodemailer');


const sendEmail = (options) => {
    const transport = nodeemailer.createTransport({
        service: process.env.EMIAL_SERVICE,
        auth: {
            user: process.env.EMIAL_USERNAME,
            pass: process.env.EMIAL_PASSWORD
        }
    })

    const mailOptions = {
        form: process.env.EMAIL_FORM,
        to: options.to,
        subject: options.subject,
        htm: options.text
    }

    transporter.sendMail(mailOptions, function(err, info) {
        if(err) {
            console.log(err)
        } else {
            console.log(info);
        }
    });
};

module.exports = sendEmail;