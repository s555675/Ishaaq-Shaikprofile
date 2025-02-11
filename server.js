const express = require('express');
const app = express();
const nodemailer = require('nodemailer')
require('dotenv').config();

app.use(express.static('./'))
app.use(express.json())
app.get('/', (req, res) => {

    res.sendFile(__dirname + 'index.html');
})

app.post('/', (req, res) => {
    console.log(req.body);
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD
        }
    })

    const mailOptions = {
        from: req.body.email,
        to: 'codeworks105@gmail.com',
        subject: `message from ${req.body.email}: ${req.body.subject}`,
        text: req.body.message
    }

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error)
            res.send('error')
        } else {
            console.log(`Details shared` + info.response);
            res.send('success');
        }
    })
})
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}!`);
});