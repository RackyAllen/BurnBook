import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./style.css";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, CartesianGrid, Tooltip } from 'recharts';

export const MobileDashboard = () => {
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

  const [caloriesEaten, setCaloriesEaten] = useState(0);
  const [caloriesBurned, setCaloriesBurned] = useState(0);
  const caloriesRemaining = calorieGoal - caloriesEaten + caloriesBurned;

  // Update calorie totals whenever entries change
  useEffect(() => {
    const { eaten, burned } = calculateCalories();
    setCaloriesEaten(eaten);
    setCaloriesBurned(burned);
  }, [entries]);

  // Function to add a new entry
  const addEntry = (entry) => {
    const currentEntries = entries.filter(e => 
      !(e.name === 'Breakfast' && e.type === 'meal' && !e.date) && 
      !(e.name === 'Morning Run' && e.type === 'exercise' && !e.date)
    );
    
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

  // Weight tracking functionality
  const generateDummyData = () => {
    const data = [];
    const startDate = new Date();
    startDate.setFullYear(startDate.getFullYear() - 1); // Start from 1 year ago
    
    // Generate daily entries for the past year
    for (let i = 0; i < 365; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      
      // Generate a weight that fluctuates between 190 and 205
      // with a general downward trend over the year
      const baseWeight = 205 - (i * 0.04); // Gradual decrease over the year
      const randomFluctuation = (Math.random() - 0.5) * 2; // ±1 pound fluctuation
      const weight = Math.round((baseWeight + randomFluctuation) * 10) / 10;
      
      data.push({
        date: currentDate.toISOString().split('T')[0],
        weight: weight
      });
    }
    return data;
  };

  // Update the weightData state to use more comprehensive dummy data
  const [weightData, setWeightData] = useState(generateDummyData());

  // Helper function to get date for days ago
  const getDateForDaysAgo = (daysAgo) => {
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    return date;
  };

  // Function to delete a weight entry
  const deleteWeightEntry = (date) => {
    const newEntries = weightData.filter(entry => entry.date !== date);
    setWeightData(newEntries);
    localStorage.setItem('weightEntries', JSON.stringify(newEntries));
  };

  // Helper function to format date based on period
  const formatDate = (date, period) => {
    const options = {
      weekly: { month: 'short', day: 'numeric' },
      monthly: { month: 'short', day: 'numeric' },
      yearly: { month: 'short', year: 'numeric' }
    };
    return new Date(date).toLocaleDateString('en-US', options[period] || options.weekly);
  };

  // Function to filter and format weight data based on selected period
  const getFilteredWeightData = () => {
    const now = new Date();
    const periodLimits = {
      weekly: 7,
      monthly: 30,
      yearly: 365
    };

    const limit = periodLimits[selectedPeriod];
    const cutoffDate = new Date(now);
    cutoffDate.setDate(cutoffDate.getDate() - limit);

    let filteredData = weightData
      .filter(entry => new Date(entry.date) >= cutoffDate)
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    // For monthly view, show data points every 5 days
    if (selectedPeriod === 'monthly') {
      const sampledData = [];
      for (let i = 0; i < filteredData.length; i += 5) {
        sampledData.push(filteredData[i]);
      }
      // Always include the most recent data point if it's not already included
      if (sampledData[sampledData.length - 1]?.date !== filteredData[filteredData.length - 1]?.date) {
        sampledData.push(filteredData[filteredData.length - 1]);
      }
      filteredData = sampledData;
    }

    // For yearly view, aggregate by month
    if (selectedPeriod === 'yearly') {
      const monthlyData = {};
      filteredData.forEach(entry => {
        const monthKey = entry.date.substring(0, 7); // YYYY-MM format
        if (!monthlyData[monthKey]) {
          monthlyData[monthKey] = {
            weights: [],
            date: entry.date // Keep the first date of the month
          };
        }
        monthlyData[monthKey].weights.push(entry.weight);
      });

      // Calculate average weight for each month
      filteredData = Object.entries(monthlyData).map(([month, data]) => ({
        date: data.date,
        weight: Math.round((data.weights.reduce((a, b) => a + b, 0) / data.weights.length) * 10) / 10
      }));
    }

    return filteredData;
  };

  // Get the filtered data for the chart
  const chartData = getFilteredWeightData();

  // Calculate weight stats based on filtered data
  const weightStats = chartData.length > 0 ? {
    startWeight: `${chartData[0].weight} lbs`,
    currentWeight: `${chartData[chartData.length - 1].weight} lbs`,
    weightLost: `${(chartData[0].weight - chartData[chartData.length - 1].weight).toFixed(1)} lbs`,
    trend: (() => {
      const weightChange = chartData[0].weight - chartData[chartData.length - 1].weight;
      const weeklyChange = selectedPeriod === 'weekly' 
        ? weightChange 
        : selectedPeriod === 'monthly'
          ? (weightChange / 4)  // Divide by 4 weeks
          : (weightChange / 52); // Divide by 52 weeks
      return `${weeklyChange.toFixed(1)} lbs/week`;
    })()
  } : {
    startWeight: '--',
    currentWeight: '--',
    weightLost: '--',
    trend: '--'
  };

  const [showAllEntries, setShowAllEntries] = useState(false);

  const displayedEntries = showAllEntries 
    ? weightData 
    : weightData.slice(0, 6);

  return (
    <div className="mobile-dashboard">
      <div className="mobile-content">
        <div className="mobile-calorie-summary">
          <div className="mobile-calorie-goal">
            <div className="mobile-goal-label">Daily Calorie Goal</div>
            <div className="mobile-goal-value">{calorieGoal}</div>
              </div>
          <div className="mobile-calorie-stats">
            <div className="mobile-stat">
              <div className="mobile-stat-value eaten">{caloriesEaten}</div>
              <div className="mobile-stat-label">Eaten</div>
              </div>
            <div className="mobile-stat">
              <div className="mobile-stat-value burned">{caloriesBurned}</div>
              <div className="mobile-stat-label">Burned</div>
            </div>
            <div className="mobile-stat">
              <div className="mobile-stat-value remaining">{calorieGoal - caloriesEaten + caloriesBurned}</div>
              <div className="mobile-stat-label">Remaining</div>
            </div>
          </div>
          <div className="mobile-progress-bar">
            <div className="mobile-progress" style={{ width: `${(caloriesEaten / calorieGoal) * 100}%` }}></div>
        </div>
          <div className="mobile-progress-labels">
            <span>0</span>
            <span>{calorieGoal}</span>
                        </div>
          <div className="mobile-calorie-equation">
            <span className="goal">{calorieGoal}</span>
            <span className="operator"> - </span>
            <span className="eaten">{caloriesEaten}</span>
            <span className="operator"> + </span>
            <span className="burned">{caloriesBurned}</span>
            <span className="operator"> = </span>
            <span className="remaining">{calorieGoal - caloriesEaten + caloriesBurned}</span>
            <span className="unit"> cal</span>
                      </div>
                    </div>

        <div className="mobile-entries-section">
          <h2>Today's Entries</h2>
          <div className="mobile-entries-list">
            {entries.map((entry, index) => (
              <div key={index} className="mobile-entry">
                <div className="mobile-entry-info">
                  <div className={`mobile-entry-icon ${entry.type}`}>{entry.icon}</div>
                  <div className="mobile-entry-name">{entry.name}</div>
                        </div>
                <div className="mobile-entry-actions">
                  <span className={`mobile-entry-calories ${entry.type === 'exercise' ? 'burned' : ''}`}>
                    {entry.type === 'exercise' ? '-' : '+'}{entry.calories} cal
                  </span>
                  <button 
                    className="mobile-delete-entry" 
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
        <div className="mobile-weight-progress">
          <div className="mobile-weight-header">
            <div className="mobile-title-section">
              <h2>Weight Progress</h2>
              <div className="mobile-period">Last {selectedPeriod === 'weekly' ? '7 days' : selectedPeriod === 'monthly' ? '30 days' : '12 months'}</div>
                        </div>
            <div className="mobile-controls">
              <Link to="/mobile-weight-entry" className="mobile-add-weight">
                <span>+</span> Add Weight
              </Link>
                      </div>
                    </div>

          <div className="mobile-weight-stats">
            <div className="mobile-stat-item">
              <div className="mobile-stat-label">Starting Weight</div>
              <div className="mobile-stat-value">
                {weightStats.startWeight}
                      </div>
                    </div>
            <div className="mobile-stat-item">
              <div className="mobile-stat-label">Current Weight</div>
              <div className="mobile-stat-value current">
                {weightStats.currentWeight}
                      </div>
                    </div>
            <div className="mobile-stat-item">
              <div className="mobile-stat-label">Weight Lost</div>
              <div className="mobile-stat-value success">
                {weightStats.weightLost}
                        </div>
                      </div>
            <div className="mobile-stat-item">
              <div className="mobile-stat-label">Trend</div>
              <div className="mobile-stat-value success">
                {weightStats.trend}
                      </div>
                    </div>
                  </div>

          <div className="mobile-period-selector">
            <button 
              className={`mobile-period-btn ${selectedPeriod === 'weekly' ? 'active' : ''}`}
              onClick={() => setSelectedPeriod('weekly')}
            >
              Weekly
            </button>
            <button 
              className={`mobile-period-btn ${selectedPeriod === 'monthly' ? 'active' : ''}`}
              onClick={() => setSelectedPeriod('monthly')}
            >
              Monthly
            </button>
            <button 
              className={`mobile-period-btn ${selectedPeriod === 'yearly' ? 'active' : ''}`}
              onClick={() => setSelectedPeriod('yearly')}
            >
              Yearly
            </button>
                            </div>

          <div className="mobile-weight-chart">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart 
                data={chartData}
                margin={{ top: 20, right: 20, left: 0, bottom: 20 }}
              >
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  stroke="#E2E8F0" 
                  horizontal={true}
                  vertical={false}
                />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12, fill: '#64748B' }}
                  tickLine={false}
                  axisLine={{ stroke: '#E2E8F0' }}
                  tickFormatter={(date) => {
                    const dateObj = new Date(date);
                    switch(selectedPeriod) {
                      case 'yearly':
                        return dateObj.toLocaleDateString('en-US', { month: 'short' });
                      case 'monthly':
                        return dateObj.getDate();
                      default: // weekly
                        return dateObj.toLocaleDateString('en-US', { weekday: 'short' });
                    }
                  }}
                />
                <YAxis 
                  tick={{ fontSize: 12, fill: '#64748B' }}
                  tickLine={false}
                  axisLine={{ stroke: '#E2E8F0' }}
                  width={35}
                  domain={(() => {
                    const weights = chartData.map(d => d.weight);
                    const minWeight = Math.min(...weights);
                    const maxWeight = Math.max(...weights);
                    const padding = 2;
                    
                    return [
                      Math.floor(minWeight - padding),
                      Math.ceil(maxWeight + padding)
                    ];
                  })()}
                  ticks={(() => {
                    const weights = chartData.map(d => d.weight);
                    const minWeight = Math.min(...weights);
                    const maxWeight = Math.max(...weights);
                    const padding = 2;
                    const min = Math.floor(minWeight - padding);
                    const max = Math.ceil(maxWeight + padding);
                    
                    const step = Math.ceil((max - min) / 6);
                    const ticks = [];
                    for (let i = min; i <= max; i += step) {
                      ticks.push(i);
                    }
                    if (!ticks.includes(max)) {
                      ticks.push(max);
                    }
                    return ticks;
                  })()}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #E2E8F0',
                    borderRadius: '8px',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                  }}
                  labelFormatter={(value) => {
                    const dateObj = new Date(value);
                    return dateObj.toLocaleDateString('en-US', { 
                      weekday: 'long',
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric'
                    });
                  }}
                  formatter={(value) => [`${value} lbs`, 'Weight']}
                />
                <Line 
                  type="monotone" 
                  dataKey="weight" 
                  stroke="#F97316"
                  strokeWidth={2}
                  dot={{
                    stroke: '#F97316',
                    strokeWidth: 2,
                    fill: '#FFFFFF',
                    r: 4
                  }}
                  activeDot={{
                    stroke: '#F97316',
                    strokeWidth: 2,
                    fill: '#F97316',
                    r: 6
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
                            </div>

          <div className="mobile-weight-entries">
            <h3>Weight Entries</h3>
            <div className="mobile-entries-list">
              {displayedEntries
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .map((entry, index) => (
                  <div key={index} className="mobile-weight-entry">
                    <div className="mobile-weight-entry-value">{entry.weight} lbs</div>
                    <div className="mobile-weight-entry-right">
                      <span className="mobile-weight-entry-date">
                        {new Date(entry.date).toLocaleDateString('en-US', { 
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                      <button 
                        className="mobile-delete-weight"
                        onClick={() => deleteWeightEntry(entry.date)}
                        title="Delete entry"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
              {weightData.length === 0 && (
                <div className="mobile-no-entries">
                  No weight entries yet. Add your first weight entry to track your progress!
                </div>
              )}
            </div>
            {weightData.length > 6 && (
              <button 
                className="mobile-see-more"
                onClick={() => setShowAllEntries(!showAllEntries)}
              >
                {showAllEntries ? 'Show Less' : 'See More'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <nav className="mobile-nav">
        <Link to="/mobile-dashboard" className="mobile-nav-item active">
          <span className="mobile-nav-icon">📊</span>
        </Link>
        <Link to="/mobile-mymeals" className="mobile-nav-item">
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
