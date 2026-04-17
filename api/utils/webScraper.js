const puppeteer = require('puppeteer');
const cheerio = require('cheerio');

async function scrapeWebsite(url) {
  try {
    const browser = await puppeteer.launch({ 
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2' });
    
    const html = await page.content();
    const $ = cheerio.load(html);
    
    // Extract API endpoints from the page
    const endpoints = [];
    
    // Look for API documentation patterns
    $('pre, code, .api-endpoint, .endpoint, [class*="api"]').each((i, element) => {
      const text = $(element).text().trim();
      
      // Try to match HTTP methods and paths
      const methodMatch = text.match(/(GET|POST|PUT|DELETE|PATCH)\s+(\/[^\s\n]+)/i);
      if (methodMatch) {
        endpoints.push({
          method: methodMatch[1].toUpperCase(),
          path: methodMatch[2],
          description: $(element).closest('div, section, article').find('h1, h2, h3, h4, p').first().text().trim() || 'No description'
        });
      }
    });
    
    // Look for authentication info
    const auth = {
      type: 'none',
      key: null,
      value: null
    };
    
    const authText = $('body').text().toLowerCase();
    if (authText.includes('bearer') || authText.includes('authorization')) {
      auth.type = 'bearer';
    } else if (authText.includes('api key') || authText.includes('apikey')) {
      auth.type = 'api-key';
    } else if (authText.includes('basic auth') || authText.includes('basic')) {
      auth.type = 'basic';
    }
    
    await browser.close();
    
    return {
      endpoints: endpoints.length > 0 ? endpoints : [{
        method: 'GET',
        path: '/',
        description: 'Root endpoint'
      }],
      auth
    };
  } catch (error) {
    console.error('Error scraping website:', error);
    return {
      endpoints: [{
        method: 'GET',
        path: '/',
        description: 'Root endpoint (scraping failed)'
      }],
      auth: {
        type: 'none',
        key: null,
        value: null
      }
    };
  }
}

module.exports = { scrapeWebsite };