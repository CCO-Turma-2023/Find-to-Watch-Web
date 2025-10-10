import { motion } from "framer-motion";

export default function ButtonLogin({
  type,
  handleClick,
}: {
  type: string;
  handleClick: (type: string) => void;
}) {
  let text = "";
  let backgroundColor = "";

  if (type === "createAccount") {
    text = "Criar conta";
    if (document.location.pathname === "/register") {
      backgroundColor = "#00925D";
    } else {
      backgroundColor = "#191919";
    }
  } else if (type === "login") {
    text = "Entrar";
    backgroundColor = "#00925D";
  } else {
    text = "Cancelar";
    backgroundColor = "#191919";
  }

  return (
    <motion.button
      className="h-[2.5rem] w-[9.375rem] rounded-full"
      style={{
        background: backgroundColor,
      }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => {
        handleClick(type);
      }}
    >
      <span className="text-[1rem] text-white">{text}</span>
    </motion.button>
  );
}
