const axios = require('axios');

class ApiService {
  constructor() {
    this.baseURL = process.env.API_BASE_URL || 'https://dataservice.okvip.business';
    this.cfBmCookie = process.env.CF_BM_COOKIE || '';
  }

  async login(email, password) {
    try {
      const response = await axios.post(`${this.baseURL}/auth/login`, {
        email,
        password
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Cookie': this.cfBmCookie
        }
      });
      console.log('response.data', response.data)
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Login API error:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.message || 'Login failed'
      };
    }
  }

  async refreshToken(refreshToken) {
    try {
      const response = await axios.post(`${this.baseURL}/auth/refresh`, {
        refresh_token: refreshToken
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Cookie': this.cfBmCookie
        }
      });

      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Refresh token API error:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.message || 'Token refresh failed'
      };
    }
  }

  async getUserProfile(accessToken) {
    try {
      console.log('accessToken', accessToken)
      const response = await axios.get(`${this.baseURL}/users/me`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Cookie': this.cfBmCookie
        }
      });

      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Get user profile API error:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to get user profile'
      };
    }
  }
}

module.exports = new ApiService();