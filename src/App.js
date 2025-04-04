import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import NavBar from './components/common/nav-bar.js';
import Footer from './components/common/footer.js';
import Homepage from './components/common/homepage.js';
import Login from './components/common/login.js';
import Register from './components/common/register.js';

import './components/assets/css/styles.css';

function App() {
  return (
    <Router>
      <NavBar />

      <main>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </main>

      <Footer />
    </Router>
  );
};

export default App;
