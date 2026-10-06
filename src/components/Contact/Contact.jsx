import { Link } from "react-router-dom";
import "./Contact.css";

export default function Contact() {
  return (
    <section className="contact editorial-section" id="contact">
      <div className="cta-wrapper">

        {/* PLAY WITH ME */}
        <Link to="/play" className="cta-box cta-play">
          <span>Play With Me</span>
          <span className="cta-arrow">→</span>
        </Link>

        {/* HIRE ME */}
        <a
          href="mailto:mansizate@gmail.com"
          className="cta-box cta-hire"
        >
          <span>Hire Me</span>
          <span className="cta-arrow">→</span>
        </a>

      </div>
    </section>
  );
}