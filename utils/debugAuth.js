// Debug utilities for authentication issues

export const debugUserLookup = async (email) => {
  try {
    const response = await fetch('/api/auth/check-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();
    console.log('User lookup debug:', data);
    return data;
  } catch (error) {
    console.error('Debug lookup error:', error);
    return { success: false, error: error.message };
  }
};

export const testLogin = async (email, password) => {
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    console.log('Login test result:', data);
    return data;
  } catch (error) {
    console.error('Login test error:', error);
    return { success: false, error: error.message };
  }
};