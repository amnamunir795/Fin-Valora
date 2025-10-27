// Client-side authentication utilities

const TOKEN_KEY = 'finvalora_token';

// Store JWT token in localStorage
export const setToken = (token) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(TOKEN_KEY, token);
  }
};

// Get JWT token from localStorage
export const getToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(TOKEN_KEY);
  }
  return null;
};

// Remove JWT token from localStorage
export const removeToken = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(TOKEN_KEY);
  }
};

// Check if user is authenticated
export const isAuthenticated = () => {
  const token = getToken();
  if (!token) return false;

  try {
    // Basic check - decode token to see if it's expired
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Math.floor(Date.now() / 1000);
    
    return payload.exp > currentTime;
  } catch (error) {
    return false;
  }
};

// Get user data from token
export const getUserFromToken = () => {
  const token = getToken();
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return {
      id: payload.id,
      email: payload.email,
      firstName: payload.firstName,
      lastName: payload.lastName,
      currency: payload.currency,
      fullName: payload.fullName
    };
  } catch (error) {
    return null;
  }
};

// Create Authorization header
export const getAuthHeader = () => {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// API call with authentication
export const authenticatedFetch = async (url, options = {}) => {
  const authHeaders = getAuthHeader();
  
  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders,
      ...options.headers,
    },
  };

  const response = await fetch(url, config);
  
  // If unauthorized, remove token and redirect to login
  if (response.status === 401) {
    removeToken();
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  }

  return response;
};

// Login function
export const login = async (email, password) => {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  if (response.ok && data.token) {
    setToken(data.token);
    return { success: true, user: data.user };
  }

  return { success: false, message: data.message };
};

// Signup function
export const signup = async (userData) => {
  const response = await fetch('/api/auth/signup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });

  const data = await response.json();

  if (response.ok && data.token) {
    setToken(data.token);
    return { success: true, user: data.user };
  }

  return { success: false, message: data.message, errors: data.errors };
};

// Logout function
export const logout = async () => {
  try {
    await authenticatedFetch('/api/auth/logout', {
      method: 'POST',
    });
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    removeToken();
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  }
};

// Get current user profile
export const getCurrentUser = async () => {
  try {
    const response = await authenticatedFetch('/api/auth/me');
    
    if (response.ok) {
      const data = await response.json();
      return { success: true, user: data.user };
    }
    
    return { success: false, message: 'Failed to fetch user profile' };
  } catch (error) {
    return { success: false, message: 'Network error' };
  }
};