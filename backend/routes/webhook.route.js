import express from 'express';
import crypto from 'crypto';
import orderService from '../services/order.service.js';

const router = express.Router();

/**
 * Webhook từ ngân hàng MB Bank
 * POST /api/webhooks/banking/mb
 * 
 * Body example:
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
router.post('/banking/mb', async (req, res) => {
  try {
    // 1. Verify webhook signature
    const signature = req.headers['x-signature'];
    const webhookSecret = process.env.BANKING_WEBHOOK_SECRET;
    
    if (webhookSecret && signature) {
      const computedSignature = crypto
        .createHmac('sha256', webhookSecret)
        .update(JSON.stringify(req.body))
        .digest('hex');
      
      if (signature !== computedSignature) {
        console.error('⚠️ Invalid webhook signature');
        return res.status(401).json({ error: 'Invalid signature' });
      }
    }

    // 2. Parse dữ liệu từ webhook
    const {
      transactionId,
      accountNumber,
      amount,
      description,
      transactionDate,
      creditDebit,
      status
    } = req.body;

    // Log webhook nhận được
    console.log('📨 Webhook received:', {
      transactionId,
      amount,
      description,
      status
    });

    // 3. Chỉ xử lý tiền vào
    if (creditDebit !== 'CREDIT') {
      console.log('ℹ️ Not a credit transaction, skipping');
      return res.status(200).json({ message: 'Not a credit transaction' });
    }

    // 4. Chỉ xử lý giao dịch thành công
    if (status !== 'SUCCESS') {
      console.log('ℹ️ Transaction not successful, skipping');
      return res.status(200).json({ message: 'Transaction not successful' });
    }

    // 5. Kiểm tra có reference đơn hàng không
    const referenceMatch = description.match(/DH([A-Z0-9]{8})/i);
    
    if (!referenceMatch) {
      console.log('⚠️ No order reference found in description:', description);
      return res.status(200).json({ message: 'No order reference found' });
    }

    // 6. Xác nhận thanh toán
    const result = await orderService.autoConfirmPayment({
      transactionId,
      amount: parseFloat(amount),
      description,
      transactionDate,
      bankCode: 'MB'
    });

    if (result.success) {
      console.log('✅ Payment confirmed via webhook:', result.order.order_number);
      
      return res.status(200).json({
        success: true,
        message: 'Payment confirmed successfully',
        orderNumber: result.order.order_number
      });
    } else {
      console.log('⚠️ Payment confirmation failed:', result.reason);
      
      return res.status(200).json({
        success: false,
        message: result.reason
      });
    }

  } catch (error) {
    console.error('❌ Webhook error:', error);
    
    // Vẫn trả 200 để ngân hàng không retry
    return res.status(200).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

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