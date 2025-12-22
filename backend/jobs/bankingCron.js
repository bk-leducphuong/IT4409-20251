// jobs/bankingCron.js
import cron from 'node-cron';
import axios from 'axios';
import orderService from '../services/order.service.js';

/**
 * Lấy danh sách giao dịch từ Bank API
 * (Thay bằng API thật của ngân hàng bạn)
 */
async function fetchBankTransactions() {
  try {
    // TODO: Thay bằng API thật
    const response = await axios.post(
      process.env.BANKING_API_URL || 'https://api.mbbank.com.vn/transactions',
      {
        accountNumber: process.env.BANK_ACCOUNT_NUMBER,
        fromDate: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 phút trước
        toDate: new Date().toISOString()
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.BANKING_API_TOKEN}`,
          'Content-Type': 'application/json'
        },
        timeout: 60000
      }
    );

    return response.data.transactions || [];
  } catch (error) {
    console.error('Fetch bank transactions error:', error.message);
    return [];
  }
}

/**
 * Xử lý từng transaction
 */
async function processTransaction(transaction) {
  const {
    id: transactionId,
    amount,
    description,
    creditDebit, // CREDIT = tiền vào, DEBIT = tiền ra
    transactionDate
  } = transaction;

  // Chỉ xử lý tiền vào
  if (creditDebit !== 'CREDIT') return;

  // Gọi hàm auto confirm
  try {
    const result = await orderService.autoConfirmPayment({
      transactionId,
      amount,
      description,
      transactionDate,
      bankCode: 'MB'
    });

    if (result.success) {
      console.log(`[CRON] Auto-confirmed: ${result.order.order_number}`);
    }
  } catch (error) {
    console.error('[CRON] Process transaction error:', error.message);
  }
}

/**
 * Start cron jobs
 */
export function startBankingCronJobs() {
  console.log('⏰ Starting banking cron jobs...');

  // 1. Check bank transactions mỗi 5 phút
  cron.schedule('*/5 * * * *', async () => {
    console.log('[CRON] Checking bank transactions...');

    try {
      const transactions = await fetchBankTransactions();
      console.log(`[CRON] Found ${transactions.length} transactions`);

      for (const transaction of transactions) {
        await processTransaction(transaction);
      }

      console.log('[CRON] Bank check completed');
    } catch (error) {
      console.error('[CRON] Bank check error:', error);
    }
  });

  // 2. Cancel expired orders mỗi 10 phút
  cron.schedule('*/10 * * * *', async () => {
    console.log('[CRON] Checking expired orders...');

    try {
      const result = await orderService.cancelExpiredOrders();
      if (result.cancelled > 0) {
        console.log(`⏰ [CRON] Cancelled ${result.cancelled} expired orders`);
      }
    } catch (error) {
      console.error('[CRON] Cancel expired error:', error);
    }
  });

  console.log('Banking cron jobs started');
  console.log('  - Check transactions: Every 5 minutes');
  console.log('  - Cancel expired orders: Every 10 minutes');
}

export default startBankingCronJobs;