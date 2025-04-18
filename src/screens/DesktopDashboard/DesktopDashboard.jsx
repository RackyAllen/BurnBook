import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./style.css";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, CartesianGrid } from 'recharts';

export const DesktopDashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('weekly');
  const [entries, setEntries] = useState(() => {
    const savedEntries = localStorage.getItem('entries');
    const placeholderEntries = [
      {
        type: 'meal',
        name: 'Breakfast',
        calories: 450,
        icon: '🍳'
      },
      {
        type: 'exercise',
        name: 'Morning Run',
        calories: 320,
        icon: '🏃'
      }
    ];
    
    if (savedEntries) {
      const parsedEntries = JSON.parse(savedEntries);
      // Only return placeholders if there are no saved entries
      return parsedEntries.length > 0 ? parsedEntries : placeholderEntries;
    }
    return placeholderEntries;
  });

  // Initialize calorie goal from localStorage
  const [calorieGoal, setCalorieGoal] = useState(() => {
    return parseInt(localStorage.getItem('calorieGoal')) || 2500;
  });

  // Listen for calorie goal updates
  useEffect(() => {
    const handleCalorieGoalUpdate = (event) => {
      setCalorieGoal(event.detail.calorieGoal);
    };

    window.addEventListener('calorieGoalUpdated', handleCalorieGoalUpdate);

    return () => {
      window.removeEventListener('calorieGoalUpdated', handleCalorieGoalUpdate);
    };
  }, []);

  // Calculate calories from entries
  const calculateCalories = () => {
    let eaten = 0;
    let burned = 0;

    entries.forEach(entry => {
      if (entry.type === 'meal') {
        eaten += entry.calories;
      } else if (entry.type === 'exercise') {
        burned += entry.calories;
      }
    });

    return { eaten, burned };
  };

  // Update calorie totals whenever entries change
  useEffect(() => {
    const { eaten, burned } = calculateCalories();
    setCaloriesEaten(eaten);
    setCaloriesBurned(burned);
  }, [entries]);

  const [caloriesEaten, setCaloriesEaten] = useState(0);
  const [caloriesBurned, setCaloriesBurned] = useState(0);
  const caloriesRemaining = calorieGoal - caloriesEaten + caloriesBurned;

  // Function to add a new entry
  const addEntry = (entry) => {
    // Get current entries
    const currentEntries = entries.filter(e => 
      !(e.name === 'Breakfast' && e.type === 'meal' && !e.date) && 
      !(e.name === 'Morning Run' && e.type === 'exercise' && !e.date)
    );
    
    // Add new entry at the beginning
    const updatedEntries = [entry, ...currentEntries];
    
    setEntries(updatedEntries);
    localStorage.setItem('entries', JSON.stringify(updatedEntries));
  };

  // Function to delete an entry
  const deleteEntry = (index) => {
    const newEntries = entries.filter((_, i) => i !== index);
    setEntries(newEntries);
    localStorage.setItem('entries', JSON.stringify(newEntries));
  };

  // Helper function to format date based on period
  const formatDate = (date, period) => {
    switch (period) {
      case 'weekly':
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      case 'monthly':
        // For monthly view, show "Apr 15" format
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      case 'yearly':
        return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      default:
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  // Helper function to get date for a number of days ago
  const getDateForDaysAgo = (daysAgo) => {
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    return date;
  };

  // Generate data for different periods
  const generatePeriodData = (period) => {
    let dates = [];
    let weights = [];
    const today = new Date();
    
    switch (period) {
      case 'weekly':
        // Generate last 7 days
        for (let i = 6; i >= 0; i--) {
          const date = getDateForDaysAgo(i);
          dates.push(date);
          weights.push(Math.round(190 + Math.random() * 5));
        }
        break;
      case 'monthly':
        // Generate data points for the past month
        const lastMonth = new Date(today);
        lastMonth.setMonth(lastMonth.getMonth() - 1);
        
        // Create 8 points spread across the month
        for (let i = 0; i < 8; i++) {
          const date = new Date(lastMonth);
          date.setDate(lastMonth.getDate() + Math.floor(i * 30 / 7));
          if (date <= today) {
            dates.push(new Date(date));
            weights.push(Math.round(190 + Math.random() * 5));
          }
        }
        break;
      case 'yearly':
        // Generate last 12 months
        const yearCurrentMonth = today.getMonth();
        const yearCurrentYear = today.getFullYear();
        
        for (let i = 11; i >= 0; i--) {
          const month = (yearCurrentMonth - i + 12) % 12;
          const yearOffset = Math.floor((yearCurrentMonth - i) / 12);
          const date = new Date(yearCurrentYear - yearOffset, month, 1);
          dates.push(date);
          weights.push(Math.round(190 + Math.random() * 5));
        }
        break;
    }
    
    // Format dates and sort by original date
    return dates.map((date, i) => ({
      originalDate: date.toISOString(),
      date: formatDate(date, period),
      weight: weights[i]
    })).sort((a, b) => new Date(a.originalDate) - new Date(b.originalDate));
  };

  // Sample data for different periods
  const weeklyData = generatePeriodData('weekly');
  const monthlyData = generatePeriodData('monthly');
  const yearlyData = generatePeriodData('yearly');

  const [weightData, setWeightData] = useState(() => {
    const savedEntries = JSON.parse(localStorage.getItem('weightEntries') || '[]');
    
    // Add dummy entries if no saved entries exist
    if (savedEntries.length === 0) {
      const dummyEntries = [
        { weight: 200, date: new Date(getDateForDaysAgo(6)).toISOString() },
        { weight: 198, date: new Date(getDateForDaysAgo(5)).toISOString() },
        { weight: 199, date: new Date(getDateForDaysAgo(4)).toISOString() },
        { weight: 201, date: new Date(getDateForDaysAgo(3)).toISOString() },
        { weight: 200, date: new Date(getDateForDaysAgo(2)).toISOString() },
        { weight: 202, date: new Date(getDateForDaysAgo(1)).toISOString() },
        { weight: 203, date: new Date(getDateForDaysAgo(0)).toISOString() }
      ];
      localStorage.setItem('weightEntries', JSON.stringify(dummyEntries));
      return dummyEntries.map(entry => ({
        ...entry,
        date: formatDate(new Date(entry.date), 'weekly')
      }));
    }
    
    return savedEntries.map(entry => ({
      ...entry,
      date: formatDate(new Date(entry.date), 'weekly')
    }));
  });

  // Function to update weight data
  const updateWeightData = () => {
    const savedEntries = JSON.parse(localStorage.getItem('weightEntries') || '[]');
    let periodData = [];
    
    switch (selectedPeriod) {
      case 'weekly':
        // For weekly, show the last 7 days
        periodData = savedEntries
          .filter(entry => {
            const entryDate = new Date(entry.date);
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
            return entryDate >= sevenDaysAgo;
          });
        break;
      
      case 'monthly':
        // For monthly, show the last 30 days
        periodData = savedEntries
          .filter(entry => {
            const entryDate = new Date(entry.date);
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            return entryDate >= thirtyDaysAgo;
          });
        break;
      
      case 'yearly':
        // For yearly, show the last 12 months
        periodData = savedEntries
          .filter(entry => {
            const entryDate = new Date(entry.date);
            const oneYearAgo = new Date();
            oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
            return entryDate >= oneYearAgo;
          });
        break;
    }

    // If no data exists, create sample data
    if (periodData.length === 0) {
      const today = new Date();
      const startWeight = 203; // Starting weight
      
      switch (selectedPeriod) {
        case 'weekly':
          for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            // Decrease weight by about 0.5 lbs per day with some variation
            const weight = startWeight - ((6 - i) * 0.5) + (Math.random() * 0.4 - 0.2);
            periodData.push({
              date: date.toISOString(),
              weight: Math.round(weight * 10) / 10
            });
          }
          break;
        case 'monthly':
          for (let i = 4; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - (i * 7));
            // Decrease weight by about 2 lbs per week with some variation
            const weight = startWeight - ((4 - i) * 2) + (Math.random() * 0.8 - 0.4);
            periodData.push({
              date: date.toISOString(),
              weight: Math.round(weight * 10) / 10
            });
          }
          break;
        case 'yearly':
          for (let i = 11; i >= 0; i--) {
            const date = new Date(today);
            date.setMonth(date.getMonth() - i);
            // Decrease weight by about 8 lbs per month with some variation
            const weight = startWeight - ((11 - i) * 8) + (Math.random() * 2 - 1);
            periodData.push({
              date: date.toISOString(),
              weight: Math.round(weight * 10) / 10
            });
          }
          break;
      }
    }

    // Format dates for display and sort by original date
    const formattedData = periodData.map(entry => ({
      ...entry,
      originalDate: entry.date,
      date: formatDate(new Date(entry.date), selectedPeriod)
    })).sort((a, b) => new Date(a.originalDate) - new Date(b.originalDate));

    setWeightData(formattedData);
  };

  // Update weight data when period changes
  useEffect(() => {
    updateWeightData();
  }, [selectedPeriod]);

  // Update weight data when new entries are added
  useEffect(() => {
    updateWeightData();
    
    const handleStorageChange = () => {
      updateWeightData();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [selectedPeriod]);

  const maxWeight = Math.max(...weightData.map(d => d.weight));
  const minWeight = Math.min(...weightData.map(d => d.weight));
  const heightScale = 150; // Maximum height for bars in pixels

  // Set up the global function for adding entries
  useEffect(() => {
    window.dashboardAddEntry = addEntry;
    return () => {
      delete window.dashboardAddEntry;
    };
  }, [entries]);

  // Function to delete a weight entry
  const deleteWeightEntry = (index) => {
    const savedEntries = JSON.parse(localStorage.getItem('weightEntries') || '[]');
    const newEntries = savedEntries.filter((_, i) => i !== index);
    localStorage.setItem('weightEntries', JSON.stringify(newEntries));
    updateWeightData();
  };

  const [showAllWeightEntries, setShowAllWeightEntries] = useState(false);

  // Get saved weight entries, sorted by date (newest first for list)
  const savedWeightEntries = JSON.parse(localStorage.getItem('weightEntries') || '[]')
    .sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort by date, newest first

  // Get entries to display (either all or just the first 5)
  const displayedWeightEntries = showAllWeightEntries 
    ? savedWeightEntries 
    : savedWeightEntries.slice(0, 5);

  // Format date for display in the entries list
  const formatEntryDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Update the stats section to handle empty data
  const getWeightStats = () => {
    if (!weightData || weightData.length === 0) {
      return {
        startWeight: 0,
        currentWeight: 0,
        weightLost: 0,
        trend: 0
      };
    }

    const startWeight = weightData[0].weight;
    const currentWeight = weightData[weightData.length - 1].weight;
    const weightLost = Math.round((startWeight - currentWeight) * 10) / 10;
    const weeksInPeriod = selectedPeriod === 'weekly' ? 1 : selectedPeriod === 'monthly' ? 4 : 52;
    const trend = weightLost / weeksInPeriod;

    return {
      startWeight,
      currentWeight,
      weightLost,
      trend
    };
  };

  const weightStats = getWeightStats();

  return (
    <div className="desktop-dashboard">
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
              <button className="nav-button active">
                <div className="button-icon">📊</div>
                <span>Dashboard</span>
              </button>
              <Link to="/desktop-mymeals">
                <button className="nav-button">
                  <div className="button-icon">🍽️</div>
                  <span>MyMeals</span>
                </button>
              </Link>
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
            {/* Header */}
            <div className="header">
              <h1>Dashboard</h1>
              <div className="user-info">
                <div className="user-email">john.doe@example.com</div>
                <div className="user-avatar">👤</div>
                      </div>
                    </div>

            {/* Calorie Summary */}
            <div className="calorie-summary">
              <div className="calorie-goal">
                <div className="goal-label">Daily Calorie Goal</div>
                <div className="goal-value">{calorieGoal.toLocaleString()}</div>
              </div>
              <div className="calorie-stats">
                <div className="stat">
                  <div className="stat-value eaten">{caloriesEaten.toLocaleString()}</div>
                  <div className="stat-label">Calories Eaten</div>
                </div>
                <div className="stat">
                  <div className="stat-value burned">{caloriesBurned.toLocaleString()}</div>
                  <div className="stat-label">Calories Burned</div>
                  </div>
                <div className="stat">
                  <div className="stat-value remaining">{caloriesRemaining.toLocaleString()}</div>
                  <div className="stat-label">Calories Left</div>
                </div>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress" 
                  style={{ 
                    width: `${Math.min(100, (caloriesEaten / calorieGoal) * 100)}%` 
                  }}
                ></div>
              </div>
              <div className="progress-labels">
                <span>0</span>
                <span>{calorieGoal.toLocaleString()} cal</span>
              </div>
              <div className="calorie-breakdown">
                <span className="goal">{calorieGoal.toLocaleString()}</span>
                <span className="separator"> - </span>
                <span className="eaten">{caloriesEaten.toLocaleString()}</span>
                <span className="separator"> + </span>
                <span className="burned">{caloriesBurned.toLocaleString()}</span>
                <span className="separator"> = </span>
                <span className="remaining">{caloriesRemaining.toLocaleString()}</span>
                <span className="separator"> cal</span>
                  </div>
                </div>

            {/* Today's Entries */}
            <div className="entries-section">
              <h2>Today's Entries</h2>
              <div className="entries-list">
                {entries.map((entry, index) => (
                  <div className="entry" key={index}>
                    <div className="entry-info">
                      <div className={`entry-icon ${entry.type}`}>{entry.icon}</div>
                      <span className="entry-name">{entry.name}</span>
                    </div>
                    <div className="entry-actions">
                      <span className={`entry-calories ${entry.type === 'exercise' ? 'burned' : ''}`}>
                        {entry.type === 'exercise' ? '-' : '+'}{entry.calories} cal
                      </span>
                      <button 
                        className="delete-entry" 
                        onClick={() => deleteEntry(index)}
                        title="Delete entry"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
                    </div>
                  </div>

            {/* Weight Progress */}
            <div className="weight-progress">
              <div className="weight-header">
                <div className="title-section">
                  <h2>Weight Progress</h2>
                  <div className="period">
                    {selectedPeriod === 'weekly' && 'Last 7 days'}
                    {selectedPeriod === 'monthly' && 'Last 30 days'}
                    {selectedPeriod === 'yearly' && 'Last 12 months'}
                  </div>
                </div>
                <div className="controls">
                  <Link to="/desktop-weight-entry">
                    <button className="add-weight">
                      <div className="button-icon">+</div>
                      <span>Add Weight</span>
                    </button>
                  </Link>
                  <div className="period-selector">
                    <button 
                      className={`period-btn ${selectedPeriod === 'weekly' ? 'active' : ''}`}
                      onClick={() => setSelectedPeriod('weekly')}
                    >
                      Weekly
                    </button>
                    <button 
                      className={`period-btn ${selectedPeriod === 'monthly' ? 'active' : ''}`}
                      onClick={() => setSelectedPeriod('monthly')}
                    >
                      Monthly
                    </button>
                    <button 
                      className={`period-btn ${selectedPeriod === 'yearly' ? 'active' : ''}`}
                      onClick={() => setSelectedPeriod('yearly')}
                    >
                      Yearly
                    </button>
                  </div>
                </div>
              </div>
              <div className="weight-chart">
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart
                    data={weightData}
                    margin={{ top: 30, right: 30, left: 20, bottom: 20 }}
                  >
                    <CartesianGrid 
                      strokeDasharray="3 3" 
                      stroke="#E5E5E5" 
                      vertical={false}
                    />
                    <XAxis 
                      dataKey="date" 
                      tick={{ fontSize: 12, fill: '#666666' }}
                      axisLine={{ stroke: '#E5E5E5' }}
                      tickLine={false}
                    />
                    <YAxis 
                      domain={[Math.floor((minWeight - 5) / 5) * 5, Math.ceil((maxWeight + 5) / 5) * 5]}
                      tick={{ fontSize: 12, fill: '#666666' }}
                      axisLine={{ stroke: '#E5E5E5' }}
                      tickLine={false}
                      width={45}
                      ticks={Array.from(
                        { length: Math.ceil((maxWeight - minWeight + 10) / 5) + 1 },
                        (_, i) => Math.floor((minWeight - 5) / 5) * 5 + i * 5
                      )}
                    />
                    <Line
                      type="monotone"
                      dataKey="weight"
                      stroke="#4A90E2"
                      strokeWidth={2}
                      dot={{
                        stroke: '#4A90E2',
                        strokeWidth: 2,
                        fill: '#FFFFFF',
                        r: 4
                      }}
                      label={{
                        position: 'top',
                        fill: '#666666',
                        fontSize: 12,
                        formatter: (value) => `${value} lbs`,
                        dy: -10
                      }}
                      connectNulls
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="weight-stats">
                <div className="stats-group">
                  <div className="stat-item">
                    <div className="stat-label">Starting Weight</div>
                    <div className="stat-value">{weightStats.startWeight} lbs</div>
                </div>
                  <div className="stat-item">
                    <div className="stat-label">Current Weight</div>
                    <div className="stat-value current">{weightStats.currentWeight} lbs</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-label">Weight Lost</div>
                    <div className="stat-value success">{weightStats.weightLost} lbs</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-label">Trend</div>
                    <div className="stat-value trend">
                      <div className="trend-icon">↓</div>
                      {weightStats.trend.toFixed(1)} lbs/week
                    </div>
                  </div>
                </div>
                <div className="goal-badge">
                  <div className="goal-label">Weekly Goal</div>
                  <div className="goal-value">2 lbs/week</div>
                </div>
              </div>
            </div>

            {/* Weight Entries List */}
            <div className="entries-section">
              <h2>Weight Entries</h2>
              <div className="entries-list">
                {displayedWeightEntries.map((entry, index) => (
                  <div className="entry" key={index}>
                    <div className="entry-info">
                      <div className="entry-icon">⚖️</div>
                      <span className="entry-name">{entry.weight} lbs</span>
                    </div>
                    <div className="entry-actions">
                      <span className="entry-date">
                        {formatEntryDate(entry.date)}
                      </span>
                      <button 
                        className="delete-entry" 
                        onClick={() => deleteWeightEntry(index)}
                        title="Delete entry"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
                {savedWeightEntries.length === 0 && (
                  <div className="no-entries">
                    No weight entries yet. Add your first weight entry to track your progress!
                  </div>
                )}
                {savedWeightEntries.length > 5 && !showAllWeightEntries && (
                  <button 
                    className="view-more-btn"
                    onClick={() => setShowAllWeightEntries(true)}
                  >
                    View More ({savedWeightEntries.length - 5} more)
                </button>
                )}
                {showAllWeightEntries && (
                  <button 
                    className="view-more-btn"
                    onClick={() => setShowAllWeightEntries(false)}
                  >
                    Show Less
              </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
