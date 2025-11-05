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
            <div className="command-info__section">
              <div className="command-info__project">
                <p className="command-info__project-title">CMD Portfolio</p>
                <p className="command-info__text">
                  Интерактивное портфолио в стиле командной строки с матричным фоном. 
                  Создано с использованием Next.js и React.
                </p>
                <p className="command-info__tech">
                  <span className="command-info__label">Технологии:</span> Next.js, React, SCSS
                </p>
              </div>
            </div>
            <div className="command-info__section">
              <div className="command-info__project">
                <p className="command-info__project-title">Больше проектов скоро...</p>
              </div>
            </div>
          </div>
        );

      case "contacts":
        return (
          <div className="command-info__content">
            <h3 className="command-info__title">Контакты</h3>
            <div className="command-info__section">
              <p className="command-info__text">
                <span className="command-info__label">Email:</span>{" "}
                <a href="mailto:istam.mamadaliyev@example.com" className="command-info__link">
                  istam.mamadaliyev@example.com
                </a>
              </p>
              <p className="command-info__text">
                <span className="command-info__label">GitHub:</span>{" "}
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="command-info__link">
                  github.com/istam
                </a>
              </p>
              <p className="command-info__text">
                <span className="command-info__label">LinkedIn:</span>{" "}
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="command-info__link">
                  linkedin.com/in/istam
                </a>
              </p>
              <p className="command-info__text">
                <span className="command-info__label">Телефон:</span> +7 (XXX) XXX-XX-XX
              </p>
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

