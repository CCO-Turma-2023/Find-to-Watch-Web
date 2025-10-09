import loginImage from "../../assets/loginIcon.jpg";
import LoginLayout from "../../layouts/login";

export default function Login() {
  return (
    <div
      className={`flex h-screen w-full justify-end bg-cover bg-center`}
      style={{ backgroundImage: `url(${loginImage})` }}
    >
      <LoginLayout />
    </div>
  );
}
