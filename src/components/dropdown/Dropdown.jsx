// Dropdown component

import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Dropdown = ({ options, label, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [dropdownLabel, setDropdownLabel] = useState(label || 'Role');
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const handleItemClick = (item) => {
    
    setSelectedItem(item);
    setIsOpen(false);
    setDropdownLabel(item || 'Role');

    if (onSelect) {
      onSelect(item);
    }
  };

  return (
    <div className="relative  z-100">
      <button
        onClick={toggleDropdown}
        className="bg-gray-100 hover:bg-gray-50 w-20 h-12 text-black px-4 py-2 rounded-md focus:outline-none focus:shadow-outline"
        aria-haspopup="true"
        aria-expanded={isOpen}
        ref={dropdownRef}
      >
        {dropdownLabel}
      </button>

      {isOpen && (
        <div className="absolute z-40 mt-2 w-32 bg-white border rounded-md shadow-lg">
          {options.map((result, index) => (
            <Link
            to="#"
              key={index}
              onClick={() => handleItemClick(result)}
              className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
            >
              {result}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
