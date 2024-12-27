import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './Home.js';
import Carrera from './Carrera.js';


const App = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/carrera" element={<Carrera />} />
        </Routes>
    );
};

export default App;