import { useState } from "react";
import LoginForm from "../../components/inputLogin";
import { InputSwitch } from "primereact/inputswitch";
import ButtonLogin from "../../components/buttonLogin";
import ButtonGoogle from "../../components/buttonGoogle";
import type { loginProps } from "../../../app/interfaces/login";
import { authenticationRegister } from "../../../app/services/posts/register";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../../app/contexts/contexts";

type RegisterLayoutProps = {
  onNavigateToLogin: () => void;
};

export default function RegisterLayout({ onNavigateToLogin }: RegisterLayoutProps) {
  const navigate = useNavigate(); 
  const [checked, setChecked] = useState(false);
  const [data, setData] = useState<loginProps>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    isGoogle: false,
  });
  const { showToast } = useToast();

  const validateForm = (): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      showToast({ severity: 'error', summary: 'Erro', detail: 'Por favor, insira um e-mail válido.' });
      return false;
    }

    if (data.password.length < 8) {
      showToast({ severity: 'error', summary: 'Senha Fraca', detail: 'A senha deve ter no mínimo 8 caracteres.' });
      return false;
    }
    if (!/[A-Z]/.test(data.password)) {
      showToast({ severity: 'error', summary: 'Senha Fraca', detail: 'A senha deve conter ao menos uma letra maiúscula.' });
      return false;
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(data.password)) {
      showToast({ severity: 'error', summary: 'Senha Fraca', detail: 'A senha deve conter ao menos um caractere especial.' });
      return false;
    }

    if (data.password !== data.confirmPassword) {
      showToast({ severity: 'error', summary: 'Erro', detail: 'As senhas não coincidem.' });
      return false;
    }

    return true;
  };

  async function handleClick(type: string) {
    if (type === "createAccount") {
      const isValid = validateForm();
      if (!isValid) {
        return;
      }
      
      if (checked) {
        localStorage.setItem("rememberMe", true.toString());
        localStorage.setItem("email", data.email);
      }

      const handleMessage = (message: string, severity : "error" | "success" | "info" | "warn" | "secondary" | "contrast" | undefined, summary : string) => {
        showToast({ severity: severity, summary: summary, detail: message });
      };

      const registered = await authenticationRegister(data, handleMessage);

      if(registered){
        navigate("/home");
      }

    } else {
      onNavigateToLogin();
    }
  }

  return (
    <div
      className="flex h-full w-full flex-col items-center justify-center"
      style={{
        background:
          "linear-gradient(270deg, rgba(0, 0, 0, 0.11) 1.07%, rgba(0, 0, 0, 0.50) 11.3%, rgba(0, 0, 0, 0.55) 15.04%, rgba(0, 0, 0, 0.60) 25.66%, rgba(0, 0, 0, 0.65) 32.15%, rgba(0, 0, 0, 0.70) 42.19%, rgba(0, 0, 0, 0.75) 52.22%, rgba(0, 0, 0, 0.80) 64.02%, rgba(0, 0, 0, 0.90) 79.66%, #000 100%)",
      }}
    >
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-5xl font-bold text-white md:scale-75 xl:scale-100">
          REGISTRE-SE!
        </h1>
        <h2 className="text-3xl text-white/90 md:scale-75 xl:scale-100">
          AO FIND TO WATCH
        </h2>
      </div>
      <div className="mt-[2.94rem] flex flex-col items-center justify-center gap-[1.88rem]">
        <LoginForm
          setData={setData}
          data={data}
          type="username"
          textDefault="Digite seu username"
        ></LoginForm>
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
        <LoginForm
          setData={setData}
          data={data}
          type="confirmPassword"
          textDefault="Confirme sua senha"
        ></LoginForm>
        <div className="flex w-full items-center justify-start">
          <InputSwitch
            checked={checked}
            onChange={(e) => setChecked(e.value)}
          />
          <span className="pl-2 font-bold text-[#FFFFFFCC]">LEMBRAR-ME</span>
        </div>
        <div className="flex items-center justify-center gap-[1.19rem]">
          <ButtonLogin form="register" handleClick={handleClick} type="createAccount" />
          <ButtonLogin form="register" handleClick={handleClick} type="cancelar" />
        </div>
        <span className="font-semibold text-white">OU</span>
        <ButtonGoogle />
      </div>
    </div>
  );
}