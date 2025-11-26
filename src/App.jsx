
import React from 'react';
import { useState } from 'react'
import { motion } from "framer-motion";
import ThemeToggle from "./components/ThemeToggle.jsx";
import ClockWidget from "./widgets/ClockWidget/ClockWidget.jsx";
import TodoWidget from "./widgets/TodoWidget/TodoWidget.jsx";
import WeatherWidget from "./widgets/WeatherWidget/WeatherWidget.jsx";
// NewsWidget import removed for now

import './App.css'


function App() {
  const [count, setCount] = useState(0)

 return (
  <div className="container py-4">
    <header className="d-flex justify-content-between align-items-center mb-4">
      <h1 className="dashboard-title mb-0">
        Personal Productivity Dashboard
      </h1>
      <ThemeToggle />
    </header>

    <div className="row g-4">
      <div className="col-lg-3 col-md-6">
        <ClockWidget />
      </div>

      <div className="col-lg-3 col-md-6">
        <WeatherWidget />
      </div>

      <div className="col-lg-3 col-md-6">
        <TodoWidget />
      </div>

      <div className="col-lg-3 col-md-6">
        <div className="widget-card h-100">
          <h5 className="widget-title">News</h5>
          <p className="text-muted mb-1">
            News widget coming later.
          </p>
          <p className="text-muted small mb-0">
            Add a NewsAPI key in the future to enable live headlines.
          </p>
        </div>
      </div>
    </div>
  </div>
);

}

export default App
