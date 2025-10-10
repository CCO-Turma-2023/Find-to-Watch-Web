import { useEffect, useState } from "react";
import LoginForm from "../../components/inputLogin";
import { InputSwitch } from "primereact/inputswitch";
import ButtonLogin from "../../components/buttonLogin";
import ButtonGoogle from "../../components/buttonGoogle";
import type { loginProps } from "../../../app/interfaces/login";
import { authenticationLogin } from "../../../app/services/posts/login";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../../app/contexts/contexts";

type LoginLayoutProps = {
  onNavigateToLogin: () => void;
};;

export default function LoginLayout({ onNavigateToLogin}: LoginLayoutProps) {
  const navigate = useNavigate(); 
  const [checked, setChecked] = useState(false);
  const [data, setData] = useState<loginProps>({
    username: "",
    email: "",
    password: "",
    isGoogle: false,
  });
  const { showToast } = useToast();

  useEffect(() => {
    const rememberMe = localStorage.getItem("rememberMe");
    if (rememberMe === "true") {
      setChecked(true);
      setData((prevData) => ({
        ...prevData,
        email: localStorage.getItem("email") || "",
      }));
    }
  }, []);

  const validateForm = (): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      showToast({ severity: 'error', summary: 'Erro', detail: 'Por favor, insira um e-mail válido.' });
      return false;
    }

    return true;
  };

  async function handleClick(type: string) {
    if (type === "createAccount") {
      onNavigateToLogin();
    } else if (type === "login") {
      const isValid = validateForm();
      if (!isValid) {
        return;
      }

      if (checked) {
        localStorage.setItem("rememberMe", true.toString());
        localStorage.setItem("email", data.email);
      } else {
        localStorage.removeItem("rememberMe");
        localStorage.removeItem("email");
      }

      const handleMessage = (message: string, severity : "error" | "success" | "info" | "warn" | "secondary" | "contrast" | undefined, summary : string) => {
        showToast({ severity: severity, summary: summary, detail: message });
      };

      const login = await authenticationLogin(data, handleMessage);

      if(login){
        navigate("/home");
      }
    }
  }

  return (
    <div
      className="flex h-full w-full flex-col items-center justify-center"
      style={{
        background:
          "linear-gradient(90deg, rgba(0, 0, 0, 0.11) 1.07%, rgba(0, 0, 0, 0.50) 11.3%, rgba(0, 0, 0, 0.55) 15.04%, rgba(0, 0, 0, 0.60) 25.66%, rgba(0, 0, 0, 0.65) 32.15%, rgba(0, 0, 0, 0.70) 42.19%, rgba(0, 0, 0, 0.75) 52.22%, rgba(0, 0, 0, 0.80) 64.02%, rgba(0, 0, 0, 0.90) 79.66%, #000 100%)",
      }}
    >
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-5xl font-bold text-white md:scale-75 xl:scale-100">
          BEM VINDO!
        </h1>
        <h2 className="text-3xl text-white/90 md:scale-75 xl:scale-100">
          AO FIND TO WATCH
        </h2>
      </div>
      <div className="mt-[2.94rem] flex flex-col items-center justify-center gap-[1.88rem]">
        <LoginForm
          setData={setData}
          data={data}
          type="email"
          textDefault="Digite seu email"
        ></LoginForm>
        <LoginForm
          setData={setData}
          data={data}
          type="password"
          textDefault="Digite sua senha"
        ></LoginForm>
        <div className="flex w-full items-center justify-start">
          <InputSwitch
            checked={checked}
            onChange={(e) => setChecked(e.value)}
          />
          <span className="pl-2 font-bold text-[#FFFFFFCC]">LEMBRAR-ME</span>
        </div>
        <div className="flex items-center justify-center gap-[1.19rem]">
          <ButtonLogin form="login" handleClick={handleClick} type="createAccount" />
          <ButtonLogin form="login" handleClick={handleClick} type="login" />
        </div>
        <span className="font-semibold text-white">OU</span>
        <ButtonGoogle />
      </div>
    </div>
  );
}