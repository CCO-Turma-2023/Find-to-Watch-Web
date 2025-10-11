import { motion } from "framer-motion";

interface ButtonsProps {
  title: string;
  color: string;
  handleClick: () => void;
}

export default function Buttons({ title, color, handleClick }: ButtonsProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`h-[2.5rem] w-[8.125rem] rounded-full bg-[${color}]`}
      onClick={handleClick}
    >
      {title}
    </motion.button>
  );
}
