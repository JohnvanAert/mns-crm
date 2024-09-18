import React, { useEffect, useState } from 'react';
import axios from '../../api/axiosConfig';
import './ProductPage.scss'; // Import the SCSS file
import ProductCard from './ProductCard';
import Navbar from '../Navbar/Navbar';


const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    country: '',
    avgPayout: '',
    capacity: '',
    approvalRate: '',
    image: null,
  });

  // Fetching products from the server
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('/api/products');
        setProducts(response.data);
      } catch (err) {
        setError('Failed to load products.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Handling form input changes
  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      setFormData({
        ...formData,
        [name]: files[0],
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  // Handling form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      for (const key in formData) {
        formDataToSend.append(key, formData[key]);
      }

      await axios.post('/api/products', formDataToSend);
      setFormData({
        name: '',
        description: '',
        country: '',
        avgPayout: '',
        capacity: '',
        approvalRate: '',
        image: null,
      });

      // Re-fetch products after successful addition
      const response = await axios.get('/api/products');
      setProducts(response.data);
    } catch (error) {
      setError('Failed to add product.');
    }
  };

  if (loading) {
    return <div className="products-page__loading">Loading...</div>;
  }

  if (error) {
    return <div className="products-page__error">{error}</div>;
  }

  return (
    <div>
      <Navbar />
    
    <div className="products-page">
      
      <h1 className="products-page__title">Products</h1>

      {/* Form for adding new products */}
      <div className="products-page__form-section">
        <h2>Add a New Product</h2>
        <form className="product-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Product Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter product name"
              required
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter product description"
              required
            />
          </div>

          <div className="form-group">
            <label>Country of Production</label>
            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleChange}
              placeholder="Enter country of production"
              required
            />
          </div>

          <div className="form-group">
            <label>Average Payout</label>
            <input
              type="number"
              name="avgPayout"
              value={formData.avgPayout}
              onChange={handleChange}
              placeholder="Enter average payout"
              required
            />
          </div>

          <div className="form-group">
            <label>Capacity</label>
            <input
              type="number"
              name="capacity"
              value={formData.capacity}
              onChange={handleChange}
              placeholder="Enter capacity"
              required
            />
          </div>

          <div className="form-group">
            <label>Average Approval Rate (%)</label>
            <input
              type="number"
              name="approvalRate"
              value={formData.approvalRate}
              onChange={handleChange}
              placeholder="Enter approval rate"
              required
            />
          </div>

          <div className="form-group">
            <label>Product Image</label>
            <input
              type="file"
              name="image"
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="submit-btn">Add Product</button>
        </form>
      </div>

      {/* Product cards */}
      <div className="products-page__grid">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
    </div>
  );
};

export default ProductsPage;
