import axios from 'axios';

const GCP_API_URL = 'https://crypto-api-1078438493144.us-central1.run.app';

class AuthService {
  async register(fullName, email, password) {
    try {
      const response = await axios.post(`${GCP_API_URL}/auth/register`, {
        fullName,
        email,
        password
      });
      
      if (response.data.token) {
        localStorage.setItem('user', JSON.stringify(response.data));
      }
      
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Login existing user
  async login(email, password) {
    try {
      const response = await axios.post(`${GCP_API_URL}/auth/login`, {
        email,
        password
      });
      
      if (response.data.token) {
        localStorage.setItem('user', JSON.stringify(response.data));
      }
      
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Google Sign-In
  async googleSignIn(googleToken) {
    try {
      const response = await axios.post(`${GCP_API_URL}/auth/google`, {
        token: googleToken
      });
      
      if (response.data.token) {
        localStorage.setItem('user', JSON.stringify(response.data));
      }
      
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Logout user
  logout() {
    localStorage.removeItem('user');
  }

  // Get current user
  getCurrentUser() {
    return JSON.parse(localStorage.getItem('user'));
  }

  // Get auth header
  getAuthHeader() {
    const user = this.getCurrentUser();
    
    if (user && user.token) {
      return { Authorization: `Bearer ${user.token}` };
    } else {
      return {};
    }
  }

  // Handle API errors
  handleError(error) {
    if (error.response) {
      // Server responded with a status code outside of 2xx range
      return new Error(error.response.data.message || 'Authentication failed');
    } else if (error.request) {
      // Request was made but no response was received
      return new Error('No response from server. Please try again later.');
    } else {
      // Something else caused the error
      return new Error('Authentication error. Please try again.');
    }
  }
}

export default new AuthService();