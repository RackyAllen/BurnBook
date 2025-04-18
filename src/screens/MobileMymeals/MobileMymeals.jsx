import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ErrorModal } from "../../components/ErrorModal/ErrorModal";
import "./style.css";

export const MobileMymeals = () => {
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
      'oatmeal|porridge|cereal|granola': '🥣',
      'pancake|waffle|french toast': '🥞',
      'egg|omelet|scramble': '🥚',
      'toast|bagel|bread': '🍞',
      'pizza|calzone': '🍕',
      'burger|sandwich|sub|hoagie': '🍔',
      'taco|burrito|quesadilla': '🌮',
      'sushi|roll|maki': '🍱',
      'pasta|spaghetti|noodle|ramen': '🍝',
      'curry|stir fry|stir-fry': '🍛',
      'chicken|poultry|turkey': '🍗',
      'beef|steak|burger|meat': '🥩',
      'fish|salmon|tuna|seafood': '🐟',
      'salad|greens|lettuce': '🥗',
      'soup|stew|chili': '🍲',
      'rice|grain|quinoa': '🍚',
      'apple|pear|fruit': '🍎',
      'banana|plantain': '🍌',
      'avocado|guacamole': '🥑',
      'carrot|vegetable|veggie': '🥕',
      'broccoli|cauliflower|vegetable': '🥦',
      'cheese|dairy': '🧀',
      'milk|yogurt|dairy': '🥛',
      'ice cream|gelato': '🍦',
      'cookie|cake|dessert|sweet': '🍪',
      'popcorn|chips|snack': '🍿'
    };

    for (const [pattern, icon] of Object.entries(iconMap)) {
      if (new RegExp(pattern).test(mealNameLower)) {
        return icon;
      }
    }

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
    <div className="mobile-mymeals">
      {error && <ErrorModal message={error} onClose={() => setError(null)} />}
      <div className="mobile-header">
        <h1>MyMeals</h1>
      </div>

      <div className="mobile-content">
        <div className="mobile-add-meal-section">
          <h2>Add New Meal</h2>
          <div className="mobile-meal-form">
            <div className="mobile-form-group">
              <label>Meal Name</label>
              <input 
                type="text" 
                name="name"
                value={newMeal.name}
                onChange={handleInputChange}
                placeholder="Enter meal name" 
              />
            </div>
            <div className="mobile-form-group">
              <label>Calories</label>
              <input 
                type="number" 
                name="calories"
                value={newMeal.calories}
                onChange={handleInputChange}
                placeholder="Enter calories" 
              />
            </div>
            <div className="mobile-form-group">
              <label>Description</label>
              <textarea 
                name="description"
                value={newMeal.description}
                onChange={handleInputChange}
                placeholder="Enter meal description"
                className="mobile-meal-description"
              ></textarea>
            </div>
            <button className="mobile-save-meal-btn" onClick={handleSaveMeal}>
              Save Meal
            </button>
          </div>
        </div>

        <div className="mobile-saved-meals-section">
          <h2>Saved Meals</h2>
          <div className="mobile-meals-list">
            {savedMeals.map((meal) => (
              <div key={meal.id} className="mobile-meal-item">
                <div className="mobile-meal-info">
                  <div className="mobile-meal-icon">{meal.icon}</div>
                  <div className="mobile-meal-details">
                    <h3>{meal.name}</h3>
                    <p>{meal.description}</p>
                  </div>
                </div>
                <div className="mobile-meal-actions">
                  <span className="mobile-meal-calories">{meal.calories} cal</span>
                  <button 
                    className="mobile-delete-btn"
                    onClick={() => handleDeleteMeal(meal.id)}
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
            {savedMeals.length === 0 && (
              <div className="mobile-no-meals">
                No saved meals yet. Add your first meal above!
              </div>
            )}
          </div>
        </div>
      </div>

      <nav className="mobile-nav">
        <Link to="/mobile-dashboard" className="mobile-nav-item">
          <span className="mobile-nav-icon">📊</span>
        </Link>
        <Link to="/mobile-mymeals" className="mobile-nav-item active">
          <span className="mobile-nav-icon">🍽️</span>
        </Link>
        <Link to="/mobile-entry-window" className="mobile-nav-item primary">
          <span className="mobile-plus-icon">+</span>
        </Link>
        <Link to="/mobile-settings" className="mobile-nav-item">
          <span className="mobile-nav-icon">⚙️</span>
        </Link>
        <Link to="/mobile-login" className="mobile-nav-item">
          <span className="mobile-nav-icon">🚪</span>
        </Link>
      </nav>
    </div>
  );
};
