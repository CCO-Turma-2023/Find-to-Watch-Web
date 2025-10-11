import { motion } from "framer-motion";
import { useState } from "react";
import { CgProfile } from "react-icons/cg";
import { FaGear } from "react-icons/fa6";
import { MdLogout } from "react-icons/md";
import { VscTriangleDown } from "react-icons/vsc";
import { useNavigate } from "react-router-dom";
import type { DecodedToken } from "../../../app/services/api.service";

export default function PerfilOptions({ info }: { info: DecodedToken | null }) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/auth");
  };
  const Freya = "Freya"; // Nome de usuário fictício
  const options = [
    {
      icon: <CgProfile />,
      name: "Perfil",
      action: () => console.log("Profile clicked"),
    },
    {
      icon: <FaGear />,
      name: "Configurações",
      action: () => console.log("Settings clicked"),
    },
    {
      icon: <MdLogout />,
      name: "Sair da conta",
      action: logout,
    },
  ];

  return (
    <div className="relative flex flex-col items-center justify-center gap-1">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="h-[3.5rem] w-[3.5rem] rounded-full bg-white"
        onClick={() => setIsOpen(!isOpen)}
      ></motion.button>

      {isOpen && (
        <>
          <div className="absolute top-17 text-[1.6rem]">
            <VscTriangleDown />
          </div>
          <div
            className="absolute top-24 left-0 w-48 rounded-xl"
            style={{
              background:
                "linear-gradient(0deg, #000 0%, rgba(2, 2, 2, 0.90) 100%)",
            }}
          >
            <span className="flex w-full items-center gap-2 p-3 text-left text-white">
              Olá, {info?.username}!
            </span>
            {options.map((option, index) => (
              <button
                key={index}
                className="flex w-full items-center gap-2 p-3 text-left text-white hover:bg-white/10"
                onClick={option.action}
              >
                {option.icon}
                {option.name}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
