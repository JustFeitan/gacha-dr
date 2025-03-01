import {useWindowSize} from "react-use";
import "./WIthBirthday.scss";
import BirthdayConfetti from "@/components/Confeti/Confeti.tsx";
import React, {FC, useEffect, useState} from "react";
import Combo1 from '@/assets/confeti/combo_2.png';
import Combo2 from '@/assets/confeti/combo_1.png';
import Pivo from '@/assets/confeti/pivo.png';
import PivoBuldac from '@/assets/confeti/pivo+buldac.png';
import AudioReactiveEffect from "@/components/AudioReactiveEffect/AudioReactiveEffect.tsx";

interface WIthBirthdayProps {
    showMessage: boolean;
    closeBirthdayMessage: () => void;
}

const WIthBirthday: FC<WIthBirthdayProps> = ({closeBirthdayMessage, showMessage = true}) => {
    const {width, height} = useWindowSize();
    const dropArray = [PivoBuldac, Pivo, Combo1, Combo2]
    // Inside your BannerDisplay component:
    const [birthdayAudio, setBirthdayAudio] = useState<HTMLAudioElement | null>(null);
    const [isBirthdayMusicPlaying, setIsBirthdayMusicPlaying] = useState<boolean>(false);

// Initialize birthday audio when message is shown
    useEffect(() => {
        if (showMessage) {
            const audio = new Audio('/music/buldac-rain.mp3'); // Replace with your audio file
            audio.loop = true;

            // Attempt to play audio when birthday message appears
            audio.play()
                .then(() => {
                    setIsBirthdayMusicPlaying(true);
                    setBirthdayAudio(audio);
                })
                .catch(err => {
                    console.error("Failed to play birthday music:", err);
                });

            // Cleanup function to stop audio when component unmounts
            return () => {
                audio.pause();
                setBirthdayAudio(null);
                setIsBirthdayMusicPlaying(false);
            };
        }
    }, [showMessage]);
    return (
       showMessage && <div className="birthday-celebration" onClick={closeBirthdayMessage}>
           {/* Add audio reactive background */}

            <BirthdayConfetti count={50} imageUrls={dropArray} minSize={50} maxSize={150}/>
            <div className="birthday-content" onClick={(e) => e.stopPropagation()}>
                {/* Left rotating image - replace src with your own */}
                <div className="birthday-icon birthday-icon-left">
                    <img src={'/favicon.png'} alt="Celebration icon"  />
                </div>

                <div className="birthday-text">С днем рождения!</div>

                {/* Right rotating image - replace src with your own */}
                <div className="birthday-icon birthday-icon-right">
                    <img src={'/favicon.png'} alt="Celebration icon" />
                </div>

                <button className="close-birthday" onClick={closeBirthdayMessage}>✕</button>
            </div>
        </div>
    );
};

export default WIthBirthday;