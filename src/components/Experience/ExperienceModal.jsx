import { useState } from "react";
import { createPortal } from "react-dom";
import { ArrowLeft, ArrowRight, Calendar, MapPin } from "lucide-react";
import "./Experience.css";

const experiences = [
  {
    title: "Web Development Intern",
    company: "Infostrategy Technologies LLP",
    location: "Aurangabad, India",
    period: "Nov 2024 — Dec 2024",
    highlights: [
      "Developed the complete Snehrishta matrimonial website.",
      "Built a responsive, clean, and intuitive user interface.",
      "Improved layout, navigation, and overall user experience.",
      "Ensured compatibility and performance across devices.",
    ],
    link: "https://www.snehrishta.com/",
  },
  {
    title: "IT Intern",
    company: "Flyer Renewable Energy Infrastructure Pvt. Ltd.",
    location: "Aurangabad, India",
    period: "Jan 2026 — Mar 2026",
    highlights: [
      "Worked on practical IT support and internal process improvement.",
      "Contributed to day-to-day digital operations and documentation workflows.",
      "Built a stronger understanding of system reliability, documentation, and productivity.",
    ],
  },
  {
    title: "Software Engineer Intern",
    company: "Infostrategy Technologies LLP",
    location: "Aurangabad, India",
    period: "Jan 2026 — May 2026",
    highlights: [
      "Developed and refined client-facing web solutions with a product mindset.",
      "Collaborated on design implementation and feature delivery for real-world interfaces.",
      "Strengthened front-end engineering, debugging, and iterative improvement skills.",
    ],
  },
];

export default function ExperienceModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentExperience, setCurrentExperience] = useState(0);
  const [direction, setDirection] = useState(1);

  const current = experiences[currentExperience];

  const handleOpen = () => {
    setDirection(1);
    setCurrentExperience(0);
    setIsOpen(true);
  };

  const handleNext = () => {
    setDirection(1);
    setCurrentExperience((prev) => Math.min(prev + 1, experiences.length - 1));
  };

  const handlePrevious = () => {
    setDirection(-1);
    setCurrentExperience((prev) => Math.max(prev - 1, 0));
  };

  const handleBackToCover = () => {
    setIsOpen(false);
    setCurrentExperience(0);
    setDirection(1);
  };

  if (isOpen) {
    return createPortal(
      <div className="exp-modal-overlay" aria-live="polite">
        <div className="experience-file" role="dialog" aria-modal="true" aria-label="Experience details">
          <div className="experience-file-header">
            <button
              className="experience-back-btn"
              onClick={handleBackToCover}
              aria-label="Back to experience"
              type="button"
            >
              <ArrowLeft size={17} />
              <span>Back</span>
            </button>

            <div className="experience-page-indicator">
              {String(currentExperience + 1).padStart(2, "0")} / {String(experiences.length).padStart(2, "0")}
            </div>

            <div className="experience-nav">
              <button
                className="experience-nav-btn"
                onClick={handlePrevious}
                disabled={currentExperience === 0}
                aria-label="Previous experience"
                type="button"
              >
                <ArrowLeft size={16} />
              </button>
              <button
                className="experience-nav-btn"
                onClick={handleNext}
                disabled={currentExperience === experiences.length - 1}
                aria-label="Next experience"
                type="button"
              >
                <ArrowRight size={16} />
              </button>
            </div>
          </div>

          <div
            key={current.title + current.company}
            className={`experience-page experience-page--${direction > 0 ? "next" : "prev"}`}
          >
            <div className="experience-page-tag">Internship record</div>
            <h3>{current.title}</h3>
            <p className="experience-company">{current.company}</p>

            <div className="experience-meta">
              <span>
                <Calendar size={14} /> {current.period}
              </span>
              <span>
                <MapPin size={14} /> {current.location}
              </span>
            </div>

            <ul className="experience-highlights">
              {current.highlights.map((highlight) => (
                <li key={highlight}>{highlight}</li>
              ))}
              {current.link && (
                <li>
                  Live link: <a href={current.link} target="_blank" rel="noreferrer">{current.link}</a>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>,
      document.body,
    );
  }

  return (
    <section className="experience-section" id="experience">
      <div className="experience-cover" aria-label="Professional experience cover">
        <div className="experience-paperclip" aria-hidden="true" />
        <div className="experience-cover-inner">
          <p className="eyebrow">Professional experience</p>
          <h2>Internships &amp; Trainings</h2>
          <div className="experience-cover-stamp">A brief record</div>
          <button className="experience-open-btn" onClick={handleOpen}>
            Internships &amp; Trainings
          </button>
        </div>
      </div>
    </section>
  );
}
