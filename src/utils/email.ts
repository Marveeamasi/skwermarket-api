import nodemailer from 'nodemailer';

export const sendEmail = async (to: string, subject: string, html: string) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"SkwerMkt" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });
};

export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const sendOTP = async (email: string, otp: string) => {
  const html = `
    <h1>Verify Your Email</h1>
    <p>Your OTP is <strong>${otp}</strong>. It expires in 10 minutes.</p>
  `;
  await sendEmail(email, 'Email Verification OTP', html);
};

export const sendPasswordResetOTP = async (email: string, otp: string) => {
  const html = `
    <h1>Reset Your Password</h1>
    <p>Your OTP is <strong>${otp}</strong>. It expires in 10 minutes.</p>
  `;
  await sendEmail(email, 'Password Reset OTP', html);
};