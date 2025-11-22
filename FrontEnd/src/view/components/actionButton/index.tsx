import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface ActionButtonProps {
  icon: ReactNode;
  label: string;
  onClick?: () => void;
  variant?: "primary" | "secondary";
}

export default function ActionButton({
  icon,
  label,
  onClick,
  variant = "primary",
}: ActionButtonProps) {
  const isPrimary = variant === "primary";

  return (
    <motion.button
      className={`flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-full sm:w-[11.3125rem] ${
        isPrimary ? "bg-[#03915E]" : "border-2 border-white"
      }`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
    >
      {isPrimary ? (
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white">
          {icon}
        </div>
      ) : (
        icon
      )}
      <span className="text-lg font-bold text-white sm:text-xl">{label}</span>
    </motion.button>
  );
}
