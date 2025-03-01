import React, { useEffect, useRef } from 'react';

interface AudioReactiveEffectProps {
    audioElement: HTMLAudioElement | null;
    isPlaying: boolean;
}

const AudioReactiveEffect: React.FC<AudioReactiveEffectProps> = ({ audioElement, isPlaying }) => {
    const requestRef = useRef<number>();
    const analyserRef = useRef<AnalyserNode | null>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const sourceNodeRef = useRef<MediaElementAudioSourceNode | null>(null);

    // Setup audio analyzer
    useEffect(() => {
        if (!audioElement) return;

        // Create audio context and analyzer
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        audioContextRef.current = audioContext;

        // Create an analyzer node with higher FFT size for better frequency resolution
        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 1024; // Higher for more detailed frequency data
        analyserRef.current = analyser;

        // Connect audio element to analyzer
        const source = audioContext.createMediaElementSource(audioElement);
        sourceNodeRef.current = source;
        source.connect(analyser);
        analyser.connect(audioContext.destination);

        return () => {
            if (requestRef.current) {
                cancelAnimationFrame(requestRef.current);
            }
            if (audioContext) {
                audioContext.close();
            }
        };
    }, [audioElement]);

    // Audio reactive animation
    useEffect(() => {
        if (!isPlaying || !analyserRef.current) return;

        const analyser = analyserRef.current;
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        // Animation timing variables
        const waveSpeed = 0.02;
        let phase = 0;

        const animate = () => {
            requestRef.current = requestAnimationFrame(animate);

            // Get frequency data
            analyser.getByteFrequencyData(dataArray);

            // Divide frequencies into bass, mid, and treble ranges
            const bassSum = dataArray.slice(1, 10).reduce((a, b) => a + b, 0) / 10;
            const midSum = dataArray.slice(10, 100).reduce((a, b) => a + b, 0) / 90;
            const trebleSum = dataArray.slice(100, 256).reduce((a, b) => a + b, 0) / 156;

            // Normalize values between 0-1
            const bassLevel = bassSum / 256;
            const midLevel = midSum / 256;
            const trebleLevel = trebleSum / 256;

            // Update phase for wave motion
            phase += waveSpeed;
            if (phase > Math.PI * 2) phase -= Math.PI * 2;

            // Update CSS variables for shadow waves
            document.documentElement.style.setProperty('--bass-level', bassLevel.toFixed(3));
            document.documentElement.style.setProperty('--mid-level', midLevel.toFixed(3));
            document.documentElement.style.setProperty('--treble-level', trebleLevel.toFixed(3));
            document.documentElement.style.setProperty('--wave-phase', phase.toFixed(3));

            // Generate colors based on audio levels
            const bassHue = Math.floor(bassLevel * 60); // Red to yellow range
            const midHue = Math.floor(120 + midLevel * 60); // Green to cyan range
            const trebleHue = Math.floor(240 + trebleLevel * 60); // Blue to magenta range

            document.documentElement.style.setProperty('--bass-color', `hsl(${bassHue}, 100%, 50%)`);
            document.documentElement.style.setProperty('--mid-color', `hsl(${midHue}, 100%, 60%)`);
            document.documentElement.style.setProperty('--treble-color', `hsl(${trebleHue}, 100%, 70%)`);
        };

        // Start animation loop
        animate();

        return () => {
            if (requestRef.current) {
                cancelAnimationFrame(requestRef.current);
            }
        };
    }, [isPlaying]);

    // Return null because we're only updating CSS variables
    return null;
};

export default AudioReactiveEffect;