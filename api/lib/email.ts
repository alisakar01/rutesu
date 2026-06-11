import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: false,
  auth: {
    user: process.env.SMTP_USER || "",
    pass: process.env.SMTP_PASS || "",
  },
});

const FROM_EMAIL = process.env.FROM_EMAIL || "noreply@rutesu.shop";
const APP_URL = process.env.APP_URL || "https://rutesu.shop";

export async function sendVerificationEmail(to: string, name: string, token: string): Promise<void> {
  const verifyUrl = `${APP_URL}/verify-email?token=${token}`;

  await transporter.sendMail({
    from: `"Rutesu Shop" <${FROM_EMAIL}>`,
    to,
    subject: "Email Adresinizi Doğrulayın - Rutesu Shop",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #1a1a1a;">Merhaba ${name},</h2>
        <p>Rutesu Shop'a hoş geldiniz! Hesabınızı aktifleştirmek için lütfen aşağıdaki bağlantıya tıklayın:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verifyUrl}" style="background: #1a1a1a; color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: 500;">Emailimi Doğrula</a>
        </div>
        <p style="color: #666; font-size: 14px;">Veya şu bağlantıyı tarayıcınıza yapıştırabilirsiniz:</p>
        <p style="color: #666; font-size: 12px; word-break: break-all;">${verifyUrl}</p>
        <p style="color: #999; font-size: 12px; margin-top: 30px;">Bu emaili siz talep etmediyseniz, lütfen dikkate almayın.</p>
      </div>
    `,
  });
}

export async function sendPasswordResetEmail(to: string, name: string, token: string): Promise<void> {
  const resetUrl = `${APP_URL}/reset-password?token=${token}`;

  await transporter.sendMail({
    from: `"Rutesu Shop" <${FROM_EMAIL}>`,
    to,
    subject: "Şifre Sıfırlama - Rutesu Shop",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #1a1a1a;">Merhaba ${name},</h2>
        <p>Şifre sıfırlama talebiniz alındı. Yeni bir şifre oluşturmak için aşağıdaki bağlantıya tıklayın:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background: #1a1a1a; color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: 500;">Şifremi Sıfırla</a>
        </div>
        <p style="color: #666; font-size: 14px;">Bu bağlantı 1 saat geçerlidir.</p>
        <p style="color: #666; font-size: 14px;">Veya şu bağlantıyı tarayıcınıza yapıştırabilirsiniz:</p>
        <p style="color: #666; font-size: 12px; word-break: break-all;">${resetUrl}</p>
        <p style="color: #999; font-size: 12px; margin-top: 30px;">Bu emaili siz talep etmediyseniz, lütfen dikkate almayın.</p>
      </div>
    `,
  });
}

export async function sendOrderConfirmationEmail(to: string, name: string, orderNumber: string, total: string): Promise<void> {
  await transporter.sendMail({
    from: `"Rutesu Shop" <${FROM_EMAIL}>`,
    to,
    subject: `Siparişiniz Alındı - ${orderNumber}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #1a1a1a;">Teşekkürler ${name}!</h2>
        <p>Siparişiniz başarıyla alındı.</p>
        <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0;"><strong>Sipariş Numarası:</strong> ${orderNumber}</p>
          <p style="margin: 10px 0 0;"><strong>Toplam Tutar:</strong> ${total} TL</p>
        </div>
        <p>Siparişiniz hazırlandığında ve kargoya verildiğinde sizi bilgilendireceğiz.</p>
        <p style="color: #999; font-size: 12px; margin-top: 30px;">Sorularınız için bize ulaşabilirsiniz.</p>
      </div>
    `,
  });
}
