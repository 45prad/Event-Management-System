const nodemailer = require('nodemailer')
require('dotenv').config()

const sendCredentials = (receiver, subject, body) => {

    // create reusable transporter
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        host: "smtp.example.com",
        port: 587,
        secure: false, // upgrade later with STARTTLS
        auth: {
            user: process.env.USER,
            pass: process.env.APP_PASS
        },
    })

    const mailOptions = {
        from: {
            name: "Rajasthan Police",
            address: process.env.USER
        },
        to: receiver,
        subject: subject,
        text: body,
        // html: "<p>HTML version of the message</p>",

    }


    const sendMail = async (transporter, mailOptions) => {
        try {
            await transporter.sendMail(mailOptions)
            console.log("Email Send Successfully...");
        } catch (error) {
            console.error(error)
        }
    }

    sendMail(transporter, mailOptions);

}


module.exports = sendCredentials