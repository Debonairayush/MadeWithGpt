async function getMockData(topic) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Add randomness to mock data based on topic and timestamp
    const timestamp = Date.now();
    const variations = ['Basic', 'Advanced', 'Complete', 'Professional', 'Expert'];
    const randomVariation = variations[Math.floor(Math.random() * variations.length)];
    
    const roadmaps = {
        javascript: [
            {
                "name": `${randomVariation} JavaScript Learning Path`,
                "children": [
                    {
                        "name": "JavaScript Fundamentals",
                        "children": [
                            { "name": "Variables and Data Types", "children": [] },
                            { "name": "Functions and Scope", "children": [] },
                            { "name": "Objects and Arrays", "children": [] },
                            { "name": "ES6+ Features", "children": [] }
                        ]
                    },
                    {
                        "name": "DOM Manipulation",
                        "children": [
                            { "name": "Event Handling", "children": [] },
                            { "name": "Dynamic Content", "children": [] },
                            { "name": "Form Validation", "children": [] }
                        ]
                    },
                    {
                        "name": "Asynchronous JavaScript",
                        "children": [
                            { "name": "Promises", "children": [] },
                            { "name": "Async/Await", "children": [] },
                            { "name": "Fetch API", "children": [] }
                        ]
                    }
                ]
            },
            {
                "name": `${randomVariation} JavaScript Mastery`,
                "children": [
                    {
                        "name": "Core Concepts",
                        "children": [
                            { "name": "Closures and Prototypes", "children": [] },
                            { "name": "Event Loop", "children": [] },
                            { "name": "Memory Management", "children": [] }
                        ]
                    },
                    {
                        "name": "Modern JavaScript",
                        "children": [
                            { "name": "Modules (ES6)", "children": [] },
                            { "name": "Destructuring", "children": [] },
                            { "name": "Template Literals", "children": [] }
                        ]
                    },
                    {
                        "name": "Testing & Tools",
                        "children": [
                            { "name": "Jest Testing", "children": [] },
                            { "name": "Webpack", "children": [] },
                            { "name": "Babel", "children": [] }
                        ]
                    }
                ]
            }
        ],
        react: [
            {
                "name": `${randomVariation} React Development`,
                "children": [
                    {
                        "name": "React Basics",
                        "children": [
                            { "name": "Components & JSX", "children": [] },
                            { "name": "Props and State", "children": [] },
                            { "name": "Event Handling", "children": [] }
                        ]
                    },
                    {
                        "name": "Advanced React",
                        "children": [
                            { "name": "Hooks (useState, useEffect)", "children": [] },
                            { "name": "Context API", "children": [] },
                            { "name": "Custom Hooks", "children": [] }
                        ]
                    },
                    {
                        "name": "React Ecosystem",
                        "children": [
                            { "name": "React Router", "children": [] },
                            { "name": "Redux/Zustand", "children": [] },
                            { "name": "Testing Library", "children": [] }
                        ]
                    }
                ]
            },
            {
                "name": `${randomVariation} React Ecosystem`,
                "children": [
                    {
                        "name": "Component Libraries",
                        "children": [
                            { "name": "Material-UI", "children": [] },
                            { "name": "Ant Design", "children": [] },
                            { "name": "Chakra UI", "children": [] }
                        ]
                    },
                    {
                        "name": "State Management",
                        "children": [
                            { "name": "Redux Toolkit", "children": [] },
                            { "name": "Recoil", "children": [] },
                            { "name": "SWR/React Query", "children": [] }
                        ]
                    },
                    {
                        "name": "Build Tools",
                        "children": [
                            { "name": "Vite", "children": [] },
                            { "name": "Next.js", "children": [] },
                            { "name": "Gatsby", "children": [] }
                        ]
                    }
                ]
            }
        ],
        python: [
            {
                "name": `${randomVariation} Python Development`,
                "children": [
                    {
                        "name": "Python Basics",
                        "children": [
                            { "name": "Syntax and Variables", "children": [] },
                            { "name": "Data Structures", "children": [] },
                            { "name": "Functions and Modules", "children": [] }
                        ]
                    },
                    {
                        "name": "Object-Oriented Programming",
                        "children": [
                            { "name": "Classes and Objects", "children": [] },
                            { "name": "Inheritance", "children": [] },
                            { "name": "Polymorphism", "children": [] }
                        ]
                    },
                    {
                        "name": "Python Libraries",
                        "children": [
                            { "name": "NumPy & Pandas", "children": [] },
                            { "name": "Requests", "children": [] },
                            { "name": "Django/Flask", "children": [] }
                        ]
                    }
                ]
            },
            {
                "name": `${randomVariation} Python Specializations`,
                "children": [
                    {
                        "name": "Web Development",
                        "children": [
                            { "name": "Django Framework", "children": [] },
                            { "name": "FastAPI", "children": [] },
                            { "name": "REST APIs", "children": [] }
                        ]
                    },
                    {
                        "name": "Data Science",
                        "children": [
                            { "name": "Machine Learning", "children": [] },
                            { "name": "Data Visualization", "children": [] },
                            { "name": "Jupyter Notebooks", "children": [] }
                        ]
                    },
                    {
                        "name": "Automation",
                        "children": [
                            { "name": "Web Scraping", "children": [] },
                            { "name": "Task Automation", "children": [] },
                            { "name": "DevOps Scripts", "children": [] }
                        ]
                    }
                ]
            }
        ]
    };

    // Default roadmap generator for any topic
    function generateDefaultRoadmap(topic) {
        const learningAreas = [
            "Fundamentals", "Core Concepts", "Advanced Topics", "Best Practices", 
            "Tools & Frameworks", "Real-world Applications"
        ];
        
        return {
            "name": `${randomVariation} ${topic} Learning Journey`,
            "children": learningAreas.slice(0, 3 + Math.floor(Math.random() * 3)).map(area => ({
                "name": area,
                "children": [
                    { "name": `${area} - Basic Level`, "children": [] },
                    { "name": `${area} - Intermediate`, "children": [] },
                    { "name": `${area} - Advanced`, "children": [] }
                ]
            }))
        };
    }

    // Get topic-specific roadmaps or create a generic one
    const topicKey = topic.toLowerCase();
    let selectedRoadmap;
    
    if (roadmaps[topicKey]) {
        const availableRoadmaps = roadmaps[topicKey];
        const randomIndex = Math.floor(Math.random() * availableRoadmaps.length);
        selectedRoadmap = availableRoadmaps[randomIndex];
    } else {
        selectedRoadmap = generateDefaultRoadmap(topic);
    }
    
    // Add timestamp to make it unique
    selectedRoadmap.name = `${selectedRoadmap.name} (Generated: ${new Date().toLocaleTimeString()})`;
    
    return JSON.stringify(selectedRoadmap);
}

module.exports = { getMockData };
