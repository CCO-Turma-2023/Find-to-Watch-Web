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

export default function HeaderPage() {
  const [infoToken, setInfoToken] = useState<DecodedToken | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = decodeToken();
    setInfoToken(token ?? null);
  }, []);

  return (
    <header
      className="flex w-full items-center justify-evenly gap-[5rem] py-3 text-white"
      style={{
        background:
          "linear-gradient(180deg, rgba(0,0,0,0.7) 0%, rgba(2, 2, 2, 0.5) 50%, rgba(2, 2, 2, 0.10) 100%)",
      }}
    >
      <img className="h-14 w-26" src={logo} alt="" />

      <div className="flex items-center justify-center gap-[1rem]">
        <NavButtons title="Home" route="/" />
        <NavButtons title="Séries" route="/series" />
        <NavButtons title="Filmes" route="/movies" />
        <NavButtons title="Cinema" route="/cinema" />
      </div>
      <div>
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
    </header>
  );
}
