import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { listingsAPI } from '../services/api';
import { getImageUrl } from '../utils/imageUtils';

const CATEGORIES = ['Electronics', 'Furniture', 'Books', 'Appliances', 'Others'];
const CONDITIONS = ['New', 'Like New', 'Good', 'Fair'];

const EditListing = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
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
  const [existingImages, setExistingImages] = useState([]);

  useEffect(() => {
    fetchListing();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchListing = async () => {
    try {
      const response = await listingsAPI.getOne(id);
      const listing = response.data;
      
      setFormData({
        title: listing.title,
        description: listing.description,
        price: listing.price,
        category: listing.category,
        condition: listing.condition,
        location: listing.location || ''
      });

      if (listing.images) {
        const images = listing.images.split(',');
        setExistingImages(images);
        setImagePreviews(images.map(img => getImageUrl(img)));
      }
    } catch (error) {
      console.error('Error fetching listing:', error);
      setError('Error loading listing');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.slice(0, 3 - existingImages.length); // Limit total to 3
    
    setImages(newImages);

    // Combine existing images with new ones for preview
    const existingPreviews = existingImages.map(img => getImageUrl(img));
    const newPreviews = newImages.map(file => URL.createObjectURL(file));
    setImagePreviews([...existingPreviews, ...newPreviews]);
  };

  const removeImage = (index) => {
    if (index < existingImages.length) {
      // Remove from existing images
      const newExisting = existingImages.filter((_, i) => i !== index);
      setExistingImages(newExisting);
      
      // Rebuild previews: existing (after removal) + new images
      const existingPreviews = newExisting.map(img => getImageUrl(img));
      const newPreviews = images.map(file => URL.createObjectURL(file));
      setImagePreviews([...existingPreviews, ...newPreviews]);
    } else {
      // Remove from new images
      const newIndex = index - existingImages.length;
      const newImages = images.filter((_, i) => i !== newIndex);
      setImages(newImages);
      
      // Rebuild previews: existing + new images (after removal)
      const existingPreviews = existingImages.map(img => getImageUrl(img));
      const newPreviews = newImages.map(file => URL.createObjectURL(file));
      setImagePreviews([...existingPreviews, ...newPreviews]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const formDataToSend = new FormData();
      
      Object.keys(formData).forEach(key => {
        formDataToSend.append(key, formData[key]);
      });

      // Send existing images to keep (if any remain)
      if (existingImages.length > 0) {
        formDataToSend.append('existingImages', existingImages.join(','));
      }

      // Send new images (if any)
      images.forEach((image) => {
        formDataToSend.append('images', image);
      });

      await listingsAPI.update(id, formDataToSend);
      navigate('/my-listings');
    } catch (error) {
      console.error('Error updating listing:', error);
      setError(error.response?.data?.error || 'Error updating listing');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="page-container"><div className="spinner"></div></div>;
  }

  return (
    <div className="page-container">
      <div className="form-container">
        <h1>Edit Listing</h1>
        
        {error && <div className="alert alert-error">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label>Price (RM) *</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                min="0"
                step="0.01"
                required
              />
            </div>

            <div className="form-group">
              <label>Category *</label>
              <select
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
              <label>Condition *</label>
              <select
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
              <label>Location/Hostel</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Images (up to 3)</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
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
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              style={{ flex: 1 }}
              disabled={submitting}
            >
              {submitting ? 'Updating...' : 'Update Listing'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditListing;

