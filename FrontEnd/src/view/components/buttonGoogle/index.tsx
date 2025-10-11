// src/components/ButtonGoogle.tsx

import { motion } from "framer-motion";
import { useGoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom"; 

import GoogleIcon from "../../assets/icons/googleIcon";
import { authenticationGoogle } from "../../../app/services/posts/authenticationGoogle";
import { useToast } from "../../../app/contexts/contexts";


export default function ButtonGoogle() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleMessage = (message: string, severity : "error" | "success" | "info" | "warn" | "secondary" | "contrast" | undefined, summary : string) => {
        showToast({ severity: severity, summary: summary, detail: message });
    };

  const login = useGoogleLogin({
    flow: 'auth-code',
    onSuccess: async (codeResponse) => {
      
      const success = await authenticationGoogle(
        { code: codeResponse.code }, 
        handleMessage
      );

      if (success) {
        navigate("/"); 
      }
    },
    onError: (error) => {
      console.error("Falha no login com Google:", error);
      handleMessage("Falha ao autenticar com o Google.", 'error', 'Erro');
    },
  });

  return (
    <motion.button
      className="flex h-[3.75rem] w-full items-center justify-center gap-4 rounded-full bg-white shadow-md"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => login()}
    >
      <GoogleIcon />
      <span className="text-[1rem] font-bold text-black">
        Continuar com o Google
      </span>
    </motion.button>
  );
}