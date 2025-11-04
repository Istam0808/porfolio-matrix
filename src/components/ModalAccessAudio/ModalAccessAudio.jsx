"use client";

import { useState, useEffect } from "react";
import "./style.scss";

const ModalAccessAudio = ({ isOpen, onClose, onAccept, onDecline }) => {
  const [showAnimation, setShowAnimation] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShowAnimation(true);
    }
  }, [isOpen]);

  // Обработка клавиатуры
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Enter" || e.key === "y" || e.key === "Y") {
        onAccept();
      } else if (e.key === "Escape" || e.key === "n" || e.key === "N") {
        onDecline();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onAccept, onDecline]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className={`modal-container ${showAnimation ? "modal-visible" : ""}`} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">
            <span className="modal-prompt">$</span>
            <span className="modal-text">AUDIO_PERMISSION_REQUEST</span>
          </div>
        </div>
        <div className="modal-body">
          <div className="modal-line">
            <span className="modal-prompt">{'>'}</span>
            <span className="modal-text">Разрешить автоматическое воспроизведение аудио?</span>
          </div>
          <div className="modal-line">
            <span className="modal-prompt">{'>'}</span>
            <span className="modal-text">[Y/n]:</span>
          </div>
        </div>
        <div className="modal-footer">
          <button className="modal-button modal-button--accept" onClick={onAccept} autoFocus>
            <span className="modal-button-prompt">Y</span>
            <span className="modal-button-text">Разрешить</span>
          </button>
          <button className="modal-button modal-button--decline" onClick={onDecline}>
            <span className="modal-button-prompt">N</span>
            <span className="modal-button-text">Отклонить</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalAccessAudio;

