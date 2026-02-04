import React from 'react';
import Home from '../Components/Landing/Home.jsx';
import Carrousel from '../Components/Landing/Carrousel.jsx';

function Landing() {
    return (
        <>
        {/* Greeting component */}
            <Home />
        {/* Caracteristics component */}
            <Carrousel />
        {/* Call to Action component */}
        </>

    );
}

export default Landing;