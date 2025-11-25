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
  {
    name: "Netflix",
    logo: netflix,
    background: "#000000",
    link: "https://www.netflix.com",
  },
  {
    name: "Amazon Prime Video",
    logo: prime,
    background: "#FFFFFF",
    link: "https://www.primevideo.com",
  },
  {
    name: "Disney Plus",
    logo: disney,
    background: "#113CCF",
    link: "https://www.disneyplus.com",
  },
  {
    name: "HBO Max",
    logo: max,
    background: "#ffffff",
    link: "https://www.hbomax.com",
  },
  {
    name: "Apple TV+",
    logo: apple,
    background: "#000000",
    link: "https://www.apple.com/apple-tv-plus/",
  },
  {
    name: "Paramount Plus",
    logo: paramount,
    background: "#ffffff",
    link: "https://www.paramountplus.com",
  },
  {
    name: "Claro Video",
    logo: claro,
    background: "#ffffff",
    link: "https://www.clarovideo.com",
  },
  {
    name: "Claro+",
    logo: claroplus,
    background: "#ffffff",
    link: "https://www.clarotvplus.com",
  },
  {
    name: "Globoplay",
    logo: globoplay,
    background: "#ffffff",
    link: "https://www.globoplay.com",
  },
  {
    name: "Crunchyroll",
    logo: crunchyroll,
    background: "#ff8000",
    link: "https://www.crunchyroll.com",
  },
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

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount =
        direction === "left" ? -clientWidth / 2 : clientWidth / 2;

      scrollRef.current.scrollTo({
        left: scrollLeft + scrollAmount,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
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
      normalize(p).includes(normalize(platform.name)),
    );
  });

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-[#141414] font-sans text-white">
      {showModal && (
        <ListModal
          filmName={contentInfo?.title || ""}
          mediaId={contentInfo?.id || 0}
          onClose={() => setShowModal(false)}
        />
      )}

      <div className="absolute top-0 left-0 z-0 h-[70vh] w-full md:h-screen">
        <div className="relative h-full w-full">
          <img
            className="h-full w-full object-cover object-top"
            src={contentInfo?.backdrop_path}
            alt={contentInfo?.title}
          />

          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute inset-0 bottom-0 h-full bg-gradient-to-t from-[#141414] via-[#141414]/60 to-transparent" />
          <div className="absolute inset-0 w-full bg-gradient-to-r from-[#141414] via-[#141414]/40 to-transparent md:w-2/3" />
        </div>
      </div>

      <motion.button
        className="fixed top-6 left-4 z-50 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-black/50 backdrop-blur-sm transition-colors hover:bg-white/20 md:top-8 md:left-8 md:h-12 md:w-12"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate(-1)}
      >
        <LeftArrow />
      </motion.button>

      <div className="relative z-10 flex flex-col px-4 pt-[35vh] pb-12 md:px-12 md:pt-[30vh] lg:px-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex max-w-3xl flex-col gap-6"
        >
          {/* Header Infos */}
          <div className="flex flex-col items-start gap-3">
            {/* Componente de Tipo (Filme/Série) - opcional deixar, mas ajustei margens */}
            <div className="mb-1">
              <ContentType
                type={contentInfo?.type === "movie" ? "Filme" : "Série"}
              />
            </div>

            <h1 className="text-4xl leading-tight font-extrabold tracking-tight text-white drop-shadow-lg sm:text-5xl md:text-6xl">
              {contentInfo?.title}
            </h1>

            <div className="flex flex-wrap items-center gap-3 text-sm font-medium text-gray-300 md:text-base">
              {contentInfo?.year && (
                <span className="font-bold text-white">{contentInfo.year}</span>
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
                        {genre}
                        {i < contentInfo.genres.length - 1 ? ", " : ""}
                      </span>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          <p className="line-clamp-4 max-w-2xl text-base leading-relaxed text-gray-300 drop-shadow-md md:line-clamp-none md:text-lg">
            {contentInfo?.overview}
          </p>

          <div className="mt-2 flex flex-col gap-4 sm:flex-row">
            <ActionButton
              icon={<PlayIcon />}
              label="Ver Trailer"
              onClick={handleOpenTrailer}
              variant="primary"
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

          {availablePlatforms.length > 0 && (
            <div className="mt-6">
              <p className="mb-3 text-sm font-semibold tracking-wider text-gray-400 uppercase">
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

        {contentInfo?.cast && contentInfo?.cast.length > 0 && (
          <div className="mt-16 w-full max-w-[100vw]">
            <h3 className="mb-6 border-l-4 border-blue-600 pl-3 text-xl font-bold text-white">
              Elenco Principal
            </h3>

            <div className="group relative w-full">
              <button
                onClick={() => scroll("left")}
                className="absolute top-1/2 left-0 z-20 hidden h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-all duration-300 group-hover:opacity-100 hover:scale-110 hover:bg-blue-600 disabled:opacity-0 md:flex"
              >
                <LeftArrow />
              </button>

              <div
                ref={scrollRef}
                className="scrollbar-hide flex snap-x gap-4 overflow-x-auto scroll-smooth px-1 pb-4"
              >
                {contentInfo.cast.map((actor) => (
                  <div
                    key={actor.name}
                    className="relative max-w-[100px] min-w-[100px] snap-start flex-col items-center gap-2 md:max-w-[120px] md:min-w-[120px]"
                  >
                    <div className="relative mx-auto h-28 w-28 overflow-hidden rounded-full border-2 border-transparent transition-all hover:border-blue-500 md:h-32 md:w-32">
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
                      <p className="line-clamp-1 text-sm font-medium text-white">
                        {actor.name}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => scroll("right")}
                className="absolute top-1/2 right-0 z-20 hidden h-12 w-12 translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-all duration-300 group-hover:opacity-100 hover:scale-110 hover:bg-blue-600 md:flex"
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
