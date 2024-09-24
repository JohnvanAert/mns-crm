import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../../api/axiosConfig';
import './ProductDetailPage.scss';
import Navbar from '../Navbar/Navbar';

const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    country: '',
    payout: '',
    capacity: '',
    approval_rate: '',
    image: null, // Добавим поле для изображения
  });
  const [existingImage, setExistingImage] = useState('');  // Для хранения старого изображения
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`/api/products/${id}`);
        setProduct(response.data);
        setFormData({
          name: response.data.name,
          description: response.data.description,
          country: response.data.country,
          payout: response.data.payout,
          capacity: response.data.capacity,
          approval_rate: response.data.approval_rate,
          image: null, // Сбросим поле изображения при загрузке
        });
        setExistingImage(response.data.image_url); // Сохраняем корректное поле image_url
      } catch (error) {
        setError('Failed to load product details.');
      }
    };

    fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFormData({
      ...formData,
      image: file, // Обновляем изображение в formData
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updateData = new FormData();
  
      // Добавляем все данные продукта в FormData
      updateData.append('name', formData.name || product.name);
      updateData.append('description', formData.description || product.description);
      updateData.append('country', formData.country || product.country);
      updateData.append('payout', formData.payout || product.payout);
      updateData.append('capacity', formData.capacity || product.capacity);
      updateData.append('approval_rate', formData.approval_rate || product.approval_rate);
  
      // Если новое изображение загружено, добавляем его в FormData, иначе используем старое изображение
      if (formData.image) {
        updateData.append('image', formData.image);
      } else {
        updateData.append('existingImage', existingImage); // Отправляем старое изображение, если новое не загружено
      }
  
      await axios.put(`/api/products/${id}`, updateData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      // Обновляем данные продукта после успешного обновления
      const response = await axios.get(`/api/products/${id}`);
      setProduct(response.data);
      setFormData({
        name: response.data.name,
        description: response.data.description,
        country: response.data.country,
        payout: response.data.payout,
        capacity: response.data.capacity,
        approval_rate: response.data.approval_rate,
        image: null, // Сбросим поле изображения
      });
      setExistingImage(response.data.image_url); // Обновляем ссылку на новое изображение

      setSuccessMessage('Product updated successfully!');
    } catch (error) {
      setError('Failed to update product.');
    }
  };

  const imageUrl = `${axios.defaults.baseURL}${existingImage}`;

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <Navbar />
    
    <div className="product-detail-page">
      <h1>Edit Product Details</h1>
      {successMessage && <div className="success-message">{successMessage}</div>}
      
      {product && (
        <form className="product-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Product Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
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
              required
            />
          </div>
          <div className="form-group">
            <label>Payout</label>
            <input
              type="number"
              name="payout"
              value={formData.payout}
              onChange={handleChange}
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
              required
            />
          </div>
          <div className="form-group">
            <label>Approval Rate (%)</label>
            <input
              type="number"
              name="approval_rate"
              value={formData.approval_rate}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group image-upload">
            <label>Product Image</label>
            <div className="image-container">
              {existingImage && !formData.image && (
                <div className="existing-image">
                  <img src={imageUrl} alt="Product" className="product-image" />
                  <div className="overlay">
                    <label className="edit-label" htmlFor="image-upload-input">Edit</label>
                    <input
                      type="file"
                      id="image-upload-input"
                      name="image"
                      accept="image/*"
                      className="file-input"
                      onChange={handleImageChange}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
          <button type="submit" className="submit-btn">Update Product</button>
        </form>
      )}
    </div>
    </div>
  );
};

export default ProductDetailPage;
