import { useState, useEffect } from "react";


import r1 from "../assets/recipe/s1.jpeg";
import r2 from "../assets/recipe/s2.jpeg";
import r3 from "../assets/recipe/s3.jpeg";
import r4 from "../assets/recipe/s4.jpeg";

export default function GetInn() {
 
    const images = [r1, r2, r3, r4,];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const slide = setInterval(() => {
      setIndex((i) => (i + 1) % images.length);
    }, 3000);
    return () => clearInterval(slide);
  }, [images.length]);

  return (
    <>
      {/* 🌪 SWIRL BACKGROUND */}
      <div className="swirl-background"></div>

      {/* PAGE CONTENT */}
      <section className="project-page">
        <h1 className="project-title">Recipe Recommendation System</h1>

        {/* Sliding card container */}
        <div className="card-slider">
          <div
            className="card-track"
            style={{ transform: `translateX(-${index * 100}%)` }}
          >
            {images.map((src, i) => (
              <div className="card-slide" key={i}>
                <img src={src} alt="GET-INN" />
              </div>
            ))}
          </div>
        </div>

        {/* Project Details */}
        <div className="project-details">
          <h2>Project Overview</h2>
          <p>
             The Recipe Recommendation System is an intelligent web application
            that suggests suitable recipes based on user preferences,
            ingredients, dietary restrictions, and cooking habits.
          </p>

          <h2>My Contribution</h2>
          <ul>
           <li>Designed UI/UX with recipe cards and search interface.</li>
            <li>Developed responsive frontend using HTML, CSS, JS.</li>
            <li>Created ingredient-based filtering & recipe detail pages.</li>
            <li>Worked on documentation & presentation.</li>
          </ul>

          <a href="/" className="back-btn">← Back to Portfolio</a>
        </div>
      </section>
    </>
  );
}
