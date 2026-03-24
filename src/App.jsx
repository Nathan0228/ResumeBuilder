import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Builder from './pages/Builder';
import About from './pages/About';
import ErrorBoundary from './components/ErrorBoundary';
import ToastProvider from './components/Toast';

const App = () => {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/builder" element={<Builder />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </ToastProvider>
    </ErrorBoundary>
  );
};

export default App;
