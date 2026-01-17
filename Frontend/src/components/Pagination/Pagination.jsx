// Import React library for creating components
import React from 'react';

// Import translation hook for multi-language support
import { useTranslation } from 'react-i18next';

// Import CSS styles for this component
import styles from './Pagination.module.css';

// Create Pagination component with props: current page, total pages, change function, and button labels
export default function Pagination({ page, totalPages, onChange, labels }) {
  
  // Get translation function for converting text to different languages
  const { t } = useTranslation();
  
  // Function to go to previous page
  const prev = () => { 
    // Change to page-1, but never go below page 1
    onChange(Math.max(1, page - 1)); 
    
    // Scroll to top of page for better user experience
    window.scrollTo({ top: 0, behavior: 'smooth' }) 
  }
  
  // Function to go to next page
  const next = () => { 
    // Change to page+1, but never go above total pages
    onChange(Math.min(totalPages, page + 1)); 
    
    // Scroll to top of page for better user experience
    window.scrollTo({ top: 0, behavior: 'smooth' }) 
  }
  
  // Create text showing current page and total pages (example: "2 of 5")
  const pageInfo = `${page} of ${totalPages}`;
  
  // Return the visual part of the component
  return (
    // Main container for pagination
    <div className={styles.wrap}>
      
      {/* Previous page button */}
      <button 
        // CSS class for styling
        className={styles.btn} 
        
        // When clicked, call prev() function
        onClick={prev} 
        
        // Disable button if already on first page
        disabled={page <= 1}
        
        // Accessibility label for screen readers
        aria-label="Previous page"
      >
        {/* Button text with left arrow */}
        <span className={styles.btnText}>
          ← {labels?.prev || t('pagination.prev')}
        </span>
      </button>
      
      {/* Container showing page numbers */}
      <div className={styles.pageInfo}>
        
        {/* Show current page and total pages (example: "2 of 5") */}
        <span className={styles.pageNumber}>{pageInfo}</span>
        
        {/* Show "Page" or "Pages" based on total count */}
        <span className={styles.pageLabel}>
          {totalPages === 1 ? 'Page' : 'Pages'}
        </span>
      </div>
      
      {/* Next page button */}
      <button 
        // CSS class for styling
        className={styles.btn} 
        
        // When clicked, call next() function
        onClick={next} 
        
        // Disable button if already on last page
        disabled={page >= totalPages}
        
        // Accessibility label for screen readers
        aria-label="Next page"
      >
        {/* Button text with right arrow */}
        <span className={styles.btnText}>
          {labels?.next || t('pagination.next')} →
        </span>
      </button>
    </div>
  );
}