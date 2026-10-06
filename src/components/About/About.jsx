import "./About.css";
import {
  GraduationCap,
  BriefcaseBusiness,
  Code2,
  Monitor,
} from "lucide-react";

export default function About() {
  return (
    <section className="about editorial-section" id="about">
      <div className="editorial-card">

        {/* About Tab */}
        <div className="editorial-tabs" aria-hidden="true">
          <span className="tab tab-pink">ABOUT</span>
        </div>

        {/* Section Heading */}
        <div className="section-title">
          <p className="eyebrow">A little about me</p>

          <h2>
            About <span>Me</span>
          </h2>
        </div>

        {/* About Content */}
        <div className="about-content">

          {/* About Text */}
          <div className="about-text">


            <h3>Building, Learning &amp; Growing as a Software Engineer</h3>

            <p className="about-description">
              I'm a recently graduated Computer Science Engineering student and
              a passionate entry-level Software Engineer beginning my journey
              in the software industry. During my internships, I had the
              opportunity to work on real-world web applications using
              React.js, JavaScript, Java, PHP, SQL, and REST APIs. I enjoy
              building clean and responsive interfaces, solving technical
              problems, and learning how different technologies come together
              to create useful products. As a fresh graduate, I'm excited to
              start my career, contribute to a collaborative team, learn from
              experienced developers, and continuously grow my skills while
              building meaningful digital experiences.
            </p>

            {/* Highlights */}
            <div className="about-highlights">

              <div className="highlight-item">
                <GraduationCap size={17} strokeWidth={1.7} />
                <span>CSE Graduate</span>
              </div>

              <div className="highlight-item">
                <BriefcaseBusiness size={17} strokeWidth={1.7} />
                <span>3 Internships</span>
              </div>

                         </div>
          </div>

          {/* About Video */}
          <div className="about-video-column">
            <video
              className="about-video"
              src="public/videos/InShot_20260613_200502811 (1).mp4"
              autoPlay
              muted
              loop
              playsInline
              controls={false}
              aria-label="About Mansi Zate"
            />
          </div>

        </div>
      </div>
    </section>
  );
}