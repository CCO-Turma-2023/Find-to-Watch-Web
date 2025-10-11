import { useEffect, useState } from "react";
import ContentType from "../../components/contentType";
import HeaderPage from "../../components/header";
import ContentInfos from "../../components/contentInfos";
import loginImage from "../../assets/background.png";
import { getMedias } from "../../../app/services/gets/getMedias";
import type { fetchMediaProps, Media } from "../../../app/interfaces/media";

export default function HomeLayout() {
  const [contentInfo, setContentInfo] = useState<Media>({
    id: 0,
    backdrop_path: "",
    type: "Movie",
    title: "VINGADORES: ULTIMATO",
    overview:
      "Em Vingadores: Ultimato, após Thanos eliminar metade das criaturas vivas em Vingadores: Guerra Infinita, os heróis precisam lidar com a dor da perda de amigos e seus entes queridos. Com Tony Stark (Robert Downey Jr.) vagando perdido no espaço sem água nem comida, o Capitão América/Steve Rogers (Chris Evans) e a Viúva Negra/Natasha Romanov (Scarlett Johansson) precisam liderar a resistência contra o titã louco.",
  });

  const [mathRandom, setMathRandom] = useState(
    Math.floor(Math.random() * 18) + 1,
  );

  useEffect(() => {
    const teste = async () => {
      const data: fetchMediaProps = {
        page: 1,
        genreId: 0,
        mediaType: "movie",
      };

      const trending = await getMedias(data);

      if (trending) {
        console.log("Retorno do getMedias:", trending);
        setContentInfo(trending[mathRandom]);
      }
    };

    teste();
  }, []);

  useEffect(() => {
    console.log("Novo contentInfo:", contentInfo);
  }, [contentInfo]);

  return (
    <div
      className="h-screen w-full bg-cover bg-center"
      style={{
        backgroundImage: `url(${(contentInfo && contentInfo?.backdrop_path) || loginImage})`,
      }}
    >
      <HeaderPage />
      <div className="mt-[18rem] w-full px-26">
        <div className="flex h-[16rem] w-[30rem] flex-col gap-3">
          <ContentType type="Movie" />
          <h2 className="text-[1.625rem] font-bold text-white">
            {(contentInfo && contentInfo?.title) || "Carregando..."}
          </h2>
          <div className="flex items-center justify-start gap-2 text-[#FFFFFF99]">
            {/*  <ContentInfos bool={true} info={contentInfo[0].duration} />
            <ContentInfos bool={true} info={contentInfo[0].year} />
            <ContentInfos bool={true} info={contentInfo[0].genres[0]} />
            <ContentInfos info={contentInfo[0].genres[1]} /> */}
          </div>
          <div>
            <span className="text-[#FFFFFFCC]">
              {(contentInfo && contentInfo?.overview) || "Carregando..."}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
