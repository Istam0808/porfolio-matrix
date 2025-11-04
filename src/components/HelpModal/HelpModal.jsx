"use client";

import { useEffect, useRef } from "react";
import "./style.scss";

const HelpModal = ({ isOpen, onClose }) => {
  const onCloseRef = useRef(onClose);
  
  // Обновляем ref при изменении onClose
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  // Обработка клавиши ESC для закрытия модального окна
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onCloseRef.current();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="help-modal" onClick={onClose}>
      <div className="help-modal__content" onClick={(e) => e.stopPropagation()}>
        <div className="help-modal__esc-hint">ESC - выйти из окна</div>
        <h2 className="help-modal__title">Доступные команды:</h2>
        <div className="help-modal__commands">
          <p><span className="help-modal__command">/help</span> - показать эту справку</p>
          <p><span className="help-modal__command">/about</span> - информация обо мне</p>
          <p><span className="help-modal__command">/project</span> - список проектов</p>
          <p><span className="help-modal__command">/contacts</span> - контактная информация</p>
        </div>
      </div>
    </div>
  );
};

export default HelpModal;
