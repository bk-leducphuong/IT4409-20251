import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useAdminStore } from '../../stores/adminStore';
import { daysAgo, monthsAgo, yearsAgo } from '../../libs/dateHelper';
import styles from './Dashboard.module.css';

function Dashboard() {
  /* DASHBOARD */
  const [statistic, setStatistic] = useState(null);
  const [statsLast, setStatsLast] = useState('7d');
  const getDashboardStatistics = useAdminStore((state) => state.getDashboardStatistics);

  const [sales, setSales] = useState(null);
  const [salesLast, setSalesLast] = useState('7d');
  const [groupBy, setGroupBy] = useState('daily'); // daily | weekly | monthly
  const getDahsboardSales = useAdminStore((state) => state.getDahsboardSales);

  const [topProducts, setTopProducts] = useState(null);
  const [topLast, setTopLast] = useState('7d');
  const [sortBy, setSortBy] = useState('revenue'); // revenue | quantity
  const [limit, setLimit] = useState(10);
  const getDashboardTopProducts = useAdminStore((state) => state.getDashboardTopProducts);
  const hasProducts = topProducts?.top_products?.length > 0;
  const hasVariants = topProducts?.top_variants?.length > 0;

  /* MEILISEARCH */
  const [meiliStats, setMeiliStats] = useState(null);
  const syncMeilisearch = useAdminStore((state) => state.syncMeilisearch);
  const configMeilisearch = useAdminStore((state) => state.configMeilisearch);
  const getMeilisearchStatistics = useAdminStore((state) => state.getMeilisearchStatistics);
  const clearMeilisearchIndex = useAdminStore((state) => state.clearMeilisearchIndex);

  function getDate(date) {
    switch (date) {
      case '7d':
        return daysAgo(7);
      case '1m':
        return monthsAgo(1);
      case '6m':
        return monthsAgo(6);
      case '1y':
        return yearsAgo(1);
      default:
        return daysAgo(7);
    }
  }

  async function fetchStatistic() {
    try {
      const res = await getDashboardStatistics({
        startDate: getDate(statsLast),
        endDate: daysAgo(0),
      });
      setStatistic(res.data);
    } catch (error) {
      toast.error(error.message);
    }
  }

  async function fetchSales() {
    try {
      const res = await getDahsboardSales({
        startDate: getDate(salesLast),
        endDate: daysAgo(0),
        groupBy,
      });
      setSales(res.data);
    } catch (error) {
      toast.error(error.message);
    }
  }

  async function fetchTopProducts() {
    try {
      const res = await getDashboardTopProducts({
        startDate: getDate(topLast),
        endDate: daysAgo(0),
        sortBy,
        limit,
      });
      setTopProducts(res.data);
    } catch (error) {
      toast.error(error.message);
    }
  }

  async function fetchMeilisearchStatistics() {
    try {
      const res = await getMeilisearchStatistics();
      setMeiliStats(res.data);
    } catch (error) {
      toast.error(error.message);
    }
  }

  async function handleSyncMeiliSearch() {
    try {
      await syncMeilisearch();
      toast.success('Synced successfully');
    } catch (error) {
      toast.error(error.message);
    }
  }

  async function handleConfigMeiliSearch() {
    try {
      await configMeilisearch();
      toast.success('Configured successfully');
    } catch (error) {
      toast.error(error.message);
    }
  }

  async function handleClearMeiliSearch() {
    try {
      await clearMeilisearchIndex();
      toast.success('Cleared successfully');
    } catch (error) {
      toast.error(error.message);
    }
  }

  useEffect(() => {
    (async () =>
      await Promise.all([
        fetchStatistic(),
        fetchSales(),
        fetchTopProducts(),
        fetchMeilisearchStatistics(),
      ]))();
  }, []);

  return (
    <div className={styles.dashboard}>
      <header>
        <h1>Dashboard</h1>
        <p>Welcome to the admin dashboard</p>
      </header>

      <div className={styles.devider}></div>
      <section>
        <div>
          <h2>Statistics</h2>
          <select value={statsLast} onChange={(e) => setStatsLast(e.target.value)}>
            <option value="7d">Last 7 days</option>
            <option value="1m">Last 1 month</option>
            <option value="6m">Last 6 month</option>
            <option value="1y">Last 1 year</option>
          </select>
          <button onClick={fetchStatistic} className={styles.blackBtn}>
            Refresh
          </button>
        </div>

        <div className={styles.grid}>
          <div>
            <div>Total Revenue: {`${statistic?.revenue.total}đ`}</div>
            <p>Average Order Value: {`${statistic?.revenue.average_order_value}đ`}</p>
          </div>
          <div>
            <div>Total Orders: {statistic?.orders.total}</div>
            <p>Pending: {statistic?.orders.pending}</p>
          </div>
          <div>
            <div>Active Users: {statistic?.users.active_customers}</div>
            <p>New Users: {statistic?.users.new_this_month}</p>
          </div>
          <div>
            <div>Total Products: {statistic?.products.total_products}</div>
            <p>Low on stock: {statistic?.products.low_stock}</p>
          </div>
        </div>
      </section>

      <div className={styles.devider}></div>
      <section>
        <div>
          <h2>Sales</h2>
          {/* <select value={groupBy} onChange={(e) => setGroupBy(e.target.value)}>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select> */}
          <select value={salesLast} onChange={(e) => setSalesLast(e.target.value)}>
            <option value="7d">Last 7 days</option>
            <option value="1m">Last 1 month</option>
            <option value="6m">Last 6 month</option>
            <option value="1y">Last 1 year</option>
          </select>
          <button onClick={fetchSales} className={styles.blackBtn}>
            Refresh
          </button>
        </div>

        <div className={styles.grid}>
          <div>
            <div>Total Sales: {`${sales?.summary.total_sales}đ`}</div>
            <p>Items sold: {sales?.summary.total_items_sold}</p>
          </div>
          <div>
            <div>Total Orders: {sales?.summary.total_orders}</div>
            <p>Average: {`${sales?.summary.average_order_value}đ`}</p>
          </div>
        </div>
      </section>

      <div className={styles.devider}></div>
      <section>
        <div>
          <h2>Top products</h2>
          Limit:
          <select value={limit} onChange={(e) => setLimit(Number(e.target.value))}>
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
          </select>
          Sort by:
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="revenue">Revenue</option>
            <option value="quantity">Quantity</option>
          </select>
          <select value={topLast} onChange={(e) => setTopLast(e.target.value)}>
            <option value="7d">Last 7 days</option>
            <option value="1m">Last 1 month</option>
            <option value="6m">Last 6 month</option>
            <option value="1y">Last 1 year</option>
          </select>
          <button onClick={fetchTopProducts} className={styles.blackBtn}>
            Refresh
          </button>
        </div>

        {hasProducts ? (
          <div className={styles.products}>
            {topProducts.top_products.map((product) => (
              <div key={product.product_id}>
                <img src={product.image_url} alt="product" />
                <div>
                  {product.product_name}
                  <br />
                  <p>
                    Brand: {product.brand}
                    <br />
                    Category: {product.category}
                  </p>
                </div>
                {sortBy === 'revenue' ? (
                  <div>
                    Revenue: {`${product.total_revenue}đ`}
                    <br />
                    <p>Quantity: {product.total_quantity_sold}</p>
                  </div>
                ) : (
                  <div>
                    Quantity: {product.total_quantity_sold}
                    <br />
                    <p>Revenue: {`${product.total_revenue}đ`}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div>No data</div>
        )}

        <h2>Top variants</h2>
        {hasVariants > 0 ? (
          <div className={styles.products}>
            {topProducts.top_variants.map((variant) => (
              <div key={variant.variant_id}>
                <img src={variant.image_url} alt="variant" />
                <div>
                  {variant.product_name}
                  <br />
                  <p>{variant.sku}</p>
                </div>
                {sortBy === 'revenue' ? (
                  <div>
                    Revenue: {`${variant.total_revenue}đ`}
                    <br />
                    <p>Quantity: {variant.total_quantity_sold}</p>
                  </div>
                ) : (
                  <div>
                    Quantity: {variant.total_quantity_sold}
                    <br />
                    <p>Revenue: {`${variant.total_revenue}đ`}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div>No data</div>
        )}
      </section>

      <div className={styles.devider}></div>

      <section>
        <div>
          <h2>Meilisearch</h2>
          <button onClick={handleSyncMeiliSearch} className={styles.blackBtn}>
            Sync
          </button>
          <button onClick={handleConfigMeiliSearch} className={styles.blackBtn}>
            Configure
          </button>
          <button onClick={handleClearMeiliSearch} className={styles.redBtn}>
            Clear
          </button>
        </div>

        {meiliStats ? (
          <>
            <div className={styles.meiliStats}>
              <div>Number of Documents: {meiliStats.numberOfDocuments}</div>
              <div>Database Size: {meiliStats.rawDocumentDbSize}</div>
              <div>Average Document Size: {meiliStats.avgDocumentSize}</div>
              <div>Embedding: {meiliStats.numberOfEmbeddings}</div>
              <div>Embedded Documents: {meiliStats.numberOfEmbeddedDocuments}</div>
              <div>
                Indexing:{' '}
                {meiliStats.isIndexing ? (
                  <span className={styles.green}>True</span>
                ) : (
                  <span className={styles.red}>False</span>
                )}
              </div>
            </div>

            <h2>Feild Distribution</h2>
            <div className={styles.meiliStats}>
              {meiliStats.fieldDistribution &&
                Object.entries(meiliStats.fieldDistribution).map(([key, value]) => (
                  <div key={key}>
                    {key} : {value}
                  </div>
                ))}
            </div>
          </>
        ) : (
          <div>No data</div>
        )}
      </section>
    </div>
  );
}

export default Dashboard;
