import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./style.css";

export const MobileSettings = () => {
  const [calorieGoal, setCalorieGoal] = useState(() => {
    return parseInt(localStorage.getItem('calorieGoal')) || 2500;
  });
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('male');
  const [activityLevel, setActivityLevel] = useState('moderate');
  const [bmr, setBmr] = useState(null);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleSaveCalorieGoal = () => {
    localStorage.setItem('calorieGoal', calorieGoal);
    window.dispatchEvent(new CustomEvent('calorieGoalUpdated', {
      detail: { calorieGoal }
    }));
  };

  const calculateBMR = () => {
    if (!height || !weight || !age) {
      alert('Please enter height, weight, and age');
      return;
    }
    
    // Mifflin-St Jeor Equation
    let calculatedBMR;
    if (gender === 'male') {
      calculatedBMR = (10 * weight) + (6.25 * height) - (5 * age) + 5;
    } else {
      calculatedBMR = (10 * weight) + (6.25 * height) - (5 * age) - 161;
    }
    
    // Activity level multipliers
    const activityMultipliers = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      veryActive: 1.9
    };
    
    const dailyCalories = Math.round(calculatedBMR * activityMultipliers[activityLevel]);
    
    setBmr(Math.round(calculatedBMR));
    setCalorieGoal(dailyCalories);
    localStorage.setItem('calorieGoal', dailyCalories);
    
    window.dispatchEvent(new CustomEvent('calorieGoalUpdated', {
      detail: { calorieGoal: dailyCalories }
    }));
  };

  const handleUpdatePassword = () => {
    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords must match');
      return;
    }
    
    setPasswordError('');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="mobile-settings">
      <div className="mobile-settings-body">
        <div className="mobile-settings-header">
          <div className="mobile-settings-title">Settings</div>
        </div>
        <div className="mobile-settings-content">
          <section className="mobile-settings-section">
            <h2 className="mobile-settings-section-title">Calorie Goals</h2>
            
            <div className="mobile-settings-form-group">
              <label className="mobile-settings-label">Daily Calorie Goal</label>
              <div className="mobile-settings-input-group">
                <input
                  type="number"
                  className="mobile-settings-input"
                  placeholder="Enter daily goal"
                  value={calorieGoal}
                  onChange={(e) => setCalorieGoal(parseInt(e.target.value))}
                />
                <button 
                  className="mobile-settings-button"
                  onClick={handleSaveCalorieGoal}
                >
                  Save
                </button>
              </div>
            </div>

            <div className="mobile-settings-divider" />

            <div className="mobile-settings-bmr-section">
              <h3 className="mobile-settings-subtitle">Calculate from BMR</h3>
              
              <div className="mobile-settings-form-group">
                <label className="mobile-settings-label">Height (cm)</label>
                <input
                  type="number"
                  className="mobile-settings-input"
                  placeholder="e.g., 170"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                />
              </div>

              <div className="mobile-settings-form-group">
                <label className="mobile-settings-label">Weight (kg)</label>
                <input
                  type="number"
                  className="mobile-settings-input"
                  placeholder="e.g., 70"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                />
              </div>

              <div className="mobile-settings-form-group">
                <label className="mobile-settings-label">Age</label>
                <input
                  type="number"
                  className="mobile-settings-input"
                  placeholder="e.g., 25"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                />
              </div>

              <div className="mobile-settings-form-group">
                <label className="mobile-settings-label">Gender</label>
                <select 
                  className="mobile-settings-select"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>

              <div className="mobile-settings-form-group">
                <label className="mobile-settings-label">Activity Level</label>
                <select 
                  className="mobile-settings-select"
                  value={activityLevel}
                  onChange={(e) => setActivityLevel(e.target.value)}
                >
                  <option value="sedentary">Sedentary (little or no exercise)</option>
                  <option value="light">Light (exercise 1-3 days/week)</option>
                  <option value="moderate">Moderate (exercise 3-5 days/week)</option>
                  <option value="active">Active (exercise 6-7 days/week)</option>
                  <option value="veryActive">Very Active (hard exercise & physical job)</option>
                </select>
              </div>

              <button 
                className="mobile-settings-button mobile-settings-button-full"
                onClick={calculateBMR}
              >
                Calculate
              </button>

              {bmr !== null && (
                <div className="mobile-settings-bmr-result">
                  <p className="mobile-settings-bmr-value">Your BMR: {bmr} calories/day</p>
                  <p className="mobile-settings-daily-calories">
                    Recommended Daily Calories: {calorieGoal} calories/day
                  </p>
                  <p className="mobile-settings-bmr-explanation">
                    This is based on your BMR and activity level
                  </p>
                </div>
              )}
            </div>
          </section>

          <section className="mobile-settings-section">
            <h2 className="mobile-settings-section-title">Security</h2>
            
            <div className="mobile-settings-form-group">
              <label className="mobile-settings-label">Current Password</label>
              <input
                type="password"
                className="mobile-settings-input"
                placeholder="Enter current password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </div>

            <div className="mobile-settings-form-group">
              <label className="mobile-settings-label">New Password</label>
              <input
                type="password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  setPasswordError('');
                }}
                className={`mobile-settings-input ${passwordError ? 'mobile-settings-input-error' : ''}`}
              />
            </div>

            <div className="mobile-settings-form-group">
              <label className="mobile-settings-label">Confirm Password</label>
              <input
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`mobile-settings-input ${passwordError ? 'mobile-settings-input-error' : ''}`}
              />
              {passwordError && (
                <div className="mobile-settings-error-message">{passwordError}</div>
              )}
            </div>

            <button 
              className="mobile-settings-button mobile-settings-button-full"
              onClick={handleUpdatePassword}
            >
              Update Password
            </button>
          </section>

          <section className="mobile-settings-help-section">
            <h2 className="mobile-settings-section-title">Help & Support</h2>
            <div className="mobile-settings-support-card">
              <div className="mobile-settings-support-icon">📧</div>
              <div>
                <h3>Contact Support</h3>
                <p>Get help from our team by emailing rachaelyn.l.st.denis-1@ou.edu</p>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Bottom Navigation */}
      <nav className="mobile-nav">
        <Link to="/mobile-dashboard" className="mobile-nav-item">
          <span className="mobile-nav-icon">📊</span>
        </Link>
        <Link to="/mobile-mymeals" className="mobile-nav-item">
          <span className="mobile-nav-icon">🍽️</span>
        </Link>
        <Link to="/mobile-entry-window" className="mobile-nav-item primary">
          <span className="mobile-plus-icon">+</span>
        </Link>
        <Link to="/mobile-settings" className="mobile-nav-item active">
          <span className="mobile-nav-icon">⚙️</span>
        </Link>
        <Link to="/mobile-login" className="mobile-nav-item">
          <span className="mobile-nav-icon">🚪</span>
        </Link>
      </nav>
    </div>
  );
};
