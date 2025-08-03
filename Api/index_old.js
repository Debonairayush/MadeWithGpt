const express = require('express');
const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const app = express();
const html2canvas = require('html2canvas');
const insertLine = require('insert-line');
const fetch = require("cross-fetch");
const cors = require('cors');
const { base64 } = require('base64-img');
const { encode } = require('punycode');
const  axios  =  require('axios');
const { getMockData } = require('./mockData');
require('dotenv').config()
let Count =1;



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

  var conf = {
    "model": "gpt-3.5-turbo",
    "messages": [
      {
        "role": "user",
        "content": `Create a comprehensive learning roadmap for "${topic}". Generate a unique JSON structure with different subtopics and learning paths each time. Format as: {"name": "Learn ${topic}", "children": [...]}. Include specific frameworks, tools, and technologies relevant to ${topic}. Make sure each children array contains different content. Provide only valid JSON, no additional text.`
      }
    ],
    "temperature": 0.9,  // Higher temperature for more variety
    "max_tokens": 1500   // More tokens for comprehensive roadmaps
  };
  var value = "";
  
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
  value = cleanText(response.data.choices[0].message.content);
  console.log(value);
      
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










let data ={
  "name": "Decentralized Shopping Website with 3D 360 View of Products",
  "children": [
    {
      "name": "Blockchain Integration",
      "children": [
        {
          "name": "Smart Contract Development",
          "children": [
            {
              "name": "ERC-20 Token Standard",
              "children": []
            },
            {
              "name": "ERC-721 Token Standard (for NFTs)",
              "children": []
            }
          ]
        },
        {
          "name": "Payment Integration",
          "children": [
            {
              "name": "Cryptocurrencies (BTC, ETH, etc.)",
              "children": []
            },
            {
              "name": "Stablecoins (USDT, USDC, etc.)",
              "children": []
            }
          ]
        },
        {
          "name": "Decentralized Data Storage",
          "children": [
            {
              "name": "IPFS",
              "children": []
            }
          ]
        }
      ]
    },
    {
      "name": "Web Development",
      "children": [
        {
          "name": "Frontend Development",
          "children": [
            {
              "name": "React",
              "children": []
            },
            {
              "name": "Three.js",
              "children": []
            },
            {
              "name": "WebGL",
              "children": []
            }
          ]
        },
        {
          "name": "Backend Development",
          "children": [
            {
              "name": "Node.js",
              "children": []
            },
            {
              "name": "Express",
              "children": []
            },
            {
              "name": "MongoDB",
              "children": []
            }
          ]
        },
        {
          "name": "API Development",
          "children": [
            {
              "name": "RESTful API",
              "children": []
            },
            {
              "name": "GraphQL",
              "children": []
            }
          ]
        }
      ]
    },
    {
      "name": "3D Modeling and Animation",
      "children": [
        {
          "name": "3D Modeling Software",
          "children": [
            {
              "name": "Blender",
              "children": []
            },
            {
              "name": "Autodesk Maya",
              "children": []
            }
          ]
        },
        {
          "name": "Animation Software",
          "children": [
            {
              "name": "Unity",
              "children": []
            },
            {
              "name": "Unreal Engine",
              "children": []
            }
          ]
        }
      ]
    },
    {
      "name": "Product Visualization",
      "children": [
        {
          "name": "3D Scanning",
          "children": [
            {
              "name": "Photogrammetry",
              "children": []
            },
            {
              "name": "Lidar",
              "children": []
            }
          ]
        },
        {
          "name": "3D Product Rendering",
          "children": [
            {
              "name": "Product Design Software",
              "children": [
                {
                  "name": "CAD (Computer-Aided Design)",
                  "children": []
                },
                {
                  "name": "SketchUp",
                  "children": []
                }
              ]
            },
            {
              "name": "3D Rendering Software",
              "children": [
                {
                  "name": "V-Ray",
                 
              "children": []
            },
            {
              "name": "Blender",
              "children": []
            },
            {
              "name": "KeyShot",
              "children": []
            }
          ]
        }
      ]
    },
    {
      "name": "360 View of Products",
      "children": [
        {
          "name": "360 Product Photography",
          "children": []
        },
        {
          "name": "360 Product Viewer",
          "children": [
            {
              "name": "Three.js",
              "children": []
            },
            {
              "name": "A-Frame",
              "children": []
            }
          ]
        }
      ]
    }
  ]
}
]
};

let datastring = JSON.stringify(data);

// console.log(datastring);








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

app.listen(3000, () => console.log('Server running on port 3000'));
