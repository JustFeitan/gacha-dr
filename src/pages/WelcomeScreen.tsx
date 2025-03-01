import { motion } from "framer-motion";
import { useState} from "react";

export const WelcomeScreen = () => {
    const [isTransitioning, setIsTransitioning] = useState(false);

    // Анимация для текста
    const titleVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0 },
    };

    return (
        <motion.div
            className="min-h-screen flex flex-col items-center justify-center bg-pink-200 relative overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
        >
            {/* Конфетти-эффект */}
            <div className="absolute inset-0 pointer-events-none">
                {[...Array(50)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="w-2 h-2 bg-yellow-400 absolute rounded-full"
                        initial={{
                            scale: 0,
                            x: Math.random() * 1000 - 500,
                            y: Math.random() * 1000 - 500,
                        }}
                        animate={{ scale: 1, x: 0, y: 0 }}
                        transition={{ type: "spring", delay: i * 0.02 }}
                    />
                ))}
            </div>

            {/* Заголовок */}
            <motion.h1
                variants={titleVariants}
                initial="hidden"
                animate="visible"
                className="font-comic text-6xl md:text-8xl text-center mb-8 text-purple-600 z-10"
            >
                С Днём Рождения,<br />
                <span className="text-red-500">ИМЯ_ДРУГА!</span>
            </motion.h1>

            {/* Анимированная кнопка */}
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsTransitioning(true)}
                className="bg-blue-500 text-white px-8 py-4 rounded-full text-3xl font-bold shadow-lg z-10"
            >
                🎁 Получить ПИЗДЮЛЕЙ! 🎁
            </motion.button>

            {/* Переход к гаче */}
            {isTransitioning && (
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 100 }}
                    transition={{ duration: 1.5 }}
                    className="fixed bg-white rounded-full"
                />
            )}
        </motion.div>
    );
};