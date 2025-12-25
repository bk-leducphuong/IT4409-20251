import express from 'express';
import crypto from 'crypto';
import orderService from '../services/order.service.js';

const router = express.Router();

/**
 * Generic bank webhook handler (supports multiple banks)
 * POST /api/webhooks/banking/:bank
 *
 * Example body (MB-like):
 * {
 *   "transactionId": "MB123456789",
 *   "accountNumber": "0969076681",
 *   "amount": 52000,
 *   "description": "DHC0CBEB88 thanh toan don hang",
 *   "transactionDate": "2025-12-17T10:00:00Z",
 *   "creditDebit": "CREDIT",
 *   "status": "SUCCESS"
 * }
 */
async function handleBankWebhook(req, res, bankParam = 'MB') {
  const bankCode = (bankParam || 'MB').toUpperCase();

  try {
    // 1. Verify webhook signature — supports per-bank secret: BANKING_WEBHOOK_SECRET_<BANK>
    const signature = req.headers['x-signature'];
    const secretEnvName = `BANKING_WEBHOOK_SECRET_${bankCode}`;
    const webhookSecret = process.env[secretEnvName] || process.env.BANKING_WEBHOOK_SECRET;

    if (!req.body || Object.keys(req.body).length === 0) {
      console.warn(`[${bankCode}] ⚠️ Empty webhook body received`);
      return res.status(200).json({ success: false, error: 'Empty request body' });
    }

    if (webhookSecret && signature) {
      const computedSignature = crypto
        .createHmac('sha256', webhookSecret)
        .update(JSON.stringify(req.body))
        .digest('hex');

      if (signature !== computedSignature) {
        console.error(`[${bankCode}] ⚠️ Invalid webhook signature`);
        return res.status(401).json({ error: 'Invalid signature' });
      }
    }

    // 2. Parse dữ liệu từ webhook
    const {
      transactionId,
      accountNumber,
      amount,
      description = '',
      transactionDate,
      creditDebit,
      status
    } = (req.body || {});

    // Log webhook nhận được
    console.log(`[${bankCode}] 📨 Webhook received:`, {
      transactionId,
      amount,
      description,
      status
    });

    // 3. Chỉ xử lý tiền vào
    if (creditDebit !== 'CREDIT') {
      console.log(`[${bankCode}] ℹ️ Not a credit transaction, skipping`);
      return res.status(200).json({ message: 'Not a credit transaction' });
    }

    // 4. Chỉ xử lý giao dịch thành công
    if (status !== 'SUCCESS') {
      console.log(`[${bankCode}] ℹ️ Transaction not successful, skipping`);
      return res.status(200).json({ message: 'Transaction not successful' });
    }

    // 5. Kiểm tra có reference đơn hàng không
    const referenceMatch = (description || '').match(/DH([A-Z0-9]{8})/i);

    if (!referenceMatch) {
      console.log(`[${bankCode}] ⚠️ No order reference found in description:`, description);
      return res.status(200).json({ message: 'No order reference found' });
    }

    // 6. Xác nhận thanh toán
    const result = await orderService.autoConfirmPayment({
      transactionId,
      amount: parseFloat(amount),
      description,
      transactionDate,
      bankCode
    });

    if (result.success) {
      console.log(`[${bankCode}] ✅ Payment confirmed via webhook:`, result.order.order_number);

      return res.status(200).json({
        success: true,
        message: 'Payment confirmed successfully',
        orderNumber: result.order.order_number
      });
    } else {
      console.log(`[${bankCode}] ⚠️ Payment confirmation failed:`, result.reason);

      return res.status(200).json({
        success: false,
        message: result.reason
      });
    }

  } catch (error) {
    console.error('❌ Webhook error:', error.stack || error);

    // Vẫn trả 200 để ngân hàng không retry
    return res.status(200).json({
      success: false,
      error: process.env.NODE_ENV === 'production' ? 'Internal server error' : (error.message || 'Internal server error')
    });
  }
}

// Backwards-compatible MB route
router.post('/banking/mb', async (req, res) => handleBankWebhook(req, res, 'MB'));
// Generic bank route
router.post('/banking/:bank', async (req, res) => handleBankWebhook(req, res, req.params.bank));

/**
 * Test webhook endpoint 
 * POST /api/webhooks/banking/test
 */
router.post('/banking/test', async (req, res) => {
  if (process.env.NODE_ENV === 'production') {
    return res.status(404).json({ error: 'Not found' });
  }

  console.log('🧪 Test webhook received:', req.body);
  
  res.json({
    success: true,
    message: 'Test webhook received',
    data: req.body
  });
});

/**
 * Health check
 * GET /api/webhooks/health
 */
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString()
  });
});

export default router;