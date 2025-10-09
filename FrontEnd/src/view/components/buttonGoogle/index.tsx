import { motion } from "framer-motion";
import GoogleIcon from "../../assets/icons/googleIcon";

export default function ButtonGoogle() {
  return (
    <motion.button
      className="flex h-[3.75rem] w-full items-center justify-center gap-4 rounded-full bg-white shadow-md"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <GoogleIcon />
      <span className="text-[1rem] font-bold text-black">
        Continuar com o Google
      </span>
    </motion.button>
  );
}
