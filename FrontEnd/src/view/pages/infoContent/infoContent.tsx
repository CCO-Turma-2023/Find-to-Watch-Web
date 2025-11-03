import { useNavigate, useParams } from "react-router-dom";
import { useMedia } from "../../../app/contexts/contexts";
import { useEffect, useState } from "react";
import type { Media } from "../../../app/interfaces/media";
import ContentType from "../../components/contentType";
import { motion } from "framer-motion";
import ContentInfos from "../../components/contentInfos";
import PlayIcon from "../../assets/icons/playIcon";
import MarkerIcon from "../../assets/icons/marker";
import YouTube from "react-youtube";
import LeftArrow from "../../assets/icons/leftArrow";

export default function InfoContent() {
  const { id } = useParams<{ id: string }>();
  const [showTrailer, setShowTrailer] = useState(false);
  const [contentInfo, setContentInfo] = useState<Media>();
  const { genres } = useMedia();
  const [videoId, setVideoId] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleOpenTrailer = () => {
    if (contentInfo?.trailer) {
      setShowTrailer(true);
    }
  };

  const handleCloseTrailer = () => {
    setShowTrailer(false);
  };

  useEffect(() => {
    genres.forEach((g) => {
      g.content.forEach((item) => {
        if (item.id.toString() === id) {
          console.log("Item encontrado:", item);
          setContentInfo(item);
          setVideoId(item.trailer || null);
        }
      });
    });
    console.log("Conteúdo atual:", JSON.stringify(contentInfo));
  }, []);

  return (
    <div className="h-screen w-full">
      <div className="absolute h-full w-full">
        <img
          className="h-full w-full object-cover"
          src={contentInfo?.backdrop_path}
          alt=""
        />
        <div className="absolute inset-0 h-full w-full bg-black/50" />
        <div className="absolute inset-0 h-full w-full bg-gradient-to-t from-black via-black/30 to-transparent" />
      </div>

      <div className="flex h-full w-full flex-col justify-center px-[5rem]">
        <motion.button
          className={`absolute top-4 left-4 z-30 flex h-10 w-10 flex-shrink-0 cursor-pointer items-center justify-center rounded-full bg-[#1B1B1BE5] md:h-12 md:w-12`}
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
          className="z-20 flex min-h-[380px] max-w-xs flex-col justify-center sm:max-w-md md:max-w-xl lg:max-w-2xl"
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
          <div className="select-non mt-4 flex flex-col items-start justify-start gap-4 sm:flex-row">
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

        <h2 className="z-20 text-white">Disponível em</h2>

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
                  playerVars: {
                    autoplay: 1,
                    controls: 1,
                  },
                }}
                className="h-full w-full"
              />
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
