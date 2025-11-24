import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { listingsAPI, usersAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { FaWhatsapp, FaFlag, FaCheckCircle } from 'react-icons/fa';
import ProductCard from '../components/ProductCard';
import { getImageUrl } from '../utils/imageUtils';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [listing, setListing] = useState(null);
  const [seller, setSeller] = useState(null);
  const [sellerListings, setSellerListings] = useState([]);
  const [mainImage, setMainImage] = useState('');
  const [loading, setLoading] = useState(true);
  const [showReportModal, setShowReportModal] = useState(false);

  useEffect(() => {
    fetchListingDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchListingDetails = async () => {
    try {
      const [listingRes, sellerRes, listingsRes] = await Promise.all([
        listingsAPI.getOne(id),
        listingsAPI.getOne(id).then(async (res) => {
          const userData = await usersAPI.getUser(res.data.user_id);
          return userData;
        }),
        listingsAPI.getSellerListings(id)
      ]);

      setListing(listingRes.data);
      setSeller(sellerRes.data);
      setSellerListings(listingsRes.data);
      
      if (listingRes.data.images) {
        const images = listingRes.data.images.split(',');
        setMainImage(images[0]);
      }
    } catch (error) {
      console.error('Error fetching listing details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleContactSeller = () => {
    if (seller && seller.phone) {
      const message = encodeURIComponent(`Hi! I'm interested in your listing: ${listing.title}`);
      window.open(`https://wa.me/6${seller.phone.replace(/[^0-9]/g, '')}?text=${message}`, '_blank');
    }
  };

  const handleOpenReportModal = () => {
    if (!isAuthenticated) {
      if (window.confirm('Please log in to report this listing. Go to the login page now?')) {
        navigate('/login');
      }
      return;
    }
    setShowReportModal(true);
  };

  const handleReport = async (e) => {
    e.preventDefault();
    const reason = e.target.reason.value;
    if (!isAuthenticated) {
      alert('Please log in to submit a report.');
      return navigate('/login');
    }
    try {
      await listingsAPI.report(id, reason);
      alert('Thank you for your report. We will review it shortly.');
      setShowReportModal(false);
    } catch (error) {
      console.error('Error reporting listing:', error);
      alert('Error submitting report. Please try again.');
    }
  };

  const handleMarkAsSold = async () => {
    if (window.confirm('Mark this listing as sold?')) {
      try {
        await listingsAPI.markAsSold(id);
        navigate('/my-listings');
      } catch (error) {
        console.error('Error marking as sold:', error);
        alert('Error updating listing. Please try again.');
      }
    }
  };

  if (loading) {
    return <div className="page-container"><div className="spinner"></div></div>;
  }

  if (!listing) {
    return (
      <div className="page-container">
        <div className="text-center">
          <h2>Listing not found</h2>
          <Link to="/" className="btn btn-primary mt-20">Back to Homepage</Link>
        </div>
      </div>
    );
  }

  const images = listing.images ? listing.images.split(',') : [];
  const isOwner = isAuthenticated && user?.id === listing.user_id;

  return (
    <div className="page-container">
      {listing.status === 'sold' && (
        <div className="alert alert-error">
          <FaCheckCircle /> This item has been sold
        </div>
      )}

      <div className="product-detail-container">
        <div className="product-images">
          <img
            src={mainImage ? getImageUrl(mainImage) : ''}
            alt={listing.title}
            className="main-image"
            onError={(e) => {
              e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect width="400" height="400" fill="%23ddd"/%3E%3Ctext x="50%25" y="50%25" font-size="24" fill="%23999" text-anchor="middle" dy=".3em"%3ENo Image%3C/text%3E%3C/svg%3E';
            }}
          />
          {images.length > 1 && (
            <div className="thumbnail-images">
              {images.map((img, idx) => (
                <img
                  key={idx}
                  src={getImageUrl(img)}
                  alt={`${listing.title} ${idx + 1}`}
                  className={`thumbnail ${img === mainImage ? 'active' : ''}`}
                  onClick={() => setMainImage(img)}
                />
              ))}
            </div>
          )}
        </div>

        <div className="product-details">
          <div className="product-header">
            <h1>{listing.title}</h1>
            <div className="product-price-large">RM {parseFloat(listing.price).toFixed(2)}</div>
          </div>

          <div className="product-details-section">
            <h3>Details</h3>
            <p><strong>Category:</strong> {listing.category}</p>
            <p><strong>Condition:</strong> {listing.condition}</p>
            {listing.location && <p><strong>Location:</strong> {listing.location}</p>}
            <p><strong>Listed:</strong> {new Date(listing.created_at).toLocaleDateString()}</p>
          </div>

          <div className="product-details-section">
            <h3>Description</h3>
            <p style={{ whiteSpace: 'pre-wrap' }}>{listing.description}</p>
          </div>

          <div className="seller-info">
            <h3>Seller Information</h3>
            <p><strong>Name:</strong> {seller?.name}</p>
            {seller?.phone && <p><strong>Phone:</strong> {seller.phone}</p>}
          </div>

          {isOwner ? (
            <div className="contact-buttons">
              <Link to={`/edit-listing/${listing.id}`} className="btn btn-secondary" style={{ flex: 1 }}>
                Edit Listing
              </Link>
              {listing.status === 'active' && (
                <button onClick={handleMarkAsSold} className="btn btn-success" style={{ flex: 1 }}>
                  Mark as Sold
                </button>
              )}
            </div>
          ) : listing.status === 'active' && (
            <div className="contact-buttons">
              <button onClick={handleContactSeller} className="btn btn-success" style={{ flex: 1 }}>
                <FaWhatsapp style={{ marginRight: '8px' }} />
                Contact via WhatsApp
              </button>
              <button onClick={handleOpenReportModal} className="btn btn-secondary">
                <FaFlag /> Report
              </button>
            </div>
          )}
        </div>
      </div>

      {sellerListings.length > 0 && (
        <div className="seller-listings">
          <h3>More from this seller</h3>
          <div className="grid">
            {sellerListings.map(item => (
              <ProductCard key={item.id} listing={item} />
            ))}
          </div>
        </div>
      )}

      {showReportModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div className="card" style={{ maxWidth: '500px', width: '90%' }}>
            <h2>Report Listing</h2>
            <form onSubmit={handleReport}>
              <div className="form-group">
                <label>Reason for reporting</label>
                <textarea name="reason" required placeholder="Please describe the issue..." />
              </div>
              <div className="flex-between">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowReportModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-danger">
                  Submit Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;

