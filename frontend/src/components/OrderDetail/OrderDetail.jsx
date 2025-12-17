import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useOrderStore } from '../../stores/orderStore';
import styles from './OrderDetail.module.css';

function Order({ order, done, refresh }) {
  const cancelOrder = useOrderStore((state) => state.cancelOrder);
  const [reason, setReason] = useState(null);

  async function handleCancelOrder() {
    try {
      await cancelOrder(order._id, reason);
      setReason(null);
      done();
      toast.success('Order cancelled');
      await refresh();
    } catch (error) {
      toast.error(error.message);
    }
  }

  return (
    <div className={styles.overlay}>
      <div>
        {reason === null ? (
          <>
            <h2>{order.order_number}</h2>

            <div>
              <h2>Shipping infomation</h2>
              <div>Full Name: {order.shipping_address.full_name}</div>
              <div>Phone: {order.shipping_address.phone}</div>
              <div>
                Address:{' '}
                {order.shipping_address.address_line +
                  ', ' +
                  order.shipping_address.city +
                  ', ' +
                  order.shipping_address.country}
              </div>
              <div>Postal Code: {order.shipping_address.postal_code}</div>
            </div>

            <div>
              <h2>Items</h2>
              <table className={styles.item}>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Unit Price</th>
                    <th>Quantity</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item) => (
                    <tr key={item.product_variant_id}>
                      <td>
                        <div className={styles.productInfo}>
                          <img src={item.image_url} alt="product" />
                          <div>
                            <div>{item.product_name}</div>
                            <div>{item.sku}</div>
                          </div>
                        </div>
                      </td>
                      <td>{`$${item.unit_price}`}</td>
                      <td>{item.quantity}</td>
                      <td>{`$${item.subtotal}`}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div>
              <h2>Payment</h2>
              <div className={styles.paymentDetail}>
                <div>
                  <div>Method: {order.payment_method}</div>
                  <div>Status: {order.status}</div>
                  <div>Customer Note: {order.customer_note}</div>
                </div>
                <div>
                  <div>Subtotal: {`$${order.subtotal}`}</div>
                  <div>Tax: {`$${order.tax}`}</div>
                  <div>Shipping: {`$${order.shipping_fee}`}</div>
                  <div>Discount: {`$${order.discount}`}</div>
                  <div>Total: {`$${order.total}`}</div>
                </div>
              </div>
            </div>

            <div className={styles.buttons}>
              <button onClick={done}>Done</button>
              {order.status != 'cancelled' && (
                <button onClick={() => setReason('')}>Cancel Order</button>
              )}
            </div>
          </>
        ) : (
          <>
            <h2>Enter the reason you want to cancel the order:</h2>
            <input type="text" value={reason} onChange={(e) => setReason(e.target.value)} />
            <div className={styles.buttons}>
              <button onClick={handleCancelOrder}>Cancel Order</button>
              <button onClick={() => setReason(null)}>Keep Order</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function OrderDetail() {
  const [orders, setOrders] = useState(null);
  const getOrder = useOrderStore((state) => state.getOrder);
  const [selectingOrder, setSelectingOrder] = useState(null);

  async function fetchOrders() {
    try {
      const res = await getOrder();
      setOrders(res.data.orders);
    } catch (error) {
      toast.error(error.message);
    }
  }

  useEffect(() => {
    (async () => await fetchOrders())();
  }, []);

  return (
    <div className={styles.order}>
      <h2>Manage your order</h2>
      {orders && orders.length > 0 ? (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Total</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{order.order_number}</td>
                <td>{`$${order.total}`}</td>
                <td>{order.status}</td>
                <td>
                  <button onClick={() => setSelectingOrder(order)}>
                    <i className="fa-solid fa-magnifying-glass"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div>No order was made</div>
      )}

      {selectingOrder && (
        <Order order={selectingOrder} done={() => setSelectingOrder(null)} refresh={fetchOrders} />
      )}
    </div>
  );
}

export default OrderDetail;
