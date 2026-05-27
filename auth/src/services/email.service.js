import nodemailer from "nodemailer";
import config from "../config/config.js";
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        type: "OAuth2",
        user: config.GOOGLE_USER,
        clientId: config.GOOGLE_CLIENT_ID,
        clientSecret: config.GOOGLE_CLIENT_SECRET,
        refreshToken: config.GOOGLE_REFRESH_TOKEN
    }
})

transporter.verify().then(() => {
    console.log('Email transporter is ready');
}).catch((err) => {
    console.error('Error setting up email transporter:', err);
});

export async function sendEmail(to, subject, html, text) {
   try{
    const info = await transporter.sendMail({
        from: config.GOOGLE_USER,
        to,
        subject,
        html,
        text
    });
    console.log('Email sent successfully:', info.response);
   }catch(err){
    console.error('Error sending email:', err);
   }
   

}
