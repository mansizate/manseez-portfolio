import React from "react";
import {
  UserRound,
  Code2,
  BriefcaseBusiness,
  FileText,
  Mail,
} from "lucide-react";

import "./Home.css";

const Home = () => {
  return (
    <main>
      <div className="home">

        {/* =========================
            Home / Hero Image
        ========================== */}
        <img
          src="/Black Brown Modern Creative Portfolio Presentation.gif"
          alt="Mansi Zate Portfolio"
          className="home-image"
        />

        {/* =========================
            Aesthetic Icon Navigation
        ========================== */}
        <nav className="bottom-icons">

          {/* 1. About Me */}
          <a
            href="#about"
            aria-label="About Me"
            title="About Me"
          >
            <UserRound size={24} />
          </a>

          {/* 2. Skills */}
          <a
            href="#skills"
            aria-label="Skills"
            title="Skills"
          >
            <Code2 size={24} />
          </a>

          {/* 3. Internship / Experience */}
          <a
            href="#experience"
            aria-label="Internship"
            title="Internship"
          >
            <BriefcaseBusiness size={24} />
          </a>

          {/* 4. Resume Download */}
          <a
            href="/document/Mansi_Zate_Resume.pdf"
            download="Mansi_Zate_Resume.pdf"
            aria-label="Download Resume"
            title="Download Resume"
          >
            <FileText size={24} />
          </a>

          {/* 5. Contact */}
          <a
            href="#contact"
            aria-label="Contact"
            title="Contact"
          >
            <Mail size={24} />
          </a>

        </nav>

      </div>
    </main>
  );
};

export default Home;