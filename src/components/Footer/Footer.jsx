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
<a
  href="https://mail.google.com/mail/?view=cm&fs=1&to=mansizate@gmail.com"
  target="_blank"
  rel="noopener noreferrer"
>
  mansizate@gmail.com
</a></div>

          <div className="footer-item location">
            <span className="footer-label">
              Location
            </span>

            <p>
              Pune
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

  {/* GitHub */}
  <a
    href="https://github.com/mansizate"
    target="_blank"
    rel="noopener noreferrer"
  >
    <FaGithub />
    <span>GitHub</span>
    <b>↗</b>
  </a>

  {/* LinkedIn */}
  <a
    href="https://www.linkedin.com/in/mansee-zate/"
    target="_blank"
    rel="noopener noreferrer"
  >
    <FaLinkedinIn />
    <span>LinkedIn</span>
    <b>↗</b>
  </a>

  {/* X / Twitter */}
  <a
    href="https://x.com/manseeez"
    target="_blank"
    rel="noopener noreferrer"
  >
    <FaXTwitter />
    <span>X / Twitter</span>
    <b>↗</b>
  </a>

  {/* Instagram */}
  <a
    href="https://www.instagram.com/manseez_/"
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