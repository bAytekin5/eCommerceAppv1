import nodemailer from "nodemailer";

export const send2FACode = async (to, code) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  await transporter.sendMail({
    from: `"eCommerce" <${process.env.SMTP_EMAIL}>`,
    to,
    subject: "Giriş Doğrulama Kodunuz",
    html: `
      <h2>Merhaba</h2>
      <p>Giriş yapmak için doğrulama kodunuz:</p>
      <h1>${code}</h1>
      <p>Bu kod 5 sadece dakika boyunca geçerlidir.</p>
    `,
  });
};
