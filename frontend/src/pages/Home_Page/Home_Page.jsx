import React from 'react';
import './Home_Page.css';
import FacilityAuraLogo from '../../assets/FacilityAuraLogo.png'; // Adjust the path according to your project

const HomePage = () => {
    return (
        <div className="home-container">
            <header className="home-header">
                <img src={FacilityAuraLogo} alt="Facility Aura Logo" className="home-logo" />
            </header>

            <main className="home-main">
                <section className="welcome-section">
                    <h2>Welcome, Facility Manager!</h2>
                    <p>Effortlessly monitor and manage building spaces, maintenance tasks, energy consumption, and inventory - all in one platform.</p>
                </section>
            </main>

            <footer className="home-footer">
                © 2025 Facility Aura | All Rights Reserved
            </footer>
        </div>
    );
};

export default HomePage;
