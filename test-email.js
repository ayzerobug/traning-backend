import "dotenv/config";
import { sendEmail } from "./utils/mailer.js";

const sendSampleEmail = async () => {
  try {
    console.log(" Sending email through Mailtrap");

    await sendEmail({
      to: "ayo@example.com",
      title: "Test from Yangaplug Training Backend 🚀",
      htmlBody: "<h1>It works!</h1><p>Email is connected.</p>",
    });

    console.log("✅ Email sent! Check Mailtrap inbox.");
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
};

sendSampleEmail();
