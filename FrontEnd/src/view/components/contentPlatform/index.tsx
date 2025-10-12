import { useState } from "react";
import { motion } from "framer-motion";
import LeftArrow from "../../assets/icons/leftArrow";
import RightArrow from "../../assets/icons/rightArrow";
import apple from "../../assets/platforms/apple.png";
import claro from "../../assets/platforms/claro.png";
import disney from "../../assets/platforms/disney.png";
import crunchyroll from "../../assets/platforms/crunchyroll.png";
import netflix from "../../assets/platforms/netflix.png";
import prime from "../../assets/platforms/primevideo.png";
import paramount from "../../assets/platforms/paramount.png";
import globoplay from "../../assets/platforms/globo.png";
import claroplus from "../../assets/platforms/clarotvplus.png";
import max from "../../assets/platforms/max.png";

const CARD_WIDTH_REM = 13.75;
const CARD_GAP_REM = 1.5;

const makeGradient = (color: string) => `${color}`;

function Card({ image, background }: { image: string; background: string }) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="flex h-[6.875rem] w-[13.75rem] flex-shrink-0 cursor-pointer items-center justify-center rounded-xl p-4 shadow-lg"
      style={{
        background: makeGradient(background),
      }}
    >
      <img
        src={image}
        alt="Platform"
        className="h-full w-full rounded-xl object-contain"
      />
    </motion.button>
  );
}

export default function ContentPlatform() {
  const platformLogos = [
    { logo: netflix, background: "#000000" },
    { logo: prime, background: "#FFFFFF" },
    { logo: disney, background: "#113CCF" },
    { logo: max, background: "#ffffff" },
    { logo: apple, background: "#000000" },
    { logo: paramount, background: "#ffffff" },
    { logo: claro, background: "#ffffff" },
    { logo: claroplus, background: "#ffffff" },
    { logo: globoplay, background: "#ffffff" },
    { logo: crunchyroll, background: "#ff8000" },
  ];

  const visibleCount = 6;
  const [currentIndex, setCurrentIndex] = useState(0);

  const maxIndex = platformLogos.length - visibleCount;

  const handleNext = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? maxIndex : prev + 1));
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev <= 0 ? 0 : prev - 1));
  };

  const translationValue = currentIndex * (CARD_WIDTH_REM + CARD_GAP_REM);

  return (
    <div className="relative flex w-full items-center justify-center gap-4 px-6 select-none">
      <motion.button
        className={`absolute left-[-2rem] flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-[#1B1B1BE5] ${currentIndex <= 0 ? "hidden" : ""}`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handlePrev}
        disabled={currentIndex === 0}
      >
        <LeftArrow />
      </motion.button>

      <div className="relative flex w-full max-w-[91rem] overflow-hidden px-2">
        <motion.div
          className="flex gap-6 py-2"
          animate={{ x: `-${translationValue}rem` }}
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 25,
          }}
        >
          {platformLogos.map((logo, index) => (
            <Card key={index} image={logo.logo} background={logo.background} />
          ))}
        </motion.div>
      </div>

      <motion.button
        className={`absolute right-[-2rem] flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-[#1B1B1BE5] ${currentIndex >= maxIndex ? "hidden" : ""}`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleNext}
        disabled={currentIndex === maxIndex}
      >
        <RightArrow />
      </motion.button>
    </div>
  );
}
