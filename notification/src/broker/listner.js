import { subscribeToQueue } from "./cloudmq.js";
import sendEmail from "../utils/email.js";

function startListener() {

    subscribeToQueue("user_created", async (msg) => {

        const { email, role, fullname: { firstName, lastName } } = msg;

        const template = `
            <h1>Welcome to Spotify Piper</h1>
            <p>Dear ${firstName} ${lastName},</p>
            <p>Thank you for registering with Spotify Piper. We are excited to have you on board!</p>
            <p>Your role is: ${role}</p>
            <p>We hope you enjoy our services.</p>
            <br/>
            <p>Best regards,</p>
            <p>Spotify Piper Team</p>
        `

        await sendEmail(email, "Welcome to Spotify Piper", "Thank you for registering with Spotify Piper.", template)

    })

}

export default startListener;