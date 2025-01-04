import nodemailer from "nodemailer";
// Create a transporter object using Mailtrap SMTP settings
const transport = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "40efd4d35b8ce3",
    pass: "60638c2df63349",
  },
});

// Function to send email
export const sendActivationEmail = async (to: string, link: string) => {
  const mailOptions = {
    from: '"DeskApi Service', // Sender address
    to: to, // List of recipients
    subject: "Activation DeskApi account", // Subject line
    text: `for activation your account click on the link => ${link}`, // Plain text body
  };

  try {
    const info = await transport.sendMail(mailOptions);
    console.log("Email sent:", info.messageId);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};
