"use client";

import { useState, useEffect } from "react";
import "./style.scss";

const CommandInfoContainer = ({ commandType }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState({});

  const skillsCategories = [
    {
      id: "languages",
      name: "Languages",
      icon: "💻",
      skills: ["JavaScript", "Python", "TypeScript", "HTML5", "CSS3"]
    },
    {
      id: "frontend",
      name: "Frontend",
      icon: "🎨",
      skills: ["React", "Vue.js", "Next.js", "Nuxt.js", "React Native", "Sass", "TailwindCSS"]
    },
    {
      id: "backend",
      name: "Backend & Database",
      icon: "⚙️",
      skills: ["Django", "Node.js", "FastAPI", "PostgreSQL", "MongoDB", "Redis", "SQLite"]
    },
    {
      id: "tools",
      name: "Tools & Cloud",
      icon: "🛠️",
      skills: ["Git", "GitHub", "Docker", "AWS", "Google Cloud", "Figma", "VS Code"]
    }
  ];

  const contactCategories = [
    {
      id: "social",
      title: "Социальные сети",
      items: [
        {
          label: "GitHub",
          url: "https://github.com/Istam0808",
          type: "link"
        },
        {
          label: "Instagram",
          url: "https://instagram.com/istam_ake",
          type: "link"
        },
        {
          label: "LinkedIn",
          url: "https://linkedin.com/in/istam-mamadaliyev",
          type: "link"
        }
      ]
    },
    {
      id: "messengers",
      title: "Мессенджеры",
      items: [
        {
          label: "Telegram",
          url: "https://t.me/istam_ake",
          type: "link"
        }
      ]
    },
    {
      id: "other",
      title: "Другие",
      items: [
        {
          label: "Email",
          value: "istamful@gmail.com",
          url: "mailto:istamful@gmail.com",
          type: "email"
        },
        {
          label: "Телефон",
          value: "+998 91 529 53 37",
          url: "tel:+998915295337",
          type: "phone"
        },
        {
          label: "Телефон",
          value: "+998 33 553 55 11",
          url: "tel:+998335535511",
          type: "phone"
        }
      ]
    }
  ];

  const projects = [
    {
      id: "unit-school",
      title: "Unit School",
      description: "Веб-приложение для образовательной платформы.",
      technologies: ["React", "Node.js", "PostgreSQL"],
      image: "/imgs/projects/Unit_School.png",
      url: "https://www.unit-school.uz/"
    },
    {
      id: "sv-school",
      title: "Social Video Save",
      description: "Платформа для скачивания видео и музыки из YouTube и Instagram.",
      technologies: ["Vue.js", "Django", "MongoDB"],
      image: "/imgs/projects/SV_S.png",
      url: "https://socialvideosaver.vercel.app/"
    },
    {
      id: "cnc",
      title: "CNC",
      description: "Онлайн магазин электротехники.",
      technologies: ["React", "FastAPI", "PostgreSQL"],
      image: "/imgs/projects/сnс.jpg",
      url: "https://cnc-project.vercel.app/"
    },
    {
      id: "SIC",
      title: "SAMARKAND INVEST COMPANY",
      description: "Инвестиционная платформа в Самарканде.",
      technologies: ["React", "FastAPI", "PostgreSQL"],
      image: "/imgs/projects/SIC.png",
      url: "https://sic-ao-lake.vercel.app/ru"
    }
  ];

  useEffect(() => {
    if (commandType) {
      setShouldRender(true);
      // Небольшая задержка для применения стилей перед анимацией
      setTimeout(() => setIsVisible(true), 10);
    } else {
      setIsVisible(false);
      // Ждем окончания анимации перед удалением из DOM
      const timer = setTimeout(() => setShouldRender(false), 300);
      return () => clearTimeout(timer);
    }
  }, [commandType]);

  const toggleCategory = (categoryId) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  if (!shouldRender) return null;

  const renderContent = () => {
    switch (commandType) {
      case "about":
        return (
          <div className="command-info__content">
            <h3 className="command-info__title">Обо мне</h3>
            <div className="command-info__section">
              <p className="command-info__text">
                <span className="command-info__label">Имя:</span> Istam Mamadaliyev
              </p>
              <p className="command-info__text">
                <span className="command-info__label">Роль:</span> Full-Stack разработчик | Веб-приложения и Telegram-боты, которые решают бизнес-задачи 🚀
              </p>
            </div>
            <div className="command-info__section">
              <p className="command-info__label">Биография:</p>
              <p className="command-info__text">
                Создаю полнофункциональные веб-приложения и Telegram-боты для автоматизации и развития бизнеса. От идеи до запуска — вы получаете готовое решение, а не часть проекта.
              </p>
            </div>
            <div className="command-info__section">
              <p className="command-info__label">Навыки:</p>
              <div className="command-info__skills">
                {skillsCategories.map((category) => (
                  <div key={category.id} className="command-info__skill-category">
                    <div 
                      className="command-info__skill-header"
                      onClick={() => toggleCategory(category.id)}
                    >
                      <span className="command-info__skill-arrow">
                        {expandedCategories[category.id] ? "▼" : "▶"}
                      </span>
                      <span className="command-info__skill-name">
                        {category.icon} {category.name}
                      </span>
                    </div>
                    {expandedCategories[category.id] && (
                      <div className="command-info__skill-items">
                        {category.skills.map((skill, index) => (
                          <div key={index} className="command-info__skill-item">
                            {skill}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case "project":
        return (
          <div className="command-info__content">
            <h3 className="command-info__title">Проекты</h3>
            <div className="command-info__projects-grid">
              {projects.map((project) => (
                <div key={project.id} className="command-info__project-card">
                  {project.image && (
                    <div className="command-info__project-image-wrapper">
                      <img 
                        src={project.image} 
                        alt={project.title}
                        className="command-info__project-image"
                      />
                    </div>
                  )}
                  <div className="command-info__project-content">
                    <h4 className="command-info__project-title">{project.title}</h4>
                    <p className="command-info__text">{project.description}</p>
                    <p className="command-info__tech">
                      <span className="command-info__label">Технологии:</span> {project.technologies.join(", ")}
                    </p>
                    {project.url && (
                      <a 
                        href={project.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="command-info__project-link"
                      >
                        Посмотреть проект →
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case "contacts":
        return (
          <div className="command-info__content">
            <h3 className="command-info__title">Контакты</h3>
            <div className="command-info__contacts">
              {contactCategories.map((category) => (
                <div key={category.id} className="command-info__contact-category">
                  <h4 className="command-info__contact-category-title">{category.title}</h4>
                  <div className="command-info__contact-items">
                    {category.items.map((item, index) => (
                      <p key={index} className="command-info__text">
                        <span className="command-info__label">{item.label}:</span>{" "}
                        {item.type === "link" || item.type === "email" ? (
                          <a
                            href={item.url}
                            target={item.type === "link" ? "_blank" : undefined}
                            rel={item.type === "link" ? "noopener noreferrer" : undefined}
                            className="command-info__link"
                          >
                            {item.value || item.url.replace(/^https?:\/\//, "").replace(/^mailto:/, "")}
                          </a>
                        ) : (
                          <a href={item.url} className="command-info__link">
                            {item.value}
                          </a>
                        )}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`command-info-container ${isVisible ? 'command-info-container--visible' : 'command-info-container--hidden'}`}>
      {renderContent()}
    </div>
  );
};

export default CommandInfoContainer;

