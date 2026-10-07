import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import "./Portfolio.css";

/*
=========================================================
IMAGE IMPORTS
=========================================================

Portfolio.jsx:
src/components/Portfolio/Portfolio.jsx

Images:
src/assets/work/i1.png
src/assets/work/i2.png
src/assets/work/i3.png

Therefore the correct path is:

../../assets/work/
*/

import ecoImage from "../../assets/work/i1.png";
import getInnImage from "../../assets/work/i2.png";
import recipeImage from "../../assets/work/i3.png";


export default function Portfolio() {

  /* =====================================================
     PROJECT DATA
     ===================================================== */

  const projects = [

    /* =====================================================
       PROJECT 1 - GET INN
       ===================================================== */

    {
      type: "PROJECT RECORD",

      title: "Get Inn",

      subtitle: "Tech That Feeds and Fuels",

      location: "INDIA",

      /*
       IMPORTANT

       The slideshow order is:

       i2.png
       ↓
       i1.png
       ↓
       i2.png
       ↓
       i1.png
       ↓
       continuously
      */

      images: [
        getInnImage,
        ecoImage,
      ],

      points: [
        "Collaborated with a team of 3 to engineer a web platform for restaurant management and food waste tracking.",

        "Delivered 3 core features: restaurant registration, waste tracking, and collection requests.",

        "Connected restaurants and biogas operators to turn food waste into renewable energy.",
      ],

      technologies:
        "Restaurant Management • Food Waste Tracking • Web Platform",

      githubUrl:
        "https://github.com/mansizate/GETinn-Restaurant",
    },


    /* =====================================================
       PROJECT 2 - RECIPE
       ===================================================== */

    {
      type: "PROJECT RECORD",

      title: "Recipe Recommendation",

      subtitle:
        "Recipe Discovery & Recommendation Platform",

      location: "INDIA",

      images: [
        recipeImage,
      ],

      points: [
        "Designed and developed a web application for discovering recipes based on available ingredients.",

        "Implemented recipe search and recommendation functionality.",

        "Created a simple and user-friendly interface for recipe discovery.",
      ],

      technologies:
        "HTML • CSS • JavaScript • PHP • MySQL",

      githubUrl:
        "https://github.com/mansizate/reciperecommandation",
    },

  ];


  /* =====================================================
     STATE
     ===================================================== */

  const [showPopup, setShowPopup] =
    useState(false);

  const [currentProject, setCurrentProject] =
    useState(0);

  /*
   * Current background image.
   *
   * For Get Inn:
   *
   * 0 = i2.png
   * 1 = i1.png
   */

  const [currentImage, setCurrentImage] =
    useState(0);


  const popupRef = useRef(null);


  const project =
    projects[currentProject];


  const projectCount =
    projects.length;


  /* =====================================================
     OPEN POPUP
     ===================================================== */

  const openPopup = () => {

    setCurrentProject(0);

    /*
     * Always start Get Inn with i2.png
     */

    setCurrentImage(0);

    setShowPopup(true);

    document.body.style.overflow =
      "hidden";
  };


  /* =====================================================
     CLOSE POPUP
     ===================================================== */

  const closePopup =
    useCallback(() => {

      setShowPopup(false);

      document.body.style.overflow =
        "";

    }, []);


  /* =====================================================
     NEXT PROJECT
     ===================================================== */

  const nextProject =
    useCallback(() => {

      setCurrentProject((prev) => {

        if (
          prev ===
          projectCount - 1
        ) {
          return 0;
        }

        return prev + 1;

      });

    }, [projectCount]);


  /* =====================================================
     PREVIOUS PROJECT
     ===================================================== */

  const previousProject =
    useCallback(() => {

      setCurrentProject((prev) => {

        if (prev === 0) {

          return (
            projectCount - 1
          );

        }

        return prev - 1;

      });

    }, [projectCount]);


  /* =====================================================
     RESET IMAGE WHEN PROJECT CHANGES
     ===================================================== */

  useEffect(() => {

    setCurrentImage(0);

  }, [currentProject]);


  /* =====================================================
     AUTOMATIC IMAGE SLIDESHOW
     =====================================================

     For Get Inn:

     i2.png
       ↓
     4 seconds
       ↓
     i1.png
       ↓
     4 seconds
       ↓
     i2.png
       ↓
     continuously

  ===================================================== */

  useEffect(() => {

    if (!showPopup) {
      return;
    }

    if (!project.images) {
      return;
    }

    if (project.images.length <= 1) {
      return;
    }

    const imageTimer =
      setInterval(() => {

        setCurrentImage((prev) => {

          return (
            (prev + 1) %
            project.images.length
          );

        });

      }, 4000);

    return () => {

      clearInterval(imageTimer);

    };

  }, [
    showPopup,
    currentProject,
    project.images,
  ]);


  /* =====================================================
     KEYBOARD CONTROLS
     ===================================================== */

  useEffect(() => {

    if (!showPopup) {
      return;
    }

    const handleKeyDown =
      (event) => {

        if (
          event.key === "Escape"
        ) {

          closePopup();

        }

        if (
          event.key === "ArrowRight"
        ) {

          nextProject();

        }

        if (
          event.key === "ArrowLeft"
        ) {

          previousProject();

        }

      };


    window.addEventListener(
      "keydown",
      handleKeyDown
    );


    return () => {

      window.removeEventListener(
        "keydown",
        handleKeyDown
      );

    };

  }, [
    showPopup,
    closePopup,
    nextProject,
    previousProject,
  ]);


  /* =====================================================
     TOUCH / SWIPE
     ===================================================== */

  useEffect(() => {

    const popup =
      popupRef.current;

    if (
      !showPopup ||
      !popup
    ) {

      return;

    }


    let startX = 0;

    let startY = 0;


    const handlePointerDown =
      (event) => {

        startX =
          event.clientX;

        startY =
          event.clientY;

      };


    const handlePointerUp =
      (event) => {

        const endX =
          event.clientX;

        const endY =
          event.clientY;


        const differenceX =
          startX - endX;

        const differenceY =
          startY - endY;


        /*
         * Ignore vertical movement
         */

        if (
          Math.abs(
            differenceX
          ) < 50 ||
          Math.abs(
            differenceX
          ) <
            Math.abs(
              differenceY
            )
        ) {

          return;

        }


        /*
         * Swipe LEFT
         * = NEXT PROJECT
         */

        if (
          differenceX > 0
        ) {

          nextProject();

        }


        /*
         * Swipe RIGHT
         * = PREVIOUS PROJECT
         */

        if (
          differenceX < 0
        ) {

          previousProject();

        }

      };


    popup.addEventListener(
      "pointerdown",
      handlePointerDown
    );

    popup.addEventListener(
      "pointerup",
      handlePointerUp
    );


    return () => {

      popup.removeEventListener(
        "pointerdown",
        handlePointerDown
      );

      popup.removeEventListener(
        "pointerup",
        handlePointerUp
      );

    };

  }, [
    showPopup,
    nextProject,
    previousProject,
  ]);


  /* =====================================================
     CLEAN BODY SCROLL
     ===================================================== */

  useEffect(() => {

    return () => {

      document.body.style.overflow =
        "";

    };

  }, []);


  /* =====================================================
     CURRENT IMAGE
     ===================================================== */

  const activeImage =
    project.images?.[
      currentImage
    ] || null;


  /* =====================================================
     RETURN
     ===================================================== */

  return (
    <>

      {/* =================================================
          MY WORK SECTION
          ================================================= */}

      <section
        className="portfolio"
        id="portfolio"
      >

        <div className="editorial-card">

          {/* PAPERCLIP */}

          <div
            className="paperclip"
            aria-hidden="true"
          >
            <span></span>
          </div>


          {/* INNER CARD */}

          <div className="editorial-inner">

            <p className="portfolio-label">
              PROFESSIONAL WORK
            </p>


            <h2 className="work-title">
              My Work
            </h2>


            <p className="work-intro">
              Turning ideas into meaningful
              digital experiences.
            </p>


            <button
              type="button"
              className="portfolio-toggle"
              onClick={openPopup}
            >

              EXPLORE MY PROJECTS

              <span className="button-arrow">
                →
              </span>

            </button>

          </div>

        </div>

      </section>


      {/* =================================================
          PROJECT POPUP
          ================================================= */}

      {showPopup && (

        <div
          className="project-modal"
          onClick={closePopup}
        >

          <div
            ref={popupRef}
            className="project-popup"

            onClick={(event) => {

              event.stopPropagation();

            }}
          >


            {/* =================================================
                BACKGROUND IMAGE 1
                ================================================= */}

            <div
              className={`project-background-image ${
                currentImage === 0
                  ? "active"
                  : ""
              }`}
              style={{
                backgroundImage:
                  `url("${project.images[0]}")`,
              }}
              aria-hidden="true"
            />


            {/* =================================================
                BACKGROUND IMAGE 2
                ================================================= */}

            {project.images.length >
              1 && (

              <div
                className={`project-background-image image-two ${
                  currentImage === 1
                    ? "active"
                    : ""
                }`}
                style={{
                  backgroundImage:
                    `url("${project.images[1]}")`,
                }}
                aria-hidden="true"
              />

            )}


            {/* =================================================
                DARK OVERLAY
                ================================================= */}

            <div
              className="project-background-overlay"
              aria-hidden="true"
            />


            {/* =================================================
                CONTENT
                ================================================= */}

            <div className="project-popup-content">


              {/* =================================================
                  HEADER
                  ================================================= */}

              <div className="record-header">


                {/* BACK */}

                <button
                  type="button"
                  className="back-button"
                  onClick={closePopup}
                >

                  <span>
                    ←
                  </span>

                  BACK

                </button>


                {/* COUNTER */}

                <div className="record-counter">

                  {String(
                    currentProject + 1
                  ).padStart(
                    2,
                    "0"
                  )}

                  {" / "}

                  {String(
                    projectCount
                  ).padStart(
                    2,
                    "0"
                  )}

                </div>


                {/* NAVIGATION */}

                <div className="record-navigation">


                  <button
                    type="button"
                    aria-label="Previous project"
                    onClick={
                      previousProject
                    }
                  >
                    ←
                  </button>


                  <button
                    type="button"
                    aria-label="Next project"
                    onClick={
                      nextProject
                    }
                  >
                    →
                  </button>


                </div>

              </div>


              {/* =================================================
                  DIVIDER
                  ================================================= */}

              <div className="record-divider"></div>


              {/* =================================================
                  PROJECT CONTENT
                  ================================================= */}

              <div
                className="record-content"
                key={currentProject}
              >


                {/* TAG */}

                <div className="record-tag">

                  {project.type}

                </div>


                {/* TITLE */}

                <h2 className="record-title">

                  {project.title}

                </h2>


                {/* SUBTITLE */}

                <h3 className="record-company">

                  {project.subtitle}

                </h3>


                {/* LOCATION */}

                <div className="record-meta">

                  <span>

                    <span className="meta-icon">
                      ♦
                    </span>

                    {project.location}

                  </span>

                </div>


                {/* DESCRIPTION */}

                <ul className="record-points">

                  {project.points.map(
                    (
                      point,
                      index
                    ) => (

                      <li
                        key={index}
                      >
                        {point}
                      </li>

                    )
                  )}

                </ul>


                {/* FOCUS */}

                <div className="record-technologies">

                  <strong>
                    Focus:
                  </strong>

                  {" "}

                  {project.technologies}

                </div>


                {/* GITHUB */}

                <div className="record-link">

                  <a
                    href={
                      project.githubUrl
                    }

                    target="_blank"

                    rel="noopener noreferrer"

                    onClick={(event) => {

                      event.stopPropagation();

                    }}
                  >

                    View GitHub

                  </a>

                </div>

              </div>

            </div>

          </div>

        </div>

      )}

    </>
  );
}