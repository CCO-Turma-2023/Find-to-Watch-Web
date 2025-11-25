import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useMedia, useToast } from "../../../app/contexts/contexts";
import { useEffect, useState, useRef } from "react";
import type { Media } from "../../../app/interfaces/media";
import { getMediaDetails } from "../../../app/services/gets/getMediaDetails";
import ContentType from "../../components/contentType";
import { motion } from "framer-motion";
import ContentInfos from "../../components/contentInfos";
import PlayIcon from "../../assets/icons/playIcon";
import MarkerIcon from "../../assets/icons/marker";
import TrailerModal from "../../components/trailerModal";
import ActionButton from "../../components/actionButton";
import LeftArrow from "../../assets/icons/leftArrow";
import RightArrow from "../../assets/icons/rightArrow";
import perfilDefault from "../../assets/defaultPerfil.jpg";
import ListModal from "../../components/listModal";
import { isTokenValid } from "../../../app/services/api.service";

// Importações de imagens (mantidas do seu código original)
import apple from "../../assets/platforms/apple.png";
import claro from "../../assets/platforms/claro.png";
import disney from "../../assets/platforms/disney.png";
import crunchyroll from "../../assets/platforms/crunchyroll.png";
import netflix from "../../assets/platforms/netflix.png";
import prime from "../../assets/platforms/primevideo.png";
import paramount from "../../assets/platforms/paramount.png";
import globoplay from "../../assets/platforms/globo.png";
import claroplus from "../../assets/platforms/clarotvplus.png";
import max from "../../assets/platforms/max.png";

const platformLogos = [
  { name: "Netflix", logo: netflix, background: "#000000", link: "https://www.netflix.com" },
  { name: "Amazon Prime Video", logo: prime, background: "#FFFFFF", link: "https://www.primevideo.com" },
  { name: "Disney Plus", logo: disney, background: "#113CCF", link: "https://www.disneyplus.com" },
  { name: "HBO Max", logo: max, background: "#ffffff", link: "https://www.hbomax.com" },
  { name: "Apple TV+", logo: apple, background: "#000000", link: "https://www.apple.com/apple-tv-plus/" },
  { name: "Paramount Plus", logo: paramount, background: "#ffffff", link: "https://www.paramountplus.com" },
  { name: "Claro Video", logo: claro, background: "#ffffff", link: "https://www.clarovideo.com" },
  { name: "Claro+", logo: claroplus, background: "#ffffff", link: "https://www.clarotvplus.com" },
  { name: "Globoplay", logo: globoplay, background: "#ffffff", link: "https://www.globoplay.com" },
  { name: "Crunchyroll", logo: crunchyroll, background: "#ff8000", link: "https://www.crunchyroll.com" },
];

