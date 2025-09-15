import nodemailer from "nodemailer";

export const sendOtpEmail = async (toEmail, otpCode) => {
  const transporter = nodemailer.createTransport({
    host: "smtp-relay.brevo.com", // Brevo SMTP server
    port: 587,                    // TLS
    secure: false,                // must be false for port 587
    auth: {
      user: process.env.BREVO_USER, // e.g. 970afe001@smtp-brevo.com
      pass: process.env.BREVO_PASS, // your SMTP key
    },
  });

  const mailOptions = {
    from: '"Estickers" <yugalhemane@gmail.com>', // ✅ use your verified sender
    to: toEmail,
    subject: "Your OTP for Estickers",
    html: `<p>Your OTP is <strong>${otpCode}</strong>. It will expire in 10 minutes.</p>`,
  };

  await transporter.sendMail(mailOptions);
};
