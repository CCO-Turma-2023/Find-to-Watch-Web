import defaultImage from "../../assets/default.jpg";
import { motion } from "framer-motion";
import HeaderPage from "../../components/header";

export default function Default() {
  return (
    <div className="min-h-screen w-full bg-[#0a0a0a]">
      <div className="z-50 bg-gradient-to-b from-black/90 to-transparent px-4 pt-4 pb-8 transition-all duration-300">
        <HeaderPage />
      </div>

      <div className="flex h-screen w-full flex-1 flex-col items-center justify-center gap-2 overflow-hidden">
        <h1 className="z-50 border-0 border-b border-white/20 px-4 py-2 text-5xl font-bold text-white">
          PÁGINA NÃO ENCONTRADA :/
        </h1>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="z-50 h-[2.5rem] w-[9.375rem] rounded-full bg-[#191919] text-white"
          onClick={() => window.location.replace("/")}
        >
          VOLTAR
        </motion.button>

        <motion.img
          src={defaultImage}
          alt=""
          className="relative z-0 h-[20rem] w-[60rem]"
          animate={{
            x: ["-20%", "20%", "-20%"],
            y: ["-10%", "10%", "-10%"],
            rotate: [0, 5, -5, 0],
            scale: [0, 1, 3],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            repeatType: "mirror",
            ease: "easeInOut",
          }}
        />
      </div>
    </div>
  );
}
