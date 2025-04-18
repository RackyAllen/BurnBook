# BurnBook - Calorie Tracking Application

A modern, responsive web application for tracking daily calorie intake and managing meal plans. Built with React and featuring both desktop and mobile-friendly interfaces, BurnBook helps users maintain their nutritional goals with ease.

## 🌟 Features

- **Responsive Design**
  - Automatic detection between desktop and mobile views
  - Optimized interface for both platforms
  - Seamless transition between devices

- **Core Functionality**
  - Daily calorie tracking
  - Meal planning and management
  - Weight tracking with progress visualization
  - Custom meal entries and favorites
  - Comprehensive dashboard

## 🚀 Live Demo

Visit the live application at: [BurnBook App](https://burnbook-nu.vercel.app/)

## 🛠️ Technology Stack

- **Frontend Framework**: React 18
- **Routing**: React Router v6
- **Data Visualization**: Recharts
- **Build Tool**: Vite
- **Deployment**: Vercel
- **Styling**: Custom CSS with responsive design

## 📋 Prerequisites

Before running this project, ensure you have:
- Node.js (v14 or higher)
- npm (v6 or higher)

## 🔧 Installation

1. Clone the repository:
```bash
git clone [your-repository-url]
cd BurnBook
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## 📦 Production Build

Create a production-ready build:

```bash
npm run build
```

The optimized files will be generated in the `dist` directory.

## 🔍 Project Structure

BurnBook/
├── src/
│ ├── components/ # Reusable UI components
│ ├── screens/
│ │ ├── Desktop/ # Desktop view components
│ │ │ ├── DesktopDashboard/
│ │ │ ├── DesktopLogin/
│ │ │ └── ...
│ │ └── Mobile/ # Mobile view components
│ │ ├── MobileDashboard/
│ │ ├── MobileLogin/
│ │ └── ...
│ ├── utils/ # Utility functions
│ ├── App.jsx # Main application component
│ └── main.jsx # Application entry point
├── static/ # Static assets
├── index.html # HTML entry point
└── vite.config.js # Vite configuration

## 🎯 Key Features

### Desktop View
- Full-width dashboard with comprehensive statistics
- Easy-to-use meal entry system
- Detailed weight tracking interface
- Settings management

### Mobile View
- Streamlined interface for on-the-go tracking
- Quick meal entry
- Simplified dashboard
- Touch-optimized controls
