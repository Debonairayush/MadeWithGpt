const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Midit dleware
app.use(cors());
app.use(express.json());

// Serve static files from the React app build directory
app.use(express.static(path.join(__dirname, 'build')));

// Mock roadmap data for demonstration
const generateMockRoadmap = (topic) => {
  // This is a placeholder function - in a real application, 
  // you would integrate with an AI service like OpenAI, Gemini, etc.
  const roadmaps = {
    'react': {
      title: 'React.js Learning Roadmap',
      steps: [
        'Learn JavaScript Fundamentals',
        'Understand ES6+ Features',
        'Learn React Basics (Components, JSX)',
        'State Management with useState',
        'Event Handling',
        'Component Lifecycle',
        'React Hooks',
        'React Router',
        'State Management (Redux/Context API)',
        'Testing with Jest',
        'Build Production Apps'
      ]
    },
    'javascript': {
      title: 'JavaScript Learning Roadmap',
      steps: [
        'Variables and Data Types',
        'Functions and Scope',
        'Objects and Arrays',
        'Control Structures',
        'DOM Manipulation',
        'ES6+ Features',
        'Asynchronous JavaScript',
        'Promises and Async/Await',
        'Module Systems',
        'Error Handling',
        'Advanced Concepts'
      ]
    },
    'python': {
      title: 'Python Learning Roadmap',
      steps: [
        'Python Syntax and Basics',
        'Data Types and Variables',
        'Control Structures',
        'Functions and Modules',
        'Object-Oriented Programming',
        'File Handling',
        'Exception Handling',
        'Libraries and Frameworks',
        'Web Development with Django/Flask',
        'Data Analysis with Pandas',
        'Machine Learning Basics'
      ]
    }
  };

  const defaultRoadmap = {
    title: `${topic.charAt(0).toUpperCase() + topic.slice(1)} Learning Roadmap`,
    steps: [
      'Learn the Fundamentals',
      'Practice Basic Concepts',
      'Build Small Projects',
      'Study Advanced Topics',
      'Work on Real Projects',
      'Join Communities',
      'Continue Learning',
      'Share Your Knowledge'
    ]
  };

  return roadmaps[topic.toLowerCase()] || defaultRoadmap;
};

// Function to create a simple base64 encoded text image
const createRoadmapImage = (roadmapData) => {
  // This is a simplified approach - in a real application,
  // you would generate an actual image using libraries like Canvas or similar
  
  // For now, we'll return a placeholder that indicates the roadmap structure
  const canvas = `
    <svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <style>
          .title { font: bold 24px sans-serif; fill: #333; }
          .step { font: 16px sans-serif; fill: #666; }
          .box { fill: #f0f8ff; stroke: #4169e1; stroke-width: 2; }
        </style>
      </defs>
      
      <rect width="100%" height="100%" fill="#ffffff"/>
      
      <text x="400" y="40" text-anchor="middle" class="title">${roadmapData.title}</text>
      
      ${roadmapData.steps.map((step, index) => {
        const y = 80 + (index * 60);
        return `
          <rect x="50" y="${y - 20}" width="700" height="40" class="box" rx="5"/>
          <text x="400" y="${y}" text-anchor="middle" class="step">${index + 1}. ${step}</text>
        `;
      }).join('')}
    </svg>
  `;

  // Convert SVG to base64
  const base64 = Buffer.from(canvas).toString('base64');
  return base64;
};

// API endpoint for roadmap generation
app.get('/getRoadmap', async (req, res) => {
  try {
    const { topic } = req.query;
    
    if (!topic) {
      return res.status(400).json({ error: 'Topic is required' });
    }

    console.log(`Generating roadmap for topic: ${topic}`);
    
    // Generate mock roadmap data
    const roadmapData = generateMockRoadmap(topic);
    
    // Create a simple image representation
    const roadmapImage = createRoadmapImage(roadmapData);
    
    // Simulate some processing time
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    res.json({
      success: true,
      topic: topic,
      roadmap: roadmapData,
      photo: roadmapImage
    });
    
  } catch (error) {
    console.error('Error generating roadmap:', error);
    res.status(500).json({ 
      error: 'Failed to generate roadmap',
      message: error.message 
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Catch all handler: send back React's index.html file for any non-API requests
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📱 Frontend: http://localhost:${PORT}`);
  console.log(`🔍 API Health: http://localhost:${PORT}/health`);
});

module.exports = app;
