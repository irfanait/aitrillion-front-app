// Decode token
import { jwtDecode } from 'jwt-decode';

// Set token in cookie
export const setUserLogin = (token) => {
  if (!token) return;
  if (typeof document !== 'undefined') {
    document.cookie = `auth_token=${token}; path=/; secure; samesite=strict`;
    // document.cookie = `auth_token=${token}; path=/; samesite=strict; ${location.protocol === 'https:' ? 'secure' : ''}`;
  }
};

// Get token from cookie
export const getToken = () => {
  if (typeof document !== 'undefined') {
    const match = document.cookie.match(new RegExp('(^| )auth_token=([^;]+)'));
    return match ? match[2] : null;
  }
  return null;
};

// logout user by clearing cookies and localStorage
export const handleLogout = () => {
  if (typeof window !== 'undefined') {
    try {
      document.cookie =
        'auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; secure; samesite=strict';

      localStorage.removeItem('encoded_data');
      localStorage.removeItem('auth_token');
      localStorage.removeItem('plan_id');
      localStorage.removeItem('plan_info');
      sessionStorage.clear();

      // 🔁 Redirect to login (optional)
      // window.location.href = '/auth/login';
      window.location.href = `${process.env.NEXT_PUBLIC_APP_URL}/logout`;
    } catch (err) {
      console.error('Logout error:', err);
    }
  }
};

// ============================
// JWT TOKEN FUNCTIONS
// ============================
export const setJWTToken = (jwt) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('encoded_data', jwt);
  }
};

export const getJWTToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('encoded_data');
  }
  return null;
};

// Remove jwt_token from cookie
export const removeJWTToken = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('encoded_data');
  }
};

// ============================
// DECODE JWT TOKEN
// ============================

export const decodeJWTToken = () => {
  try {
    const token = getJWTToken();
    if (!token) return null;

    const decoded = jwtDecode(token);

    return decoded;
  } catch (error) {
    console.error('Invalid or expired JWT token', error);
    return null;
  }
};

export const isJWTTokenExpired = (token) => {
  if (!token) return true;
  try {
    const decoded = jwtDecode(token);
    if (!decoded.exp) return true;

    const currentTime = Date.now() / 1000; // current time in seconds
    return decoded.exp < currentTime; // true if expired
  } catch (error) {
    console.error('Failed to decode token:', error);
    return true;
  }
};
