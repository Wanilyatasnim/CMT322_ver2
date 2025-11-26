import React, { useState, useEffect } from 'react';
import { listingsAPI } from '../services/api';
import ProductCard from '../components/ProductCard';

const CATEGORIES = [
  { name: 'Electronics', icon: '📱', color: '#4A90E2' },
  { name: 'Furniture', icon: '🪑', color: '#50C878' },
  { name: 'Books', icon: '📚', color: '#FF6B6B' },
  { name: 'Appliances', icon: '🔌', color: '#9B59B6' },
  { name: 'Others', icon: '📦', color: '#F39C12' }
];

const CONDITIONS = ['New', 'Like New', 'Good', 'Fair'];
const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' }
];

const Homepage = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedCondition, setSelectedCondition] = useState('');
  const [location, setLocation] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      setLoading(true);
      const params = { sortBy: 'newest' };
      const response = await listingsAPI.getAll(params);
      setListings(response.data);
    } catch (error) {
      console.error('Error fetching listings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    try {
      setLoading(true);
      const params = {};
      
      if (searchTerm) params.search = searchTerm;
      if (selectedCategory) params.category = selectedCategory;
      if (selectedCondition) params.condition = selectedCondition;
      if (location) params.location = location;
      if (minPrice) params.minPrice = minPrice;
      if (maxPrice) params.maxPrice = maxPrice;
      if (sortBy) params.sortBy = sortBy;
      
      const response = await listingsAPI.getAll(params);
      setListings(response.data);
    } catch (error) {
      console.error('Error searching listings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedCondition('');
    setLocation('');
    setSortBy('newest');
    setMinPrice('');
    setMaxPrice('');
    fetchListings();
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    handleSearchWithCurrentFilters(e.target.value);
  };

  const handleSearchWithCurrentFilters = async (sort = sortBy) => {
    try {
      setLoading(true);
      const params = {};
      
      if (searchTerm) params.search = searchTerm;
      if (selectedCategory) params.category = selectedCategory;
      if (selectedCondition) params.condition = selectedCondition;
      if (location) params.location = location;
      if (minPrice) params.minPrice = minPrice;
      if (maxPrice) params.maxPrice = maxPrice;
      if (sort) params.sortBy = sort;
      
      const response = await listingsAPI.getAll(params);
      setListings(response.data);
    } catch (error) {
      console.error('Error searching listings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = (categoryName) => {
    setSelectedCategory(categoryName);
    // Automatically fetch listings for that category with current filters
    fetchCategoryListings(categoryName);
  };

  const fetchCategoryListings = async (category) => {
    try {
      setLoading(true);
      const params = { category };
      if (selectedCondition) params.condition = selectedCondition;
      if (location) params.location = location;
      if (minPrice) params.minPrice = minPrice;
      if (maxPrice) params.maxPrice = maxPrice;
      if (sortBy) params.sortBy = sortBy;
      
      const response = await listingsAPI.getAll(params);
      setListings(response.data);
    } catch (error) {
      console.error('Error fetching category listings:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Welcome to 2Street.my</h1>
        <p>Buy and sell secondhand items within the USM community</p>
      </div>

      {/* Category Cards Section */}
      <div className="categories-section">
        <h2 style={{ marginBottom: '20px', fontSize: '24px', fontWeight: '600' }}>Browse by Category</h2>
        <div className="category-cards">
          {CATEGORIES.map(category => (
            <div
              key={category.name}
              className="category-card"
              style={{ 
                border: selectedCategory === category.name ? `3px solid ${category.color}` : '2px solid #e0e0e0'
              }}
              onClick={() => handleCategoryClick(category.name)}
            >
              <div className="category-icon" style={{ color: category.color, fontSize: '48px' }}>
                {category.icon}
              </div>
              <div className="category-name">{category.name}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="search-section">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search for items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button className="btn btn-primary" onClick={handleSearch}>
            Search
          </button>
          <button className="btn btn-secondary" onClick={handleClearFilters}>
            Clear
          </button>
        </div>

        <div className="filters">
          <div className="filter-group">
            <label>Sort By</label>
            <select
              value={sortBy}
              onChange={handleSortChange}
              style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px' }}
            >
              {SORT_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Condition</label>
            <select
              value={selectedCondition}
              onChange={(e) => {
                setSelectedCondition(e.target.value);
                setTimeout(() => handleSearch(), 100);
              }}
              style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px' }}
            >
              <option value="">All Conditions</option>
              {CONDITIONS.map(condition => (
                <option key={condition} value={condition}>
                  {condition}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Location</label>
            <input
              type="text"
              placeholder="e.g., Aman Damai Hostel"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px' }}
            />
          </div>

          <div className="filter-group">
            <label>Min Price (RM)</label>
            <input
              type="number"
              placeholder="0"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              min="0"
              step="0.01"
            />
          </div>

          <div className="filter-group">
            <label>Max Price (RM)</label>
            <input
              type="number"
              placeholder="10000"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              min="0"
              step="0.01"
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="spinner"></div>
      ) : listings.length === 0 ? (
        <div className="text-center">
          <p>No listings found. Be the first to list an item!</p>
        </div>
      ) : (
        <>
          <p style={{ marginBottom: '20px' }}>
            Found {listings.length} {listings.length === 1 ? 'listing' : 'listings'}
          </p>
          <div className="grid">
            {listings.map(listing => (
              <ProductCard key={listing.id} listing={listing} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Homepage;

