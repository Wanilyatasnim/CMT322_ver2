/**
 * Get the full image URL
 * Handles both Cloudinary URLs (full URLs) and local filenames
 * @param {string} imagePath - Image path from the data store (could be URL or filename)
 * @returns {string} Full image URL
 */
export const getImageUrl = (imagePath) => {
  if (!imagePath) return '';
  
  // If it's already a full URL (starts with http:// or https://), return as is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  // Otherwise, it's a local filename, prepend the uploads path
  return `${process.env.REACT_APP_API_URL || ''}/uploads/${imagePath}`;
};







