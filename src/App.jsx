import { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";

// ==========================================
// MAIN PORTFOLIO COMPONENTS
// ==========================================
import Home from "./components/Home/Home";
import About from "./components/About/About";
import ExperienceModal from "./components/Experience/ExperienceModal";
import Skills from "./components/Skills/Skills";
import Portfolio from "./components/Portfolio/Portfolio";
import Contact from "./components/Contact/Contact";
import Footer from "./components/Footer/Footer";

// ==========================================
// INTRO LOADER
// ==========================================
import IntroLoader from "./components/IntroLoader";

// ==========================================
// PLAY WITH ME
// ==========================================
import PlayWithMe from "./components/PlayWithMe";

// ==========================================
// PROJECT PAGES
// ==========================================
import GetInn from "./pages/GetInn";
import RecipeRecommend from "./pages/RecipeRecommend";


// ==========================================
// MAIN PORTFOLIO PAGE
// ==========================================
function MainPage() {
  const [showIntro, setShowIntro] = useState(true);

  return (
    <>
      {/* Intro Animation */}
      {showIntro && (
        <IntroLoader
          onComplete={() => setShowIntro(false)}
        />
      )}

      {/* Portfolio Sections */}
      <Home />

      <About />

      <ExperienceModal />

      <Skills />

      <Portfolio />

      <Contact />

      <Footer />
    </>
  );
}


// ==========================================
// APP
// ==========================================
export default function App() {
  return (
    <Router>
      <Routes>

        {/* ==================================
            HOME / PORTFOLIO
        ================================== */}
        <Route
          path="/"
          element={<MainPage />}
        />


        {/* ==================================
            PLAY WITH ME
            URL: /play
        ================================== */}
        <Route
          path="/play"
          element={<PlayWithMe />}
        />


        {/* ==================================
            GET INN PROJECT
        ================================== */}
        <Route
          path="/projects/get-inn"
          element={<GetInn />}
        />


        {/* ==================================
            RECIPE RECOMMENDATION PROJECT
        ================================== */}
        <Route
          path="/projects/recipe"
          element={<RecipeRecommend />}
        />

      </Routes>
    </Router>
  );
}