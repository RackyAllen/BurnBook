import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ErrorModal } from "../../components/ErrorModal/ErrorModal";
import "./style.css";

export const DesktopWeightEntry = () => {
  const [weight, setWeight] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [error, setError] = useState(null);

  const handleAddWeight = () => {
    if (!weight || parseFloat(weight) <= 0) {
      setError(weight === '' ? 'Please enter your weight' : 'Please enter a valid weight');
      return;
    }

    const weightEntry = {
      weight: parseFloat(weight),
      date: date // Use the date directly from the input
    };

    try {
      // Get existing weight entries from localStorage
      const existingEntries = JSON.parse(localStorage.getItem('weightEntries') || '[]');
      // Add new entry
      const updatedEntries = [...existingEntries, weightEntry];
      // Save back to localStorage
      localStorage.setItem('weightEntries', JSON.stringify(updatedEntries));
      
      // Trigger storage event for dashboard update
      window.dispatchEvent(new Event('storage'));
      
      // Navigate to dashboard
      window.location.href = '/desktop-dashboard';
    } catch (error) {
      setError('Unable to add weight entry. Please try again.');
    }
  };

  return (
    <div className="desktop-weight-entry">
      <div className="weight-entry-content">
        <div className="weight-entry-header">
          <h1>Add Weight Entry</h1>
          <Link to="/desktop-dashboard" className="close-button">×</Link>
        </div>

        <div className="weight-entry-form">
          <div className="form-group">
            <label htmlFor="weight">Weight (lbs)</label>
            <div className="input-wrapper">
              <input
                type="number"
                id="weight"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="Enter your weight"
                min="0"
                step="0.1"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="date">Date</label>
            <div className="input-wrapper">
              <input
                type="date"
                id="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
          </div>

          <button className="add-button" onClick={handleAddWeight}>
            Add Weight
          </button>
        </div>
      </div>

      {error && <ErrorModal message={error} onClose={() => setError(null)} />}
    </div>
  );
};
