import React from 'react';
import Home from '../Components/Landing/Home.jsx';
import Carrousel from '../Components/Landing/Carrousel.jsx';
import CallToAction from '../Components/Landing/CallToAction.jsx';
import TopBarLanding from '../Components/Landing/TopBarLanding.jsx';

function Landing() {
    return (
        <>
        <TopBarLanding />
        {/* Greeting component */}
            <Home />
        {/* Caracteristics component */}
            <Carrousel />
        {/* Call to Action component */}
            <CallToAction />
        </>

    );
}

export default Landing;