import nodemailer from "nodemailer";

export const sendResetPasswordEmail = async (to, link) => {
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
    subject: "Şifre Sıfırlama Talebi",
    html: `
      <h2>Merhaba</h2>
      <p>Şifrenizi sıfırlamak için aşağıdaki bağlantıya tıklayın:</p>
      <a href="${link}" target="_blank">${link}</a>
      <p>Bu bağlantı 15 dakika boyunca geçerlidir.</p>
    `,
  });
};
