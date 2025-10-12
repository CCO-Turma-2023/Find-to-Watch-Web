import { useNavigate } from "react-router-dom";
import NavButtons from "../navButtons";
import { useEffect, useState } from "react";
import {
  decodeToken,
  isTokenValid,
  type DecodedToken,
} from "../../../app/services/api.service";
import Buttons from "../buttons";
import PerfilOptions from "../perfilOptions";
import logo from "../../assets/logo.png";

const HamburgerIcon = () => (
  <svg
    className="h-6 w-6"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M4 6h16M4 12h16m-7 6h7"
    ></path>
  </svg>
);

export default function HeaderPage() {
  const [infoToken, setInfoToken] = useState<DecodedToken | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = decodeToken();
    setInfoToken(token ?? null);
  }, []);

  const navLinks = (
    <>
      <NavButtons title="Home" route="/" />
      <NavButtons title="Séries" route="/series" />
      <NavButtons title="Filmes" route="/movies" />
      <NavButtons title="Cinema" route="/cinema" />
    </>
  );

  return (
    <header
      
      className="relative flex w-full items-center px-4 py-3 text-white md:px-8"
      style={{
        background:
          "linear-gradient(180deg, rgba(0,0,0,0.7) 0%, rgba(2, 2, 2, 0.5) 50%, rgba(2, 2, 2, 0.10) 100%)",
      }}
    >
      
      <div className="hidden w-full items-center md:flex md:flex-1 md:gap-4">
        
        <div className="flex flex-1 justify-start">
          <img className="h-14 w-auto flex-shrink-0" src={logo} alt="Logo" />
        </div>

        
        <nav className="flex items-center gap-4 lg:gap-6">{navLinks}</nav>

        <div className="flex flex-1 justify-end">
          {isTokenValid() ? (
            <PerfilOptions info={infoToken} />
          ) : (
            <div className="flex gap-2">
              <Buttons
                title="Sign up"
                color="#191919"
                handleClick={() => navigate("/auth")}
              />
              <Buttons
                title="Login"
                color="#00925D"
                handleClick={() => navigate("/auth")}
              />
            </div>
          )}
        </div>
      </div>

      <div className="flex w-full items-center justify-between md:hidden">
        <img className="h-14 w-auto flex-shrink-0" src={logo} alt="Logo" />
        <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <HamburgerIcon />
        </button>
      </div>

      {isMenuOpen && (
        <div className="absolute left-0 top-full z-50 flex w-full flex-col items-center gap-4 bg-black/95 p-4 md:hidden">
          {navLinks}
          {isTokenValid() ? (
            <div className="mt-4 w-full">
              <PerfilOptions info={infoToken} />
            </div>
          ) : (
            <div className="mt-4 flex w-full flex-row justify-center gap-2">
              <Buttons
                title="Sign up"
                color="#191919"
                handleClick={() => navigate("/auth")}
              />
              <Buttons
                title="Login"
                color="#00925D"
                handleClick={() => navigate("/auth")}
              />
            </div>
          )}
        </div>
      )}
    </header>
  );
}