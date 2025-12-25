import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { useProductStore } from '../../stores/productStore';
import { useBrandStore } from '../../stores/brandStore';
import { useCategoryStore } from '../../stores/categoryStore';
import { useAdminStore } from '../../stores/adminStore';
import styles from './ProductReport.module.css';

function ProductVariant({ selectingProduct, cancel }) {
  const [newVariant, setNewVariant] = useState(null);
  const createVariant = useAdminStore((state) => state.createProductVariant);

  const [editingVariant, setEditingVariant] = useState(null);
  const updateVariant = useAdminStore((state) => state.updateVariant);

  const [deletingVariant, setDeletingVariant] = useState(null);
  const deleteVariant = useAdminStore((state) => state.deleteVariant);

  const newImage = useRef(null);
  const editingImage = useRef(null);
  const uploadImage = useAdminStore((state) => state.uploadImage);
  async function handleFileChange(type) {
    const image = type === 'new' ? newImage : editingImage;
    if (!image.current || !image.current.files[0]) return;
    try {
      const res = await uploadImage(selectingProduct._id, image.current.files[0]);
      if (newVariant)
        setNewVariant({
          ...newVariant,
          main_image_url: import.meta.env.VITE_API_URL + res.data.url,
        });
      else
        setEditingVariant({
          ...editingVariant,
          main_image_url: import.meta.env.VITE_API_URL + res.data.url,
        });
      toast.success('Image uploaded');
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  }

  return (
    <div className={styles.productVariant}>
      <h2>Product infomations</h2>
      <div className={styles.productInfo}>
        <div>
          <span className={styles.bold}>Name: </span>
          {selectingProduct.name}
        </div>
        <div>
          <span className={styles.bold}>Slug: </span>
          {selectingProduct.slug}
        </div>
        <div>
          <span className={styles.bold}>Category: </span>
          {selectingProduct.category_id.name}
        </div>
        <div>
          <span className={styles.bold}>Brand: </span>
          {selectingProduct.brand_id.name}
        </div>
        <div>
          <span className={styles.bold}>Description: </span>
          {selectingProduct.description}
        </div>
      </div>

      <div>
        <h2>Variants</h2>
        <button className={styles.blackBtn} onClick={() => setNewVariant({})}>
          + Create new variant
        </button>
      </div>
      {selectingProduct.variants && selectingProduct.variants.length > 0 ? (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Variant</th>
              <th>Price</th>
              <th>Stock quantity</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {selectingProduct.variants.map((variant) => (
              <tr key={variant._id}>
                <td>
                  <div className={styles.variantInfo}>
                    <img src={variant.main_image_url} alt="variant" />
                    {variant.sku}
                  </div>
                </td>
                <td>
                  <div>
                    {`${variant.price.toLocaleString('vi-VN')}đ`}
                    <br />
                    {variant.original_price ? (
                      <span
                        className={styles.grey}
                      >{`${variant.original_price.toLocaleString('vi-VN')}đ`}</span>
                    ) : (
                      ''
                    )}
                  </div>
                </td>
                <td>{variant.stock_quantity}</td>
                <td>
                  <div className={styles.buttonsContainer}>
                    <button onClick={() => setEditingVariant({ ...variant })}>Edit</button>
                    <button className={styles.redBtn} onClick={() => setDeletingVariant(variant)}>
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className={styles.noVariants}>No variants</div>
      )}
      <button onClick={cancel}>Done</button>

      {newVariant && (
        <div className={styles.overlay}>
          <div>
            <h2>Create new variant</h2>

            <div className={styles.form}>
              <div>SKU:</div>
              <input
                type="text"
                placeholder="Enter variant's sku"
                value={newVariant.sku}
                onChange={(e) => setNewVariant({ ...newVariant, sku: e.target.value })}
              />

              <div>Price:</div>
              <input
                type="number"
                placeholder="Enter variant's price"
                value={newVariant.price}
                onChange={(e) => setNewVariant({ ...newVariant, price: e.target.value })}
              />

              <div>Original price:</div>
              <input
                type="number"
                placeholder="Enter variant's original price"
                value={newVariant.original_price}
                onChange={(e) => setNewVariant({ ...newVariant, original_price: e.target.value })}
              />

              <div>Stock quantity:</div>
              <input
                type="number"
                placeholder="Enter variant's stock quantity"
                value={newVariant.stock_quantity}
                onChange={(e) => setNewVariant({ ...newVariant, stock_quantity: e.target.value })}
              />

              <div>Main image:</div>
              <div className={styles.imageInputGroup}>
                <input
                  type="text"
                  placeholder="Enter image's url"
                  value={newVariant.main_image_url}
                  onChange={(e) => setNewVariant({ ...newVariant, main_image_url: e.target.value })}
                />
                <input
                  type="file"
                  ref={newImage}
                  onChange={() => handleFileChange('new')}
                  accept="image/*"
                  disabled={newVariant.main_image_url}
                />
              </div>

              <div>RAM:</div>
              <input
                type="text"
                placeholder="Enter RAM"
                value={newVariant.RAM}
                onChange={(e) => setNewVariant({ ...newVariant, RAM: e.target.value })}
              />

              <div>Storage:</div>
              <input
                type="text"
                placeholder="Enter Storage"
                value={newVariant.storage}
                onChange={(e) => setNewVariant({ ...newVariant, storage: e.target.value })}
              />

              <div>Color:</div>
              <input
                type="text"
                placeholder="Enter color"
                value={newVariant.color}
                onChange={(e) => setNewVariant({ ...newVariant, color: e.target.value })}
              />
            </div>

            <div className={styles.buttonsContainer}>
              <button
                onClick={() =>
                  createVariant(selectingProduct._id, {
                    sku: newVariant.sku,
                    price: newVariant.price,
                    original_price: newVariant.original_price,
                    stock_quantity: newVariant.stock_quantity,
                    main_image_url: newVariant.main_image_url,
                    attributes: {
                      RAM: newVariant.RAM,
                      Storage: newVariant.storage,
                      Color: newVariant.color,
                    },
                  })
                    .then(() => {
                      toast.success('Variant created');
                      setNewVariant(null);
                    })
                    .catch((err) => toast.error(err.message))
                }
              >
                Create variant
              </button>
              <button onClick={() => setNewVariant(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {editingVariant && (
        <div className={styles.overlay}>
          <div>
            <h2>Update variant</h2>

            <div className={styles.form}>
              <div>SKU:</div>
              <input
                type="text"
                placeholder="Enter variant's sku"
                value={editingVariant.sku}
                onChange={(e) => setEditingVariant({ ...editingVariant, sku: e.target.value })}
              />

              <div>Price:</div>
              <input
                type="number"
                placeholder="Enter variant's price"
                value={editingVariant.price}
                onChange={(e) => setEditingVariant({ ...editingVariant, price: e.target.value })}
              />

              <div>Original price:</div>
              <input
                type="number"
                placeholder="Enter variant's original price"
                value={editingVariant.original_price}
                onChange={(e) =>
                  setEditingVariant({ ...editingVariant, original_price: e.target.value })
                }
              />

              <div>Stock quantity:</div>
              <input
                type="number"
                placeholder="Enter variant's stock quantity"
                value={editingVariant.stock_quantity}
                onChange={(e) =>
                  setEditingVariant({ ...editingVariant, stock_quantity: e.target.value })
                }
              />

              <div>Main image:</div>
              <div className={styles.imageInputGroup}>
                <input
                  type="text"
                  placeholder="Enter image's url"
                  value={editingVariant.main_image_url}
                  onChange={(e) =>
                    setEditingVariant({ ...editingVariant, main_image_url: e.target.value })
                  }
                />
                <input
                  type="file"
                  ref={editingImage}
                  onChange={() => handleFileChange('editing')}
                  accept="image/*"
                  disabled={editingVariant.main_image_url}
                />
              </div>

              <div>RAM:</div>
              <input
                type="text"
                placeholder="Enter RAM"
                value={editingVariant.attributes?.RAM}
                onChange={(e) =>
                  setEditingVariant({
                    ...editingVariant,
                    attributes: { ...editingVariant.attributes, RAM: e.target.value },
                  })
                }
              />

              <div>Storage:</div>
              <input
                type="text"
                placeholder="Enter Storage"
                value={editingVariant.attributes?.Storage}
                onChange={(e) =>
                  setEditingVariant({
                    ...editingVariant,
                    attributes: { ...editingVariant.attributes, Storage: e.target.value },
                  })
                }
              />

              <div>Color:</div>
              <input
                type="text"
                placeholder="Enter color"
                value={editingVariant.attributes?.Color}
                onChange={(e) =>
                  setEditingVariant({
                    ...editingVariant,
                    attributes: { ...editingVariant.attributes, Color: e.target.value },
                  })
                }
              />
            </div>

            <div className={styles.buttonsContainer}>
              <button
                onClick={() =>
                  updateVariant(editingVariant._id, {
                    sku: editingVariant.sku,
                    price: editingVariant.price,
                    original_price: editingVariant.original_price,
                    stock_quantity: editingVariant.stock_quantity,
                    main_image_url: editingVariant.main_image_url,
                    attributes: {
                      RAM: editingVariant.attributes?.RAM,
                      Storage: editingVariant.attributes?.Storage,
                      Color: editingVariant.attributes?.Color,
                    },
                  })
                    .then(() => {
                      toast.success('Variant updated');
                      setEditingVariant(null);
                    })
                    .catch((err) => toast.error(err.message))
                }
              >
                Update variant
              </button>
              <button onClick={() => setEditingVariant(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {deletingVariant && (
        <div className={styles.overlay}>
          <div>
            <h2>{`Are you sure you want to delete ${deletingVariant.sku}?`}</h2>
            <div className={styles.buttonsContainer}>
              <button
                className={styles.redBtn}
                onClick={() =>
                  deleteVariant(deletingVariant._id)
                    .then(() => {
                      toast.success('Variant deleted');
                      setDeletingVariant(null);
                    })
                    .catch((err) => toast.error(err.message))
                }
              >
                Delete
              </button>
              <button onClick={() => setDeletingVariant(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ProductReport() {
  const [products, setProducts] = useState(null);
  const [productName, setProductName] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [totalPage, setTotalPage] = useState(1);

  const brands = useBrandStore((state) => state.data);
  const categories = useCategoryStore((state) => state.data);

  const getProducts = useProductStore((state) => state.getProducts);

  const [newProduct, setNewProduct] = useState(null);
  const createProduct = useAdminStore((state) => state.createProduct);

  const [editingProduct, setEditingProduct] = useState(null);
  const updateProduct = useAdminStore((state) => state.updateProduct);

  const [deletingProduct, setDeletingProduct] = useState(null);
  const deleteProduct = useAdminStore((state) => state.deleteProduct);

  const [selectingProduct, setSelectingProduct] = useState(null);

  async function fetchProducts() {
    try {
      const res = await getProducts({ page, limit });
      setProducts(res.data.products);
      setTotalPage(res.data.pagination.totalPages);
    } catch (error) {
      toast.error(error.message);
    }
  }

  async function searchProducts() {
    try {
      const res = await getProducts({ search: productName, page, limit });
      setProducts(res.data.products);
      setTotalPage(res.data.pagination.totalPages);
    } catch (error) {
      toast.error(error.message);
    }
  }

  useEffect(() => {
    (async () => await fetchProducts())();
  }, [limit, page]);

  if (selectingProduct)
    return (
      <ProductVariant
        selectingProduct={selectingProduct}
        cancel={() => setSelectingProduct(null)}
      />
    );

  return (
    <div className={styles.productReport}>
      <header>
        <div>
          <h1>Products Management</h1>
          <p>Manage store&apos;s products</p>
        </div>

        <button className={styles.blackBtn} onClick={() => setNewProduct({})}>
          + Create new product
        </button>
      </header>

      <main>
        <div>
          <input
            type="text"
            placeholder="Find product"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
          />
          <div className={styles.buttonsContainer}>
            <button onClick={searchProducts}>Find</button>
            <button
              onClick={() => {
                setProductName('');
                fetchProducts();
              }}
            >
              Refresh
            </button>
          </div>
        </div>

        <table className={styles.table}>
          <thead>
            <tr>
              <th>Product</th>
              <th>Brand</th>
              <th>Category</th>
              <th>Number of variants</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products &&
              products.map((product) => (
                <tr key={product._id}>
                  <td>{product.name}</td>
                  <td>{product.brand_id.name}</td>
                  <td>{product.category_id.name}</td>
                  <td>{product.variants?.length || 0}</td>
                  <td>
                    <div className={styles.buttonsContainer}>
                      <button onClick={() => setEditingProduct({ ...product })}>Edit</button>
                      <button onClick={() => setSelectingProduct(product)}>Variants</button>
                      <button onClick={() => setDeletingProduct(product)} className={styles.redBtn}>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>

        <div className={styles.paginationContainer}>
          <div>
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
            Product per page:
            <select
              value={limit}
              onChange={(e) => {
                setLimit(e.target.value);
                setPage(1);
              }}
            >
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
            </select>
          </div>
        </div>
      </main>

      {newProduct && (
        <div className={styles.overlay}>
          <div>
            <h2>Create new product</h2>

            <div className={styles.form}>
              <div>Name:</div>
              <input
                type="text"
                placeholder="Enter product's name"
                value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
              />

              <div>Slug:</div>
              <input
                type="text"
                placeholder="Enter product's slug"
                value={newProduct.slug}
                onChange={(e) => setNewProduct({ ...newProduct, slug: e.target.value })}
              />

              <div>Description:</div>
              <textarea
                value={newProduct.description}
                onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
              ></textarea>

              <div>Category:</div>
              <select
                value={newProduct.category_id}
                onChange={(e) => {
                  setNewProduct({ ...newProduct, category_id: e.target.value });
                }}
              >
                {categories &&
                  categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
              </select>

              <div>Brand:</div>
              <select
                value={newProduct.brand_id}
                onChange={(e) => {
                  setNewProduct({ ...newProduct, brand_id: e.target.value });
                }}
              >
                {brands &&
                  brands.map((brand) => (
                    <option key={brand._id} value={brand._id}>
                      {brand.name}
                    </option>
                  ))}
              </select>
            </div>

            <div className={styles.buttonsContainer}>
              <button
                onClick={() =>
                  createProduct(
                    newProduct.name,
                    newProduct.slug,
                    newProduct.description,
                    newProduct.category_id,
                    newProduct.brand_id,
                  )
                    .then(() => {
                      toast.success('Product created');
                      setNewProduct(null);
                    })
                    .catch((err) => toast.error(err.message))
                }
              >
                Create product
              </button>
              <button onClick={() => setNewProduct(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {editingProduct && (
        <div className={styles.overlay}>
          <div>
            <h2>Update product</h2>

            <div className={styles.form}>
              <div>Name:</div>
              <input
                type="text"
                placeholder="Enter product's name"
                value={editingProduct.name}
                onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
              />

              <div>Slug:</div>
              <input
                type="text"
                placeholder="Enter product's slug"
                value={editingProduct.slug}
                onChange={(e) => setEditingProduct({ ...editingProduct, slug: e.target.value })}
              />

              <div>Description:</div>
              <textarea
                value={editingProduct.description}
                onChange={(e) =>
                  setEditingProduct({ ...editingProduct, description: e.target.value })
                }
              ></textarea>

              <div>Category:</div>
              <select
                value={editingProduct.category_id._id}
                onChange={(e) => {
                  setEditingProduct({
                    ...editingProduct,
                    category_id: { ...editingProduct.category_id, _id: e.target.value },
                  });
                }}
              >
                {categories &&
                  categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
              </select>

              <div>Brand:</div>
              <select
                value={editingProduct.brand_id._id}
                onChange={(e) => {
                  setEditingProduct({
                    ...editingProduct,
                    brand_id: { ...editingProduct.brand_id, _id: e.target.value },
                  });
                }}
              >
                {brands &&
                  brands.map((brand) => (
                    <option key={brand._id} value={brand._id}>
                      {brand.name}
                    </option>
                  ))}
              </select>
            </div>

            <div className={styles.buttonsContainer}>
              <button
                onClick={() =>
                  updateProduct(
                    editingProduct._id,
                    editingProduct.name,
                    editingProduct.slug,
                    editingProduct.description,
                    editingProduct.category_id._id,
                    editingProduct.brand_id._id,
                  )
                    .then(() => {
                      toast.success('Product updated');
                      setEditingProduct(null);
                    })
                    .catch((err) => toast.error(err.message))
                }
              >
                Update product
              </button>
              <button onClick={() => setEditingProduct(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {deletingProduct && (
        <div className={styles.overlay}>
          <div>
            <h2>{`Are you sure you want to delete ${deletingProduct.name}?`}</h2>
            <div className={styles.buttonsContainer}>
              <button
                className={styles.redBtn}
                onClick={() =>
                  deleteProduct(deletingProduct._id)
                    .then(() => {
                      toast.success('Product deleted');
                      setDeletingProduct(null);
                    })
                    .catch((err) => toast.error(err.message))
                }
              >
                Delete
              </button>
              <button onClick={() => setDeletingProduct(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductReport;
