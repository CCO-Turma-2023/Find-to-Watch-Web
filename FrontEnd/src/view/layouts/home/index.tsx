import { useEffect, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import HeaderPage from "../../components/header";
import ContentType from "../../components/contentType";
import ContentInfos from "../../components/contentInfos";

import { getMedias } from "../../../app/services/gets/getMedias";
import type { fetchMediaProps, Media } from "../../../app/interfaces/media";
import ContentPlatform from "../../components/contentPlatform";
import PlayIcon from "../../assets/icons/playIcon";
import MarkerIcon from "../../assets/icons/marker";
import ContentCarousel from "../../components/contentCarousel";
import TrailerModal from "../../components/trailerModal";
import ActionButton from "../../components/actionButton";
import NavigationButton from "../../components/navigationButton";

const backgroundVariants = {
  enter: { opacity: 0 },
  center: { opacity: 1 },
  exit: { opacity: 0 },
};

const contentVariants = {
  enter: (direction: "left" | "right") => ({
    x: direction === "right" ? 100 : -100,
    opacity: 0,
    position: "absolute",
  }),
  center: {
    x: 0,
    opacity: 1,
    position: "relative",
  },
  exit: (direction: "left" | "right") => ({
    x: direction === "right" ? -100 : 100,
    opacity: 0,
    position: "absolute",
  }),
};

export default function HomeLayout() {
  const [contentInfo, setContentInfo] = useState<Media[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [indexSelected, setIndexSelected] = useState(0);
  const [direction, setDirection] = useState<"left" | "right">("right");
  const [showTrailer, setShowTrailer] = useState(false);

  const handleNext = useCallback(() => {
    setDirection("right");
    setIndexSelected((prev) =>
      prev === contentInfo.length - 1 ? 0 : prev + 1,
    );
  }, [contentInfo.length]);

  const handlePrev = useCallback(() => {
    setDirection("left");
    setIndexSelected((prev) =>
      prev === 0 ? contentInfo.length - 1 : prev - 1,
    );
  }, [contentInfo.length]);

  const handleOpenTrailer = () => {
    if (contentInfo[indexSelected]?.trailer) {
      setShowTrailer(true);
    }
  };

  const handleCloseTrailer = () => {
    setShowTrailer(false);
  };

  useEffect(() => {
    const fetchRandomMedia = async () => {
      setIsLoading(true);
      try {
        const dataMovie: fetchMediaProps = {
          page: Math.floor(Math.random() * 15) + 1,
          genreId: 0,
          mediaType: "movie",
        };
        const dataTv: fetchMediaProps = {
          page: Math.floor(Math.random() * 15) + 1,
          genreId: 0,
          mediaType: "tv",
        };

        const trending1 = await getMedias(dataMovie);
        const trending2 = await getMedias(dataTv);

        if (trending1?.length && trending2?.length) {
          const length = Math.min(trending1.length, trending2.length);
          const mixed: Media[] = [];

          for (let i = 0; i < length; i++) {
            mixed.push(i % 2 === 0 ? trending1[i] : trending2[i]);
          }

          setContentInfo(mixed);
        }
      } catch (error) {
        console.error("Erro ao buscar mídias:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRandomMedia();
  }, []);

  useEffect(() => {
    if (contentInfo.length === 0 || isLoading || showTrailer) {
      return;
    }

    const timer = setInterval(() => {
      handleNext();
    }, 10000);

    return () => clearInterval(timer);
  }, [contentInfo.length, isLoading, indexSelected, handleNext, showTrailer]);

  const backgroundStyle = {
    backgroundImage:
      contentInfo.length > 0 && contentInfo[indexSelected]?.backdrop_path
        ? `url(${contentInfo[indexSelected].backdrop_path})`
        : "none",
    backgroundSize: "cover",
    backgroundPosition: "center",
  };

  const videoId = contentInfo[indexSelected]?.trailer;

  return (
    <div className="relative min-h-screen w-full overflow-auto bg-[#1f1f1f] p-4">
      <div className="absolute top-0 right-0 left-0 z-30">
        <HeaderPage />
      </div>

      <div className="absolute inset-0 z-0">
        <AnimatePresence>
          <motion.div
            key={contentInfo[indexSelected]?.id || indexSelected}
            className="absolute inset-0"
            style={backgroundStyle}
            variants={backgroundVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ opacity: { duration: 0.8, ease: "easeInOut" } }}
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-[#1f1f1f]/50" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1f1f1f] via-[#1f1f1f]/30 to-transparent" />
      </div>

      <div className="relative z-20 flex min-h-screen flex-col justify-end pb-8 md:justify-center">
        <div className="flex w-full items-center justify-between px-6">
          <NavigationButton direction="left" onClick={handlePrev} />

          <div className="flex w-full flex-grow flex-col items-start justify-center overflow-hidden px-4 sm:px-6 md:px-12">
            <div className="relative flex min-h-[380px] w-full max-w-xs flex-col justify-end sm:max-w-md md:max-w-xl lg:max-w-2xl">
              <AnimatePresence mode="wait" custom={direction}>
                {!isLoading &&
                contentInfo.length > 0 &&
                contentInfo[indexSelected] ? (
                  <motion.div
                    key={contentInfo[indexSelected].id ?? indexSelected}
                    custom={direction}
                    variants={contentVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                      x: { type: "spring", stiffness: 300, damping: 30 },
                      opacity: { duration: 0.2 },
                    }}
                    className="w-full"
                  >
                    <ContentType
                      type={
                        contentInfo[indexSelected].type === "movie"
                          ? "Filme"
                          : "Série"
                      }
                    />
                    <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl md:text-5xl">
                      {contentInfo[indexSelected].title}
                    </h2>
                    <div className="text-opacity-80 mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-white">
                      {contentInfo[indexSelected].year && (
                        <ContentInfos
                          info={contentInfo[indexSelected].year}
                          bool={
                            !!contentInfo[indexSelected].runtime ||
                            (contentInfo[indexSelected].genres?.length ?? 0) > 0
                          }
                        />
                      )}
                      {contentInfo[indexSelected].runtime && (
                        <ContentInfos
                          info={contentInfo[indexSelected].runtime}
                          bool={
                            (contentInfo[indexSelected].genres?.length ?? 0) > 0
                          }
                        />
                      )}
                      {contentInfo[indexSelected].genres?.map(
                        (genre, index) => (
                          <ContentInfos
                            key={genre}
                            info={genre}
                            bool={
                              index <
                              contentInfo[indexSelected].genres.length - 1
                            }
                          />
                        ),
                      )}
                    </div>
                    <p className="mt-4 line-clamp-3 text-gray-200 sm:line-clamp-4 md:line-clamp-5">
                      {contentInfo[indexSelected].overview}
                    </p>
                    <div className="select-non mt-4 flex flex-col items-start justify-start gap-4 sm:flex-row">
                      <ActionButton
                        icon={<PlayIcon />}
                        label="Ver Trailer"
                        onClick={handleOpenTrailer}
                        variant="primary"
                      />
                      <ActionButton
                        icon={<MarkerIcon />}
                        label="Lista"
                        variant="secondary"
                      />
                    </div>
                  </motion.div>
                ) : (
                  <div className="flex h-full items-center">
                    <h2 className="text-3xl font-bold text-white md:text-4xl">
                      Carregando...
                    </h2>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <NavigationButton direction="right" onClick={handleNext} />
        </div>

        <div className="mt-8 flex w-full items-center justify-center px-6">
          <ContentPlatform />
        </div>
      </div>
      <AnimatePresence>
        {showTrailer && videoId && (
          <TrailerModal videoId={videoId} onClose={handleCloseTrailer} />
        )}
      </AnimatePresence>

      <ContentCarousel type={0} />
    </div>
  );
}
