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
  const [showLargeInput, setShowLargeInput] = useState(false);
  const [isLargeInputClosing, setIsLargeInputClosing] = useState(false);
  const [largeInputCursorPosition, setLargeInputCursorPosition] = useState(0);
  const [largeInputCursorLeft, setLargeInputCursorLeft] = useState(0);
  const inputRef = useRef(null);
  const largeInputRef = useRef(null);
  const measureRef = useRef(null);
  const largeMeasureRef = useRef(null);
  const dropdownRef = useRef(null);
  const largeDropdownRef = useRef(null);

  useEffect(() => {
    // Фокусируем инпут при монтировании
    if (inputRef.current) {
      inputRef.current.focus();
      setIsFocused(true);
    }
  }, []);

  // Показываем/скрываем большой инпут только после полного написания команды
  useEffect(() => {
    const trimmedCommand = command.trim().toLowerCase();
    
    // Проверяем, является ли команда точным совпадением с одной из доступных команд (кроме /help)
    const isExactMatch = AVAILABLE_COMMANDS.some(
      (cmd) => cmd.command.toLowerCase() === trimmedCommand && cmd.command !== "/help"
    );
    
    if (isExactMatch) {
      setIsLargeInputClosing(false);
      setShowLargeInput(true);
      // Фокусируем большой инпут с небольшой задержкой
      setTimeout(() => {
        if (largeInputRef.current) {
          const cursorPos = command.length;
          setLargeInputCursorPosition(cursorPos);
          largeInputRef.current.focus();
          largeInputRef.current.setSelectionRange(cursorPos, cursorPos);
        }
      }, 100);
    } else {
      // Запускаем анимацию закрытия перед скрытием
      if (showLargeInput && !isLargeInputClosing) {
        setIsLargeInputClosing(true);
        // Сразу переводим фокус на маленький инпут
        setTimeout(() => {
          if (inputRef.current) {
            inputRef.current.focus();
            const cursorPos = command.length;
            inputRef.current.setSelectionRange(cursorPos, cursorPos);
          }
        }, 50);
        setTimeout(() => {
          setShowLargeInput(false);
          setIsLargeInputClosing(false);
        }, 300); // Время анимации
      } else if (!showLargeInput) {
        setIsLargeInputClosing(false);
      }
    }
  }, [command, showLargeInput, isLargeInputClosing]);

  // Фильтрация команд при изменении инпута
  useEffect(() => {
    const trimmedCommand = command.trim();
    
    // Проверяем, является ли команда точным совпадением с одной из доступных
    const isExactMatch = AVAILABLE_COMMANDS.some(
      (cmd) => cmd.command.toLowerCase() === trimmedCommand.toLowerCase()
    );
    
    // Если команда точно совпадает с доступной командой, не показываем dropdown
    if (isExactMatch) {
      setShowSuggestions(false);
      setFilteredCommands([]);
      return;
    }
    
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

  const updateLargeInputCursorPosition = () => {
    if (largeInputRef.current) {
      const pos = largeInputRef.current.selectionStart ?? command.length;
      setLargeInputCursorPosition(pos);
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

  const handleLargeInputChange = (e) => {
    const newValue = e.target.value;
    setCommand(newValue);
    // Передаем текущее значение в родительский компонент
    if (onInputChange) {
      onInputChange(newValue);
    }
    // Обновляем позицию курсора большого инпута
    setTimeout(updateLargeInputCursorPosition, 0);
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
    // Показываем подсказки если текст начинается с / и не является точным совпадением
    const trimmedCommand = command.trim();
    const isExactMatch = AVAILABLE_COMMANDS.some(
      (cmd) => cmd.command.toLowerCase() === trimmedCommand.toLowerCase()
    );
    
    if (!isExactMatch && (trimmedCommand === "/" || trimmedCommand.startsWith("/"))) {
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

  // Вычисляем позицию курсора для большого инпута
  useLayoutEffect(() => {
    if (!largeMeasureRef.current || !largeInputRef.current) {
      setLargeInputCursorLeft(0);
      return;
    }
    
    const textBeforeCursor = command.substring(0, largeInputCursorPosition);
    largeMeasureRef.current.textContent = textBeforeCursor;
    setLargeInputCursorLeft(largeMeasureRef.current.offsetWidth);
  }, [command, largeInputCursorPosition]);

  const handleLargeInputKeyDown = (e) => {
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
        setShowLargeInput(false);
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }
    } else if (e.key === "Enter") {
      const trimmedCommand = command.trim();
      if (trimmedCommand) {
        if (onCommand) {
          onCommand(trimmedCommand);
        }
        setCommand("");
        setCursorPosition(0);
        setShowLargeInput(false);
      }
    } else {
      setTimeout(updateLargeInputCursorPosition, 0);
    }
  };

  const handleLargeInputSelectionChange = () => {
    updateLargeInputCursorPosition();
  };

  const handleLargeInputFocus = () => {
    setIsFocused(true);
    updateLargeInputCursorPosition();
    const trimmedCommand = command.trim();
    const isExactMatch = AVAILABLE_COMMANDS.some(
      (cmd) => cmd.command.toLowerCase() === trimmedCommand.toLowerCase()
    );
    
    if (!isExactMatch && (trimmedCommand === "/" || trimmedCommand.startsWith("/"))) {
      const filterText = trimmedCommand.toLowerCase();
      const filtered = AVAILABLE_COMMANDS.filter((cmd) =>
        cmd.command.toLowerCase().startsWith(filterText)
      );
      if (filtered.length > 0) {
        setShowSuggestions(true);
      }
    }
  };

  const handleLargeInputBlur = () => {
    setTimeout(() => {
      setIsFocused(false);
      setShowSuggestions(false);
    }, 200);
  };

  return (
    <>
      {/* Большой инпут */}
      {showLargeInput && (
        <div className={`command-input-large-group ${isLargeInputClosing ? 'command-input-large-group--closing' : ''}`}>
          <div className="command-input-large-wrapper">
            <span className="command-input-large__prefix">C:\&gt;</span>
            <div className="command-input-large-container">
              <input
                ref={largeInputRef}
                type="text"
                className="command-input-large"
                value={command}
                onChange={handleLargeInputChange}
                onKeyDown={handleLargeInputKeyDown}
                onSelect={handleLargeInputSelectionChange}
                onClick={handleLargeInputSelectionChange}
                onKeyUp={handleLargeInputSelectionChange}
                onFocus={handleLargeInputFocus}
                onBlur={handleLargeInputBlur}
                placeholder=""
                autoFocus
              />
              <span 
                ref={largeMeasureRef}
                className="command-input-large__measure"
                aria-hidden="true"
              />
              <span 
                className={`command-input-large__cursor ${isFocused ? 'command-input-large__cursor--focused' : ''}`}
                style={{ left: `${largeInputCursorLeft}px` }}
              ></span>
              {showSuggestions && filteredCommands.length > 0 && (
                <div 
                  ref={largeDropdownRef}
                  className="command-input-large__dropdown"
                  onMouseDown={handleSuggestionMouseDown}
                >
                  {filteredCommands.map((cmd, index) => (
                    <div
                      key={cmd.command}
                      className={`command-input-large__suggestion ${index === selectedIndex ? 'command-input-large__suggestion--selected' : ''}`}
                      onClick={() => handleSuggestionClick(cmd)}
                      onMouseEnter={() => setSelectedIndex(index)}
                    >
                      <span className="command-input-large__suggestion-command">{cmd.command}</span>
                      <span className="command-input-large__suggestion-description"> - {cmd.description}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Маленький инпут */}
      <div className="command-input-group">
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
            {showSuggestions && filteredCommands.length > 0 && !showLargeInput && (
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
    </>
  );
};

export default CommandInput;
