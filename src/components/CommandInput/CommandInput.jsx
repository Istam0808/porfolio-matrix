"use client";

import { useState, useRef, useEffect, useLayoutEffect } from "react";
import "./style.scss";

const CommandInput = ({ onCommand, onInputChange, hasInfoContainer }) => {
  const [command, setCommand] = useState("");
  const [cursorPosition, setCursorPosition] = useState(0);
  const [cursorLeft, setCursorLeft] = useState(0);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);
  const measureRef = useRef(null);

  useEffect(() => {
    // Фокусируем инпут при монтировании
    if (inputRef.current) {
      inputRef.current.focus();
      setIsFocused(true);
    }
  }, []);

  useEffect(() => {
    // Обновляем позицию курсора при изменении текста
    const updateCursor = () => {
      if (inputRef.current) {
        const pos = inputRef.current.selectionStart ?? command.length;
        setCursorPosition(pos);
      }
    };
    
    updateCursor();
    // Также обновляем при фокусе
    const input = inputRef.current;
    if (input) {
      input.addEventListener('focus', updateCursor);
      return () => {
        input.removeEventListener('focus', updateCursor);
      };
    }
  }, [command]);

  const updateCursorPosition = () => {
    if (inputRef.current) {
      const pos = inputRef.current.selectionStart ?? command.length;
      setCursorPosition(pos);
    }
  };

  const handleChange = (e) => {
    const newValue = e.target.value;
    setCommand(newValue);
    // Передаем текущее значение в родительский компонент
    if (onInputChange) {
      onInputChange(newValue);
    }
    // Обновляем позицию курсора после изменения
    setTimeout(updateCursorPosition, 0);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      const trimmedCommand = command.trim();
      if (trimmedCommand) {
        // Вызываем callback с командой
        if (onCommand) {
          onCommand(trimmedCommand);
        }
        setCommand("");
        setCursorPosition(0);
      }
    } else {
      // Обновляем позицию курсора после нажатия клавиши (стрелки, удаление и т.д.)
      setTimeout(updateCursorPosition, 0);
    }
  };

  const handleSelectionChange = () => {
    updateCursorPosition();
  };

  const handleFocus = () => {
    setIsFocused(true);
    updateCursorPosition();
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  // Вычисляем позицию курсора на основе ширины текста
  useLayoutEffect(() => {
    if (!measureRef.current || !inputRef.current) {
      setCursorLeft(0);
      return;
    }
    
    const textBeforeCursor = command.substring(0, cursorPosition);
    measureRef.current.textContent = textBeforeCursor;
    setCursorLeft(measureRef.current.offsetWidth);
  }, [command, cursorPosition]);

  return (
    <div className={`command-input-group ${hasInfoContainer ? 'command-input-group--with-info' : ''}`}>
      <div className="command-input__hint">Напиши /help чтобы узнать больше</div>
      <div className="command-input-wrapper">
        <span className="command-input__prefix">C:\&gt;</span>
        <div className="command-input-container">
          <input
            ref={inputRef}
            type="text"
            className="command-input"
            value={command}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onSelect={handleSelectionChange}
            onClick={handleSelectionChange}
            onKeyUp={handleSelectionChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder=""
            autoFocus
          />
          <span 
            ref={measureRef}
            className="command-input__measure"
            aria-hidden="true"
          />
          <span 
            className={`command-input__cursor ${isFocused ? 'command-input__cursor--focused' : ''}`}
            style={{ left: `${cursorLeft}px` }}
          ></span>
        </div>
      </div>
    </div>
  );
};

export default CommandInput;
