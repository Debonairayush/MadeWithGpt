async function getMockData(topic) {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const mockRoadmaps = {
    "javascript": {
      "name": "JavaScript Learning Roadmap",
      "children": [
        {
          "name": "Fundamentals",
          "children": [
            {
              "name": "Variables & Data Types",
              "children": []
            },
            {
              "name": "Functions",
              "children": []
            },
            {
              "name": "Control Flow",
              "children": []
            }
          ]
        },
        {
          "name": "Advanced Concepts",
          "children": [
            {
              "name": "Async/Await",
              "children": []
            },
            {
              "name": "Promises",
              "children": []
            },
            {
              "name": "Modules",
              "children": []
            }
          ]
        },
        {
          "name": "Frameworks",
          "children": [
            {
              "name": "React",
              "children": []
            },
            {
              "name": "Vue",
              "children": []
            },
            {
              "name": "Angular",
              "children": []
            }
          ]
        }
      ]
    },
    "react": {
      "name": "React Learning Roadmap",
      "children": [
        {
          "name": "Core Concepts",
          "children": [
            {
              "name": "Components",
              "children": []
            },
            {
              "name": "JSX",
              "children": []
            },
            {
              "name": "Props & State",
              "children": []
            }
          ]
        },
        {
          "name": "Advanced React",
          "children": [
            {
              "name": "Hooks",
              "children": []
            },
            {
              "name": "Context API",
              "children": []
            },
            {
              "name": "Redux",
              "children": []
            }
          ]
        }
      ]
    },
    "default": {
      "name": `${topic} Learning Roadmap`,
      "children": [
        {
          "name": "Getting Started",
          "children": [
            {
              "name": "Basic Concepts",
              "children": []
            },
            {
              "name": "Setup & Installation",
              "children": []
            }
          ]
        },
        {
          "name": "Intermediate Level",
          "children": [
            {
              "name": "Core Skills",
              "children": []
            },
            {
              "name": "Best Practices",
              "children": []
            }
          ]
        },
        {
          "name": "Advanced Topics",
          "children": [
            {
              "name": "Expert Techniques",
              "children": []
            },
            {
              "name": "Industry Applications",
              "children": []
            }
          ]
        }
      ]
    }
  };
  
  const roadmap = mockRoadmaps[topic.toLowerCase()] || mockRoadmaps.default;
  return JSON.stringify(roadmap);
}

module.exports = { getMockData };
