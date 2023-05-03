import rateLimit from 'express-rate-limit';

const apiRateLimiter = rateLimit({
  windowMs: 60000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

export default apiRateLimiter;