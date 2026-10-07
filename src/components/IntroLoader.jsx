import { useEffect, useState } from "react";
import "./IntroLoader.css";

const greetings = [
  "नमस्ते",        // Hindi
  "नमस्कार",       // Marathi
  "নমস্কার",       // Bengali
  "નમસ્તે",        // Gujarati
  "ਸਤ ਸ੍ਰੀ ਅਕਾਲ", // Punjabi
  "வணக்கம்",       // Tamil
  "Hello"      // English
];

function IntroLoader({ onComplete }) {
  const [index, setIndex] = useState(0);
  const [reveal, setReveal] = useState(false);

  useEffect(() => {
    // Fast greeting changes
    if (index < greetings.length - 1) {
      const timer = setTimeout(() => {
        setIndex((prev) => prev + 1);
      }, 220);

      return () => clearTimeout(timer);
    }

    // Wait briefly after final greeting
    const revealTimer = setTimeout(() => {
      setReveal(true);
    }, 500);

    return () => clearTimeout(revealTimer);
  }, [index]);

  useEffect(() => {
    if (!reveal) return;

    // Give the reveal animation time to finish
    const timer = setTimeout(() => {
      onComplete();
    }, 1100);

    return () => clearTimeout(timer);
  }, [reveal, onComplete]);

  return (
    <div className={`intro-loader ${reveal ? "reveal-active" : ""}`}>
      
      {/* Decorative background */}
      <div className="intro-glow intro-glow-one"></div>
      <div className="intro-glow intro-glow-two"></div>

      {/* Main greeting */}
      <div className="intro-content">
        <div className="intro-greeting">
          <span className="intro-dot">•</span>

          <span
            className="intro-word"
            key={index}
          >
            {greetings[index]}
          </span>
        </div>

        <div className="intro-line"></div>

        <p className="intro-small-text">
        
        </p>
      </div>

      {/* Circular reveal */}
      <div className="reveal-circle"></div>

    </div>
  );
}

export default IntroLoader;