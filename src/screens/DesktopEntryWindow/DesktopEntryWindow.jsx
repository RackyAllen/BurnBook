import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ErrorModal } from "../../components/ErrorModal/ErrorModal";
import "./style.css";

export const DesktopEntryWindow = () => {
  const [entryType, setEntryType] = useState('eaten');
  const [mealType, setMealType] = useState('breakfast');
  const [workoutType, setWorkoutType] = useState('run');
  const [timeOfDay, setTimeOfDay] = useState('morning');
  const [selectedMeal, setSelectedMeal] = useState('');
  const [calories, setCalories] = useState('');
  const [error, setError] = useState(null);
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

  const handleMealSelect = (e) => {
    const mealId = e.target.value;
    setSelectedMeal(mealId);
    
    // Find the selected meal and update calories
    const meal = savedMeals.find(m => m.id === parseInt(mealId));
    if (meal) {
      setCalories(meal.calories.toString());
      setMealType('saved'); // Set meal type to 'saved' only
    }
  };

  const handleCaloriesChange = (e) => {
    const value = e.target.value;
    // Only allow numbers
    if (value === '' || /^\d+$/.test(value)) {
      setCalories(value);
    }
  };

  const handleAddEntry = () => {
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
      window.location.href = '/desktop-dashboard';
    } catch (error) {
      setError('Unable to add entry. Please try again.');
    }
  };

  return (
    <div className="desktop-entry-window">
      {error && <ErrorModal message={error} onClose={() => setError(null)} />}
      <div className="body-5">
        <div className="div-107">
          <div className="div-108">
            <div className="div-109">
              <div className="text-wrapper-71">Add Entry</div>
              <Link className="button-16" to="/desktop-dashboard">
                <div className="frame-32">
                  <img className="frame-33" alt="Frame" src="/img/frame-22.svg" />
                </div>
              </Link>
            </div>

            <div className="div-110">
              <div className="content-section">
                <div className="div-111">
                  <div className="text-wrapper-72">Entry Type</div>
                  <div className="div-112">
                    <button 
                      className={`button-17 ${entryType === 'eaten' ? 'active' : ''}`}
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
                      className={`button-17 ${entryType === 'burned' ? 'active' : ''}`}
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

                {entryType === 'eaten' && (
                  <div className="div-meal-type">
                    <div className="text-wrapper-72">Meal Type</div>
                    <div className="meal-type-buttons">
                      <button 
                        className={`meal-type-btn ${mealType === 'breakfast' ? 'active' : ''}`}
                        onClick={() => setMealType('breakfast')}
                      >
                        Breakfast
                      </button>
                      <button 
                        className={`meal-type-btn ${mealType === 'lunch' ? 'active' : ''}`}
                        onClick={() => setMealType('lunch')}
                      >
                        Lunch
                      </button>
                      <button 
                        className={`meal-type-btn ${mealType === 'dinner' ? 'active' : ''}`}
                        onClick={() => setMealType('dinner')}
                      >
                        Dinner
                      </button>
                      <button 
                        className={`meal-type-btn ${mealType === 'snack' ? 'active' : ''}`}
                        onClick={() => setMealType('snack')}
                      >
                        Snack
                      </button>
                    </div>
                  </div>
                )}

                {entryType === 'burned' && (
                  <>
                    <div className="div-meal-type">
                      <div className="text-wrapper-72">Workout Type</div>
                      <div className="meal-type-buttons">
                        <button 
                          className={`meal-type-btn ${workoutType === 'run' ? 'active' : ''}`}
                          onClick={() => setWorkoutType('run')}
                        >
                          Run
                        </button>
                        <button 
                          className={`meal-type-btn ${workoutType === 'walk' ? 'active' : ''}`}
                          onClick={() => setWorkoutType('walk')}
                        >
                          Walk
                        </button>
                        <button 
                          className={`meal-type-btn ${workoutType === 'swim' ? 'active' : ''}`}
                          onClick={() => setWorkoutType('swim')}
                        >
                          Swim
                        </button>
                        <button 
                          className={`meal-type-btn ${workoutType === 'other' ? 'active' : ''}`}
                          onClick={() => setWorkoutType('other')}
                        >
                          Other
                        </button>
                      </div>
                    </div>

                    <div className="div-meal-type">
                      <div className="text-wrapper-72">Time of Day</div>
                      <div className="meal-type-buttons three-buttons">
                        <button 
                          className={`meal-type-btn ${timeOfDay === 'morning' ? 'active' : ''}`}
                          onClick={() => setTimeOfDay('morning')}
                        >
                          Morning
                        </button>
                        <button 
                          className={`meal-type-btn ${timeOfDay === 'afternoon' ? 'active' : ''}`}
                          onClick={() => setTimeOfDay('afternoon')}
                        >
                          Afternoon
                        </button>
                        <button 
                          className={`meal-type-btn ${timeOfDay === 'night' ? 'active' : ''}`}
                          onClick={() => setTimeOfDay('night')}
                        >
                          Night
                        </button>
                      </div>
                    </div>
                  </>
                )}

                <div className="div-113">
                  <div className="text-wrapper-75">Calories</div>
                  <div className="input-4">
                    <input
                      type="text"
                      value={calories}
                      onChange={handleCaloriesChange}
                      placeholder="Enter calories"
                      className="calories-input"
                    />
                    <div className="text-wrapper-77">cal</div>
                  </div>
                </div>

                {entryType === 'eaten' && (
                  <div className="div-115">
                    <div className="text-wrapper-78">Or choose from My Meals</div>
                    <select 
                      className="select"
                      value={selectedMeal}
                      onChange={handleMealSelect}
                      placeholder="Select a meal"
                    >
                      <option value="" disabled>Select a meal</option>
                      {savedMeals.map(meal => (
                        <option key={meal.id} value={meal.id}>
                          {meal.icon} {meal.name} ({meal.calories} cal)
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              <div className="div-116">
                <button className="button-19" onClick={handleAddEntry}>
                  <div className="text-wrapper-80">Add Entry</div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
