import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import loginImage from "../../assets/loginIcon.jpg";

import LoginLayout from "../../layouts/login";
import RegisterLayout from "../../layouts/register";

const panelVariants = {
  hidden: (direction: "left" | "right") => ({
    x: direction === "left" ? "-100%" : "100%",
    opacity: 0,
  }),
  visible: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.5, ease: [0.43, 0.13, 0.23, 0.96] as const },
  },
  exit: (direction: "left" | "right") => ({
    x: direction === "left" ? "-100%" : "100%",
    opacity: 0,
    transition: { duration: 0.5, ease: [0.43, 0.13, 0.23, 0.96] as const },
  }),
};

export default function AuthPage() {
  const [isRegister, setIsRegister] = useState(false);

  return (
    <div
      className="relative h-screen w-full overflow-x-hidden bg-cover bg-center"
      style={{ backgroundImage: `url(${loginImage})` }}
    >
      <AnimatePresence initial={false}>
        {!isRegister ? (
          <motion.div
            key="login"
            variants={panelVariants}
            custom="left"
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute top-0 right-0 flex h-full w-full flex-col items-center justify-center md:w-1/2 lg:w-[45%]"
          >
            <LoginLayout onNavigateToLogin={() => setIsRegister(true)} />
          </motion.div>
        ) : (
          <motion.div
            key="register"
            variants={panelVariants}
            custom="right"
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute top-0 left-0 flex h-full w-full flex-col items-center justify-center md:w-1/2 lg:w-[45%]"
          >
            <RegisterLayout onNavigateToLogin={() => setIsRegister(false)} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
