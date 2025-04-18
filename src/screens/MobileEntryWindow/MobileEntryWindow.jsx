import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ErrorModal } from "../../components/ErrorModal/ErrorModal";
import "./style.css";

export const MobileEntryWindow = () => {
  const navigate = useNavigate();
  const [entryType, setEntryType] = useState('eaten');
  const [mealType, setMealType] = useState('breakfast');
  const [workoutType, setWorkoutType] = useState('run');
  const [timeOfDay, setTimeOfDay] = useState('morning');
  const [selectedMeal, setSelectedMeal] = useState('');
  const [calories, setCalories] = useState('');
  const [error, setError] = useState(null);
  const [savedMeals] = useState(() => {
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

  const handleMealSelect = (e) => {
    const meal = savedMeals.find(m => m.id === parseInt(e.target.value));
    if (meal) {
      setSelectedMeal(meal.id.toString());
      setCalories(meal.calories.toString());
      setMealType('saved');
    }
  };

  const handleCaloriesChange = (e) => {
    const value = e.target.value;
    if (value === '' || /^\d+$/.test(value)) {
      setCalories(value);
    }
  };

  const handleSubmit = () => {
    if (!calories || calories <= 0) {
      setError(calories === '' ? 'Please enter the number of calories' : 'Please enter a valid number of calories');
      return;
    }

    // Get the selected meal details if it's a saved meal
    const selectedMealDetails = savedMeals.find(meal => meal.id === parseInt(selectedMeal));

    const entry = {
      type: entryType === 'eaten' ? 'meal' : 'exercise',
      name: entryType === 'eaten' ? 
        (selectedMealDetails ? selectedMealDetails.name : mealType.charAt(0).toUpperCase() + mealType.slice(1)) :
        `${timeOfDay.charAt(0).toUpperCase() + timeOfDay.slice(1)} ${workoutType === 'other' ? 'Workout' : workoutType.charAt(0).toUpperCase() + workoutType.slice(1)}`,
      calories: parseInt(calories),
      icon: entryType === 'eaten' ? 
        (selectedMealDetails ? selectedMealDetails.icon :
         mealType === 'breakfast' ? '🍳' : 
         mealType === 'lunch' ? '🍽️' : 
         mealType === 'dinner' ? '🍖' : '🍪') :
        (workoutType === 'run' ? '🏃' :
         workoutType === 'walk' ? '🚶' :
         workoutType === 'swim' ? '🏊' : '🏋️'),
      date: new Date().toISOString()
    };

    try {
      // Get existing entries from localStorage
      const existingEntries = JSON.parse(localStorage.getItem('entries') || '[]');
      // Add new entry to the beginning of the array
      const updatedEntries = [entry, ...existingEntries];
      // Save back to localStorage
      localStorage.setItem('entries', JSON.stringify(updatedEntries));
      
      // Navigate to dashboard
      navigate('/mobile-dashboard');
    } catch (error) {
      setError('Unable to add entry. Please try again.');
    }
  };

  return (
    <div className="mobile-entry-window">
      {error && <ErrorModal message={error} onClose={() => setError(null)} />}
      <div className="mobile-entry-header">
        <button className="mobile-entry-back-btn" onClick={() => navigate('/mobile-dashboard')}>
          ←
        </button>
        <h1 className="mobile-entry-header-title">Add Entry</h1>
        <div style={{ width: 24 }}></div>
      </div>

      <div className="mobile-entry-body">
        <div className="mobile-entry-content">
          <div className="mobile-entry-form">
            <div className="mobile-entry-sections">
              <div className="mobile-entry-section">
                <div className="mobile-entry-label">Entry Type</div>
                <div className="mobile-entry-type-buttons">
                  <button
                    className={`mobile-entry-type-btn ${entryType === 'eaten' ? 'active' : ''}`}
                    onClick={() => setEntryType('eaten')}
                  >
                    <img 
                      src="/img/frame-25-2.svg"
                      alt="" 
                      className={`button-icon ${entryType === 'eaten' ? 'active' : ''}`}
                      style={{marginRight: '8px'}} 
                    />
                    Eaten
                  </button>
                  <button
                    className={`mobile-entry-type-btn ${entryType === 'burned' ? 'active' : ''}`}
                    onClick={() => setEntryType('burned')}
                  >
                    <img 
                      src="/img/frame-26-2.svg"
                      alt="" 
                      className={`button-icon ${entryType === 'burned' ? 'active' : ''}`}
                      style={{marginRight: '8px'}} 
                    />
                    Burned
                  </button>
                </div>
              </div>

              {entryType === 'eaten' ? (
                <>
                  <div className="mobile-entry-section">
                    <div className="mobile-entry-label">Meal Type</div>
                    <div className="mobile-entry-meal-types">
                      <button 
                        className={`mobile-meal-type-btn ${mealType === 'breakfast' ? 'active' : ''}`}
                        onClick={() => setMealType('breakfast')}
                      >
                        Breakfast
                      </button>
                      <button 
                        className={`mobile-meal-type-btn ${mealType === 'lunch' ? 'active' : ''}`}
                        onClick={() => setMealType('lunch')}
                      >
                        Lunch
                      </button>
                      <button 
                        className={`mobile-meal-type-btn ${mealType === 'dinner' ? 'active' : ''}`}
                        onClick={() => setMealType('dinner')}
                      >
                        Dinner
                      </button>
                      <button 
                        className={`mobile-meal-type-btn ${mealType === 'snack' ? 'active' : ''}`}
                        onClick={() => setMealType('snack')}
                      >
                        Snack
                      </button>
                    </div>
                  </div>

                  <div className="mobile-entry-section">
                    <div className="mobile-entry-label">Calories</div>
                    <div className="mobile-entry-input-group">
                      <input
                        type="text"
                        className="mobile-entry-input"
                        placeholder="Enter calories"
                        value={calories}
                        onChange={handleCaloriesChange}
                      />
                    </div>
                  </div>

                  <div className="mobile-entry-meals-section">
                    <div className="mobile-entry-meals-title">Or choose from MyMeals</div>
                    <select 
                      className="mobile-entry-select"
                      value={selectedMeal}
                      onChange={handleMealSelect}
                    >
                      <option value="" disabled>Select a meal</option>
                      {savedMeals.map(meal => (
                        <option key={meal.id} value={meal.id}>
                          {meal.icon} {meal.name} ({meal.calories} cal)
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              ) : (
                <>
                  <div className="mobile-entry-section">
                    <div className="mobile-entry-label">Workout Type</div>
                    <div className="mobile-entry-workout-types">
                      <button 
                        className={`mobile-workout-type-btn ${workoutType === 'run' ? 'active' : ''}`}
                        onClick={() => setWorkoutType('run')}
                      >
                        Run
                      </button>
                      <button 
                        className={`mobile-workout-type-btn ${workoutType === 'walk' ? 'active' : ''}`}
                        onClick={() => setWorkoutType('walk')}
                      >
                        Walk
                      </button>
                      <button 
                        className={`mobile-workout-type-btn ${workoutType === 'swim' ? 'active' : ''}`}
                        onClick={() => setWorkoutType('swim')}
                      >
                        Swim
                      </button>
                      <button 
                        className={`mobile-workout-type-btn ${workoutType === 'other' ? 'active' : ''}`}
                        onClick={() => setWorkoutType('other')}
                      >
                        Other
                      </button>
                    </div>
                  </div>

                  <div className="mobile-entry-section">
                    <div className="mobile-entry-label">Time of Day</div>
                    <div className="mobile-entry-time-types">
                      <button 
                        className={`mobile-time-type-btn ${timeOfDay === 'morning' ? 'active' : ''}`}
                        onClick={() => setTimeOfDay('morning')}
                      >
                        Morning
                      </button>
                      <button 
                        className={`mobile-time-type-btn ${timeOfDay === 'afternoon' ? 'active' : ''}`}
                        onClick={() => setTimeOfDay('afternoon')}
                      >
                        Afternoon
                      </button>
                      <button 
                        className={`mobile-time-type-btn ${timeOfDay === 'evening' ? 'active' : ''}`}
                        onClick={() => setTimeOfDay('evening')}
                      >
                        Evening
                      </button>
                    </div>
                  </div>

                  <div className="mobile-entry-section">
                    <div className="mobile-entry-label">Calories</div>
                    <div className="mobile-entry-input-group">
                      <input
                        type="text"
                        className="mobile-entry-input"
                        placeholder="Enter calories"
                        value={calories}
                        onChange={handleCaloriesChange}
                      />
                    </div>
                  </div>
                </>
              )}
            </div>

            <button 
              className="mobile-entry-submit-btn" 
              onClick={handleSubmit}
              disabled={!calories || calories <= 0}
            >
              Add Entry
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
