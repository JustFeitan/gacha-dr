import React, {useEffect, useRef, useState, useCallback} from "react";
import "./BannerDisplay.scss";
import Baner from "../../assets/d6wd77ssad.png";
import Wishbutton from "../../assets/wish_button_v2.png";
import SoundOff from "../../assets/sound_off.png";
import SoundOn from "../../assets/sound_on.png";
import CloseBtn from "../../assets/close.png";
import Button from "@/components/Button/Button.tsx";
import {ItemRarity, WishItem} from "@/types/types.ts";
import GiftIcon from "@/assets/gift_icon.svg";
import WIthBirthday from "@/components/WIthBirthday/WIthBirthday.tsx";

// Define the 3-star video options
const threeStarVideos = [
    "/videos/3star-chudo-choco.webm",
    "/videos/3star_box(new).webm",
    "/videos/3star_chudo2.webm",
    "/videos/3star_egg(new).webm",
    "/videos/3star-chips(new).webm"
];

// Interface for tracking which video goes with which wish
interface WishVideoMapping {
    wishIndex: number;
    videoUrl: string;
}

const BannerDisplay: React.FC = () => {
    const [completedWishes, setCompletedWishes] = useState<WishItem[]>([]);
    const [remainingWishes, setRemainingWishes] = useState<number>(10);
    const [isPlayingVideo, setIsPlayingVideo] = useState<boolean>(false);
    const [currentVideo, setCurrentVideo] = useState<string>('');
    const [showCloseButton, setShowCloseButton] = useState<boolean>(false);
    const [wishDistribution, setWishDistribution] = useState<ItemRarity[]>([]);
    const [isMusicPlaying, setIsMusicPlaying] = useState<boolean>(false);
    const [musicEnabled, setMusicEnabled] = useState<boolean>(true); // Default enabled
    const [userInteracted, setUserInteracted] = useState<boolean>(false);
    const [threeStarVideoMapping, setThreeStarVideoMapping] = useState<WishVideoMapping[]>([]);
    const [autoplayAttempted, setAutoplayAttempted] = useState<boolean>(false);
    const [showwWIthBirthday, setShowwWIthBirthday] = useState<boolean>(false);
    const videoRef = useRef<HTMLVideoElement>(null);
    const audioRef = useRef<HTMLAudioElement>(null);

    // Initialize wish distribution and assign videos for 3-star wishes
    useEffect(() => {
        const distribution: ItemRarity[] = [
            ...Array(5).fill(ItemRarity.ThreeStar),
            ...Array(4).fill(ItemRarity.FourStar),
            ...Array(1).fill(ItemRarity.FiveStar)
        ];

        const shuffledDistribution = shuffleArray(distribution);
        setWishDistribution(shuffledDistribution);

        // Create mappings for all 3-star wishes
        const videoMappings: WishVideoMapping[] = [];

        // Find all 3-star wishes in the shuffled distribution
        shuffledDistribution.forEach((rarity, index) => {
            if (rarity === ItemRarity.ThreeStar) {
                // Get a video from the array, cycling if needed
                const videoIndex = videoMappings.length % threeStarVideos.length;
                videoMappings.push({
                    wishIndex: index,
                    videoUrl: threeStarVideos[videoIndex]
                });
            }
        });

        console.log("3-star video mappings:", videoMappings);
        setThreeStarVideoMapping(videoMappings);

        // Try to autoplay music immediately when the component loads
        setTimeout(() => {
            if (audioRef.current && musicEnabled) {
                audioRef.current.play()
                    .then(() => {
                        console.log("Background music playing automatically");
                        setIsMusicPlaying(true);
                    })
                    .catch(err => {
                        console.error("Auto-play failed (expected due to browser policies):", err);
                        setAutoplayAttempted(true);
                        // We'll try again after user interaction
                    });
            }
        }, 500);
    }, []);

    // Track user interaction globally
    useEffect(() => {
        const handleUserInteraction = () => {
            if (!userInteracted) {
                console.log("First user interaction detected");
                setUserInteracted(true);

                // If music is enabled and autoplay failed before, try again now
                if (musicEnabled && !isMusicPlaying && audioRef.current && autoplayAttempted) {
                    playBackgroundMusic();
                }
            }
        };

        // Add multiple event types to catch any user interaction
        document.addEventListener('click', handleUserInteraction);
        document.addEventListener('touchstart', handleUserInteraction);
        document.addEventListener('keydown', handleUserInteraction);

        return () => {
            document.removeEventListener('click', handleUserInteraction);
            document.removeEventListener('touchstart', handleUserInteraction);
            document.removeEventListener('keydown', handleUserInteraction);
        };
    }, [userInteracted, musicEnabled, isMusicPlaying, autoplayAttempted]);

    // Define music control functions with useCallback to avoid dependency issues
    const playBackgroundMusic = useCallback(() => {
        if (audioRef.current && !isMusicPlaying && musicEnabled) {
            audioRef.current.play()
                .then(() => {
                    console.log("Background music playing");
                    setIsMusicPlaying(true);
                })
                .catch(err => {
                    console.error("Failed to play music:", err);
                    setIsMusicPlaying(false);
                });
        }
    }, [isMusicPlaying, musicEnabled]);

    const pauseBackgroundMusic = useCallback(() => {
        if (audioRef.current && isMusicPlaying) {
            audioRef.current.pause();
            setIsMusicPlaying(false);
        }
    }, [isMusicPlaying]);

    // Handle music state changes
    useEffect(() => {
        if (musicEnabled && !isPlayingVideo) {
            // Play music when not watching videos and music is enabled
            playBackgroundMusic();
        } else if (isPlayingVideo || !musicEnabled) {
            // Pause when watching videos or music is disabled
            pauseBackgroundMusic();
        }

        // Resume music when video ends and close button shows, if music is enabled
        if (showCloseButton && musicEnabled) {
            playBackgroundMusic();
        }
    }, [musicEnabled, isPlayingVideo, showCloseButton]);

    const shuffleArray = <T,>(array: T[]): T[] => {
        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    };

    // Video event handlers
    useEffect(() => {
        const video = videoRef.current;

        if (video && isPlayingVideo) {
            console.log("Setting up video event listeners");

            const handleEnded = () => {
                console.log("Video playback ended");
                if (video) {
                    video.pause();
                    try {
                        if (video.duration) {
                            video.currentTime = Math.max(0, video.duration - 0.2);
                        }
                    } catch (error) {
                        console.error("Error setting video currentTime:", error);
                    }
                }
                setShowCloseButton(true);

                // Resume music when video ends if music is enabled
                if (musicEnabled) {
                    playBackgroundMusic();
                }
            };

            const handleError = (e: Event) => {
                const videoElement = e.target as HTMLVideoElement;
                console.error("Video error:", videoElement.error);
                setShowCloseButton(true);
            };

            video.addEventListener('ended', handleEnded);
            video.addEventListener('error', handleError);

            return () => {
                video.removeEventListener('ended', handleEnded);
                video.removeEventListener('error', handleError);
            };
        }
    }, [isPlayingVideo, musicEnabled, playBackgroundMusic]);

    useEffect(() => {
        if (!remainingWishes && !isPlayingVideo) {
            setShowwWIthBirthday(true)
        }
    }, [remainingWishes, isPlayingVideo]);

    const handleWish = () => {
        console.log("Wish button clicked");
        if (!remainingWishes) setShowwWIthBirthday(true)
        if (remainingWishes > 0) {
            const wishIndex = Math.floor(Math.random() * remainingWishes);
            console.log(threeStarVideoMapping, 'threeStarVideoMapping');
            const rarity = wishDistribution[wishIndex];
            setWishDistribution(prevState => prevState.filter((item, index) => index !==wishIndex))

            // Get video based on rarity
            let videoUrl;
            switch(rarity) {
                case ItemRarity.ThreeStar:
                    // Find the specific video assigned to this 3-star wish
                    const wishIndex3 = Math.floor(Math.random() * threeStarVideoMapping.length);
                    const mapping = threeStarVideoMapping.find((m, index) => index ===wishIndex3);
                    if (mapping) {
                        videoUrl = mapping.videoUrl;
                        console.log(`Playing 3-star video: ${videoUrl} for wish #${wishIndex}`);
                        setThreeStarVideoMapping(prevState => prevState.filter((item, index) => index !==wishIndex3))
                    } else {
                        // Fallback if no mapping found (shouldn't happen)
                        videoUrl = threeStarVideos[0];
                        console.warn(`No video mapping found for 3-star wish #${wishIndex}, using default`);
                    }
                    break;
                case ItemRarity.FourStar:
                    videoUrl = "/videos/buldac.webm";
                    console.log(`Playing 4-star video`);
                    break;
                case ItemRarity.FiveStar:
                    videoUrl = "/videos/5star-single.webm";
                    console.log(`Playing 5-star video`);
                    break;
                default:
                    videoUrl = threeStarVideos[0];
            }

            // Pause any playing music while video plays
            pauseBackgroundMusic();

            // Set up video
            setCurrentVideo(videoUrl);
            setIsPlayingVideo(true);
            setShowCloseButton(false);
            setRemainingWishes(prev => prev - 1);
        }
    };

    const handleCloseVideo = () => {
        if (isPlayingVideo) {
            const wishIndex = 10 - (remainingWishes + 1);
            const rarity = wishDistribution[wishIndex];

            const newWish: WishItem = {
                id: wishIndex,
                rarity: rarity,

            };

            setCompletedWishes(prev => [...prev, newWish]);
            setIsPlayingVideo(false);
            setShowCloseButton(false);

            // Reset video for next time
            if (videoRef.current) {
                videoRef.current.currentTime = 0;
            }

            // Resume music if enabled
            if (musicEnabled) {
                playBackgroundMusic();
            }
        }
    };



    const toggleMusic = () => {
        const newMusicEnabled = !musicEnabled;
        setMusicEnabled(newMusicEnabled);

        if (newMusicEnabled && !isPlayingVideo) {
            // Try to play music immediately if we're enabling it and not watching a video
            setTimeout(() => playBackgroundMusic(), 0);
        } else if (!newMusicEnabled) {
            pauseBackgroundMusic();
        }
    };

    useEffect(() => {
        playBackgroundMusic()
    }, [showwWIthBirthday]);
    const handleCloseWithBirthdayMsg = () => {
        setShowwWIthBirthday(false)
    }
    return (
        <div className="banner">
            {/* Background music audio element */}
            <audio
                ref={audioRef}
                src={showwWIthBirthday ?"/music/buldac-rain.mp3":"/music/bgm.mp3"}
                loop
                preload="auto"
            />

            {/* Music control button */}
            <Button
                text={''}
                showIcon={false}
                backgroundImage={isMusicPlaying ? SoundOn : SoundOff}
                onClick={toggleMusic}
                className='bgm-off-on'
            />

            {!isPlayingVideo ? (
                <>
                    <div className="remaining-wishes">
                        <img
                            style={{height: "40px", width: "40px"}}
                            src={GiftIcon}
                            alt="gift"
                        />
                        {remainingWishes}
                    </div>
                    <div className="simple-image-container">
                        <img
                            src={Baner}
                            alt="Banner"
                            className="simple-responsive-image"
                        />
                    </div>
                  <Button
                        backgroundImage={Wishbutton}
                        text="Start Adventure"
                        className="banner__wish_button"
                        onClick={handleWish}
                        disabled={remainingWishes <= 0}
                    />
                    {/*{*/}
                    {/*   !remainingWishes &&*/}
                    {/*    <> <Button*/}
                    {/*        backgroundImage={Barabani}*/}
                    {/*        text={''}*/}
                    {/*        className="banner__barabani"*/}
                    {/*        onClick={handleWish}*/}
                    {/*        showIcon={false}*/}

                    {/*        disabled={remainingWishes <= 0}*/}
                    {/*    />*/}
                    {/*     <span className="banner__barabani__text">НАЖМИ НА МЕНЯ</span>*/}
                    {/*    </>*/}

                    {/*}*/}
                </>
            ) : (
                <div className="video-container">
                    <video ref={videoRef} autoPlay playsInline className="video-element">
                        <source src={currentVideo} type="video/mp4"/>
                        Your browser does not support the video tag.
                    </video>
                    {showCloseButton && (
                        <Button
                            text={''}
                            showIcon={false}
                            backgroundImage={CloseBtn}
                            onClick={handleCloseVideo}
                            className='close-pull'
                        />
                    )}
                </div>
            )}
            <WIthBirthday  showMessage={showwWIthBirthday} closeBirthdayMessage={handleCloseWithBirthdayMsg}/>
        </div>
    );
};

export default BannerDisplay;