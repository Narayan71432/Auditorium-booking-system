import config from '../config';

// We'll use our centralized config for the API base URL
// and append the /api path segment if needed
export const API_BASE_URL = config.API_BASE_URL + (config.API_BASE_URL.endsWith('/api') ? '' : '/api');

// Log the API URL being used for debugging
console.log('apiConfig using URL:', API_BASE_URL);

// Helper functions for API calls
export const login = async (credentials) => {
  try {
    console.log('Login attempt with API URL:', API_BASE_URL);
    console.log('Login credentials (without password):', { email: credentials.email || credentials.username });
    
    // Handle case where API_BASE_URL is empty or undefined
    if (!API_BASE_URL) {
      console.error('API_BASE_URL is empty or undefined');
      throw new Error('API configuration error. Please try again later.');
    }
    
    const loginUrl = `${API_BASE_URL}/auth/login`;
    console.log('Full login URL:', loginUrl);
    
    const response = await fetch(loginUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
    
    console.log('Login response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Login response error text:', errorText);
      
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch (e) {
        errorData = { message: errorText || 'Login failed' };
      }
      
      throw new Error(errorData.message || 'Login failed');
    }
    
    const data = await response.json();
    console.log('Login success, received data:', { ...data, token: 'HIDDEN' });
    return data;
  } catch (error) {
    console.error('Login error:', error.message);
    throw error;
  }
};

export const register = async (userData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Registration failed');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

// Check availability of a hall for a specific date and time
export const checkAvailability = async (params) => {
  try {
    const queryParams = new URLSearchParams();
    
    // Add all parameters to the query string
    Object.keys(params).forEach(key => {
      if (params[key]) {
        queryParams.append(key, params[key]);
      }
    });
    
    const response = await fetch(`${API_BASE_URL}/events/check-availability?${queryParams.toString()}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      }
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to check availability');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Availability check error:', error);
    throw error;
  }
};

// Get all events
export const getEvents = async (filters = {}) => {
  try {
    const queryParams = new URLSearchParams();
    
    // Add filters to query string if provided
    Object.keys(filters).forEach(key => {
      if (filters[key]) {
        queryParams.append(key, filters[key]);
      }
    });
    
    const response = await fetch(`${API_BASE_URL}/events/list?${queryParams.toString()}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      }
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch events');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Get events error:', error);
    throw error;
  }
};

// Create a new event
export const createEvent = async (eventData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/events/create`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(eventData),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create event');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Create event error:', error);
    throw error;
  }
};
