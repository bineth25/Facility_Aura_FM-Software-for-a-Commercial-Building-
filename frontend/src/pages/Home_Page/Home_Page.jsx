import React from 'react';
import './Home_Page.css'; // ✅ Link to external CSS

const HomePage = () => {
    return (
        <div className="home-container">
            <header className="home-header">
                <h1>Facility Aura</h1>
                <p>Smart Facility Management for Your Commercial Building</p>
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
