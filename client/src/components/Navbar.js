
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaBars, FaTimes, FaShoppingBag, FaUser, FaCog } from 'react-icons/fa';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <Link to="/" className="navbar-brand" onClick={() => setMobileMenuOpen(false)}>
          <FaShoppingBag style={{ display: 'inline', marginRight: '8px' }} />
          2Street.my
        </Link>
        
        <button
          className="mobile-menu-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>

        <div className={`navbar-links ${mobileMenuOpen ? 'mobile-menu-open' : ''}`}>
          <Link to="/safety-tips" onClick={() => setMobileMenuOpen(false)}>
            Safety Tips
          </Link>
          
          {isAuthenticated ? (
            <>
              {user?.role === 'admin' ? (
                // Only show admin and logout links for admin
                <>
                  <Link to="/admin" onClick={() => setMobileMenuOpen(false)}>
                    Admin
                  </Link>
                  <button onClick={handleLogout}>Logout</button>
                </>
              ) : (
                // For normal users
                <>
                  <Link to="/create-listing" onClick={() => setMobileMenuOpen(false)}>
                    Sell Item
                  </Link>
                  <Link to="/my-listings" onClick={() => setMobileMenuOpen(false)}>
                    My Listings
                  </Link>
                  <Link to="/profile" onClick={() => setMobileMenuOpen(false)}>
                    <FaUser style={{ display: 'inline', marginRight: '5px' }} />
                    {user?.name}
                  </Link>
                  <button onClick={handleLogout}>Logout</button>
                </>
              )}
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setMobileMenuOpen(false)}>Login</Link>
              <Link to="/register" onClick={() => setMobileMenuOpen(false)}>Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

