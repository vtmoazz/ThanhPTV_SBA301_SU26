
import './App.css'
import Footer from './components/Footer'
import Header from './components/Header'
import { BrowserRouter as BrowsersRouter, Route, Routes } from 'react-router-dom'
import About from './components/About'
import Contact from './components/Contact'
import { OrchidsData } from './data/OrchidsData.js'
import { CarouselData } from './data/CarouselData.js'
import ListOfOrchids from './components/ListOfOrchids.jsx'
import HeroCarousel from './components/HeroCarousel.jsx'

function App() {
  return (
    <BrowsersRouter>
      <div className="app-container">
        <Header />
        
        <main className="main-content">
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <HeroCarousel slides={CarouselData} />
                  <ListOfOrchids orchidsData={OrchidsData} />
                </>
              }
            />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </main>

        <Footer avatar="/images/work.png" name="thanh" email="thanhptv.vn" />
      </div>
    </BrowsersRouter>
  );
}

export default App
