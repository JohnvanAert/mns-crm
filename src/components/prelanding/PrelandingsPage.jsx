import React, { useEffect, useState } from 'react';
import axios from '../../api/axiosConfig';
import './PrelandingsPage.scss';
import Navbar from '../Navbar/Navbar';
import Modal from 'react-modal'; // Import modal library

const PrelandingsPage = () => {
  const [prelandings, setPrelandings] = useState([]);
  const [products, setProducts] = useState([]); // State to store products
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    alias: '',
    domain: '',
    product: '',
    type: ''
  });

  // Fetch prelandings and products
  useEffect(() => {
    const fetchPrelandings = async () => {
      try {
        const response = await axios.get('/api/prelandings');
        setPrelandings(response.data);
      } catch (err) {
        setError('Failed to load prelandings.');
      } finally {
        setLoading(false);
      }
    };

    const fetchProducts = async () => {
      try {
        const response = await axios.get('/api/products');
        setProducts(response.data); // Set products in state
      } catch (err) {
        console.error('Failed to load products:', err);
      }
    };

    fetchPrelandings();
    fetchProducts(); // Fetch products
  }, []);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/prelandings', formData);
      setPrelandings([...prelandings, response.data]); // Update the list with the new prelanding
      setFormData({
        name: '',
        alias: '',
        domain: '',
        product: '',
        type: '',
      });
      closeModal(); // Close the modal after successful submission
    } catch (error) {
      console.error('Failed to add prelanding:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="prelandings-page">
      <h1>Prelandings List</h1>

      {/* Button to open modal */}
      <button className="add-prelanding-btn" onClick={openModal}>
        Add Prelanding
      </button>

      {/* Modal for adding prelanding */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Add Prelanding"
        className="modal"
        overlayClassName="modal-overlay"
      >
        <h2>Add a New Prelanding</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Prelanding Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter prelanding name"
              required
            />
          </div>

          <div className="form-group">
            <label>Alias</label>
            <input
              type="text"
              name="alias"
              value={formData.alias}
              onChange={handleChange}
              placeholder="Enter alias"
              required
            />
          </div>

          <div className="form-group">
            <label>Domain</label>
            <input
              type="text"
              name="domain"
              value={formData.domain}
              onChange={handleChange}
              placeholder="Enter domain"
              required
            />
          </div>

          <div className="form-group">
            <label>Product</label>
            <select
              name="product"
              value={formData.product}
              onChange={handleChange}
              required
            >
              <option value="">Select product</option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Type</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
            >
              <option value="">Select Prelanding Type</option>
              <option value="blog">Blog</option>
              <option value="news">News</option>
              <option value="medical">Medical</option>
            </select>
          </div>

          <button type="submit" className="submit-btn">Submit</button>
          <button type="button" className="close-modal-btn" onClick={closeModal}>
            Close
          </button>
        </form>
      </Modal>

      <table className="prelandings-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Alias</th>
            <th>Domain</th>
            <th>Created By</th>
            <th>Created At</th>
          </tr>
        </thead>
        <tbody>
          {prelandings.map((prelanding) => (
            <tr key={prelanding.id}>
              <td>{prelanding.id}</td>
              <td>{prelanding.name}</td>
              <td>{prelanding.alias}</td>
              <td>{prelanding.domain}</td>
              <td>{prelanding.created_by}</td>
              <td>{new Date(prelanding.created_at).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PrelandingsPage;
