import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useAdminStore } from '../../stores/adminStore';
import styles from './CouponReport.module.css';

function CouponReport() {
  const [coupons, setCoupons] = useState(null);
  const getCoupons = useAdminStore((state) => state.getCoupons);

  const [newCoupon, setNewCoupon] = useState(null);
  const createCoupon = useAdminStore((state) => state.createCoupon);

  const [editingCoupon, setEditingCoupon] = useState(null);
  const updateCoupon = useAdminStore((state) => state.updateCoupon);

  const [deletingCoupon, setDeletingCoupon] = useState(null);
  const deleteCoupon = useAdminStore((state) => state.deleteCoupon);

  const [limit, setLimit] = useState(20);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);

  /* For searching */
  const [active, setActive] = useState('');
  const [discountType, setDiscountType] = useState('');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('-createAt');

  async function fetchCoupons() {
    try {
      const queryObject = {
        page,
        limit,
        search,
        sort,
      };
      if (active !== '') queryObject.is_active = active;
      if (discountType !== '') queryObject.discount_type = discountType;
      const res = await getCoupons(queryObject);
      setCoupons(res.data.coupons);
      setTotalPage(res.data.pagination.pages);
    } catch (error) {
      toast.error(error.message);
    }
  }

  async function handleCreateCoupon() {
    try {
      await createCoupon(newCoupon);
      await fetchCoupons();
      toast.success('Successfully created new coupon');
    } catch (error) {
      toast.error(error.message);
    }
  }

  async function handleUpdateCoupon() {
    try {
      await updateCoupon(editingCoupon._id, editingCoupon);
      await fetchCoupons();
      toast.success('Successfully updated coupon');
      setEditingCoupon(null);
    } catch (error) {
      toast.error(error.message);
    }
  }

  async function handleDeleteCoupon() {
    try {
      await deleteCoupon(deletingCoupon._id);
      await fetchCoupons();
      toast.success('Successfully deleted coupon');
      setDeletingCoupon(null);
    } catch (error) {
      toast.error(error.message);
    }
  }

  useEffect(() => {
    (async () => await fetchCoupons())();
  }, [limit, page]);

  return (
    <div className={styles.couponReport}>
      <header>
        <div>
          <h1>Coupon Management</h1>
          <p>Manage store&apos;s coupons</p>
        </div>
        <button className={styles.blackBtn} onClick={() => setNewCoupon({})}>
          + Create new coupon
        </button>
      </header>

      <main>
        <div className={styles.search}>
          <div>
            <input
              type="text"
              placeholder="Enter coupon's code"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <div>
              Active:
              <select value={active} onChange={(e) => setActive(e.target.value)}>
                <option value="">All</option>
                <option value="true">True</option>
                <option value="false">False</option>
              </select>
            </div>
            <div>
              Discount Type:
              <select value={discountType} onChange={(e) => setDiscountType(e.target.value)}>
                <option value="">All</option>
                <option value="percentage">Percentage</option>
                <option value="fixed_amount">Fixed Amount</option>
                <option value="free_shipping">Free Shipping</option>
              </select>
            </div>
            <div>
              Sort By:
              <select value={sort} onChange={(e) => setSort(e.target.value)}>
                <option value="-createAt">Newest</option>
                <option value="code">Code</option>
                <option value="valid_until">Validation period</option>
              </select>
            </div>
          </div>
          <div className={styles.buttonContainer}>
            <button onClick={fetchCoupons}>
              <i className="fa-solid fa-magnifying-glass"></i> Find
            </button>
            <button>
              <i className="fa-solid fa-arrows-rotate"></i> Refresh
            </button>
          </div>
        </div>

        <table className={styles.table}>
          <thead>
            <tr>
              <th>Code</th>
              <th>Used</th>
              <th>Limit</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {coupons &&
              coupons.map((coupon) => (
                <tr key={coupon._id}>
                  <td>{coupon.code}</td>
                  <td>{coupon.usage_count}</td>
                  <td>{coupon.usage_limit}</td>
                  <td>
                    <div className={styles.buttonContainer}>
                      <button onClick={() => setEditingCoupon({ ...coupon })}>Edit</button>
                      <button className={styles.redBtn} onClick={() => setDeletingCoupon(coupon)}>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>

        <div className={styles.pagination}>
          <div className={styles.buttonContainer}>
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
          <div className={styles.buttonContainer}>
            Coupons per page:
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

      {newCoupon && (
        <div className={styles.overlay}>
          <div>
            <h2>Create new coupon</h2>

            <div className={styles.form}>
              <div>Code:</div>
              <input
                type="text"
                placeholder="Enter coupon's code"
                value={newCoupon.code}
                onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value })}
              />

              <div>Description</div>
              <textarea
                value={newCoupon.description}
                onChange={(e) => setNewCoupon({ ...newCoupon, description: e.target.value })}
              />

              <div>Discount Type</div>
              <select
                value={newCoupon.discount_type ?? 'percentage'}
                onChange={(e) => setNewCoupon({ ...newCoupon, discount_type: e.target.value })}
              >
                <option value="percentage">Percentage</option>
                <option value="fixed_amount">Fixed Amount</option>
                <option value="free_shipping">Free Shipping</option>
              </select>

              <div>Discount Value</div>
              <input
                type="text"
                inputMode="numeric"
                placeholder="Enter discount value"
                value={newCoupon.discount_value}
                onChange={(e) =>
                  setNewCoupon({ ...newCoupon, discount_value: Number(e.target.value) })
                }
              />

              <div>Max Discount Amount</div>
              <input
                type="text"
                inputMode="numeric"
                placeholder="Enter max discount value"
                value={newCoupon.max_discount_amount}
                onChange={(e) =>
                  setNewCoupon({ ...newCoupon, max_discount_amount: Number(e.target.value) })
                }
              />

              <div>Min Order Value</div>
              <input
                type="text"
                inputMode="numeric"
                placeholder="Enter min order value"
                value={newCoupon.min_order_value}
                onChange={(e) =>
                  setNewCoupon({ ...newCoupon, min_order_value: Number(e.target.value) })
                }
              />

              <div>Usage Limit</div>
              <input
                type="number"
                min={1}
                value={newCoupon.usage_limit ?? 1}
                onChange={(e) =>
                  setNewCoupon({ ...newCoupon, usage_limit: Number(e.target.value) })
                }
              />

              <div>Usage Limit per User</div>
              <input
                type="number"
                min={1}
                value={newCoupon.usage_limit_per_user ?? 1}
                onChange={(e) =>
                  setNewCoupon({ ...newCoupon, usage_limit_per_user: Number(e.target.value) })
                }
              />

              <div>Active</div>
              <select
                value={newCoupon.is_active ?? true}
                onChange={(e) =>
                  setNewCoupon({ ...newCoupon, is_active: e.target.value === 'true' })
                }
              >
                <option value="true">True</option>
                <option value="false">False</option>
              </select>

              <div>Valid From</div>
              <input
                type="datetime-local"
                value={
                  newCoupon.valid_from
                    ? new Date(newCoupon.valid_from).toISOString().slice(0, 16)
                    : ''
                }
                onChange={(e) =>
                  setNewCoupon({
                    ...newCoupon,
                    valid_from: new Date(e.target.value).toISOString(),
                  })
                }
              />
              <div>Valid Until</div>
              <input
                type="datetime-local"
                value={
                  newCoupon.valid_until
                    ? new Date(newCoupon.valid_until).toISOString().slice(0, 16)
                    : ''
                }
                onChange={(e) =>
                  setNewCoupon({
                    ...newCoupon,
                    valid_until: new Date(e.target.value).toISOString(),
                  })
                }
              />
            </div>

            <div className={styles.buttonContainer}>
              <button onClick={handleCreateCoupon}>Create coupon</button>
              <button onClick={() => setNewCoupon(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {editingCoupon && (
        <div className={styles.overlay}>
          <div>
            <h2>Update coupon</h2>

            <div className={styles.form}>
              <div>Code:</div>
              <input
                type="text"
                placeholder="Enter coupon's code"
                value={editingCoupon.code}
                onChange={(e) => setEditingCoupon({ ...editingCoupon, code: e.target.value })}
              />

              <div>Description</div>
              <textarea
                value={editingCoupon.description}
                onChange={(e) =>
                  setEditingCoupon({ ...editingCoupon, description: e.target.value })
                }
              />

              <div>Discount Type</div>
              <select
                value={editingCoupon.discount_type}
                onChange={(e) =>
                  setEditingCoupon({ ...editingCoupon, discount_type: e.target.value })
                }
              >
                <option value="percentage">Percentage</option>
                <option value="fixed_amount">Fixed Amount</option>
                <option value="free_shipping">Free Shipping</option>
              </select>

              <div>Discount Value</div>
              <input
                type="text"
                inputMode="numeric"
                placeholder="Enter discount value"
                value={editingCoupon.discount_value}
                onChange={(e) =>
                  setEditingCoupon({ ...editingCoupon, discount_value: Number(e.target.value) })
                }
              />

              <div>Max Discount Amount</div>
              <input
                type="text"
                inputMode="numeric"
                placeholder="Enter max discount value"
                value={editingCoupon.max_discount_amount}
                onChange={(e) =>
                  setEditingCoupon({
                    ...editingCoupon,
                    max_discount_amount: Number(e.target.value),
                  })
                }
              />

              <div>Min Order Value</div>
              <input
                type="text"
                inputMode="numeric"
                placeholder="Enter min order value"
                value={editingCoupon.min_order_value}
                onChange={(e) =>
                  setEditingCoupon({ ...editingCoupon, min_order_value: Number(e.target.value) })
                }
              />

              <div>Usage Limit</div>
              <input
                type="number"
                min={1}
                value={editingCoupon.usage_limit}
                onChange={(e) =>
                  setEditingCoupon({ ...editingCoupon, usage_limit: Number(e.target.value) })
                }
              />

              <div>Usage Limit per User</div>
              <input
                type="number"
                min={1}
                value={editingCoupon.usage_limit_per_user}
                onChange={(e) =>
                  setEditingCoupon({
                    ...editingCoupon,
                    usage_limit_per_user: Number(e.target.value),
                  })
                }
              />

              <div>Active</div>
              <select
                value={editingCoupon.is_active}
                onChange={(e) =>
                  setEditingCoupon({ ...editingCoupon, is_active: e.target.value === 'true' })
                }
              >
                <option value="true">True</option>
                <option value="false">False</option>
              </select>

              <div>Valid From</div>
              <input
                type="datetime-local"
                value={
                  editingCoupon.valid_from
                    ? new Date(editingCoupon.valid_from).toISOString().slice(0, 16)
                    : ''
                }
                onChange={(e) =>
                  setEditingCoupon({
                    ...editingCoupon,
                    valid_from: new Date(e.target.value).toISOString(),
                  })
                }
              />
              <div>Valid Until</div>
              <input
                type="datetime-local"
                value={
                  editingCoupon.valid_until
                    ? new Date(editingCoupon.valid_until).toISOString().slice(0, 16)
                    : ''
                }
                onChange={(e) =>
                  setEditingCoupon({
                    ...editingCoupon,
                    valid_until: new Date(e.target.value).toISOString(),
                  })
                }
              />
            </div>

            <div className={styles.buttonContainer}>
              <button onClick={handleUpdateCoupon}>Update coupon</button>
              <button onClick={() => setEditingCoupon(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {deletingCoupon && (
        <div className={styles.overlay}>
          <div>
            <h2>{`Are you sure you want to delete coupon ${deletingCoupon.code}?`}</h2>
            <div className={styles.buttonContainer}>
              <button className={styles.redBtn} onClick={handleDeleteCoupon}>
                Delete
              </button>
              <button onClick={() => setDeletingCoupon(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CouponReport;
