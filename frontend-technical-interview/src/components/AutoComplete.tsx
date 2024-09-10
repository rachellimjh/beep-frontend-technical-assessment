import React, { useState, useEffect, useRef } from "react";
import { useFloating, shift, offset, flip } from "@floating-ui/react";
import debounce from "lodash.debounce";

type Option = string | { label: string; value: string };

interface AutocompleteProps {
  label: string;
  description?: string;
  disabled?: boolean;
  filterOptions?: (options: Option[], inputValue: string) => Option[];
  loading?: boolean;
  multiple?: boolean;
  onChange: (value: Option | Option[]) => void;
  onInputChange?: (inputValue: string) => void;
  options: Option[];
  placeholder?: string;
  renderOption?: (option: Option) => React.ReactNode;
  value?: Option | Option[] | null;
}

const Autocomplete: React.FC<AutocompleteProps> = ({
  label,
  description,
  disabled = false,
  filterOptions,
  loading = false,
  multiple = false,
  onChange,
  onInputChange,
  options,
  placeholder = "",
  renderOption,
  value,
}) => {
  const [inputValue, setInputValue] = useState("");
  const [filteredOptions, setFilteredOptions] = useState<Option[]>(options);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<Option[]>([]);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const { refs, floatingStyles } = useFloating({
    middleware: [offset(5), flip(), shift()],
  });

  // Handle input change
  const handleInputChange = (value: string) => {
    if (onInputChange) onInputChange(value);
    setInputValue(value);
    if (filterOptions) {
      setFilteredOptions(filterOptions(options, value));
    } else {
      console.log(value);
      const defaultFilter = (option: Option) =>
        typeof option === "string"
          ? option.toLowerCase().includes(value.toLowerCase())
          : option.label.toLowerCase().includes(value.toLowerCase());
      setFilteredOptions(options.filter(defaultFilter));
    }
  };

  // Handle option selection
  const handleOptionClick = (option: Option) => {
    if (multiple) {
      const isSelected = selectedOptions.includes(option);
      const newSelection = isSelected
        ? selectedOptions.filter((o) => o !== option)
        : [...selectedOptions, option];
      setSelectedOptions(newSelection);
      onChange(newSelection);
    } else {
      setSelectedOptions([option]);
      onChange(option);
      setIsOpen(false);
    }
    setInputValue("");
  };

  // Handle keyboard navigation and selection
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    if (e.key === "ArrowDown") {
      setHighlightedIndex(
        (prevIndex) => (prevIndex + 1) % filteredOptions.length
      );
    } else if (e.key === "ArrowUp") {
      setHighlightedIndex((prevIndex) =>
        prevIndex === 0 ? filteredOptions.length - 1 : prevIndex - 1
      );
    } else if (e.key === "Enter" && highlightedIndex >= 0) {
      handleOptionClick(filteredOptions[highlightedIndex]);
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative w-full max-w-md">
      <label className="block mb-2 text-sm font-medium">{label}</label>
      <input
        ref={refs.setReference}
        type="text"
        disabled={disabled}
        value={inputValue}
        onChange={(e) => handleInputChange(e.target.value)}
        onFocus={() => setIsOpen(true)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {isOpen && !loading && (
        <ul
          ref={refs.setFloating}
          style={floatingStyles}
          className="absolute w-full bg-white border border-gray-200 rounded-md shadow-lg z-10 max-h-60 overflow-y-auto"
        >
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option, index) => (
              <li
                key={index}
                onClick={() => handleOptionClick(option)}
                onMouseEnter={() => setHighlightedIndex(index)}
                className={`p-2 cursor-pointer hover:bg-blue-100 ${
                  highlightedIndex === index ? "bg-blue-200" : ""
                }`}
              >
                {renderOption
                  ? renderOption(option)
                  : typeof option === "string"
                  ? option
                  : option.label}
              </li>
            ))
          ) : (
            <li className="p-2 text-gray-500">No results were found</li>
          )}
        </ul>
      )}
      {description && (
        <p className="mt-2 text-sm text-gray-500">{description}</p>
      )}
      {multiple && (
        <div className="mt-2 flex flex-wrap gap-2">
          {selectedOptions.map((option, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-blue-500 text-white rounded-md text-sm"
            >
              {typeof option === "string" ? option : option.label}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default Autocomplete;
