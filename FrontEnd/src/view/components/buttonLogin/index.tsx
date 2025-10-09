import { motion } from "framer-motion";

export default function ButtonLogin({
  type,
  handleClick,
}: {
  type: string;
  handleClick: (type: string) => void;
}) {
  const properties = {
    text: type === "createAccount" ? "Criar conta" : "Entrar",
    backgroundColor: type === "createAccount" ? "#191919" : "#00925D",
  };
  return (
    <motion.button
      className="h-[2.5rem] w-[9.375rem] rounded-full"
      style={{
        background: properties.backgroundColor,
      }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => {
        handleClick(type);
      }}
    >
      <span className="text-[1rem] text-white">{properties.text}</span>
    </motion.button>
  );
}
