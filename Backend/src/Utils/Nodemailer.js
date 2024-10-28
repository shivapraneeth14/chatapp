import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
  port: 587,
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USERNAME,
        pass:process.env.SENDGRID_API_KEY
    }
})

export default transporter