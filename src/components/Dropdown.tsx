import { useEffect, useState } from "react";

type DropdownProps = {
  value: string;
  options: string[];
  onChange: (value: string) => void;
  icon?: string;
  placeholder?: string;
  typeAhead?: boolean;
};

export const Dropdown = ({ value, options, onChange, icon, placeholder, typeAhead = false }: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [inputValue, setInputValue] = useState(value || "");
  const [isTyping, setIsTyping] = useState(false);

  // Filter options based on input value when type-ahead is enabled and user is typing
  // When dropdown opens without typing, show all options
  const filteredOptions = typeAhead && isTyping
    ? options.filter((option) =>
        option.toLowerCase().includes(inputValue.toLowerCase())
      )
    : options;

  useEffect(() => {
    if (typeAhead && value) {
      // Only sync inputValue with value when value changes externally (not during typing)
      setInputValue(value);
    }
    const selectedIndex = filteredOptions.indexOf(value);
    setActiveIndex(selectedIndex >= 0 ? selectedIndex : 0);
  }, [options, value, typeAhead]);

  const displayValue = value || placeholder || "";
  const isPlaceholder = !value && placeholder;

  const handleBlur = (event: React.FocusEvent) => {
    // Use setTimeout to allow click events on dropdown options to fire first
    setTimeout(() => {
      if (!event.currentTarget.contains(document.activeElement)) {
        setIsOpen(false);
        setIsTyping(false);
        if (typeAhead) {
          // Reset input to the selected value if no selection was made
          setInputValue(value || "");
        }
      }
    }, 200);
  };

  return (
    <div
      className={`dropdown ${isOpen ? "open" : ""}`}
      onBlur={handleBlur}
      onKeyDown={(event) => {
        // Only handle special keys, let normal typing pass through
        const target = event.target as HTMLElement | null;
        const isInput = target?.tagName === "INPUT";
        
        // Don't interfere with typing in the input field
        if (isInput && typeAhead && 
            event.key !== "ArrowDown" && 
            event.key !== "ArrowUp" && 
            event.key !== "Enter" && 
            event.key !== "Escape") {
          return;
        }
        
        if (
          (event.key === "Enter" || event.key === " ") &&
          target?.classList.contains("dropdown-option")
        ) {
          event.preventDefault();
          const nextValue = target.getAttribute("data-option");
          if (nextValue) {
            onChange(nextValue);
            if (typeAhead) {
              setInputValue(nextValue);
            }
          }
          setIsOpen(false);
          return;
        }
        if (event.key === "Escape") {
          setIsOpen(false);
          if (typeAhead) {
            setInputValue(value || "");
          }
          return;
        }
        if (event.key === "ArrowDown") {
          event.preventDefault();
          setIsOpen(true);
          if (filteredOptions.length > 0) {
            setActiveIndex((index) => (index + 1) % filteredOptions.length);
          }
          return;
        }
        if (event.key === "ArrowUp") {
          event.preventDefault();
          setIsOpen(true);
          if (filteredOptions.length > 0) {
            setActiveIndex((index) => (index - 1 + filteredOptions.length) % filteredOptions.length);
          }
          return;
        }
        if (event.key === "Enter" && !typeAhead) {
          event.preventDefault();
          if (!isOpen) {
            setIsOpen(true);
            return;
          }
          const nextValue = filteredOptions[activeIndex];
          if (nextValue) {
            onChange(nextValue);
          }
          setIsOpen(false);
        }
        if (event.key === "Enter" && typeAhead) {
          event.preventDefault();
          // If input is empty, clear the selection
          if (!inputValue || inputValue.trim() === "") {
            onChange("");
            setInputValue("");
            setIsOpen(false);
            return;
          }
          // Otherwise, select the highlighted option if available
          if (filteredOptions.length > 0) {
            const nextValue = filteredOptions[activeIndex];
            if (nextValue) {
              onChange(nextValue);
              setInputValue(nextValue);
              setIsOpen(false);
            }
          }
        }
      }}
    >
      {typeAhead ? (
        <div className="input dropdown-toggle" style={{ position: "relative", display: "flex", alignItems: "center", padding: 0 }}>
          {icon && <img className="dropdown-icon" src={icon} alt="" aria-hidden="true" style={{ marginLeft: "16px", flexShrink: 0, pointerEvents: "none" }} />}
          <input
            type="text"
            className={`input input-field ${!inputValue ? "placeholder" : ""}`}
            value={inputValue}
            placeholder={placeholder}
            aria-haspopup="listbox"
            aria-expanded={isOpen}
            autoComplete="off"
            onChange={(e) => {
              const newValue = e.target.value;
              setInputValue(newValue);
              setIsTyping(true);
              setIsOpen(true);
              setActiveIndex(0);
            }}
            onFocus={(e) => {
              setIsOpen(true);
              setIsTyping(false); // Show all options when focusing
              e.target.select();
            }}
            onClick={() => {
              setIsOpen(true);
              setIsTyping(false); // Show all options when clicking
            }}
            style={{ 
              flex: 1, 
              border: "none", 
              outline: "none", 
              background: "transparent", 
              padding: icon ? "8px 36px 8px 0" : "8px 36px 8px 16px",
              width: "100%",
              cursor: "text"
            }}
          />
        </div>
      ) : (
        <button
          className={`input dropdown-toggle ${isPlaceholder ? "placeholder" : ""}`}
          type="button"
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          onClick={() => setIsOpen((open) => !open)}
        >
          {icon && <img className="dropdown-icon" src={icon} alt="" aria-hidden="true" />}
          <span className="dropdown-value">{displayValue}</span>
        </button>
      )}
      {isOpen && typeAhead && filteredOptions.length === 0 && inputValue && (
        <div className="dropdown-menu" role="listbox">
          <div style={{ padding: "10px 14px", color: "var(--color-text-default-tertiary)", fontSize: "14px" }}>
            No matches found
          </div>
        </div>
      )}
      {isOpen && filteredOptions.length > 0 && (
        <div className="dropdown-menu" role="listbox">
          {filteredOptions.map((option, index) => (
            <button
              className={`dropdown-option ${option === value ? "selected" : ""} ${index === activeIndex ? "active" : ""}`}
              type="button"
              role="option"
              aria-selected={option === value}
              key={option}
              data-option={option}
              onFocus={() => setActiveIndex(index)}
              onClick={() => {
                onChange(option);
                if (typeAhead) {
                  setInputValue(option);
                }
                setIsOpen(false);
              }}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
