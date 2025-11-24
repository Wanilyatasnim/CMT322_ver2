import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { listingsAPI } from '../services/api';

const CATEGORIES = ['Electronics', 'Furniture', 'Books', 'Appliances', 'Others'];
const CONDITIONS = ['New', 'Like New', 'Good', 'Fair'];

const inputIds = {
  title: 'create-title',
  description: 'create-description',
  price: 'create-price',
  category: 'create-category',
  condition: 'create-condition',
  location: 'create-location',
  images: 'create-images'
};

const CreateListing = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: 'Electronics',
    condition: 'Good',
    location: ''
  });
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files).slice(0, 3);
    setImages(files);

    const previews = files.map(file => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  const removeImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    setImages(newImages);
    setImagePreviews(newPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!images || images.length === 0) {
      setError('Please upload at least one image');
      setLoading(false);
      return;
    }

    try {
      const formDataToSend = new FormData();
      
      Object.keys(formData).forEach(key => {
        formDataToSend.append(key, formData[key]);
      });

      images.forEach((image) => {
        formDataToSend.append('images', image);
      });

      await listingsAPI.create(formDataToSend);
      navigate('/my-listings');
    } catch (error) {
      console.error('Error creating listing:', error);
      setError(error.response?.data?.error || 'Error creating listing');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="form-container">
        <h1>Create New Listing</h1>
        
        {error && <div className="alert alert-error">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor={inputIds.title}>Title *</label>
            <input
              id={inputIds.title}
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., iPhone 13 Pro Max 256GB"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor={inputIds.description}>Description *</label>
            <textarea
              id={inputIds.description}
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your item in detail..."
              required
            />
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label htmlFor={inputIds.price}>Price (RM) *</label>
              <input
                id={inputIds.price}
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="0.00"
                min="0"
                step="0.01"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor={inputIds.category}>Category *</label>
              <select
                id={inputIds.category}
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label htmlFor={inputIds.condition}>Condition *</label>
              <select
                id={inputIds.condition}
                name="condition"
                value={formData.condition}
                onChange={handleChange}
                required
              >
                {CONDITIONS.map(cond => (
                  <option key={cond} value={cond}>{cond}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor={inputIds.location}>Location/Hostel</label>
              <input
                id={inputIds.location}
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g., Aman Damai Hostel"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor={inputIds.images}>Images (up to 3) *</label>
            <input
              id={inputIds.images}
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              required
            />
            {imagePreviews.length > 0 && (
              <div className="image-upload-preview">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="image-preview">
                    <img src={preview} alt={`Preview ${index + 1}`} />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-10">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate('/my-listings')}
              style={{ flex: 1 }}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              style={{ flex: 1 }}
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Listing'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateListing;

