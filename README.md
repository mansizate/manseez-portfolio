# Mansi Zate - Portfolio

Hi, I'm Mansi Zate, a Computer Science Engineering graduate interested in software and web development.

This repository contains my personal portfolio website, showcasing my projects, technologies, internship experience, and learning journey.

## About Me

I enjoy building websites and web applications and solving problems when something doesn't work as expected.

During my internships, I worked on live websites and applications, gaining experience in frontend development, responsive design, debugging, website maintenance, and backend/API development.

I'm currently focusing on improving my skills in Java, Spring Boot, React.js, REST APIs, and MySQL.

## Skills

### Programming
- Java
- Python
- C
- JavaScript
- PHP
- SQL

### Frontend
- React.js
- HTML5
- CSS3
- Bootstrap
- Responsive Web Design

### Backend
- Java
- Spring Boot
- PHP
- REST APIs
- CRUD Operations

### Database
- MySQL
- SQL

### Tools
- Git
- GitHub
- VS Code
- Postman

## Projects

### GETinn - Tech That Feeds and Fuels

A web platform designed to connect restaurants with biogas operators and help manage food waste.

Features:
- Restaurant registration
- Food waste tracking
- Collection requests
- Restaurant and biogas operator workflows

### Recipe Recommendation System

A web application that helps users discover recipes based on available ingredients and preferences.

Features:
- Recipe search
- User preferences
- Recipe management

## Experience

### Software Engineering Intern — Infostrategy Technologies LLP

Worked on a live biodata platform, contributing to responsive templates, frontend development, debugging, and application improvements.

### IT Intern — Flyer Renewable Energy Infrastructure Pvt. Ltd.

Worked on the company's WordPress website, including website maintenance, content updates, and troubleshooting.

### Web Development Intern — Infostrategy Technologies LLP

Contributed to a live matrimonial website through frontend improvements, feature development, and troubleshooting.

## Education

**B.Tech in Computer Science Engineering**

Deogiri Institute of Engineering and Management Studies  
2023–2026

## Achievement

**Top 20 Finalist — InnoHack, VIT Pune**

## Portfolio

[Visit my portfolio](https://manseez-portfolio.netlify.app/)

## Connect

- **LinkedIn:** [Mansi Zate](https://www.linkedin.com/in/mansee-zate/)
- **GitHub:** [mansizate](https://github.com/mansizate)
- **Email:** mansizate@gmail.com

## Chat Assistant Setup

The portfolio includes a chat assistant powered by a Django backend.

### Local Development

By default, Vite proxies `/api/chat/` requests to the local Django API at `http://127.0.0.1:8000`.

To use a different backend, set `VITE_API_URL` in your local Vite environment file to the backend origin, without `/api/chat/`. For example:

`VITE_API_URL=https://your-backend-url.onrender.com`

Production builds call the configured API origin directly.

### Backend Environment Variables

Configure these variables in your backend hosting environment, such as Render:

- `SECRET_KEY`
- `GEMINI_API_KEY`
- `GEMINI_MODEL` (optional)

Keep the backend's existing `DEBUG`, allowed-host, CORS, and CSRF origin settings correctly configured for your deployment.

**Security:** Never expose `GEMINI_API_KEY` in frontend code or in any `VITE_*` environment variable. Do not commit secret environment files to GitHub.

### Troubleshooting

If the chat assistant responds slowly or returns a configuration error:

1. Verify that `GEMINI_API_KEY` is valid and configured on the backend.
2. Check the backend deployment logs for errors.
3. Confirm that the frontend is using the correct backend URL.
4. Redeploy or restart the backend after changing environment variables.
5. If the hosting service puts the backend to sleep, its first request may take longer to complete.

---

Thanks for visiting my repository!