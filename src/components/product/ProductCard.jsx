import React from 'react';
import './ProductCard.scss';

const ProductCard = ({ product }) => {
  const { name, image, description, country, average_payout, capacity, approval_rate } = product;

  return (
    <div className="product-card">
      <img className="product-card__image" src={image} alt={name} />
      <div className="product-card__info">
        <h2 className="product-card__name">{name}</h2>
        <p className="product-card__description">{description}</p>
        <p className="product-card__details"><strong>Country:</strong> {country}</p>
        <p className="product-card__details"><strong>Avg Payout:</strong> ${average_payout}</p>
        <p className="product-card__details"><strong>Capacity:</strong> {capacity}</p>
        <p className="product-card__details"><strong>Approval Rate:</strong> {approval_rate}%</p>
      </div>
    </div>
  );
};

export default ProductCard;
