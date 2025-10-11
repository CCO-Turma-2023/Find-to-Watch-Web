import { motion } from "framer-motion";

export interface NavButtonsProps {
  title: string;
  route: string;
}

export default function NavButtons({ title, route }: NavButtonsProps) {
  const isActive = window.location.pathname === route;

  return (
    <motion.button
      whileHover={{ scale: 1.1, borderBottom: "2px solid white" }}
      whileTap={{ scale: 0.9 }}
      initial={{ borderBottom: isActive ? "0px solid white" : "none" }}
      animate={{ borderBottom: isActive ? "2px solid white" : "none" }}
      transition={{ duration: 0.2 }}
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
