import { motion } from "framer-motion";

export interface NavButtonsProps {
  title: string;
  route: string;
}

export default function NavButtons({ title, route }: NavButtonsProps) {
  const isActive = window.location.pathname === route;

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={() => {
        window.location.replace(route);
      }}
      className="text-[1.25rem] font-medium"
      style={{
        color: isActive ? "white" : "#FFFFFFB2",
      }}
    >
      {title}
    </motion.button>
  );
}
