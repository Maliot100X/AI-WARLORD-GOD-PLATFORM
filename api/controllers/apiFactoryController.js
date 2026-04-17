const { ApiEndpoint } = require('../models/ApiEndpoint');
const { scrapeWebsite } = require('../utils/webScraper');

class ApiFactoryController {
  async createApiFromUrl(req, res) {
    try {
      const { url, name, description } = req.body;
      
      // Scrape the website to understand its structure
      const scrapedData = await scrapeWebsite(url);
      
      // Create API endpoint configuration
      const apiEndpoint = new ApiEndpoint({
        name,
        description,
        sourceUrl: url,
        endpoints: scrapedData.endpoints,
        auth: scrapedData.auth,
        status: 'created',
        createdAt: new Date()
      });

      await apiEndpoint.save();
      
      res.status(201).json({
        success: true,
        data: apiEndpoint
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  async getApiStatus(req, res) {
    try {
      const { apiId } = req.params;
      
      const apiEndpoint = await ApiEndpoint.findById(apiId);
      if (!apiEndpoint) {
        return res.status(404).json({
          success: false,
          error: 'API not found'
        });
      }

      res.json({
        success: true,
        data: {
          status: apiEndpoint.status,
          endpoints: apiEndpoint.endpoints,
          lastTested: apiEndpoint.lastTested
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  async testApi(req, res) {
    try {
      const { apiId } = req.params;
      const { endpoint, method, headers, body } = req.body;
      
      const apiEndpoint = await ApiEndpoint.findById(apiId);
      if (!apiEndpoint) {
        return res.status(404).json({
          success: false,
          error: 'API not found'
        });
      }

      // Test the API endpoint
      const testResult = await this._testEndpoint(endpoint, method, headers, body);
      
      // Update last tested timestamp
      apiEndpoint.lastTested = new Date();
      await apiEndpoint.save();

      res.json({
        success: true,
        data: testResult
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  async deleteApi(req, res) {
    try {
      const { apiId } = req.params;
      
      const apiEndpoint = await ApiEndpoint.findByIdAndDelete(apiId);
      if (!apiEndpoint) {
        return res.status(404).json({
          success: false,
          error: 'API not found'
        });
      }

      res.json({
        success: true,
        message: 'API deleted successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  async _testEndpoint(url, method, headers = {}, body = null) {
    const axios = require('axios');
    
    const config = {
      method: method.toLowerCase(),
      url: url,
      headers: {
        'User-Agent': 'AI-Warlord-API-Factory/1.0',
        ...headers
      }
    };

    if (body && (method.toLowerCase() === 'post' || method.toLowerCase() === 'put')) {
      config.data = body;
    }

    const response = await axios(config);
    
    return {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
      data: response.data,
      responseTime: response.headers['response-time'] || 'N/A'
    };
  }
}

module.exports = new ApiFactoryController();