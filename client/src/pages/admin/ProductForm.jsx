import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { ArrowLeft, Save } from 'lucide-react';

const ProductForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { user } = useAuth();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    originalPrice: '',
    description: '',
    images: '',
    brand: '',
    category: '',
    stock: '',
    featured: false,
  });

  useEffect(() => {
    // Fetch categories
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get('/api/categories');
        setCategories(data);
      } catch (err) {
        console.error('Fetch categories error:', err);
      }
    };
    fetchCategories();

    // If editing, fetch product data
    if (isEdit) {
      const fetchProduct = async () => {
        try {
          const { data } = await axios.get(`/api/products/${id}`);
          setFormData({
            name: data.name,
            price: data.price,
            originalPrice: data.originalPrice,
            description: data.description,
            images: data.images.join(', '),
            brand: data.brand,
            category: data.category?._id || data.category,
            stock: data.stock,
            featured: data.featured,
          });
        } catch (err) {
          setError('Product not found');
        }
      };
      fetchProduct();
    }
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
      };

      const productData = {
        ...formData,
        price: Number(formData.price),
        originalPrice: Number(formData.originalPrice || formData.price),
        stock: Number(formData.stock),
        images: formData.images.split(',').map((img) => img.trim()).filter(Boolean),
      };

      if (isEdit) {
        await axios.put(`/api/admin/products/${id}`, productData, config);
      } else {
        await axios.post('/api/admin/products', productData, config);
      }

      navigate('/admin/products');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex items-center mb-6">
        <button onClick={() => navigate('/admin/products')} className="text-gray-500 hover:text-gray-700 mr-3">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-2xl font-bold text-gray-900">{isEdit ? 'Edit Product' : 'Add New Product'}</h1>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="bg-white shadow-sm rounded-xl border border-gray-200 p-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Product Name</label>
            <input type="text" name="name" required value={formData.name} onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Price ($)</label>
            <input type="number" name="price" required step="0.01" value={formData.price} onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Original Price ($)</label>
            <input type="number" name="originalPrice" step="0.01" value={formData.originalPrice} onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] sm:text-sm"
              placeholder="For showing discount"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Brand</label>
            <input type="text" name="brand" required value={formData.brand} onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <select name="category" required value={formData.category} onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] sm:text-sm"
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Stock</label>
            <input type="number" name="stock" required value={formData.stock} onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] sm:text-sm"
            />
          </div>

          <div className="flex items-center">
            <input type="checkbox" name="featured" checked={formData.featured} onChange={handleChange}
              className="h-4 w-4 text-[var(--color-primary)] focus:ring-[var(--color-primary)] border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-900">Featured Product</label>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Image URLs (comma separated)</label>
            <input type="text" name="images" required value={formData.images} onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] sm:text-sm"
              placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea name="description" required rows="4" value={formData.description} onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] sm:text-sm"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button type="button" onClick={() => navigate('/admin/products')}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button type="submit" disabled={loading}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] disabled:opacity-70"
          >
            <Save className="h-4 w-4 mr-2" />
            {loading ? 'Saving...' : isEdit ? 'Update Product' : 'Create Product'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
