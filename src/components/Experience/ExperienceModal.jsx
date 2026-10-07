import "./Experience.css";

export default function Experience() {
  const experiences = [
    {
      title: "Software Engineer Intern",
      company: "Infostrategy Technologies LLP",
      year: "2026",
      period: "Jan 2026 — May 2026",
      link: "https://freebiodata.online/",
      companyLink:
        "https://www.linkedin.com/company/infostrategy-technologies-llp/posts/?feedView=all",
      description:
        "Built and maintained FreeBioData, a public online biodata generator. Designed 30+ responsive templates and page layouts, resolved debugging tasks, and improved application stability and user experience.",
    },

    {
      title: "IT Intern",
      company: "Flyer Renewable Energy Infrastructure Pvt. Ltd.",
      year: "2026",
      period: "Jan 2026 — Mar 2026",
      link: "https://flyerinfra.com/",
      companyLink: "https://flyerinfra.com/",
      description:
        "Managed and administered the company WordPress website during a three-month internship. Resolved website bugs and updated content across multiple pages while maintaining an accurate and reliable website.",
    },

    {
      title: "Web Development Intern",
      company: "Infostrategy Technologies LLP",
      year: "2024",
      period: "Nov 2024 — Dec 2024",
      link: "https://www.snehrishta.com/",
      companyLink:
        "https://www.linkedin.com/company/infostrategy-technologies-llp/posts/?feedView=all",
      description:
        "Independently developed SnehRishta, a live matrimonial website. Enhanced website functionality and front-end features while analyzing and troubleshooting website issues to improve usability and reliability.",
    },

    {
      title: "Computer Science Engineering",
      company: "Deogiri Institute of Engineering and Management Studies",
      year: "2026",
      period: "2023 — 2026 • SGPA 8.0",
      link: "https://deogiricollege.org/",
      companyLink: "https://deogiricollege.org/",
      description:
        "Completed B.Tech in Computer Science Engineering. Built a strong foundation in Data Structures and Algorithms, Object-Oriented Programming, DBMS, Operating Systems, Computer Networks, and Software Engineering while developing practical web projects.",
    },

    {
      title: "Higher Secondary Education",
      company: "S.B.E.S. College of Science",
      year: "2022",
      period: "H.S.C. • 66.83%",
      link: "https://www.sbscience.org/",
      companyLink: "https://www.sbscience.org/",
      description:
        "Completed Higher Secondary Certificate education with 66.83%, building the academic foundation that led to pursuing Computer Science Engineering at the undergraduate level.",
    },

    {
      title: "Secondary School Education",
      company: "Saraswati Bhuvan Prashala",
      year: "2020",
      period: "S.S.C. • 92.60%",
      link: "https://saraswatibhuvan.org/",
      companyLink: "https://saraswatibhuvan.org/",
      description:
        "Completed Secondary School Certificate education with 92.60%, building the foundation for higher education and the journey toward computer science and technology.",
    },
  ];

  return (
    <section className="experience" id="experience">
      <div className="experience-inner">

        {/* =================================================
            HEADING
        ================================================= */}

        <div className="experience-heading">
          <span>MY JOURNEY</span>

          <h2>
            My Career &amp;
            <br />
            <em>Experience</em>
          </h2>
        </div>


        {/* =================================================
            TIMELINE
        ================================================= */}

        <div className="experience-timeline">

          {/* ONE CONTINUOUS CENTER LINE */}

          <div className="experience-line">
            <div className="experience-line-glow"></div>

            <div className="experience-line-dot"></div>
          </div>


          {/* =================================================
              EXPERIENCE ITEMS
          ================================================= */}

          {experiences.map((item, index) => (
            <article
              className="experience-item"
              key={`${item.title}-${index}`}
            >

              {/* =============================================
                  LEFT SIDE
              ============================================= */}

              <div className="experience-role">

                <h3>{item.title}</h3>

                <a
                  href={item.companyLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {item.company}
                </a>

              </div>


              {/* =============================================
                  CENTER YEAR
              ============================================= */}

              <div className="experience-year">
                <span>{item.year}</span>
              </div>


              {/* =============================================
                  RIGHT SIDE
              ============================================= */}

              <div className="experience-info">

                <small>{item.period}</small>

                <p>{item.description}</p>

                <a
                  className="experience-link"
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Visit →
                </a>

              </div>

            </article>
          ))}

        </div>
      </div>
    </section>
  );
}