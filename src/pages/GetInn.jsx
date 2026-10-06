import { useState, useEffect } from "react";


import img0 from "../assets/getinn/a.png";
import img1 from "../assets/getinn/b.jpeg";
import img2 from "../assets/getinn/c.jpeg";
import img3 from "../assets/getinn/d.jpeg";
import img4 from "../assets/getinn/e.png";
import img5 from "../assets/getinn/f.png";
import img6 from "../assets/getinn/g.png";


export default function GetInn() {
  const images = [img0, img1, img2, img3, img4, img5, img6,];
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
        <h1 className="project-title">GET-INN — Tech That Feeds & Fuels</h1>

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
            GET-INN is a digital restaurant management system designed to modernize
            food ordering, reduce operational errors, and minimize food waste. Traditional
            handwritten order methods cause delays, miscommunication, and customer
            dissatisfaction. GET-INN replaces this with a fast, accurate, and automated
            workflow. The system allows customers to browse menus, place orders, book
            tables, and make secure payments online, while staff can track orders,
            manage inventory, and monitor waste generation in real time. The project
            also integrates food waste tracking and Waste-to-Energy concepts to promote
            sustainability and reduce environmental impact.
          </p>

          <h2>My Contribution</h2>
          <ul>
            <li>Designed clean, responsive, and user-friendly web pages.</li>
            <li>Developed the frontend using HTML, CSS, JavaScript and use the canva templates</li>
            <li>Created pages for menu, ordering system, Eco-Regen panel, and dashboards.</li>
            <li>Improved navigation, UI flow, and user experience.</li>
            <li>Integrated project data, images, and waste-tracking interfaces.</li>
            <li>Collaborated with team to structure system modules and present project online.</li>
          </ul>

          <a href="/" className="back-btn">← Back to Portfolio</a>
        </div>
      </section>
    </>
  );
}
