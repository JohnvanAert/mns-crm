import React from 'react';
import './ProductCard.scss';
import { Link } from 'react-router-dom';
import axios from '../../api/axiosConfig';  // Импортируем axiosConfig для доступа к baseURL

const ProductCard = ({ product, onDelete }) => {
  const {id, name, description, country, payout, capacity, approval_rate, image_url } = product;

  // Формируем корректный URL для изображения
  const imageUrl = `${axios.defaults.baseURL}${image_url}`; 

  return (
    <div className="product-card">
      <img className="product-card__image" src={imageUrl} alt={name} /> {/* Используем корректный путь */}
      <div className="product-card__info">
        <h2 className="product-card__name"><Link to={`/product/${id}`}>{name}</Link></h2>
        <p className="product-card__description">{description}</p>
        <p className="product-card__details"><strong>Country:</strong> {country}</p>
        <p className="product-card__details"><strong>Avg Payout:</strong>{payout}</p>
        <p className="product-card__details"><strong>Capacity:</strong> {capacity}</p>
        <p className="product-card__details"><strong>Approval Rate:</strong> {approval_rate}%</p>
      </div>
      <button onClick={() => onDelete(id)} className="delete-btn">Delete Product</button>
    </div>
  );
};

export default ProductCard;
