import { useCategoryStore } from '../../stores/categoryStore';
import { useAdminStore } from '../../stores/adminStore';
import { useState, useEffect } from 'react';
import styles from './CategoryReport.module.css';

function CategoryReport() {
  const categories = useCategoryStore((state) => state.data);
  const loadCategories = useCategoryStore((state) => state.loadCategories);

  const [newCategory, setNewCategory] = useState(null);
  const createCategory = useAdminStore((state) => state.createCategory);

  const [editingCategory, setEditingCategory] = useState(null);
  const updateCategory = useAdminStore((state) => state.updateCategory);

  const [deletingCategory, setDeletingCategory] = useState(null);
  const deleteCategory = useAdminStore((state) => state.deleteCategory);

  async function fetchCategories() {
    try {
      await loadCategories();
    } catch (error) {
      console.error(error);
      alert(error);
    }
  }

  async function handleCreateCategory() {
    try {
      await createCategory(newCategory.name, newCategory.slug, newCategory.parent_category_id);
      await loadCategories();
      setNewCategory(null);
    } catch (error) {
      console.error(error);
      alert(error);
    }
  }

  async function handleUpdateCategory() {
    try {
      await updateCategory(
        editingCategory._id,
        editingCategory.name,
        editingCategory.slug,
        editingCategory.parent_category_id,
      );
      await loadCategories();
      setEditingCategory(null);
    } catch (error) {
      console.error(error);
      alert(error);
    }
  }

  async function handleDeleteCategory() {
    try {
      await deleteCategory(deletingCategory._id);
      await loadCategories();
      setDeletingCategory(null);
    } catch (error) {
      console.error(error);
      alert(error);
    }
  }

  useEffect(() => {
    (async () => await fetchCategories())();
  }, []);

  return (
    <div className={styles.categoryReport}>
      <header>
        <div>
          <h1>Categories management</h1>
          <p>Managent store&apos;s categories</p>
        </div>

        <button
          className={styles.blackBtn}
          onClick={() => setNewCategory({ name: '', slug: '', parent_category_id: '' })}
        >
          + Create new category
        </button>
      </header>

      <main>
        <div>
          <input type="text" />
          <div className={styles.buttonContainer}>
            <button>
              <i className="fa-solid fa-magnifying-glass"></i>Find
            </button>
            <button onClick={fetchCategories}>
              <i className="fa-solid fa-arrows-rotate"></i>Refresh
            </button>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Category name</th>
              <th>Category slug</th>
              <th>Parent category</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {categories.map((category) => (
              <tr key={category._id}>
                <td>{category.name}</td>
                <td>{category.slug}</td>
                <td>{category.parent_category_id?.name || 'None'}</td>
                <td>
                  <div className={styles.buttonContainer}>
                    <button onClick={() => setEditingCategory({ ...category })}>Edit</button>
                    <button className={styles.redBtn} onClick={() => setDeletingCategory(category)}>
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>

      {newCategory && (
        <div className={styles.overlay}>
          <div>
            <h2>Create new category</h2>
            <div>
              Name:
              <input
                type="text"
                placeholder="Enter category's name"
                value={newCategory.name}
                onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
              />
            </div>
            <div>
              Slug:
              <input
                type="text"
                placeholder="Enter category's slug"
                value={newCategory.slug}
                onChange={(e) => setNewCategory({ ...newCategory, slug: e.target.value })}
              />
            </div>
            <div>
              Parent Category:
              <select
                value={newCategory.parent_category_id || null}
                onChange={(e) =>
                  setNewCategory({ ...newCategory, parent_category_id: e.target.value })
                }
              >
                <option value={null}>Select perent category</option>
                {categories.map((category) => (
                  <option value={category._id} key={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.buttonContainer}>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  handleCreateCategory();
                }}
              >
                Create
              </button>
              <button onClick={() => setNewCategory(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {editingCategory && (
        <div className={styles.overlay}>
          <div>
            <h2>Update category</h2>
            <div>
              Name:
              <input
                type="text"
                placeholder="Enter category's name"
                value={editingCategory.name}
                onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
              />
            </div>
            <div>
              Slug:
              <input
                type="text"
                placeholder="Enter category's slug"
                value={editingCategory.slug}
                onChange={(e) => setEditingCategory({ ...editingCategory, slug: e.target.value })}
              />
            </div>
            <div>
              Parent Category:
              <select
                value={editingCategory.parent_category_id || null}
                onChange={(e) =>
                  setEditingCategory({ ...editingCategory, parent_category_id: e.target.value })
                }
              >
                <option value={null}>Select perent category</option>
                {categories.map((category) =>
                  category._id != editingCategory._id ? (
                    <option value={category._id} key={category._id}>
                      {category.name}
                    </option>
                  ) : null,
                )}
              </select>
            </div>
            <div className={styles.buttonContainer}>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  handleUpdateCategory();
                }}
              >
                Update
              </button>
              <button onClick={() => setEditingCategory(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {deletingCategory && (
        <div className={styles.overlay}>
          <div>
            <h2>{`Are you sure you want to delete category ${deletingCategory.name}?`}</h2>
            <div className={styles.buttonContainer}>
              <button
                className={styles.redBtn}
                onClick={(e) => {
                  e.preventDefault();
                  handleDeleteCategory();
                }}
              >
                Delete
              </button>
              <button onClick={() => setDeletingCategory(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CategoryReport;
