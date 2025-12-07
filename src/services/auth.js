const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://kal-heter-back.vercel.app';

// Store tokens in localStorage
export const setAuthTokens = (accessToken, refreshToken) => {
  localStorage.setItem('access_token', accessToken);
  localStorage.setItem('refresh_token', refreshToken);
};

export const getAccessToken = () => {
  return localStorage.getItem('access_token');
};

export const getRefreshToken = () => {
  return localStorage.getItem('refresh_token');
};

export const clearAuthTokens = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('user');
};

export const setUser = (user) => {
  localStorage.setItem('user', JSON.stringify(user));
};

export const getUser = () => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

export const isAuthenticated = () => {
  return !!getAccessToken();
};

// Sign up a new user
export const signUp = async (email, password, phone = null, fullName = null) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
        phone,
        full_name: fullName,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail || 'Failed to sign up');
    }

    // If we got tokens, store them
    if (data.access_token) {
      setAuthTokens(data.access_token, data.refresh_token);
      if (data.user) {
        setUser(data.user);
      }
      return { success: true, user: data.user, tokens: { access_token: data.access_token, refresh_token: data.refresh_token } };
    }

    // If email confirmation is required
    return { success: false, requiresEmailConfirmation: true, message: data.message || 'Please check your email to confirm your account.' };
  } catch (error) {
    throw new Error(error.message || 'An error occurred during sign up');
  }
};

// Sign in an existing user
export const signIn = async (email, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/signin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail || 'Failed to sign in');
    }

    // Store tokens and user info
    if (data.access_token) {
      setAuthTokens(data.access_token, data.refresh_token);
      if (data.user) {
        setUser(data.user);
      }
      return { success: true, user: data.user, tokens: { access_token: data.access_token, refresh_token: data.refresh_token } };
    }

    throw new Error('No access token received');
  } catch (error) {
    throw new Error(error.message || 'An error occurred during sign in');
  }
};

// Sign out
export const signOut = () => {
  clearAuthTokens();
};

// Get current user (with token validation)
export const getCurrentUser = async () => {
  try {
    const token = getAccessToken();
    if (!token) {
      return null;
    }

    const response = await fetch(`${API_BASE_URL}/api/auth/user`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      clearAuthTokens();
      return null;
    }

    const user = await response.json();
    setUser(user);
    return user;
  } catch (error) {
    clearAuthTokens();
    return null;
  }
};

