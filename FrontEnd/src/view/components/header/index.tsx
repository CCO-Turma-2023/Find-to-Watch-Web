import { motion } from "framer-motion";
import NavButtons from "../navButtons";

export default function HeaderPage() {
  return (
    <header className="mt-[4.78rem] flex w-full items-center justify-evenly gap-[5rem] text-white">
      <h1>FIND TO WATCH</h1>
      <div className="flex items-center justify-center gap-[0.58rem]">
        <NavButtons title="Home" route="/home" />
        <NavButtons title="Séries" route="/series" />
        <NavButtons title="Filmes" route="/movies" />
        <NavButtons title="Cinema" route="/cinema" />
      </div>
      <div>
        <button
          className="h-[2.5rem] w-[8.125rem] bg-[#00925D]"
          onClick={() => {
            localStorage.removeItem("token");
            window.location.replace("/login");
          }}
        >
          Logout
        </button>
      </div>
    </header>
  );
}
