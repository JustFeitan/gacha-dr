import React, { useEffect } from 'react';

interface BirthdayConfettiProps {
    count?: number;
    imageUrls: string[]; // Array of image URLs to use as confetti
    minSize?: number;  // Minimum size in pixels
    maxSize?: number;  // Maximum size in pixels
}

const BirthdayConfetti: React.FC<BirthdayConfettiProps> = ({
                                                               count = 100,
                                                               imageUrls = [],
                                                               minSize = 20,
                                                               maxSize = 50
                                                           }) => {
    useEffect(() => {
        if (imageUrls.length === 0) return;

        const confettiContainer = document.querySelector('.birthday-celebration');
        if (!confettiContainer) return;

        const particles: HTMLElement[] = [];

        // Create custom image confetti
        for (let i = 0; i < count; i++) {
            // Get random image from the array
            const randomIndex = Math.floor(Math.random() * imageUrls.length);
            const imageUrl = imageUrls[randomIndex];

            // Create image element
            const img = document.createElement('img');
            img.src = imageUrl;
            img.classList.add('image-particle');

            // Randomize size between minSize and maxSize
            const size = Math.floor(Math.random() * (maxSize - minSize + 1) + minSize);
            img.style.width = `${size}px`;
            img.style.height = `${size}px`;

            // Random starting position
            img.style.left = `${Math.random() * 100}vw`;

            // Random animation properties
            const duration = (Math.random() * 5 + 3); // 3-8 seconds
            const delay = Math.random() * 5; // 0-5 seconds delay

            img.style.animationDuration = `${duration}s`;
            img.style.animationDelay = `${delay}s`;

            // Add rotation for more dynamic movement
            const rotationDirection = Math.random() > 0.5 ? 'clockwise' : 'counterClockwise';
            img.classList.add(`rotate-${rotationDirection}`);

            // Add to DOM
            confettiContainer.appendChild(img);
            particles.push(img);
        }

        // Cleanup function
        return () => {
            particles.forEach(p => p.remove());
        };
    }, [count, imageUrls, minSize, maxSize]);

    return null;
};

export default BirthdayConfetti;