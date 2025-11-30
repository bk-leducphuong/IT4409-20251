import nodemailer from 'nodemailer';

// Cấu hình transporter (sử dụng Gmail, SendGrid, hoặc SMTP server khác)
const transporter = nodemailer.createTransport({
  service: 'gmail', // hoặc SMTP tùy chỉnh
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD, // Dùng App Password cho Gmail
  },
});

// Gửi email đơn giản
export const sendEmail = async (to, subject, htmlContent) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      html: htmlContent,
    });
    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error('Error sending email:', error.message);
    throw new Error('Không thể gửi email');
  }
};

// Email xác nhận đăng ký
export const sendRegistrationEmail = async (to, fullName) => {
  const htmlContent = `
    <h2>Chào mừng ${fullName}!</h2>
    <p>Cảm ơn bạn đã đăng ký tài khoản.</p>
    <p>Tài khoản của bạn đã được kích hoạt và sẵn sàng sử dụng.</p>
    <a href="${process.env.FRONTEND_URL}">Truy cập ứng dụng</a>
  `;
  return sendEmail(to, 'Xác nhận đăng ký tài khoản', htmlContent);
};

// Email reset password
export const sendResetPasswordEmail = async (to, fullName, resetToken) => {
  const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
  const htmlContent = `
    <h2>Yêu cầu đặt lại mật khẩu</h2>
    <p>Xin chào ${fullName},</p>
    <p>Bạn đã yêu cầu đặt lại mật khẩu. Nhấp vào liên kết dưới để đặt lại mật khẩu của bạn:</p>
    <a href="${resetLink}">Đặt lại mật khẩu</a>
    <p>Liên kết này sẽ hết hạn trong 1 giờ.</p>
    <p>Nếu bạn không yêu cầu điều này, vui lòng bỏ qua email này.</p>
  `;
  return sendEmail(to, 'Đặt lại mật khẩu', htmlContent);
};

// Email xác nhận đơn hàng
export const sendOrderConfirmationEmail = async (to, fullName, order) => {
  const itemsHtml = order.items
    .map(
      item => `
        <tr>
          <td>${item.product_name}</td>
          <td>${item.quantity}</td>
          <td>${item.unit_price}</td>
          <td>${item.subtotal}</td>
        </tr>
      `
    )
    .join('');

  const htmlContent = `
    <h2>Xác nhận đơn hàng</h2>
    <p>Xin chào ${fullName},</p>
    <p>Cảm ơn bạn đã đặt hàng. Dưới đây là thông tin đơn hàng của bạn:</p>
    
    <h3>Mã đơn hàng: ${order.orderNumber}</h3>
    
    <table border="1" style="width: 100%; border-collapse: collapse;">
      <thead>
        <tr>
          <th>Sản phẩm</th>
          <th>Số lượng</th>
          <th>Giá</th>
          <th>Tổng</th>
        </tr>
      </thead>
      <tbody>
        ${itemsHtml}
      </tbody>
    </table>
    
    <h3>Tổng tiền: ${order.total_amount} VND</h3>
    <p>Phương thức thanh toán: ${order.payment_method}</p>
    
    <p>Địa chỉ giao hàng:</p>
    <p>${order.shipping_address.addressLine1}, ${order.shipping_address.city}</p>
  `;
  return sendEmail(to, 'Xác nhận đơn hàng', htmlContent);
};

// Email cập nhật trạng thái đơn hàng
export const sendOrderStatusUpdateEmail = async (to, fullName, orderNumber, status) => {
  const statusText = {
    pending: 'Đơn hàng đang chờ xử lý',
    processing: 'Đơn hàng đang được chuẩn bị',
    shipped: 'Đơn hàng đã được gửi',
    delivered: 'Đơn hàng đã được giao',
    cancelled: 'Đơn hàng đã bị hủy',
  };

  const htmlContent = `
    <h2>Cập nhật trạng thái đơn hàng</h2>
    <p>Xin chào ${fullName},</p>
    <p>Trạng thái đơn hàng của bạn đã được cập nhật:</p>
    <h3>Mã đơn hàng: ${orderNumber}</h3>
    <h3>Trạng thái: ${statusText[status]}</h3>
    <p>Vui lòng kiểm tra tài khoản của bạn để xem chi tiết.</p>
  `;
  return sendEmail(to, 'Cập nhật trạng thái đơn hàng', htmlContent);
};

export default {
  sendEmail,
  sendRegistrationEmail,
  sendResetPasswordEmail,
  sendOrderConfirmationEmail,
  sendOrderStatusUpdateEmail,
};