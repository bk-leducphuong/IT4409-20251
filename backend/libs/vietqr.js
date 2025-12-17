// VietQR API Service
// Docs: https://www.vietqr.io/danh-sach-api

const VIETQR_API_URL = 'https://api.vietqr.io/v2';

/**
 * Generate QR code using VietQR API
 * @param {Object} params
 * @param {string} params.accountNo - Số tài khoản
 * @param {string} params.accountName - Tên chủ tài khoản
 * @param {string} params.acqId - Mã ngân hàng (BIN)
 * @param {number} params.amount - Số tiền
 * @param {string} params.addInfo - Nội dung chuyển khoản
 * @param {string} params.template - Template: 'compact', 'qr_only', 'print'
 * @returns {Promise<{qrCode: string, qrDataURL: string}>}
 */
export const generateVietQR = async ({
  accountNo,
  accountName,
  acqId,
  amount,
  addInfo = '',
  template = 'compact'
}) => {
  try {
    const response = await fetch(`${VIETQR_API_URL}/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-client-id': process.env.VIETQR_CLIENT_ID || '',
        'x-api-key': process.env.VIETQR_API_KEY || ''
      },
      body: JSON.stringify({
        accountNo,
        accountName,
        acqId,
        amount: Math.round(amount), // VietQR yêu cầu số nguyên
        addInfo,
        format: 'text',
        template
      })
    });

    const result = await response.json();

    if (result.code !== '00') {
      throw new Error(result.desc || 'VietQR API error');
    }

    return {
      qrCode: result.data.qrCode, // EMV string
      qrDataURL: result.data.qrDataURL // Base64 image
    };

  } catch (error) {
    console.error('VietQR API error:', error.message);
    throw new Error(`Không thể tạo mã QR: ${error.message}`);
  }
};

/**
 * Get danh sách ngân hàng hỗ trợ VietQR
 * @returns {Promise<Array>}
 */
export const getBankList = async () => {
  try {
    const response = await fetch(`${VIETQR_API_URL}/banks`);
    const result = await response.json();
    
    if (result.code !== '00') {
      throw new Error(result.desc || 'Cannot get bank list');
    }
    
    return result.data;
  } catch (error) {
    console.error('Get bank list error:', error.message);
    return [];
  }
};

/**
 * Lookup thông tin tài khoản (cần API key)
 * @param {string} bin - Mã ngân hàng
 * @param {string} accountNumber - Số tài khoản
 * @returns {Promise<Object>}
 */
export const lookupAccount = async (bin, accountNumber) => {
  try {
    const response = await fetch(`${VIETQR_API_URL}/lookup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-client-id': process.env.VIETQR_CLIENT_ID || '',
        'x-api-key': process.env.VIETQR_API_KEY || ''
      },
      body: JSON.stringify({
        bin,
        accountNumber
      })
    });

    const result = await response.json();

    if (result.code !== '00') {
      throw new Error(result.desc || 'Lookup failed');
    }

    return result.data;
  } catch (error) {
    console.error('Lookup account error:', error.message);
    throw error;
  }
};

export default {
  generateVietQR,
  getBankList,
  lookupAccount
};