import {
  FaHtml5,
  FaCss3Alt,
  FaJs,
  FaReact,
  FaPython,
  FaGithub,
  FaGitAlt,
  FaTools,
  FaRobot,
  FaPalette,
  FaJava,
  FaPhp
} from "react-icons/fa";

import { SiC } from "react-icons/si";
import { SiSpringboot } from "react-icons/si"

import "./Skills.css";

export default function Skills() {
  return (
    <section className="skills editorial-section" id="skills">
      <div className="editorial-card">

        {/* Tabs */}
        <div className="editorial-tabs" aria-hidden="true">
          <span className="tab tab-blue">SKILLS</span>
          <span className="tab tab-yellow">TOOLKIT</span>
        </div>

        {/* Section Title */}
        <div className="section-title">
          <p className="eyebrow">Things I work with</p>

          <h2>
            My <span>Skills</span>
          </h2>

          <p className="skills-subtitle">
            Programming languages, tools, and technologies I use to build
            amazing things!
          </p>
        </div>

        {/* Skills Grid */}
        <div className="skills-grid">

          {/* Programming */}
          <div className="skill-card">
            <h3>Programming</h3>

            <div className="skill-icons">
                <FaJava
                className="skill-icon"
                aria-label="Java"
                title="java"
              />

              <FaPython
                className="skill-icon"
                aria-label="Python"
                title="Python"
              />

              <SiC
                className="skill-icon"
                aria-label="C"
                title="C"
              />
            </div>
          </div>

          {/* Web Development */}
          <div className="skill-card">
            <h3>Full stack development</h3>

            <div className="skill-icons">
              <FaHtml5
                className="skill-icon"
                aria-label="HTML5"
                title="HTML5"
              />

              <FaCss3Alt
                className="skill-icon"
                aria-label="CSS3"
                title="CSS3"
              />

              <FaJs
                className="skill-icon"
                aria-label="JavaScript"
                title="JavaScript"
              />

              <FaReact
                className="skill-icon"
                aria-label="React"
                title="React"
              />
                <SiSpringboot
                className="skill-icon"
                aria-label="springboot"
                title="springboot"
              />
               <FaPhp
                className="skill-icon"
                aria-label="PHP"
                title="PHP"
              />
            </div>
          </div>

          {/* Tools */}
          <div className="skill-card">
            <h3>Tools</h3>

            <div className="skill-icons">
              <FaPalette
                className="skill-icon"
                aria-label="Canva"
                title="Canva"
              />

              <FaGithub
                className="skill-icon"
                aria-label="GitHub"
                title="GitHub"
              />

              <FaGitAlt
                className="skill-icon"
                aria-label="Git"
                title="Git"
              />

              <FaTools
                className="skill-icon"
                aria-label="Tools"
                title="Tools"
              />

              <FaRobot
                className="skill-icon"
                aria-label="AI Tools"
                title="AI Tools"
              />
            </div>
          </div>

          {/* Soft Skills */}
          <div className="skill-card">
            <h3>Soft Skills</h3>

            <ul className="soft-skill-list">
              <li>Teamwork</li>
              <li>Communication</li>
              <li>Problem Solving</li>
              <li>Time Management</li>
            </ul>
          </div>

        </div>
      </div>
    </section>
  );
}