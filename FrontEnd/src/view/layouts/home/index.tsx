import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import HeaderPage from "../../components/header";
import ContentType from "../../components/contentType";
import ContentInfos from "../../components/contentInfos";
import LeftArrow from "../../assets/icons/leftArrow";
import RightArrow from "../../assets/icons/rightArrow";
import { getMedias } from "../../../app/services/gets/getMedias";
import type { fetchMediaProps, Media } from "../../../app/interfaces/media";
import ContentPlatform from "../../components/contentPlatform";
import PlayIcon from "../../assets/icons/playIcon";
import MarkerIcon from "../../assets/icons/marker";

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

  const handleNext = () => {
    setDirection("right");
    setIndexSelected((prev) =>
      prev === contentInfo.length - 1 ? prev : prev + 1,
    );
  };

  const handlePrev = () => {
    setDirection("left");
    setIndexSelected((prev) => (prev === 0 ? 0 : prev - 1));
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

  const backgroundStyle = {
    backgroundImage:
      contentInfo.length > 0 && contentInfo[indexSelected]?.backdrop_path
        ? `url(${contentInfo[indexSelected].backdrop_path})`
        : "none",
    backgroundSize: "cover",
    backgroundPosition: "center",
  };

  return (
    <div className="relative h-screen w-full overflow-hidden bg-black">
      <div className="relative z-30">
        {" "}
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

        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
      </div>

      <div className="relative z-20 flex h-full flex-col justify-center">
        <div className="flex h-full w-full items-center justify-between px-6">
          <motion.button
            className={`flex h-12 w-12 flex-shrink-0 cursor-pointer items-center justify-center rounded-full bg-[#1B1B1BE5] ${indexSelected <= 0 ? "hidden" : ""}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handlePrev}
          >
            <LeftArrow />
          </motion.button>

          <div className="flex w-full flex-grow flex-col items-start justify-center gap-2 overflow-hidden px-6 md:px-12 lg:px-26">
            <div className="relative flex max-h-[400px] min-h-[320px] w-full max-w-lg flex-col gap-4 p-4 md:max-w-xl">
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
                    <h2 className="mt-3 text-3xl font-bold text-white md:text-4xl">
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
                    <p className="mt-4 line-clamp-6 text-gray-200">
                      {contentInfo[indexSelected].overview}
                    </p>
                    <div className="select-non mt-4 flex items-center justify-start gap-4">
                      <motion.button
                        className="flex h-[3.125rem] w-[11.3125rem] cursor-pointer items-center justify-center gap-2 rounded-full bg-[#03915E]"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white">
                          <PlayIcon />
                        </div>
                        <span className="text-xl font-bold text-white">
                          Ver Trailer
                        </span>
                      </motion.button>

                      <motion.button
                        className="flex h-[3.125rem] w-[11.3125rem] cursor-pointer items-center justify-center gap-2 rounded-full border-2 border-white"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <MarkerIcon />
                        <span className="text-xl font-bold text-white">
                          Lista
                        </span>
                      </motion.button>
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
            <div className="mt-8 flex w-full items-center justify-center text-white">
              <ContentPlatform />
            </div>
          </div>

          <motion.button
            className={`flex h-12 w-12 flex-shrink-0 cursor-pointer items-center justify-center rounded-full bg-[#1B1B1BE5] ${indexSelected === contentInfo.length - 1 ? "hidden" : ""}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleNext}
          >
            <RightArrow />
          </motion.button>
        </div>
      </div>
    </div>
  );
}
