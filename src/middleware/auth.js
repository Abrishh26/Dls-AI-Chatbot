/**
 * src/middleware/auth.js
 * Verifies the JWT issued by the main DigitalLogicsStudio-Backend.
 * Accepts the token either via the `Authorization: Bearer <token>` header
 * or the `token` HTTP-only cookie — same contract as the main backend, so
 * no second login is required.
 */

const jwt = require('jsonwebtoken');

function extractToken(req) {
  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.slice(7).trim();
    if (token) return token;
  }

  if (req.cookies && req.cookies.token) {
    return req.cookies.token;
  }

  return null;
}

const isDev = (process.env.NODE_ENV || 'development') !== 'production';

if (isDev) {
  console.warn('[auth.middleware] NODE_ENV is not "production" — unauthenticated localhost requests will bypass login. Do not deploy with NODE_ENV unset or set to "development".');
}

function requireAuth(req, res, next) {
  const token = extractToken(req);

  const isLocalhostRequest = (() => {
    try {
      const host = (req.hostname || '').toLowerCase();
      const origin = (req.headers && req.headers.origin) || '';
      const ip = (req.ip || '').toString();
      if (host === 'localhost') return true;
      if (origin && origin.includes('localhost')) return true;
      if (ip === '::1' || ip === '127.0.0.1') return true;
    } catch (e) {
      // ignore and fall through
    }
    return false;
  })();

  if (!token) {
    // Allow requests from localhost during development to ease local testing
    if (process.env.NODE_ENV === 'development' && isLocalhostRequest) {
      req.user = null; // proceed unauthenticated for local dev
      return next();
    }

    return res.status(401).json({
      error: 'Authentication required. Provide a Bearer token or valid session cookie.',
    });
  }

  if (!process.env.JWT_SECRET) {
    console.error('[auth.middleware] JWT_SECRET is not configured.');
    return res.status(500).json({
      error: 'Server misconfiguration: missing JWT secret.',
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      const message = err.name === 'TokenExpiredError'
        ? 'Session expired. Please log in again.'
        : 'Invalid authentication token.';
      return res.status(401).json({ error: message });
    }

    // Same shape the main backend signs: at minimum `id` / `name`.
    req.user = decoded;
    next();
  });
}

module.exports = {
  requireAuth,
  extractToken,
};