export default function InfoContent() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const { type } = location.state || {};
  const [showTrailer, setShowTrailer] = useState(false);
  const [contentInfo, setContentInfo] = useState<Media>();
  const { genres } = useMedia();
  const [videoId, setVideoId] = useState<string | null>(null);
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showModal, setShowModal] = useState(false);
  const { showToast } = useToast();

  const handleOpenTrailer = () => {
    if (contentInfo?.trailer) setShowTrailer(true);
  };

  const handleCloseTrailer = () => setShowTrailer(false);

  // Função de scroll melhorada
  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = direction === "left" ? -clientWidth / 2 : clientWidth / 2;
      
      scrollRef.current.scrollTo({
        left: scrollLeft + scrollAmount,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    // Lógica de busca mantida (simplificada para leitura)
    let found = false;
    genres.forEach((g) => {
      g.content.forEach((item) => {
        if (item.id.toString() === id) {
          setContentInfo(item);
          setVideoId(item.trailer || null);
          localStorage.setItem("lastViewed", JSON.stringify(item));
          found = true;
        }
      });
    });

    if (!found) {
      if (type && id) {
        getMediaDetails(id, type).then((data) => {
          if (data) {
            setContentInfo(data);
            setVideoId(data.trailer || null);
            localStorage.setItem("lastViewed", JSON.stringify(data));
          }
        });
      } else {
        const lastViewed = localStorage.getItem("lastViewed");
        if (lastViewed) {
          const parsed = JSON.parse(lastViewed);
          if (parsed.id.toString() === id) {
            setContentInfo(parsed);
            setVideoId(parsed.trailer || null);
          }
        }
      }
    }
  }, [genres, id, type]);

  const normalize = (str: string) =>
    str.toLowerCase().replace(/\+/g, "plus").replace(/\s+/g, "").trim();

  const availablePlatforms = platformLogos.filter((platform) => {
    if (!contentInfo?.providers) return false;
    return contentInfo.providers.some((p) =>
      normalize(p).includes(normalize(platform.name))
    );
  });

  return (
    <div className="relative min-h-screen w-full bg-[#141414] font-sans text-white overflow-x-hidden">
      {showModal && (
        <ListModal
          filmName={contentInfo?.title || ""}
          mediaId={contentInfo?.id || 0}
          onClose={() => setShowModal(false)}
        />
      )}

      {/* --- BACKGROUND HERO SECTION --- */}
      <div className="absolute top-0 left-0 h-[70vh] md:h-screen w-full z-0">
        <div className="relative h-full w-full">
          <img
            className="h-full w-full object-cover object-top"
            src={contentInfo?.backdrop_path}
            alt={contentInfo?.title}
          />
          {/* Gradientes para legibilidade */}
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-[#141414]/60 to-transparent bottom-0 h-full" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#141414] via-[#141414]/40 to-transparent w-full md:w-2/3" />
        </div>
      </div>

      {/* --- BOTÃO VOLTAR --- */}
      <motion.button
        className="fixed top-6 left-4 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 backdrop-blur-sm border border-white/10 transition-colors hover:bg-white/20 md:left-8 md:top-8 md:h-12 md:w-12"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate(-1)}
      >
        <LeftArrow />
      </motion.button>

      {/* --- CONTEÚDO PRINCIPAL --- */}
      <div className="relative z-10 flex flex-col px-4 pt-[35vh] pb-12 md:px-12 md:pt-[30vh] lg:px-20">
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col gap-6 max-w-3xl"
        >
          {/* Header Infos */}
          <div className="flex flex-col items-start gap-3">
             {/* Componente de Tipo (Filme/Série) - opcional deixar, mas ajustei margens */}
             <div className="mb-1">
               <ContentType type={contentInfo?.type === "movie" ? "Filme" : "Série"} />
             </div>

            <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl md:text-6xl drop-shadow-lg">
              {contentInfo?.title}
            </h1>

            <div className="flex flex-wrap items-center gap-3 text-sm font-medium text-gray-300 md:text-base">
              {contentInfo?.year && (
                <span className="text-white font-bold">{contentInfo.year}</span>
              )}
              
              {contentInfo?.runtime && (
                 <>
                  <span className="h-1 w-1 rounded-full bg-gray-500"></span>
                  <ContentInfos info={contentInfo.runtime} bool={false} />
                 </>
              )}
              
              {contentInfo?.genres && contentInfo.genres.length > 0 && (
                <>
                  <span className="h-1 w-1 rounded-full bg-gray-500"></span>
                  <div className="flex gap-2">
                    {contentInfo.genres.map((genre, i) => (
                       <span key={genre}>
                          {genre}{i < contentInfo.genres.length - 1 ? ", " : ""}
                       </span>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Sinopse */}
          <p className="text-base leading-relaxed text-gray-300 md:text-lg line-clamp-4 md:line-clamp-none max-w-2xl drop-shadow-md">
            {contentInfo?.overview}
          </p>

          {/* Botões de Ação */}
          <div className="flex flex-col sm:flex-row gap-4 mt-2">
            <ActionButton
              icon={<PlayIcon />}
              label="Assistir Trailer"
              onClick={handleOpenTrailer}
              variant="primary"
              // Sugestão: Adicione classes extras no seu componente ActionButton para largura full no mobile
            />
            <ActionButton
              icon={<MarkerIcon />}
              label="Minha Lista"
              onClick={() => {
                if (!isTokenValid()) {
                  showToast({
                    severity: "error",
                    summary: "Acesso negado",
                    detail: "Faça login para salvar na lista.",
                  });
                  return;
                }
                setShowModal(true);
              }}
              variant="secondary"
            />
          </div>

          {/* Plataformas */}
          {availablePlatforms.length > 0 && (
            <div className="mt-6">
              <p className="text-sm font-semibold text-gray-400 mb-3 uppercase tracking-wider">
                Disponível em
              </p>
              <div className="flex flex-wrap gap-3">
                {availablePlatforms.map((platform) => (
                  <motion.button
                    key={platform.name}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => window.open(platform.link, "_blank")}
                    className="flex h-10 w-16 items-center justify-center rounded-lg bg-white p-1 shadow-lg transition-shadow hover:shadow-blue-500/20 md:h-12 md:w-20"
                    style={{ background: platform.background }}
                    title={platform.name}
                  >
                    <img
                      src={platform.logo}
                      alt={platform.name}
                      className="h-full w-full object-contain"
                    />
                  </motion.button>
                ))}
              </div>
            </div>
          )}
        </motion.div>

        {/* --- ELENCO (CARROSSEL) --- */}
        {contentInfo?.cast && contentInfo?.cast.length > 0 && (
          <div className="mt-16 w-full max-w-[100vw]">
            <h3 className="text-xl font-bold text-white mb-6 border-l-4 border-blue-600 pl-3">
              Elenco Principal
            </h3>
            
            <div className="group relative w-full">
              {/* Botão Esquerda (Desktop) */}
              <button
                onClick={() => scroll("left")}
                className="hidden md:flex absolute left-0 top-1/2 z-20 h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-all duration-300 hover:bg-blue-600 hover:scale-110 group-hover:opacity-100 disabled:opacity-0"
              >
                <LeftArrow />
              </button>

              {/* Lista Scrollavel */}
              <div
                ref={scrollRef}
                className="flex gap-4 overflow-x-auto scroll-smooth pb-4 scrollbar-hide px-1 snap-x"
              >
                {contentInfo.cast.map((actor) => (
                  <div
                    key={actor.name}
                    className="relative min-w-[100px] max-w-[100px] snap-start flex-col items-center gap-2 md:min-w-[120px] md:max-w-[120px]"
                  >
                    <div className="relative h-28 w-28 overflow-hidden rounded-full border-2 border-transparent transition-all hover:border-blue-500 md:h-32 md:w-32 mx-auto">
                      <img
                        src={
                          actor.profile_path
                            ? `https://image.tmdb.org/t/p/w185/${actor.profile_path}`
                            : perfilDefault
                        }
                        alt={actor.name}
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <div className="mt-2 text-center">
                      <p className="text-sm font-medium text-white line-clamp-1">
                        {actor.name}
                      </p>
                      {/* Se tiver info do personagem, é legal por também */}
                      {/* <p className="text-xs text-gray-400 line-clamp-1">{actor.character}</p> */}
                    </div>
                  </div>
                ))}
              </div>

              {/* Botão Direita (Desktop) */}
              <button
                onClick={() => scroll("right")}
                className="hidden md:flex absolute right-0 top-1/2 z-20 h-12 w-12 translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-all duration-300 hover:bg-blue-600 hover:scale-110 group-hover:opacity-100"
              >
                <RightArrow />
              </button>
            </div>
          </div>
        )}
      </div>

      {showTrailer && videoId && (
        <TrailerModal videoId={videoId} onClose={handleCloseTrailer} />
      )}
    </div>
  );
}