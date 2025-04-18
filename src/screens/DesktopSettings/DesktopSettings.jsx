import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./style.css";

export const DesktopSettings = () => {
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

  // Save calorie goal to localStorage and notify dashboard
  const handleSaveCalorieGoal = () => {
    localStorage.setItem('calorieGoal', calorieGoal);
    window.dispatchEvent(new CustomEvent('calorieGoalUpdated', {
      detail: { calorieGoal }
    }));
  };

  // Calculate BMR and set calorie goal
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
      sedentary: 1.2, // Little to no exercise
      light: 1.375, // Light exercise 1-3 days/week
      moderate: 1.55, // Moderate exercise 3-5 days/week
      active: 1.725, // Heavy exercise 6-7 days/week
      veryActive: 1.9 // Very heavy exercise, physical job
    };
    
    // Calculate daily calorie needs
    const dailyCalories = Math.round(calculatedBMR * activityMultipliers[activityLevel]);
    
    setBmr(Math.round(calculatedBMR));
    setCalorieGoal(dailyCalories);
    localStorage.setItem('calorieGoal', dailyCalories);
    
    // Notify dashboard of the update
    window.dispatchEvent(new CustomEvent('calorieGoalUpdated', {
      detail: { calorieGoal: dailyCalories }
    }));
  };

  const handleUpdatePassword = () => {
    if (newPassword !== confirmPassword) {
      setPasswordError('New password must match');
      return;
    }
    
    // Clear error if passwords match
    setPasswordError('');
    
    // Clear all password fields
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="desktop-dashboard">
      <div className="dashboard-content">
        <div className="dashboard-layout">
          {/* Sidebar */}
          <div className="sidebar">
            <div className="logo">
              <div className="logo-icon">🔥</div>
              <span className="logo-text">BurnBook</span>
                        </div>
            <div className="nav-buttons">
              <Link to="/desktop-entry-window">
                <button className="nav-button primary">
                  <div className="button-icon">+</div>
                  <span>Add Entry</span>
                </button>
              </Link>
              <Link to="/desktop-dashboard">
                <button className="nav-button">
                  <div className="button-icon">📊</div>
                  <span>Dashboard</span>
                </button>
              </Link>
              <Link to="/desktop-mymeals">
                <button className="nav-button">
                  <div className="button-icon">🍽️</div>
                  <span>My Meals</span>
                        </button>
              </Link>
                      </div>
            <div className="bottom-nav">
              <button className="nav-button active">
                <div className="button-icon">⚙️</div>
                <span>Settings</span>
              </button>
              <Link to="/desktop-login">
                <button className="nav-button">
                  <div className="button-icon">🚪</div>
                  <span>Logout</span>
                </button>
              </Link>
                  </div>
                </div>

          {/* Main Content */}
          <div className="main-content">
            <div className="header">
              <h1>Settings</h1>
              <div className="user-info">
                <div className="user-email">john.doe@example.com</div>
                <div className="user-avatar">👤</div>
                        </div>
                      </div>

            {/* Settings Content */}
            <div className="settings-content">
              {/* Calorie Goals Section */}
              <div className="settings-section">
                <h2>Calorie Goals</h2>
                <div className="calorie-goals">
                  <div className="goal-input">
                    <label>Daily Calorie Goal</label>
                    <div className="input-group">
                      <input 
                        type="number" 
                        value={calorieGoal}
                        onChange={(e) => setCalorieGoal(parseInt(e.target.value))}
                      />
                      <button onClick={handleSaveCalorieGoal}>Save</button>
                    </div>
                  </div>

                  <div className="bmr-calculator">
                    <p>Or calculate based on BMR (Basal Metabolic Rate)</p>
                    <div className="bmr-inputs">
                      <div className="form-group">
                        <label>Height (cm)</label>
                        <input 
                          type="number" 
                          value={height}
                          onChange={(e) => setHeight(e.target.value)}
                          placeholder="e.g., 170"
                        />
                      </div>
                      <div className="form-group">
                        <label>Weight (kg)</label>
                        <input 
                          type="number" 
                          value={weight}
                          onChange={(e) => setWeight(e.target.value)}
                          placeholder="e.g., 70"
                        />
                      </div>
                      <div className="form-group">
                        <label>Age</label>
                        <input 
                          type="number" 
                          value={age}
                          onChange={(e) => setAge(e.target.value)}
                          placeholder="e.g., 25"
                        />
                      </div>
                      <div className="form-group">
                        <label>Gender</label>
                        <select 
                          value={gender}
                          onChange={(e) => setGender(e.target.value)}
                          className="select-input"
                        >
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                        </select>
                        </div>
                      <div className="form-group">
                        <label>Activity Level</label>
                        <select 
                          value={activityLevel}
                          onChange={(e) => setActivityLevel(e.target.value)}
                          className="select-input"
                        >
                          <option value="sedentary">Sedentary (little or no exercise)</option>
                          <option value="light">Light (exercise 1-3 days/week)</option>
                          <option value="moderate">Moderate (exercise 3-5 days/week)</option>
                          <option value="active">Active (exercise 6-7 days/week)</option>
                          <option value="veryActive">Very Active (hard exercise & physical job)</option>
                        </select>
                      </div>
                      <button onClick={calculateBMR}>Calculate</button>
                    </div>
                    {bmr !== null && (
                      <div className="bmr-result">
                        <p>Your BMR: {bmr} calories/day</p>
                        <p className="daily-calories">
                          Recommended Daily Calories: {calorieGoal} calories/day
                        </p>
                        <p className="bmr-explanation">
                          This is based on your BMR and activity level
                        </p>
                  </div>
                    )}
              </div>
            </div>
          </div>

              {/* Security Section */}
              <div className="settings-section">
                <h2>Security</h2>
                <div className="password-form">
                  <div className="form-group">
                    <label>Current Password</label>
                    <input 
                      type="password" 
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                </div>
                  <div className="form-group">
                    <label>New Password</label>
                    <input 
                      type="password" 
                      value={newPassword}
                      onChange={(e) => {
                        setNewPassword(e.target.value);
                        setPasswordError('');
                      }}
                      className={passwordError ? 'input-error' : ''}
                        />
                      </div>
                  <div className="form-group">
                    <label>Confirm New Password</label>
                    <input 
                      type="password" 
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        setPasswordError('');
                      }}
                      className={passwordError ? 'input-error' : ''}
                    />
                  </div>
                  {passwordError && (
                    <div className="error-message">{passwordError}</div>
                  )}
                  <button onClick={handleUpdatePassword}>Update Password</button>
                    </div>
                  </div>

              {/* Help & Support Section */}
              <div className="settings-section">
                <h2>Help & Support</h2>
                <div className="support-options">
                  <div className="support-card">
                    <div className="support-icon">📧</div>
                    <div>
                      <h3>Contact Support</h3>
                      <p>Get help from our team by emailing rachaelyn.l.st.denis-1@ou.edu</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
