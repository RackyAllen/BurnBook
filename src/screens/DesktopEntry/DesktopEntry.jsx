import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import "./style.css";

export const DesktopEntry = () => {
  useEffect(() => {
    // Add modal-open class to body when component mounts
    document.body.classList.add('modal-open');
    
    // Remove modal-open class when component unmounts
    return () => {
      document.body.classList.remove('modal-open');
    };
  }, []);

  return (
    <div className="entry-modal-overlay">
      <div className="entry-modal">
        {/* ... rest of the component code ... */}
      </div>
    </div>
  );
}; 