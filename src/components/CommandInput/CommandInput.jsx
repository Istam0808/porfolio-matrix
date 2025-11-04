"use client";

import { useState, useRef, useEffect, useLayoutEffect } from "react";
import "./style.scss";

// Массив доступных команд с описаниями
const AVAILABLE_COMMANDS = [
  { command: "/help", description: "показать справку" },
  { command: "/about", description: "информация обо мне" },
  { command: "/project", description: "список проектов" },
  { command: "/contacts", description: "контактная информация" },
];

const CommandInput = ({ onCommand, onInputChange, hasInfoContainer }) => {
  const [command, setCommand] = useState("");
  const [cursorPosition, setCursorPosition] = useState(0);
  const [cursorLeft, setCursorLeft] = useState(0);
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [filteredCommands, setFilteredCommands] = useState([]);
  const inputRef = useRef(null);
  const measureRef = useRef(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    // Фокусируем инпут при монтировании
    if (inputRef.current) {
      inputRef.current.focus();
      setIsFocused(true);
    }
  }, []);

  // Фильтрация команд при изменении инпута
  useEffect(() => {
    const trimmedCommand = command.trim();
    
    if (trimmedCommand === "/" || trimmedCommand.startsWith("/")) {
      const filterText = trimmedCommand.toLowerCase();
      const filtered = AVAILABLE_COMMANDS.filter((cmd) =>
        cmd.command.toLowerCase().startsWith(filterText)
      );
      
      setFilteredCommands(filtered);
      setShowSuggestions(filtered.length > 0);
      setSelectedIndex(0); // Сбрасываем выбранный индекс при изменении фильтра
    } else {
      setShowSuggestions(false);
      setFilteredCommands([]);
    }
  }, [command]);

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

  const selectSuggestion = (selectedCommand) => {
    if (selectedCommand) {
      setCommand(selectedCommand.command);
      setShowSuggestions(false);
      // Передаем новое значение в родительский компонент
      if (onInputChange) {
        onInputChange(selectedCommand.command);
      }
      // Фокусируем инпут после выбора
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
          // Устанавливаем курсор в конец
          const length = selectedCommand.command.length;
          inputRef.current.setSelectionRange(length, length);
        }
      }, 0);
    }
  };

  const handleKeyDown = (e) => {
    if (showSuggestions && filteredCommands.length > 0) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => 
          prev < filteredCommands.length - 1 ? prev + 1 : prev
        );
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 0));
      } else if (e.key === "Enter") {
        e.preventDefault();
        const selectedCommand = filteredCommands[selectedIndex];
        if (selectedCommand) {
          selectSuggestion(selectedCommand);
        }
      } else if (e.key === "Escape") {
        e.preventDefault();
        setShowSuggestions(false);
        // Фокусируем инпут после закрытия
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }
    } else if (e.key === "Enter") {
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
    // Показываем подсказки если текст начинается с /
    const trimmedCommand = command.trim();
    if (trimmedCommand === "/" || trimmedCommand.startsWith("/")) {
      const filterText = trimmedCommand.toLowerCase();
      const filtered = AVAILABLE_COMMANDS.filter((cmd) =>
        cmd.command.toLowerCase().startsWith(filterText)
      );
      if (filtered.length > 0) {
        setShowSuggestions(true);
      }
    }
  };

  const handleBlur = () => {
    // Задерживаем закрытие dropdown, чтобы клик по элементу успел обработаться
    setTimeout(() => {
      setIsFocused(false);
      setShowSuggestions(false);
    }, 200);
  };

  const handleSuggestionClick = (selectedCommand) => {
    selectSuggestion(selectedCommand);
  };

  const handleSuggestionMouseDown = (e) => {
    // Предотвращаем потерю фокуса инпута при клике на dropdown
    e.preventDefault();
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
          {showSuggestions && filteredCommands.length > 0 && (
            <div 
              ref={dropdownRef}
              className="command-input__dropdown"
              onMouseDown={handleSuggestionMouseDown}
            >
              {filteredCommands.map((cmd, index) => (
                <div
                  key={cmd.command}
                  className={`command-input__suggestion ${index === selectedIndex ? 'command-input__suggestion--selected' : ''}`}
                  onClick={() => handleSuggestionClick(cmd)}
                  onMouseEnter={() => setSelectedIndex(index)}
                >
                  <span className="command-input__suggestion-command">{cmd.command}</span>
                  <span className="command-input__suggestion-description"> - {cmd.description}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommandInput;
