import React, {ButtonHTMLAttributes} from "react";
import GiftIcon from "../../assets/gift_icon.svg";
import "./Button.scss";

interface ImageButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    backgroundImage: string;  // URL to the background image
    text: string;             // Button text
    leftIcon?: string;        // Optional URL to the left icon
    className?: string;       // Additional CSS classes
    showIcon?:boolean
}

const ImageButton: React.FC<ImageButtonProps> = ({
                                                     backgroundImage,
                                                     onClick,
                                                     className,
    showIcon = true,
    text
                                                 }) => {
    return (
        <button
            className={`pray-button ${className}`}
            onClick={onClick}
            style={{backgroundImage: `url(${backgroundImage})`}}
        >
            {text && <span className="pray-text">Помолиться <strong>1 раз</strong></span>}
            <div className="pray-icon">
                {showIcon && <img style={{height: "40px", width: "40px"}} src={GiftIcon} alt="gift"/> }
                {   showIcon && <span className="pray-count">x 1</span>}

            </div>
        </button>
    );
};

export default ImageButton;