import { motion } from "framer-motion";
import LeftArrow from "../../assets/icons/leftArrow";
import RightArrow from "../../assets/icons/rightArrow";

interface NavigationButtonProps {
  direction: "left" | "right";
  onClick: () => void;
  className?: string;
}

export default function NavigationButton({
  direction,
  onClick,
  className = "",
}: NavigationButtonProps) {
  return (
    <motion.button
      className={`flex h-10 w-10 flex-shrink-0 cursor-pointer items-center justify-center rounded-full bg-[#1B1B1BE5] md:h-12 md:w-12 ${className}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
    >
      {direction === "left" ? <LeftArrow /> : <RightArrow />}
    </motion.button>
  );
}
