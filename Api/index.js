const express = require('express');
const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const app = express();
const cors = require('cors');
const axios = require('axios');
const { getMockData } = require('./mockData');
require('dotenv').config();

function isValidJSON(myString) {
  try {
      JSON.parse(myString);
      return true;
  } catch (error) {
      return false;
  }
}

function cleanText(inputString) {
  const openingBraceIndex = inputString.indexOf('{');
  const closingBraceIndex = inputString.lastIndexOf('}');

  if (openingBraceIndex !== -1 && closingBraceIndex !== -1 && closingBraceIndex > openingBraceIndex) {
      const extractedText = inputString.substring(openingBraceIndex, closingBraceIndex + 1).trim();
      return extractedText;
  } else {
      return null;
  }
}

async function getData(topic) {
  const api_key = process.env.OPENAI_API_KEY;
  console.log(`Generating roadmap for topic: ${topic}`);

  // Add timestamp and randomness to ensure unique responses
  const timestamp = Date.now();
  const randomId = Math.random().toString(36).substr(2, 9);

  var conf = {
    "model": "gpt-3.5-turbo",
    "messages": [
      {
        "role": "user",
        "content": `Create a comprehensive and unique learning roadmap for "${topic}" (Request ID: ${randomId}-${timestamp}). 

        Generate a detailed JSON structure with different subtopics, technologies, and learning paths each time. The roadmap should be practical and include:
        - Core fundamentals
        - Popular frameworks/tools
        - Advanced concepts
        - Best practices
        - Career paths

        Format as: {"name": "Learn ${topic}", "children": [...]}
        
        Make sure each request generates different content with varied subtopics and learning sequences. Include specific, actionable learning items.
        
        Provide only valid JSON, no additional text or markdown formatting.`
      }
    ],
    "temperature": 0.9,  // Higher temperature for more variety
    "max_tokens": 1500   // More tokens for comprehensive roadmaps
  };

  var config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'https://api.openai.com/v1/chat/completions',
      headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${api_key}`,
      },
      data: conf
  };

  const response = await axios(config);
  const value = cleanText(response.data.choices[0].message.content);
  console.log(`Generated unique roadmap for ${topic}`);
      
  return value;
}

async function QueryMessage(topic) {
  // First try the real API
  for (let i = 0; i < 3; i++) {
      try {
        let response = await getData(topic);
        if(isValidJSON(response)){
          return response;
        }
      } catch (error) {
        console.log(`API attempt ${i + 1} failed:`, error.message);
      }
  }
  
  // If real API fails, use mock data
  console.log('Using mock data as fallback');
  return await getMockData(topic);
}

app.use(cors());

app.get('/getRoadmap', async (req, res) => {
  const topic = req.query.topic || 'Web Development';
  
  try {
    const fileCode = await fs.readFile(__dirname + '/Roadmap.html', 'utf-8');
    
    // Get fresh data for this request
    const roadmapData = await QueryMessage(topic);
    console.log(`Generated roadmap data for ${topic}`);
    
    // Create a completely fresh HTML by replacing the placeholder
    // Look for the data placeholder in the HTML template
    const htmlWithData = fileCode.replace(
      '// DATA_PLACEHOLDER',
      `const data = ${roadmapData};`
    );
    
    console.log(`HTML template prepared for ${topic}`);
    
    try {
      const browser = await puppeteer.launch({ 
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
      });
      const page = await browser.newPage();
      await page.setViewport({ width: 1920, height: 1080 });
      await page.setContent(htmlWithData);
      
      // Wait for the chart to render
      await page.waitForSelector('#chart svg', { timeout: 10000 });

      // Screenshot the chart element
      const chartElement = await page.$('#chart');
      const base64Data = await chartElement.screenshot({encoding: "base64"});
      
      await browser.close();
      
      res.header('Access-Control-Allow-Origin', '*');
      res.send({
        photo: base64Data,
        topic: topic,
        message: `Roadmap generated successfully for ${topic}`
      });
    } catch (puppeteerError) {
      console.error('Puppeteer error:', puppeteerError);
      // Fallback: return just the data without screenshot
      res.header('Access-Control-Allow-Origin', '*');
      res.send({
        photo: null,
        data: roadmapData,
        topic: topic,
        message: 'Roadmap data generated successfully, but screenshot generation failed'
      });
    }
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(3000, () => console.log('Server running on port 3000 with improved roadmap generation'));
