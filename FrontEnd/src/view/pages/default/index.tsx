import defaultImage from "../../assets/default.jpg";
import { motion } from "framer-motion";

export default function Default() {
  return (
    <div className="relative flex h-screen w-full flex-col items-center justify-start gap-[6rem] overflow-hidden bg-green-800 p-12">
      <h1 className="text-5xl font-bold text-white">
        PÁGINA NÃO ENCONTRADA :/
      </h1>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="z-10 h-[2.5rem] w-[9.375rem] rounded-full bg-[#191919] text-white"
        onClick={() => window.location.replace("/home")}
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
  );
}
