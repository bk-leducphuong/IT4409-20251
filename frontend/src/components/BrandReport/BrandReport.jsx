import { useBrandStore } from '../../stores/brandStore';
import { useAdminStore } from '../../stores/adminStore';
import { useState, useEffect } from 'react';
import styles from './BrandReport.module.css';

function BrandReport() {
  const brands = useBrandStore((state) => state.data);
  const loadBrands = useBrandStore((state) => state.loadBrands);

  const [newBrand, setNewBrand] = useState(null);
  const createBrand = useAdminStore((state) => state.createBrand);

  const [editingBrand, setEditingBrand] = useState(null);
  const updateBrand = useAdminStore((state) => state.updateBrand);

  const [deletingBrand, setDeletingBrand] = useState(null);
  const deleteBrand = useAdminStore((state) => state.deleteBrand);

  async function fetchBrands() {
    try {
      await loadBrands();
    } catch (error) {
      console.error(error);
      alert(error);
    }
  }

  async function handleCreateBrand() {
    try {
      await createBrand(newBrand.name, newBrand.logo_url);
      await loadBrands();
      setNewBrand(null);
    } catch (error) {
      console.error(error);
      alert(error);
    }
  }

  async function handleUpdateBrand() {
    try {
      await updateBrand(editingBrand._id, editingBrand.name, editingBrand.logo_url);
      await loadBrands();
      setEditingBrand(null);
    } catch (error) {
      console.error(error);
      alert(error);
    }
  }

  async function handleDeleteBrand() {
    try {
      await deleteBrand(deletingBrand._id);
      await loadBrands();
      setDeletingBrand(null);
    } catch (error) {
      console.error(error);
      alert(error);
    }
  }

  useEffect(() => {
    (async () => await fetchBrands())();
  }, []);

  return (
    <div className={styles.brandReport}>
      <header>
        <div>
          <h1>Brands management</h1>
          <p>Managent store&apos;s brands</p>
        </div>

        <button onClick={() => setNewBrand({ name: '', logo_url: '' })} className={styles.blackBtn}>
          + Create new brand
        </button>
      </header>

      <main>
        <div>
          <input type="text" placeholder="Find brand" />
          <div className={styles.buttonContainer}>
            <button>
              <i className="fa-solid fa-magnifying-glass"></i>Find
            </button>
            <button onClick={fetchBrands}>
              <i className="fa-solid fa-arrows-rotate"></i>Refresh
            </button>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Brand</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {brands.map((brand) => (
              <tr key={brand._id}>
                <td>
                  <div>
                    <img src={brand.logo_url} alt="Brand" />
                    <span>{brand.name}</span>
                  </div>
                </td>
                <td>
                  <div className={styles.buttonContainer}>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        setEditingBrand({ ...brand });
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className={styles.redBtn}
                      onClick={(e) => {
                        e.preventDefault();
                        setDeletingBrand(brand);
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>

      {newBrand && (
        <div className={styles.overlay}>
          <div>
            <h2>Create new brand</h2>
            <div>
              Name:
              <input
                type="text"
                placeholder="Enter brand's name"
                value={newBrand.name}
                onChange={(e) => setNewBrand({ ...newBrand, name: e.target.value })}
              />
            </div>
            <div>
              Logo URL:
              <input
                type="text"
                placeholder="Enter brand logo's url"
                value={newBrand.logo_url}
                onChange={(e) => setNewBrand({ ...newBrand, logo_url: e.target.value })}
              />
            </div>
            <div className={styles.buttonContainer}>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  handleCreateBrand();
                }}
              >
                Create
              </button>
              <button onClick={() => setNewBrand(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {editingBrand && (
        <div className={styles.overlay}>
          <div>
            <h2>Update brand</h2>
            <div>
              Name:
              <input
                type="text"
                placeholder="Enter brand's name"
                value={editingBrand.name}
                onChange={(e) => setEditingBrand({ ...editingBrand, name: e.target.value })}
              />
            </div>
            <div>
              Logo URL:
              <input
                type="text"
                placeholder="Enter brand logo's url"
                value={editingBrand.logo_url}
                onChange={(e) => setEditingBrand({ ...editingBrand, logo_url: e.target.value })}
              />
            </div>
            <div className={styles.buttonContainer}>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  handleUpdateBrand();
                }}
              >
                Update
              </button>
              <button onClick={() => setEditingBrand(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {deletingBrand && (
        <div className={styles.overlay}>
          <div>
            <h2>{`Are you sure you want to delete brand ${deletingBrand.name}?`}</h2>
            <div className={styles.buttonContainer}>
              <button
                className={styles.redBtn}
                onClick={(e) => {
                  e.preventDefault();
                  handleDeleteBrand();
                }}
              >
                Delete
              </button>
              <button onClick={() => setDeletingBrand(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BrandReport;
