import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../about.css";
const About = () => {
  const navigate = useNavigate();
  const [animatedSections, setAnimatedSections] = useState(new Set());
  const [counters, setCounters] = useState({
    users: 0,
    cards: 0,
    countries: 0,
    satisfaction: 0,
  });
  const sectionsRef = useRef([]);

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -100px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const section = entry.target.dataset.section;
          setAnimatedSections((prev) => new Set([...prev, section]));

          // Start counter animation for stats section
          if (section === "stats") {
            animateCounters();
          }
        }
      });
    }, observerOptions);

    // Observe all sections with a small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      sectionsRef.current.forEach((section, index) => {
        if (section) {
          console.log(`Observing section ${index}:`, section.dataset.section);
          observer.observe(section);
        }
      });
    }, 100);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, []);

  const animateCounters = () => {
    const targets = {
      users: 50000,
      cards: 125000,
      countries: 85,
      satisfaction: 98,
    };
    const duration = 2000; // 2 seconds
    const steps = 60;
    const stepDuration = duration / steps;

    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;

      setCounters({
        users: Math.floor(targets.users * progress),
        cards: Math.floor(targets.cards * progress),
        countries: Math.floor(targets.countries * progress),
        satisfaction: Math.floor(targets.satisfaction * progress),
      });

      if (currentStep >= steps) {
        clearInterval(timer);
        setCounters(targets);
      }
    }, stepDuration);
  };

  const teamMembers = [
    {
      name: "Rajesh Prajapat",
      role: "Engineer (IT)",
      image: "👩‍💼",
      bio: "Full-stack developer and AI enthusiast.Previously at BISPL and Accenture, building scalable platforms. ",
      // bio: "Former tech executive with 15+ years in digital innovation. Passionate about sustainable business solutions.",
      linkedin: "https://www.linkedin.com/in/rajeshprajapat/",
    },
    // {
    //   name: "David Chen",
    //   role: "CTO & Co-Founder",
    //   image: "👨‍💻",
    //   bio: "Full-stack developer and AI enthusiast. Previously at Google and Microsoft, building scalable platforms.",
    //   linkedin: "#",
    // },
    // {
    //   name: "Emma Rodriguez",
    //   role: "Head of Design",
    //   image: "👩‍🎨",
    //   bio: "Award-winning UX designer focused on creating intuitive, beautiful experiences that users love.",
    //   linkedin: "#",
    // },
    // {
    //   name: "Michael Thompson",
    //   role: "VP of Marketing",
    //   image: "👨‍💼",
    //   bio: "Growth marketing expert who has helped scale multiple startups from zero to millions of users.",
    //   linkedin: "#",
    // },
  ];

  const values = [
    {
      icon: "🌱",
      title: "Sustainability",
      description:
        "We're committed to reducing paper waste and creating eco-friendly digital solutions for a greener future.",
    },
    {
      icon: "🚀",
      title: "Innovation",
      description:
        "Constantly pushing boundaries with cutting-edge technology to deliver the best user experience possible.",
    },
    {
      icon: "🤝",
      title: "Trust",
      description:
        "Your data security and privacy are our top priorities. We believe in transparent, honest relationships.",
    },
    {
      icon: "🎯",
      title: "Excellence",
      description:
        "We strive for perfection in every detail, from design to functionality to customer support.",
    },
  ];

  const milestones = [
    {
      year: "2020",
      title: "Company Founded",
      description: "Started with a simple idea to digitize business cards",
    },
    {
      year: "2021",
      title: "First 1K Users",
      description: "Reached our first major milestone during the pandemic",
    },
    {
      year: "2022",
      title: "Global Expansion",
      description: "Launched in 50+ countries worldwide",
    },
    {
      year: "2023",
      title: "AI Integration",
      description: "Added smart design suggestions and analytics",
    },
    {
      year: "2024",
      title: "50K+ Users",
      description: "Growing community of professionals worldwide",
    },
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="hero-about">
        <div className="floating-shapes">
          <div className="shape">📇</div>
          <div className="shape">💼</div>
          <div className="shape">🌐</div>
        </div>
        <div className="container">
          <div className="row">
            <div className="col-lg-8 mx-auto text-center hero-content">
              <h1
                ref={(el) => (sectionsRef.current[0] = el)}
                data-section="hero"
                className={`hero-title ${
                  animatedSections.has("hero") ? "animated" : ""
                }`}
              >
                Revolutionizing Professional Networking
              </h1>
              <p
                className={`hero-subtitle ${
                  animatedSections.has("hero") ? "animated" : ""
                }`}
              >
                We're on a mission to transform how professionals connect and
                share their identity in the digital age. Join thousands of users
                who've already made the switch to sustainable, smart business
                cards.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section ">
        <div className="container">
          <h2
            ref={(el) => (sectionsRef.current[1] = el)}
            data-section="story"
            className={`my-5 section-title ${
              animatedSections.has("story") ? "animated" : ""
            }`}
          >
            Our ambitious goals for the year ahead
          </h2>
          <div
            ref={(el) => (sectionsRef.current[2] = el)}
            data-section="stats"
            className="row"
          >
            <div className="col-lg-3 col-md-6">
              <div
                className={`stat-card ${
                  animatedSections.has("stats") ? "animated" : ""
                }`}
              >
                <div className="stat-number">
                  {counters.users.toLocaleString()}+
                </div>
                <div className="stat-label">Happy Users</div>
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <div
                className={`stat-card ${
                  animatedSections.has("stats") ? "animated" : ""
                }`}
                style={{ transitionDelay: "0.1s" }}
              >
                <div className="stat-number">
                  {counters.cards.toLocaleString()}+
                </div>
                <div className="stat-label">Cards Created</div>
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <div
                className={`stat-card ${
                  animatedSections.has("stats") ? "animated" : ""
                }`}
                style={{ transitionDelay: "0.2s" }}
              >
                <div className="stat-number">{counters.countries}+</div>
                <div className="stat-label">Countries</div>
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <div
                className={`stat-card ${
                  animatedSections.has("stats") ? "animated" : ""
                }`}
                style={{ transitionDelay: "0.3s" }}
              >
                <div className="stat-number">{counters.satisfaction}%</div>
                <div className="stat-label">Satisfaction Rate</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="about-section section-padding">
        <div className="container">
          <div className="row">
            <div className="col-lg-8 mx-auto">
              <h2
                ref={(el) => (sectionsRef.current[3] = el)}
                data-section="story"
                className={`section-title ${
                  animatedSections.has("story") ? "animated" : ""
                }`}
              >
                Our Story
              </h2>
              <p
                className={`section-subtitle ${
                  animatedSections.has("story") ? "animated" : ""
                }`}
              >
                Born from a simple idea to make networking more sustainable and
                efficient
              </p>
              <div
                className={`story-content ${
                  animatedSections.has("story") ? "animated" : ""
                }`}
              >
                <p>
                  In 2020, during the height of the global pandemic, we realized
                  how outdated traditional business cards had become. People
                  were avoiding physical contact, yet still needed to share
                  their professional information effectively. That's when we had
                  our "aha moment" - what if we could create something better?
                </p>
                <p>
                  Our Co-founders, Dipankar Sharma and Vibhakar Sharma, combined
                  their expertise in business strategy and technology to create
                  a platform that would not only solve the immediate problem but
                  also address the long-term environmental impact of paper waste
                  in the business world. What started as a weekend project
                  quickly grew into a global movement.
                </p>
                <p>
                  Today, we're proud to serve professionals from startups to
                  Fortune 500 companies, helping them make meaningful
                  connections while reducing their environmental footprint.
                  Every digital card created on our platform saves trees and
                  creates opportunities for more dynamic, trackable professional
                  interactions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="section-padding" style={{ background: "#f8f9fa" }}>
        <div className="container">
          <h2
            ref={(el) => (sectionsRef.current[4] = el)}
            data-section="values"
            className={`section-title ${
              animatedSections.has("values") ? "animated" : ""
            }`}
          >
            Our Values
          </h2>
          <p
            className={`section-subtitle ${
              animatedSections.has("values") ? "animated" : ""
            }`}
          >
            The principles that guide everything we do
          </p>

          <div className="values-grid">
            {values?.map((value, index) => (
              <div
                key={index}
                className={`value-card ${
                  animatedSections.has("values") ? "animated" : ""
                }`}
                style={{ transitionDelay: `${index * 0.1}s` }}
              >
                <span className="value-icon">{value.icon}</span>
                <h3 className="value-title">{value.title}</h3>
                <p className="value-description">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="about-section section-padding">
        <div className="container">
          <h2
            ref={(el) => (sectionsRef.current[5] = el)}
            data-section="team"
            className={`section-title ${
              animatedSections.has("team") ? "animated" : ""
            }`}
          >
            Meet Our Team
          </h2>
          <p
            className={`section-subtitle ${
              animatedSections.has("team") ? "animated" : ""
            }`}
          >
            The passionate people behind the platform
          </p>

          <div className="team-grid">
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className={`team-card ${
                  animatedSections.has("team") ? "animated" : ""
                }`}
                style={{ transitionDelay: `${index * 0.1}s` }}
              >
                <div className="team-avatar">{member.image}</div>
                <div className="team-info">
                  <h3 className="team-name">{member.name}</h3>
                  <p className="team-role">{member.role}</p>
                  <p className="team-bio">{member.bio}</p>
                  <a
                    onClick={() => {
                      navigate(member.linkedin);
                    }}
                    target="_blank"
                    className="team-social"
                    rel="noreferrer"
                  >
                    💼 Connect on LinkedIn
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      {/* <section className="section-padding" style={{ background: "#f8f9fa" }}>
        <div className="container">
          <h2
            ref={(el) => (sectionsRef.current[6] = el)}
            data-section="timeline"
            className={`section-title ${
              animatedSections.has("timeline") ? "animated" : ""
            }`}
          >
            Our Journey
          </h2>
          <p
            className={`section-subtitle ${
              animatedSections.has("timeline") ? "animated" : ""
            }`}
          >
            Key milestones in our growth story
          </p>

          <div className="timeline">
            {milestones.map((milestone, index) => (
              <div
                key={index}
                className={`timeline-item ${
                  animatedSections.has("timeline") ? "animated" : ""
                }`}
                style={{ transitionDelay: `${index * 0.2}s` }}
              >
                <div className="timeline-content">
                  <h3 className="timeline-title">{milestone.title}</h3>
                  <p className="timeline-description">
                    {milestone.description}
                  </p>
                </div>
                <div className="timeline-year">{milestone.year}</div>
              </div>
            ))}
          </div>
        </div>
      </section> */}
    </>
  );
};

export default About;
