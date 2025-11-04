"use client";

import "./style.scss";

const HelpModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="help-modal" onClick={onClose}>
      <div className="help-modal__content" onClick={(e) => e.stopPropagation()}>
        <h2 className="help-modal__title">Доступные команды:</h2>
        <div className="help-modal__commands">
          <p><span className="help-modal__command">/help</span> - показать эту справку</p>
          <p>Больше команд скоро...</p>
        </div>
      </div>
    </div>
  );
};

export default HelpModal;
