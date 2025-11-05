import { useNavigate, useParams } from "react-router-dom";
import { useMedia } from "../../../app/contexts/contexts";
import { useEffect, useState, useRef } from "react";
import type { Media } from "../../../app/interfaces/media";
import ContentType from "../../components/contentType";
import { motion } from "framer-motion";
import ContentInfos from "../../components/contentInfos";
import PlayIcon from "../../assets/icons/playIcon";
import MarkerIcon from "../../assets/icons/marker";
import YouTube from "react-youtube";
import LeftArrow from "../../assets/icons/leftArrow";
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
import RightArrow from "../../assets/icons/rightArrow";
import perfilDefault from "../../assets/defaultPerfil.jpg";

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
  const [showTrailer, setShowTrailer] = useState(false);
  const [contentInfo, setContentInfo] = useState<Media>();
  const { genres } = useMedia();
  const [videoId, setVideoId] = useState<string | null>(null);
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleOpenTrailer = () => {
    if (contentInfo?.trailer) setShowTrailer(true);
  };

  const handleCloseTrailer = () => setShowTrailer(false);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount =
        direction === "left" ? -clientWidth / 1.5 : clientWidth / 1.5;
      scrollRef.current.scrollTo({
        left: scrollLeft + scrollAmount,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    genres.forEach((g) => {
      g.content.forEach((item) => {
        if (item.id.toString() === id) {
          setContentInfo(item);
          setVideoId(item.trailer || null);
          localStorage.setItem("lastViewed", JSON.stringify(item));
        }
      });
    });

    if (!contentInfo) {
      const lastViewed = localStorage.getItem("lastViewed");
      if (lastViewed) {
        setContentInfo(JSON.parse(lastViewed));
      }
    }
  }, [genres, id]);

  const normalize = (str: string) =>
    str.toLowerCase().replace(/\+/g, "plus").replace(/\s+/g, "").trim();

  const availablePlatforms = platformLogos.filter((platform) => {
    if (!contentInfo?.providers) return false;
    return contentInfo.providers.some((p) =>
      normalize(p).includes(normalize(platform.name)),
    );
  });

  return (
    <div className="flex min-h-screen w-full flex-col gap-1 bg-black">
      <div className="absolute h-full w-full">
        <img
          className="h-full w-full object-cover"
          src={contentInfo?.backdrop_path}
          alt=""
        />
        <div className="absolute inset-0 h-full w-full bg-black/50" />
        <div className="absolute inset-0 h-full w-full bg-gradient-to-t from-black via-black/30 to-transparent" />
      </div>

      <div className="flex h-[90vh] w-full flex-col justify-center gap-3 px-[5rem]">
        <motion.button
          className="absolute top-4 left-4 z-30 flex h-10 w-10 flex-shrink-0 cursor-pointer items-center justify-center rounded-full bg-[#1B1B1BE5] md:h-12 md:w-12"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate(-1)}
        >
          <LeftArrow />
        </motion.button>

        <motion.div
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 },
          }}
          className="z-20 mt-14 flex min-h-[380px] max-w-xs flex-col justify-center sm:max-w-md md:max-w-xl lg:max-w-2xl"
        >
          <ContentType
            type={contentInfo?.type === "movie" ? "Filme" : "Série"}
          />
          <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl md:text-5xl">
            {contentInfo?.title}
          </h2>

          <div className="text-opacity-80 mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-white">
            {contentInfo?.year && (
              <ContentInfos
                info={contentInfo.year}
                bool={
                  !!contentInfo.runtime || (contentInfo.genres?.length ?? 0) > 0
                }
              />
            )}
            {contentInfo?.runtime && (
              <ContentInfos
                info={contentInfo.runtime}
                bool={(contentInfo.genres?.length ?? 0) > 0}
              />
            )}
            {contentInfo?.genres?.map((genre, index) => (
              <ContentInfos
                key={genre}
                info={genre}
                bool={index < contentInfo.genres.length - 1}
              />
            ))}
          </div>

          <p className="mt-4 line-clamp-10 text-gray-200 sm:line-clamp-11 md:line-clamp-12">
            {contentInfo?.overview}
          </p>

          <div className="mt-4 flex flex-col items-start justify-start gap-4 select-none sm:flex-row">
            <motion.button
              className="flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-[#03915E] sm:w-[11.3125rem]"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleOpenTrailer}
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white">
                <PlayIcon />
              </div>
              <span className="text-lg font-bold text-white sm:text-xl">
                Ver Trailer
              </span>
            </motion.button>

            <motion.button
              className="flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-full border-2 border-white sm:w-[11.3125rem]"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <MarkerIcon />
              <span className="text-lg font-bold text-white sm:text-xl">
                Lista
              </span>
            </motion.button>
          </div>
        </motion.div>

        {availablePlatforms.length > 0 && (
          <div className="mt-12 flex flex-col gap-4">
            <h2 className="z-20 text-white">Disponível em:</h2>
            <div className="z-20 flex flex-wrap gap-4">
              {availablePlatforms.map((platform) => (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => window.open(platform.link, "_blank")}
                  key={platform.name}
                  className="flex items-center justify-center gap-2 rounded-xl p-2"
                  style={{ background: platform.background }}
                >
                  <img
                    src={platform.logo}
                    alt={platform.name}
                    className="h-12 w-24 object-contain"
                  />
                </motion.button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex w-full flex-col justify-center gap-4 px-[5rem]">
        {contentInfo?.cast && contentInfo?.cast.length > 0 && (
          <div className="relative mt-8 flex flex-col justify-center gap-2">
            <h2 className="z-20 mb-2 text-white">Elenco:</h2>

            {/* Botões laterais */}
            <button
              onClick={() => scroll("left")}
              className="absolute top-1/2 left-[-2rem] z-30 h-12 w-12 -translate-y-1/2 rounded-full bg-black/50 p-2 transition hover:bg-black/70"
            >
              <LeftArrow />
            </button>
            <button
              onClick={() => scroll("right")}
              className="absolute top-1/2 right-[-2rem] z-30 h-12 w-12 -translate-y-1/2 rounded-full bg-black/50 p-2 transition hover:bg-black/70"
            >
              <RightArrow />
            </button>

            {/* Lista horizontal */}
            <div
              ref={scrollRef}
              className="scrollbar-hide z-20 flex gap-4 overflow-hidden scroll-smooth px-8"
            >
              {contentInfo.cast.map((actor) => (
                <div
                  key={actor.name}
                  className="flex flex-shrink-0 flex-col items-center justify-center gap-2 rounded-xl p-2"
                >
                  <img
                    src={
                      actor.profile_path
                        ? `https://image.tmdb.org/t/p/original/${actor.profile_path}`
                        : perfilDefault
                    }
                    alt={actor.name}
                    className="h-16 w-16 rounded-full object-cover"
                  />
                  <span className="text-center text-sm text-white">
                    {actor.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {showTrailer && videoId && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleCloseTrailer}
        >
          <div
            className="relative aspect-video w-full max-w-4xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={handleCloseTrailer}
              className="absolute -top-10 right-0 z-10 text-3xl text-white"
              aria-label="Fechar player"
            >
              &times;
            </button>
            <YouTube
              videoId={videoId}
              opts={{
                height: "100%",
                width: "100%",
                playerVars: { autoplay: 1, controls: 1 },
              }}
              className="h-full w-full"
            />
          </div>
        </motion.div>
      )}
    </div>
  );
}
