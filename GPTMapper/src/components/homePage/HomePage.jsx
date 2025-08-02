import React, { useState } from 'react';
import './homePage.css';
import Header from '../header/Header';
import Footer from '../footer/Footer';
import SingleGalleryItem from './SingleGalleryItem';

import IMG1 from '../../assets/roadm.jpg';
import IMG2 from '../../assets/roadm2.jpg';
import IMG3 from '../../assets/roadm3.jpg';
import IMG4 from '../../assets/roadm4.jpg';
import IMG5 from '../../assets/roadm5.jpg';
import IMG6 from '../../assets/roadm6.jpg';

const HomePage = () => {
  const [inputValue, setInputValue] = useState('');
  const [outputText, setOutputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [roadmapImage, setRoadmapImage] = useState(null); // to show the base64 image

  const fetchRoadmapFromGemini = async (topic) => {
    if (!topic) return;
    setLoading(true);
    setOutputText('');
    setRoadmapImage(null);

    try {
      const response = await fetch(`http://localhost:3000/getRoadmap?topic=${encodeURIComponent(topic)}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        }
      });

      const contentType = response.headers.get("content-type");

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server error: ${response.status} - ${errorText}`);
      }

      if (!contentType || !contentType.includes("application/json")) {
        const errorText = await response.text();
        throw new Error(`Expected JSON but got: ${errorText}`);
      }

      const data = await response.json();

      if (data.photo) {
        setOutputText(`✅ Roadmap generated successfully!`);
        setRoadmapImage(data.photo);
      } else {
        setOutputText('❌ No roadmap generated.');
      }
    } catch (error) {
      setOutputText('⚠️ Error fetching roadmap: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleButtonClick = () => {
    fetchRoadmapFromGemini(inputValue);
  };

  return (
    <>
      <Header />
      <div className="home-area">
        <div className="big-container">
          <div className="middle-container">
            <div className="small-container">
              <h2>Hello, <br /> Need Guidance?</h2>
              <p>You reached the right place. We provide instant roadmaps essential to ace your career.</p>
              <div className="btn-container">
                <input
                  className="btn-1"
                  placeholder="Enter Topic"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                />
                <button className="btn-2" onClick={handleButtonClick}>Get</button>
              </div>
              {loading ? (
                <p className="loader">Loading...</p>
              ) : (
                <>
                  <pre className="roadmap-text">{outputText}</pre>
                  {roadmapImage && (
                    <img
                      src={`data:image/png;base64,${roadmapImage}`}
                      alt="Generated Roadmap"
                      style={{ maxWidth: "100%", marginTop: "1rem", borderRadius: "8px", border: "1px solid #ccc" }}
                    />
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        <div className="roadmap_samples_container">
          <div className="left-side">
            <h3>Roadmap Samples</h3>
          </div>
          <div className="roadmap_samples_block">
            <SingleGalleryItem IMG={IMG1} />
            <SingleGalleryItem IMG={IMG2} />
            <SingleGalleryItem IMG={IMG3} />
            <SingleGalleryItem IMG={IMG4} />
            <SingleGalleryItem IMG={IMG5} />
            <SingleGalleryItem IMG={IMG6} />
          </div>
          <div className="view_more">
            <div className="view-more-inner">
              <a href="#" className="btna">View More</a>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default HomePage;
