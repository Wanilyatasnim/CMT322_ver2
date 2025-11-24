import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const inputIds = {
  name: 'register-name',
  email: 'register-email',
  password: 'register-password',
  confirmPassword: 'register-confirm-password',
  phone: 'register-phone',
  matricNumber: 'register-matric'
};

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    matricNumber: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!formData.email.endsWith('@student.usm.my')) {
      setError('Please use your USM student email (@student.usm.my)');
      return;
    }

    setLoading(true);

    const { confirmPassword, ...userData } = formData;
    const result = await register(userData);
    
    if (result.success) {
      navigate('/');
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  return (
    <div className="page-container">
      <div className="form-container">
        <h1>Register</h1>
        
        {error && <div className="alert alert-error">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor={inputIds.name}>Full Name</label>
            <input
              id={inputIds.name}
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor={inputIds.email}>USM Student Email</label>
            <input
              id={inputIds.email}
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="yourname@student.usm.my"
              required
            />
          </div>
          
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor={inputIds.password}>Password</label>
              <input
                id={inputIds.password}
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor={inputIds.confirmPassword}>Confirm Password</label>
              <input
                id={inputIds.confirmPassword}
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor={inputIds.phone}>Phone Number (Optional)</label>
              <input
                id={inputIds.phone}
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor={inputIds.matricNumber}>Matric Number (Optional)</label>
              <input
                id={inputIds.matricNumber}
                type="text"
                name="matricNumber"
                value={formData.matricNumber}
                onChange={handleChange}
              />
            </div>
          </div>
          
          <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%' }}>
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
        
        <p className="text-center mt-20">
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;

