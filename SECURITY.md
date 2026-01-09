# Security Features

## Implemented Security Measures

### 1. Authentication & Authorization
- ✅ JWT token-based authentication
- ✅ Password hashing with bcrypt (10 rounds)
- ✅ Role-based access control (admin/user)
- ✅ Session inactivity timeout (30 minutes)

### 2. Input Validation
- ✅ Server-side input sanitization
- ✅ Email format validation
- ✅ USM email domain validation
- ✅ Password strength requirements (minimum 6 characters)
- ✅ File upload restrictions (images only, 5MB max)
- ✅ Listing validation (title, description, price)

### 3. XSS Protection
- ✅ DOMPurify for HTML sanitization
- ✅ React's built-in XSS protection
- ✅ Input sanitization middleware
- ✅ HTML entity escaping

### 4. Rate Limiting
- ✅ General API rate limiting (100 requests per 15 minutes)
- ✅ Authentication rate limiting (5 attempts per 15 minutes)
- ✅ Prevents brute force attacks
- ✅ Prevents API abuse

### 5. Security Headers
- ✅ Helmet.js for security headers
- ✅ Content Security Policy (CSP)
- ✅ XSS protection headers
- ✅ Frame options (X-Frame-Options)
- ✅ Strict Transport Security (HSTS) ready

### 6. File Upload Security
- ✅ File type validation (images only)
- ✅ File size limits (5MB)
- ✅ MIME type checking
- ✅ Secure file storage (Cloudinary)
- ✅ File name sanitization

### 7. HTTPS
- ✅ SSL/TLS encryption (provided by hosting platform)
- ✅ Secure cookie options (when using cookies)

### 8. Session Management
- ✅ JWT token expiration (7 days)
- ✅ Inactivity timeout (30 minutes)
- ✅ Automatic logout on inactivity
- ✅ Token validation on each request

## Session Management Details

- **Token Expiration**: 7 days from login
- **Inactivity Timeout**: 30 minutes of no user activity
- **Auto-logout**: Automatic logout when inactivity timeout is reached
- **Activity Tracking**: Tracks mouse, keyboard, scroll, and touch events

## Security Best Practices

1. **Environment Variables**
   - Always use environment variables for secrets
   - Never commit `.env` files to version control
   - Use strong JWT secrets in production (generate with: `openssl rand -base64 32`)

2. **Password Security**
   - Passwords are hashed using bcrypt with 10 salt rounds
   - Minimum password length: 6 characters
   - Passwords are never stored in plain text

3. **Input Validation**
   - All user inputs are sanitized on the server
   - HTML tags are stripped from user input
   - Email format and domain validation
   - Price and numeric validation

4. **Rate Limiting**
   - Prevents brute force attacks on authentication
   - Limits API requests to prevent abuse
   - Configurable limits per endpoint

5. **File Uploads**
   - Only image files are accepted
   - Maximum file size: 5MB
   - Files are stored securely on Cloudinary
   - File names are sanitized

6. **Error Handling**
   - Generic error messages to prevent information leakage
   - Proper HTTP status codes
   - No sensitive information in error responses

## Security Checklist

- [x] Password hashing (bcrypt)
- [x] JWT authentication
- [x] Input validation and sanitization
- [x] XSS protection
- [x] Rate limiting
- [x] Security headers (Helmet)
- [x] File upload restrictions
- [x] Session timeout
- [x] Role-based access control
- [x] HTTPS support

## Known Limitations

1. **CSRF Protection**: Currently not implemented. Consider adding CSRF tokens for additional security.
2. **SQL Injection**: Not applicable (using JSON file storage, not SQL database).
3. **Token Storage**: Tokens are stored in localStorage. For enhanced security, consider using httpOnly cookies.

## Recommendations for Production

1. Set a strong `JWT_SECRET` environment variable
2. Configure `FRONTEND_URL` to your production domain
3. Enable HTTPS/SSL certificate
4. Regularly update dependencies
5. Monitor for security vulnerabilities (`npm audit`)
6. Consider implementing CSRF protection
7. Consider using httpOnly cookies for token storage
8. Implement logging and monitoring
9. Regular security audits
10. Keep dependencies up to date

## Security Contact

For security concerns or vulnerabilities, please contact the development team.


