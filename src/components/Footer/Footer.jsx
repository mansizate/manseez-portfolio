import {
  FaGithub,
  FaLinkedinIn,
  FaInstagram,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

import "./Footer.css";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">

      <div className="footer-container">

        {/* CONTACT */}
        <div className="footer-contact">

          <div className="footer-item">
            <span className="footer-label">
              Email
            </span>

            <a href="mailto:your-email@gmail.com">
              mansizate@gmail.com
            </a>
          </div>

          <div className="footer-item location">
            <span className="footer-label">
              Location
            </span>

            <p>
              Chhatrapati Sambhajinagar,
              <br />
              Maharashtra, India
            </p>
          </div>

        </div>


        {/* SOCIAL */}
        <div className="footer-social">

          <span className="footer-label">
            Social
          </span>

          <a
            href="https://github.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaGithub />
            <span>GitHub</span>
            <b>↗</b>
          </a>

          <a
            href="https://linkedin.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaLinkedinIn />
            <span>LinkedIn</span>
            <b>↗</b>
          </a>

          <a
            href="https://x.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaXTwitter />
            <span>X / Twitter</span>
            <b>↗</b>
          </a>

          <a
            href="https://instagram.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaInstagram />
            <span>Instagram</span>
            <b>↗</b>
          </a>

        </div>

      </div>


      {/* BOTTOM BAR */}
      <div className="footer-bottom">

        <p>
          © {year} Mansi Subhash Rajashri Zate. All Rights Reserved.
        </p>

        <a
          href="#home"
          className="back-top"
        >
          BACK TO TOP
          <span>↑</span>
        </a>

      </div>

    </footer>
  );
}