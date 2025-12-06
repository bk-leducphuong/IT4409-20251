import nodemailer from 'nodemailer';

// Đọc config từ environment variables với tên biến đúng
const smtpUser = process.env.EMAIL_USER;
const smtpPass = process.env.EMAIL_PASS; // Sửa từ EMAIL_PASSWORD
const service = process.env.EMAIL_SERVICE || 'gmail';

// Kiểm tra config trước khi tạo transporter
if (!smtpUser || !smtpPass) {
  console.warn('⚠️ Warning: EMAIL_USER or EMAIL_PASS not configured');
}

// Debug log (xóa trong production)
console.log('📧 Email configuration:', {
  service,
  user: smtpUser,
  hasPassword: !!smtpPass,
  passwordLength: smtpPass?.length,
});

const transporter = nodemailer.createTransport({
  service,
  auth:
    smtpUser && smtpPass
      ? {
          user: smtpUser,
          pass: smtpPass,
        }
      : undefined,
  // Thêm config cho Gmail
  ...(service === 'gmail' && {
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // true cho port 465, false cho 587
  }),
});

// Verify connection at startup
transporter
  .verify()
  .then(() => console.log('✅ Email transporter verified for user:', smtpUser))
  .catch((err) => {
    console.error('❌ Email transporter verification failed:', err?.message || err);
    console.error('💡 Tip: Make sure to use App Password from Google Account settings');
  });

export const sendEmail = async (to, subject, html, text) => {
  try {
    if (!to) throw new Error('Missing "to" field');
    if (!smtpUser || !smtpPass) {
      throw new Error('Email service not configured. Check EMAIL_USER and EMAIL_PASS in .env');
    }

    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || smtpUser,
      to,
      subject,
      text: text || undefined,
      html: html || undefined,
    });

    console.log('✅ Email sent successfully:', info.messageId);
    return info;
  } catch (err) {
    console.error('❌ sendEmail error:', err?.message || err);
    throw new Error('Không thể gửi email: ' + (err?.message || 'unknown error'));
  }
};

export const sendResetPasswordEmail = async (to, fullName, otp, resetToken) => {
  const link =
    process.env.FRONTEND_URL && resetToken
      ? `${process.env.FRONTEND_URL.replace(/\/$/, '')}/reset-password?token=${encodeURIComponent(resetToken)}`
      : null;

  const html = `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
      <h2>Đặt lại mật khẩu</h2>
      <p>Xin chào <strong>${fullName}</strong>,</p>
      <p>Bạn đã yêu cầu đặt lại mật khẩu. Mã OTP của bạn là:</p>
      <div style="margin: 20px 0; padding: 12px; background:#f5f5f5; border-radius:4px; text-align:center;">
        <span style="font-size:24px; font-weight:700;">${otp}</span>
      </div>
      ${link ? `<p>Hoặc nhấn <a href="${link}">vào đây</a> để đặt lại mật khẩu.</p>` : ''}
      <p>Mã này có hiệu lực trong 5 phút. Nếu bạn không yêu cầu, bỏ qua email này.</p>
    </div>
  `;

  const text = `Xin chào ${fullName},

Bạn đã yêu cầu đặt lại mật khẩu.
Mã OTP của bạn là: ${otp}

${link ? `Hoặc mở link sau để đặt lại mật khẩu: ${link}\n\n` : ''}

Mã có hiệu lực trong 5 phút. Nếu bạn không yêu cầu, bỏ qua email này.
`;

  return sendEmail(to, 'OTP đặt lại mật khẩu', html, text);
};
export default { sendEmail, sendResetPasswordEmail };
