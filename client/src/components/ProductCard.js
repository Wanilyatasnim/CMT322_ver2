import React from 'react';
import { Link } from 'react-router-dom';
import { getImageUrl } from '../utils/imageUtils';
import { escapeHTML } from '../utils/sanitize';

const ProductCard = ({ listing }) => {
  const imageUrl = listing.images ? 
    getImageUrl(listing.images.split(',')[0]) :
    '';

  return (
    <Link to={`/product/${listing.id}`} className="product-card">
      <img
        src={imageUrl}
        alt={listing.title}
        className="product-image"
        onError={(e) => {
          e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect width="200" height="200" fill="%23ddd"/%3E%3Ctext x="50%25" y="50%25" font-size="18" fill="%23999" text-anchor="middle" dy=".3em"%3ENo Image%3C/text%3E%3C/svg%3E';
        }}
      />
      <div className="product-info">
        <h3 className="product-title">{escapeHTML(listing.title)}</h3>
        <div className="product-price">RM {parseFloat(listing.price).toFixed(2)}</div>
        <div className="product-meta">
          <span className="product-category">{escapeHTML(listing.category)}</span>
          <span style={{ fontSize: '12px' }}>{escapeHTML(listing.condition)}</span>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;

