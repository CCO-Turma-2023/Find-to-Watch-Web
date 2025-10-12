import { motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { CgProfile } from "react-icons/cg";
import { FaGear } from "react-icons/fa6";
import { MdLogout } from "react-icons/md";
import { VscTriangleDown } from "react-icons/vsc";
import { useNavigate } from "react-router-dom";
import type { DecodedToken } from "../../../app/services/api.service";

export default function PerfilOptions({ info }: { info: DecodedToken | null }) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const navigate = useNavigate();
  const menuRef = useRef<HTMLDivElement>(null);

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/auth");
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef]);

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
    <div ref={menuRef} className="relative flex flex-col items-center">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="h-[3.5rem] w-[3.5rem] cursor-pointer rounded-full bg-white"
        onClick={() => setIsOpen(!isOpen)}
      ></motion.button>

      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: isOpen ? 1 : 0, y: isOpen ? 0 : -10 }}
        transition={{ duration: 0.2 }}
        className="absolute top-full z-50 mt-4 w-52 left-1/2 -translate-x-1/2 md:left-auto md:right-0 md:translate-x-0"
        style={{ display: isOpen ? "block" : "none" }}
      >
        <div className="absolute -top-3 text-[1.6rem] text-white -translate-x-1/2 left-1/2 md:left-auto md:right-4 md:translate-x-0">
          <VscTriangleDown />
        </div>

        <div
          className="overflow-hidden rounded-xl"
          style={{
            background:
              "linear-gradient(0deg, #000 0%, rgba(2, 2, 2, 0.95) 100%)",
          }}
        >
          <span className="flex w-full items-center gap-2 border-b border-white/10 p-3 text-left font-semibold text-white">
            Olá, {info?.username}!
          </span>
          {options.map((option, index) => (
            <button
              key={index}
              className="flex w-full cursor-pointer items-center gap-3 p-3 text-left text-white hover:bg-white/10"
              onClick={option.action}
            >
              {option.icon}
              {option.name}
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  );
}