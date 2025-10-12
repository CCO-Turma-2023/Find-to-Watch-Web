import { useState, useRef, useEffect } from "react";
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


const CARD_WIDTH_REM_SM = 10;
const CARD_WIDTH_REM_MD = 13.75;
const CARD_GAP_REM_SM = 0.5; 
const CARD_GAP_REM_MD = 1;  

const makeGradient = (color: string) => `${color}`;

function Card({ image, background }: { image: string; background: string }) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="flex h-[5rem] w-[10rem] flex-shrink-0 cursor-pointer items-center justify-center rounded-xl p-3 shadow-lg md:h-[6.875rem] md:w-[13.75rem] md:p-4"
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

  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(0);

  const [viewportWidth, setViewportWidth] = useState(0);
  const [isSmallScreen, setIsSmallScreen] = useState(true);
  
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new ResizeObserver(() => {
      const isCurrentlySmall = window.innerWidth < 768;
      setIsSmallScreen(isCurrentlySmall);

      const rootFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
      
      const buttonWidthPx = (isCurrentlySmall ? 2.5 : 3) * rootFontSize; 
      const containerGapPx = (isCurrentlySmall ? 0.5 : 1) * rootFontSize; 
      const cardWidthPx = (isCurrentlySmall ? CARD_WIDTH_REM_SM : CARD_WIDTH_REM_MD) * rootFontSize;
      const cardGapPx = (isCurrentlySmall ? CARD_GAP_REM_SM : CARD_GAP_REM_MD) * rootFontSize;

      const totalAvailableWidth = container.offsetWidth;
      const spaceForCards = totalAvailableWidth - (buttonWidthPx * 2) - (containerGapPx * 2);

      const totalItemWidthPx = cardWidthPx + cardGapPx;
      const newVisibleCount = Math.floor((spaceForCards + cardGapPx) / totalItemWidthPx);
      const finalVisibleCount = Math.max(1, newVisibleCount);
      setVisibleCount(finalVisibleCount);

      const newViewportWidth = (finalVisibleCount * cardWidthPx) + (Math.max(0, finalVisibleCount - 1) * cardGapPx);
      setViewportWidth(newViewportWidth);
    });

    observer.observe(container);
    return () => observer.disconnect();
  }, []);


  const maxIndex = Math.max(0, platformLogos.length - visibleCount);

  useEffect(() => {
    if (currentIndex > maxIndex) {
      setCurrentIndex(maxIndex);
    }
  }, [maxIndex, currentIndex]);

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, maxIndex));
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };
  
  const cardGapRem = isSmallScreen ? CARD_GAP_REM_SM : CARD_GAP_REM_MD;
  const cardWidthRem = isSmallScreen ? CARD_WIDTH_REM_SM : CARD_WIDTH_REM_MD;
  const stepWidthRem = cardWidthRem + cardGapRem;
  const translationValueRem = currentIndex * stepWidthRem;

  return (
    <div ref={containerRef} className="w-full max-w-[91rem] flex justify-center">
      
        <div className="flex items-center gap-2 md:gap-4">
            <motion.button
                className={`flex h-10 w-10 flex-shrink-0 cursor-pointer items-center justify-center rounded-full bg-[#1B1B1BE5] md:h-12 md:w-12 ${
                currentIndex <= 0 || platformLogos.length <= visibleCount ? "invisible" : ""
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handlePrev}
                disabled={currentIndex === 0}
            >
                <LeftArrow />
            </motion.button>

            <div 
                className="overflow-hidden"
                style={{ width: `${viewportWidth <= 328 ? viewportWidth : viewportWidth + 16 }px` }}
            >
                <motion.div
                className="flex gap-2 sm:ml-2 py-2 md:gap-4" 
                animate={{ x: `-${translationValueRem}rem` }}
                transition={{ type: "spring", stiffness: 200, damping: 25 }}
                >
                {platformLogos.map((logo, index) => (
                    <Card key={index} image={logo.logo} background={logo.background} />
                ))}
                </motion.div>
            </div>

            <motion.button
                className={`flex h-10 w-10 flex-shrink-0 cursor-pointer items-center justify-center rounded-full bg-[#1B1B1BE5] md:h-12 md:w-12 ${
                currentIndex >= maxIndex || platformLogos.length <= visibleCount ? "invisible" : ""
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleNext}
                disabled={currentIndex >= maxIndex}
            >
                <RightArrow />
            </motion.button>
      </div>
    </div>
  );
}