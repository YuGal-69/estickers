import nodemailer from "nodemailer";

export const sendOtpEmail = async (toEmail, otpCode) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: toEmail,
    subject: "Your OTP for Estickers",
    html: `<p>Your OTP is <strong>${otpCode}</strong>. It will expire in 10 minutes.</p>`,
  };

  await transporter.sendMail(mailOptions);
};