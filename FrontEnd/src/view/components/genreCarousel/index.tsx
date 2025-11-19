import { useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import LeftArrow from "../../assets/icons/leftArrow";
import RightArrow from "../../assets/icons/rightArrow";
import MediaContent from "../mediaContent";
import type {
  fetchMediaProps,
  genreData,
  Media,
} from "../../../app/interfaces/media";
import { getMedias } from "../../../app/services/gets/getMedias";

interface GenreCarouselProps {
  genre: genreData;
  visibleCount: number;
  viewportWidth: number;
  stepWidthPx: number;
  updateGenreContent?: (
    genreId: number,
    newContent: Media[],
    nextPage: number,
  ) => void;
}

export default function GenreCarousel({
  genre,
  visibleCount,
  viewportWidth,
  stepWidthPx,
  updateGenreContent,
}: GenreCarouselProps) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });
  const [currentIndex, setCurrentIndex] = useState(0);

  const maxIndex = Math.max(0, genre.content.length - visibleCount);
  const translationValuePx = currentIndex * stepWidthPx;

  const handleNext = async () => {
    const newIndex = currentIndex + 1;
    if (newIndex > maxIndex - 1) {
      if (updateGenreContent) {
        const nextPage = genre.page + 1;
        const fetchData: fetchMediaProps = {
          page: nextPage,
          genreId: genre.genreId,
          mediaType: genre.mediaType,
        };
        const newData = await getMedias(fetchData);
        if (newData && newData.length > 0) {
          updateGenreContent(
            genre.genreId,
            [...genre.content, ...newData],
            nextPage,
          );
        }
      }
    }
    setCurrentIndex(Math.min(newIndex, maxIndex + 1));
  };

  const handlePrev = () => setCurrentIndex((prev) => Math.max(prev - 1, 0));

  return (
    <div ref={ref} className="flex w-full flex-col gap-2 md:gap-4">
      {inView && (
        <>
          <h2 className="mb-2 ml-[7.2rem] text-xl font-bold text-white">
            {genre.titulo}
          </h2>
          <div className="flex w-full items-center justify-center gap-2 md:gap-4">
            <motion.button
              className={`flex h-10 w-10 flex-shrink-0 cursor-pointer items-center justify-center rounded-full bg-[#1B1B1BE5] md:h-12 md:w-12 ${
                currentIndex <= 0 || genre.content.length <= visibleCount
                  ? "invisible"
                  : ""
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handlePrev}
              disabled={currentIndex === 0}
            >
              <LeftArrow />
            </motion.button>

            <div
              className="overflow-hidden"
              style={{ width: `${viewportWidth}px` }}
            >
              <motion.div
                className="flex gap-4 py-2 sm:ml-2 md:gap-8"
                animate={{ x: `-${translationValuePx}px` }}
                transition={{ type: "spring", stiffness: 100, damping: 25 }}
              >
                {genre.content.map((media) => (
                  <MediaContent
                    key={media.id}
                    id={media.id}
                    urlImage={media.poster_path}
                  />
                ))}
              </motion.div>
            </div>

            <motion.button
              className={`flex h-10 w-10 flex-shrink-0 cursor-pointer items-center justify-center rounded-full bg-[#1B1B1BE5] md:h-12 md:w-12 ${
                currentIndex >= maxIndex || genre.content.length <= visibleCount
                  ? "invisible"
                  : ""
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleNext}
              disabled={currentIndex >= maxIndex}
            >
              <RightArrow />
            </motion.button>
          </div>
        </>
      )}
    </div>
  );
}
