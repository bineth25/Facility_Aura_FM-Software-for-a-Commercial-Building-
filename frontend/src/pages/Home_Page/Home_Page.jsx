import React, { useState, useEffect } from 'react';
import './Home_Page.css';
import FacilityAuraLogo1 from '../../assets/FacilityAuraLogo1.jpg';
import FacilityAuraLogo2 from '../../assets/FacilityAuraLogo2.jpg';
import FacilityAuraLogo3 from '../../assets/FacilityAuraLogo3.jpg';

const HomePage = () => {
    const images = [FacilityAuraLogo1, FacilityAuraLogo2, FacilityAuraLogo3];
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Show animation after a small delay
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 300);

        // Slideshow functionality
        const interval = setInterval(() => {
            setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 7000); // Changed to 5 seconds for better viewing

        return () => {
            clearInterval(interval);
            clearTimeout(timer);
        };
    }, []);

    const features = [
        {
            icon: "📅",
            title: "Maintenance Scheduling",
            description: "Streamline maintenance workflows with automated scheduling and task management."
        },
        {
            icon: "📊",
            title: "Energy Monitoring",
            description: "Track and reduce energy consumption with real-time monitoring and cost-saving insights."
        },
        {
            icon: "🏢",
            title: "Space Management",
            description: "Optimize your facility's space utilization with smart analytics and planning tools."
        },
        {
            icon: "📦",
            title: "Inventory Control",
            description: "Manage supplies and equipment efficiently with our comprehensive inventory system."
        }
    ];

    return (
        <div className="home-container">
            <header className="home-header">
                <div
                    className="slide"
                    style={{ backgroundImage: `url(${images[currentImageIndex]})` }}
                ></div>

                <div className="overlay"></div>
                
                <div className={`hero-content ${isVisible ? 'visible' : ''}`}>
                    <h1>Smart Facility Management Solutions</h1>
                    <p>Take control of your facility operations with our all-in-one management platform</p>
                </div>
            </header>

            <main className="home-main">
                <section className="welcome-section">
                    <h2>Welcome to the Future of Facility Management</h2>
                    <p>Facility Aura provides an intelligent platform that helps facility managers streamline operations, 
                    reduce costs, and create more efficient building environments. Our comprehensive solution empowers you 
                    to make data-driven decisions that improve both operational efficiency and occupant satisfaction.</p>
                </section>

                <section className="features-section">
                    <h2>Key Features</h2>
                    <div className="features-grid">
                        {features.map((feature, index) => (
                            <div className="feature-card" key={index}>
                                <div className="feature-icon">
                                    {feature.icon}
                                </div>
                                <h3>{feature.title}</h3>
                                <p>{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </section>
            </main>
            <footer className="home-footer">
                <div className="footer-bottom">
                    © 2025 Facility Aura | All Rights Reserved
                </div>
            </footer>
        </div>
    );
};

export default HomePage;