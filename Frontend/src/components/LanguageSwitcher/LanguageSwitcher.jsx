// Import React and its built-in tools
import React, { useState, useEffect, useRef } from 'react';

// Import translation system for language switching
import { useTranslation } from 'react-i18next';

// Import CSS styles for this component
import './LanguageSwitcher.css';

// Create LanguageSwitcher component
const LanguageSwitcher = () => {
  
  // Get language system object from translation hook
  const { i18n } = useTranslation();
  
  // State to track current language (default is English)
  const [currentLang, setCurrentLang] = useState(i18n.language || 'en');
  
  // State to track if dropdown menu is open or closed
  const [isOpen, setIsOpen] = useState(false);
  
  // Reference to dropdown element for clicking outside detection
  const dropdownRef = useRef(null);
  
  // List of available languages with their details
  const languages = [
    { 
      code: 'en',                    // Language code
      name: 'English',               // Language name
      country: 'USA',                // Country name
      flag: 'https://flagcdn.com/w20/us.png'  // Country flag image
    },
    { 
      code: 'am', 
      name: 'አማርኛ',                 // Amharic name
      country: 'Ethiopia',
      flag: 'https://flagcdn.com/w20/et.png'
    },
    { 
      code: 'gez', 
      name: 'ግዕዝ',                  // Ge'ez name
      country: 'Ethiopia',
      flag: 'https://flagcdn.com/w20/et.png'
    }
  ];
  
  // Find which language object matches the current language code
  const currentLanguage = languages.find(lang => lang.code === currentLang);
  
  // Function to change language when user selects one
  const handleLanguageChange = (langCode) => {
    // Change the app's language
    i18n.changeLanguage(langCode);
    
    // Update current language state
    setCurrentLang(langCode);
    
    // Save language choice to browser storage
    localStorage.setItem('evangadi-language', langCode);
    
    // Close the dropdown menu
    setIsOpen(false);
  };
  
  // Function to open/close dropdown menu
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  
  // Effect: Close dropdown when user clicks outside of it
  useEffect(() => {
    // Function to detect clicks outside dropdown
    const handleClickOutside = (event) => {
      // If click is outside dropdown element, close dropdown
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    
    // Add click listener to entire document
    document.addEventListener('mousedown', handleClickOutside);
    
    // Clean up: Remove listener when component unmounts
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Effect: Load saved language when app starts
  useEffect(() => {
    // Get saved language from browser storage
    const savedLang = localStorage.getItem('evangadi-language');
    
    // If saved language exists and is valid, use it
    if (savedLang && languages.some(lang => lang.code === savedLang)) {
      handleLanguageChange(savedLang);
    }
  }, []);
  
  // Return the visual part of the component
  return (
    // Main container for language switcher
    <div className="language-switcher-button" ref={dropdownRef}>
      
      {/* Button that shows currently selected language */}
      <button 
        className="language-main-button"
        onClick={toggleDropdown}            // Click opens/closes dropdown
        aria-label="Change language"        // Accessibility label for screen readers
      >
        {/* Display flag of current language */}
        <img 
          src={currentLanguage?.flag} 
          alt={`${currentLanguage?.country} flag`}
          className="main-button-flag"
        />
        
        {/* Display country name of current language */}
        <span className="main-button-text">{currentLanguage?.country}</span>
        
        {/* Dropdown arrow icon */}
        <span className="main-button-arrow">▾</span>
      </button>
      
      {/* Dropdown Menu - Shows when isOpen is true */}
      {isOpen && (
        <div className="language-dropdown">
          
          {/* Map through all available languages */}
          {languages.map(lang => (
            
            // Button for each language option
            <button
              key={lang.code}               // Unique key for React
              className={`dropdown-item ${currentLang === lang.code ? 'active' : ''}`} // Highlight current language
              onClick={() => handleLanguageChange(lang.code)}  // Change language when clicked
            >
              
              {/* Display flag for this language option */}
              <img 
                src={lang.flag} 
                alt={`${lang.country} flag`}
                className="dropdown-flag"
              />
              
              {/* Text container for language details */}
              <div className="dropdown-text">
                
                {/* Display country name */}
                <span className="dropdown-country">{lang.country}</span>
                
                {/* Display language name in parentheses */}
                <span className="dropdown-language">({lang.name})</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// Export component so other files can use it
export default LanguageSwitcher;