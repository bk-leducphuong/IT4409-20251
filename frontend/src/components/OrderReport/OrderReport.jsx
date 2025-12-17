import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useAdminStore } from '../../stores/adminStore';
import styles from './OrderReport.module.css';

function OrderReport() {
  const [orders, setOrders] = useState(null);
  const getOrders = useAdminStore((state) => state.getOrders);
  const updateOrderStatus = useAdminStore((state) => state.updateOrderStatus);

  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [limit, setLimit] = useState(20);

  async function fetchOrders() {
    try {
      const res = await getOrders({ limit, page });
      setTotalPage(res.data.pagination.pages);
      setOrders(res.data.orders);
    } catch (err) {
      toast.error(err.message);
    }
  }

  /* TODO: order searchbar */

  useEffect(() => {
    (async () => await fetchOrders())();
  }, [limit, page]);

  return (
    <div className={styles.orderReport}>
      <header>
        <h1>Order Management</h1>
        <p>Manage store&apos;s order</p>
      </header>

      <main>
        <div>
          <input
            type="text"
            placeholder="Enter Order'Id eg: ORD-20251215-00001"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className={styles.buttonsContainer}>
            <button>
              <i className="fa-solid fa-magnifying-glass"></i>Find
            </button>
            <button onClick={fetchOrders}>
              <i className="fa-solid fa-arrows-rotate"></i>Refresh
            </button>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Customer</th>
              <th>Total</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {orders &&
              orders.map((order) => (
                <tr key={order._id}>
                  <td>{order.order_number}</td>
                  <td>{order.shipping_address.full_name}</td>
                  <td>{`$${order.total}`}</td>
                  <td>
                    <select
                      value={order.status}
                      onChange={(e) =>
                        updateOrderStatus(order._id, e.target.value)
                          .then((res) => {
                            res = res.data.order;
                            setOrders(orders.map((o) => (o._id === res._id ? res : o)));
                            toast.success('Order status updated');
                          })
                          .catch((err) => toast.error(err.message))
                      }
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                      <option value="refunded">Refunded</option>
                    </select>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>

        <div className={styles.pagination}>
          <div className={styles.buttonsContainer}>
            <button
              onClick={() => {
                if (page > 1) setPage((p) => p - 1);
              }}
            >
              &lt;
            </button>
            <span>
              {page} / {totalPage}
            </span>
            <button
              onClick={() => {
                if (page < totalPage) setPage((p) => p + 1);
              }}
            >
              &gt;
            </button>
          </div>
          <div>
            Orders per page:
            <select
              value={limit}
              onChange={(e) => {
                setLimit(e.target.value);
                setPage(1);
              }}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>
      </main>
    </div>
  );
}

export default OrderReport;
