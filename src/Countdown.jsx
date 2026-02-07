import React, { useState, useEffect } from 'react';

const Countdown = ({ targetDate, isActive }) => {
    const calculateTimeLeft = () => {
        const difference = +new Date(targetDate) - +new Date();
        let timeLeft = {};

        if (difference > 0) {
            timeLeft = {
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60),
            };
        } else {
            timeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };
        }
        return timeLeft;
    };

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    useEffect(() => {
        const timer = setTimeout(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearTimeout(timer);
    });

    const timerComponents = [];

    Object.keys(timeLeft).forEach((interval) => {
        if (!timeLeft[interval] && timeLeft[interval] !== 0) {
            return;
        }

        timerComponents.push(
            <div key={interval} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '0 10px' }}>
                <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{timeLeft[interval]}</span>
                <span style={{ fontSize: '0.8rem', textTransform: 'uppercase' }}>{interval}</span>
            </div>
        );
    });

    // If strict about isActive -- for now render always, or conditionally?
    // User passed isActive={false}, which implies they might not want it visible or active?
    // But why request to add it?
    // I will render it.

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            color: 'white',
            fontFamily: "'Poppins', sans-serif",
            marginBottom: '20px',
            textShadow: '0 0 10px rgba(255, 105, 180, 0.7)',
            zIndex: 100,
            position: 'relative'
        }}>
            {timerComponents.length ? timerComponents : <span>Time's up!</span>}
        </div>
    );
};

export default Countdown;
