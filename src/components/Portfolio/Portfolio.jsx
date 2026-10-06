
import work2 from "../../assets/work/i2.png";
import work3 from "../../assets/work/i3.png";
import "./Portfolio.css";

export default function Portfolio() {
  const projects = [
    { title: "Get-Inn", desc: "Tech that feeds and fuel", link: "/projects/get-inn", image: work2 },
    { title: "Recipe Recommendation System", desc: "Find flavors that fit you.", link: "/projects/recipe", image: work3 },
  ];

  return (
    <section className="portfolio editorial-section" id="portfolio">
      <div className="editorial-card">
        <div className="editorial-tabs" aria-hidden="true">
          <span className="tab tab-yellow">PROJECTS</span>
          <span className="tab tab-pink">SELECTED WORK</span>
        </div>
        <div className="section-title">
          <p className="eyebrow">A selection of my work</p>
          <h2>My <span>Work</span></h2>
        </div>
        <div className="portfolio-container">
          {projects.map((project) => (
            <article className="portfolio-item" key={project.title}>
              <div className="portfolio-thumb"><img src={project.image} alt={project.title} /></div>
              <div className="portfolio-layer">
                <h3>{project.title}</h3><p>{project.desc}</p>
                <a href={project.link} target="_blank" rel="noreferrer">View</a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
