import About from "./components/about/About";
import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";
import HomePage from "./components/homePage/HomePage";
import Contact from "./components/contact/Contact";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
    <div className="w-100 h-screen">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </div>
  </BrowserRouter>
    // <div className="App">
    //   <Header/>
    //   <HomePage/>

    //   <About/>
    //   {/* <Contact/> */}
    //   <Footer/> 
    // </div>
  );
}

export default App;
