"use client";

import "./style.scss";

const CommandInfoContainer = ({ commandType }) => {
  if (!commandType) return null;

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
                <span className="command-info__label">Роль:</span> Full Stack Developer
              </p>
            </div>
            <div className="command-info__section">
              <p className="command-info__label">Биография:</p>
              <p className="command-info__text">
                Я разработчик, специализирующийся на создании современных веб-приложений. 
                Увлекаюсь созданием интерактивных пользовательских интерфейсов и разработкой 
                эффективных backend-решений.
              </p>
            </div>
            <div className="command-info__section">
              <p className="command-info__label">Навыки:</p>
              <ul className="command-info__list">
                <li>JavaScript / TypeScript</li>
                <li>React / Next.js</li>
                <li>Node.js</li>
                <li>HTML / CSS / SCSS</li>
                <li>Git</li>
              </ul>
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
    <div className="command-info-container">
      {renderContent()}
    </div>
  );
};

export default CommandInfoContainer;

