import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './Home.js';
// import About from './About.js';


const App = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            {/* <Route path="/about" element={<About />} /> */}
        </Routes>
    );
};

export default App;