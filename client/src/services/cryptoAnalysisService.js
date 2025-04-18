import axios from 'axios';

class CryptoAnalysisService {
  constructor() {
    this.baseUrl = import.meta.env.VITE_API_URL;
    this.analysisEndpoint = '/auth/api/crypto-analysis';
  }

  getAuthHeaders() {
    const token = localStorage.getItem("token");
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": 'application/json',
    };
  }

  async fetchAnalysisData() {
    try {
      const response = await axios.get(`${this.baseUrl}${this.analysisEndpoint}`, {
        headers: this.getAuthHeaders(),
      });

      if (response.status !== 200) {
        throw new Error("Failed to fetch analysis data");
      }

      // Cache the results
      localStorage.setItem("crypto-analysis", JSON.stringify({
        data: response.data,
        timestamp: Date.now()
      }));

      return response.data;
    } catch (error) {
      console.error("Error fetching crypto analysis data:", error);
      throw error;
    }
  }


  async getAnalysisData() {
    const cachedData = localStorage.getItem("crypto-analysis");
    if (cachedData) {
      const { data, timestamp } = JSON.parse(cachedData);
      const now = Date.now();
      const cacheDuration = 30 * 60 * 1000; 
      
      if (now - timestamp < cacheDuration) {
        return data;
      }
    }
    return this.fetchAnalysisData();
  }
}

export default new CryptoAnalysisService();