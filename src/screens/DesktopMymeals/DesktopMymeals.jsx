import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ErrorModal } from "../../components/ErrorModal/ErrorModal";
import "./style.css";

export const DesktopMymeals = () => {
  const [newMeal, setNewMeal] = useState({
    name: '',
    description: '',
    calories: ''
  });
  const [savedMeals, setSavedMeals] = useState(() => {
    const saved = localStorage.getItem('savedMeals');
    return saved ? JSON.parse(saved) : [
      {
        id: 1,
        name: 'Breakfast Bowl',
        description: 'Oatmeal with fruits and nuts',
        calories: 450,
        icon: '🥣'
      },
      {
        id: 2,
        name: 'Chicken Salad',
        description: 'Grilled chicken with mixed greens',
        calories: 320,
        icon: '🥗'
      }
    ];
  });
  const [error, setError] = useState(null);

  const getMealIcon = (mealName) => {
    const mealNameLower = mealName.toLowerCase();
    
    const iconMap = {
      // Breakfast
      'oatmeal|porridge|cereal|granola': '🥣',
      'pancake|waffle|french toast': '🥞',
      'egg|omelet|scramble': '🥚',
      'toast|bagel|bread': '🍞',
      
      // Main dishes
      'pizza|calzone': '🍕',
      'burger|sandwich|sub|hoagie': '🍔',
      'taco|burrito|quesadilla': '🌮',
      'sushi|roll|maki': '🍱',
      'pasta|spaghetti|noodle|ramen': '🍝',
      'curry|stir fry|stir-fry': '🍛',
      
      // Proteins
      'chicken|poultry|turkey': '🍗',
      'beef|steak|burger|meat': '🥩',
      'fish|salmon|tuna|seafood': '🐟',
      
      // Vegetarian
      'salad|greens|lettuce': '🥗',
      'soup|stew|chili': '🍲',
      'rice|grain|quinoa': '🍚',
      
      // Fruits & Vegetables
      'apple|pear|fruit': '🍎',
      'banana|plantain': '🍌',
      'avocado|guacamole': '🥑',
      'carrot|vegetable|veggie': '🥕',
      'broccoli|cauliflower|vegetable': '🥦',
      
      // Dairy
      'cheese|dairy': '🧀',
      'milk|yogurt|dairy': '🥛',
      
      // Snacks & Desserts
      'ice cream|gelato': '🍦',
      'cookie|cake|dessert|sweet': '🍪',
      'popcorn|chips|snack': '🍿'
    };

    // Check each pattern in the iconMap
    for (const [pattern, icon] of Object.entries(iconMap)) {
      if (new RegExp(pattern).test(mealNameLower)) {
        return icon;
      }
    }

    // If no match found, return a random icon
    const defaultIcons = ['🍎', '🥑', '🥩', '🍗', '🥦', '🥕', '🍞', '🥚', '🥛', '🧀', '🍕', '🍝', '🍜', '🍛', '🍱'];
    return defaultIcons[Math.floor(Math.random() * defaultIcons.length)];
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewMeal(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDeleteMeal = (mealId) => {
    const updatedMeals = savedMeals.filter(meal => meal.id !== mealId);
    setSavedMeals(updatedMeals);
    localStorage.setItem('savedMeals', JSON.stringify(updatedMeals));
  };

  const handleSaveMeal = () => {
    if (!newMeal.name.trim()) {
      setError('Please enter a meal name');
      return;
    }
    if (!newMeal.calories) {
      setError('Please enter the number of calories');
      return;
    }
    if (isNaN(newMeal.calories) || newMeal.calories <= 0) {
      setError('Please enter a valid number of calories');
      return;
    }

    const meal = {
      id: Date.now(),
      name: newMeal.name,
      description: newMeal.description,
      calories: parseInt(newMeal.calories),
      icon: getMealIcon(newMeal.name)
    };

    const updatedMeals = [...savedMeals, meal];
    setSavedMeals(updatedMeals);
    localStorage.setItem('savedMeals', JSON.stringify(updatedMeals));
    setNewMeal({ name: '', description: '', calories: '' });
  };

  return (
    <div className="desktop-dashboard">
      {error && <ErrorModal message={error} onClose={() => setError(null)} />}
      <div className="dashboard-content">
        <div className="dashboard-layout">
          {/* Sidebar */}
          <div className="sidebar">
            <div className="logo">
              <div className="logo-icon">
                🔥
              </div>
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
              <button className="nav-button active">
                <div className="button-icon">🍽️</div>
                <span>MyMeals</span>
              </button>
            </div>
            <div className="bottom-nav">
              <Link to="/desktop-settings">
                <button className="nav-button">
                  <div className="button-icon">⚙️</div>
                  <span>Settings</span>
                </button>
              </Link>
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
              <h1>MyMeals</h1>
              <div className="user-info">
                <div className="user-email">john.doe@example.com</div>
                <div className="user-avatar">👤</div>
              </div>
            </div>

            {/* Rest of your My Meals content */}
            <div className="meals-content">
              <div className="add-meal-section">
                <h2>Add New Meal</h2>
                <div className="meal-form">
                  <div className="form-group">
                    <label>Meal Name</label>
                    <input 
                      type="text" 
                      name="name"
                      value={newMeal.name}
                      onChange={handleInputChange}
                      placeholder="Enter meal name" 
                    />
                  </div>
                  <div className="form-group">
                    <label>Calories</label>
                    <input 
                      type="number" 
                      name="calories"
                      value={newMeal.calories}
                      onChange={handleInputChange}
                      placeholder="Enter calories" 
                    />
                  </div>
                  <div className="form-group">
                    <label>Description</label>
                    <textarea 
                      name="description"
                      value={newMeal.description}
                      onChange={handleInputChange}
                      placeholder="Enter meal description"
                      className="meal-description-input"
                    ></textarea>
                  </div>
                  <button className="save-meal-btn" onClick={handleSaveMeal}>Save Meal</button>
                </div>
              </div>

              <div className="saved-meals-section">
                <h2>Saved Meals</h2>
                <div className="meals-list">
                  {savedMeals.map(meal => (
                    <div key={meal.id} className="meal-item">
                      <div className="meal-info">
                        <div className="meal-icon">{meal.icon}</div>
                        <div>
                          <h3>{meal.name}</h3>
                          <p>{meal.description}</p>
                        </div>
                      </div>
                      <div className="meal-actions">
                        <span>{meal.calories} cal</span>
                        <button 
                          className="delete-btn" 
                          onClick={() => handleDeleteMeal(meal.id)}
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
