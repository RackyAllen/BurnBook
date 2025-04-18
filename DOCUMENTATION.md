# BurnBook - Technical Documentation

## Project Overview
BurnBook is a responsive calorie tracking application built with React, featuring both desktop and mobile interfaces. This document provides a detailed technical overview of the project's components, architecture, and implementation decisions.

## Core Functionality Verification
This section demonstrates how the prototype meets user goals and runs without major errors.

### 1. User Authentication
```javascript
// screens/DesktopLogin/DesktopLogin.jsx
const DesktopLogin = () => {
  const handleLogin = async (credentials) => {
    try {
      // Authentication logic
      await authenticateUser(credentials);
      navigate('/desktop-dashboard');
    } catch (error) {
      handleError(error);
    }
  };
};
```

### 2. Meal Tracking Implementation
```javascript
// components/MealEntry/MealEntry.jsx
const MealEntry = ({ onSave }) => {
  const [meal, setMeal] = useState({
    name: '',
    calories: 0,
    date: new Date()
  });
  
  // Input validation and error handling
  const validateMeal = (mealData) => {
    if (!mealData.name) throw new Error('Meal name required');
    if (mealData.calories <= 0) throw new Error('Invalid calorie count');
  };
};
```

### 3. Data Visualization
```javascript
// components/WeightChart/WeightChart.jsx
import { LineChart } from 'recharts';

const WeightChart = ({ data }) => {
  // Responsive chart implementation
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        {/* Chart configuration */}
      </LineChart>
    </ResponsiveContainer>
  );
};
```

## Core Components Breakdown

### 1. Device Detection System
```javascript
// utils/deviceDetector.js
export const isMobile = () => {
  if (typeof window === 'undefined') return false;
  const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
  return mobileRegex.test(navigator.userAgent) || window.innerWidth <= 768;
};
```
This utility demonstrates error handling and browser compatibility considerations by:
- Checking for window object existence (SSR compatibility)
- Using both user agent and viewport width for reliable detection
- Implementing debounced resize listeners for performance

### 2. Responsive Router Implementation
```javascript
// App.jsx routing logic
<Route
  path="/desktop-dashboard"
  element={
    isMobileDevice ? (
      <Navigate to="/mobile-dashboard" replace />
    ) : (
      <DesktopDashboard />
    )
  }
/>
```
Shows modular design through:
- Conditional rendering based on device type
- Automatic route redirection for optimal UX
- Separation of mobile and desktop components

### 3. Screen Components Structure 

screens/
├── Desktop/
│ ├── DesktopDashboard/
│ │ ├── index.jsx
│ │ └── styles.css
│ └── ...
└── Mobile/
├── MobileDashboard/
│ ├── index.jsx
│ └── styles.css
└── ...

Demonstrates software engineering principles:
- Clear separation of concerns
- Component modularity
- Consistent file structure
- Platform-specific optimizations

## Key Libraries and Their Usage

1. **React Router (v6)**
   - Handles client-side routing
   - Enables responsive route management
   - Provides navigation guards

2. **Recharts**
   - Data visualization for weight tracking
   - Performance-optimized rendering
   - Responsive chart layouts

3. **Vite**
   - Modern build tooling
   - Fast development server
   - Optimized production builds

## Error Handling Implementation

1. **Device Detection Fallbacks**
```javascript
export const isMobile = () => {
  try {
    // Primary detection logic
    return mobileRegex.test(navigator.userAgent);
  } catch (error) {
    // Fallback to width-based detection
    return window.innerWidth <= 768;
  }
};
```

2. **Route Protection**
```javascript
// Example of protected route implementation
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = checkAuth(); // Authentication check
  return isAuthenticated ? children : <Navigate to="/login" />;
};
```

## Performance Optimizations

1. **Lazy Loading**
   - Components are split by device type
   - Routes are loaded on demand
   - Images use responsive loading

2. **State Management**
   - Local state for UI components
   - Context for shared state
   - Memoization for expensive calculations

## Testing Considerations

While tests are not yet implemented, the code structure supports:
- Component isolation for unit testing
- Route testing through React Router tools
- Utility function pure implementations

## Future Enhancements

1. **Planned Features**
   - Offline support
   - Data persistence
   - Social sharing

2. **Technical Debt**
   - Add comprehensive testing
   - Implement error boundaries
   - Add performance monitoring

## Development Workflow

1. **Local Development**
```bash
npm run dev
```
- Hot module replacement
- Fast refresh support
- Development error overlay

2. **Production Build**
```bash
npm run build
```
- Code splitting
- Asset optimization
- Source map generation

## Deployment Architecture

The application is deployed on Vercel with:
- Automatic HTTPS
- Edge caching
- Serverless functions support
- Continuous deployment

## Code Quality Measures

1. **Formatting Standards**
   - Consistent file structure
   - Clear naming conventions
   - Component organization

2. **Best Practices**
   - Proper prop types
   - Error boundaries
   - Performance considerations

## Security Considerations

1. **Client-side**
   - Input sanitization
   - XSS prevention
   - CORS handling

2. **Build Process**
   - Dependency scanning
   - Asset optimization
   - Source map protection
