// Simple API Key authentication for admin routes
// For production, use JWT tokens or OAuth

const adminAuth = (req, res, next) => {
  const apiKey = req.headers['x-api-key'] || req.query.apiKey;
  
  const validApiKey = process.env.ADMIN_API_KEY || 'your-secret-api-key-here';
  
  if (!apiKey) {
    return res.status(401).json({
      success: false,
      message: 'API key required. Include X-API-Key header.'
    });
  }
  
  if (apiKey !== validApiKey) {
    return res.status(403).json({
      success: false,
      message: 'Invalid API key'
    });
  }
  
  next();
};

// Rate limiting helper (simple in-memory implementation)
const rateLimitStore = new Map();

const rateLimit = (maxRequests = 100, windowMs = 15 * 60 * 1000) => {
  return (req, res, next) => {
    const ip = req.ip || req.connection.remoteAddress;
    const now = Date.now();
    
    if (!rateLimitStore.has(ip)) {
      rateLimitStore.set(ip, []);
    }
    
    const requests = rateLimitStore.get(ip);
    
    // Remove old requests outside the window
    const recentRequests = requests.filter(timestamp => now - timestamp < windowMs);
    
    if (recentRequests.length >= maxRequests) {
      return res.status(429).json({
        success: false,
        message: 'Too many requests. Please try again later.'
      });
    }
    
    recentRequests.push(now);
    rateLimitStore.set(ip, recentRequests);
    
    next();
  };
};

module.exports = { adminAuth, rateLimit };