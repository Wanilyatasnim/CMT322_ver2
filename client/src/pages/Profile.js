import React, { useState, useEffect } from 'react';
import { usersAPI } from '../services/api';

const Profile = () => {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    matricNumber: ''
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await usersAPI.getProfile();
      setFormData({
        name: response.data.name,
        email: response.data.email,
        phone: response.data.phone || '',
        matricNumber: response.data.matric_number || ''
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
      setError('Error loading profile');
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);

    try {
      await usersAPI.updateProfile({
        name: formData.name,
        phone: formData.phone,
        matricNumber: formData.matricNumber
      });
      setSuccess('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Error updating profile');
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
        <h1>My Profile</h1>
        
        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={formData.email}
              disabled
              style={{ background: '#f5f5f5', cursor: 'not-allowed' }}
            />
            <small style={{ color: '#666', fontSize: '12px' }}>
              Email cannot be changed
            </small>
          </div>
          
          <div className="form-group">
            <label>Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="e.g., 0123456789"
            />
          </div>
          
          <div className="form-group">
            <label>Matric Number</label>
            <input
              type="text"
              name="matricNumber"
              value={formData.matricNumber}
              onChange={handleChange}
              placeholder="e.g., 123456"
            />
          </div>
          
          <button
            type="submit"
            className="btn btn-primary"
            disabled={submitting}
            style={{ width: '100%' }}
          >
            {submitting ? 'Updating...' : 'Update Profile'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;

