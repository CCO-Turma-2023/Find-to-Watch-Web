import loginImage from "../../assets/background.png";
import HomeLayout from "../../layouts/home";

export default function Home() {
  return (
    <div
      className={`flex h-screen w-full justify-end bg-cover bg-center`}
      style={{ backgroundImage: `url(${loginImage})` }}
    >
      <HomeLayout />
    </div>
  );
}
