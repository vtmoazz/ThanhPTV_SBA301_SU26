
import './App.css'
import Footer from './components/Footer'
import NavBar from './components/NavBar'
import { BrowserRouter as BrowsersRouter, Route, Routes } from 'react-router-dom'
import About from './components/About'
import Contact from './components/Contact'
import { CarouselData } from './data/CarouselData.js'
import HeroCarousel from './components/HeroCarousel.jsx'
import Orchids from './components/Orchids.jsx'

function App() {
  return (
    <BrowsersRouter>
      <div className="app-container">
        <NavBar />

        <main className="main-content">
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <HeroCarousel slides={CarouselData} />
                  <Orchids />
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
