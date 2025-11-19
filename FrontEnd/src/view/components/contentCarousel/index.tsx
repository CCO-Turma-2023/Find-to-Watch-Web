import { useState, useRef, useEffect } from "react";

import { getMedias } from "../../../app/services/gets/getMedias";
import type {
  fetchMediaProps,
  genreData,
  Media,
} from "../../../app/interfaces/media";
import { useInView } from "react-intersection-observer";
import { useMedia } from "../../../app/contexts/contexts";
import GenreCarousel from "../genreCarousel";

// --- Gêneros ---
const contents = [
  {
    titulo: "Filmes - Ação",
    index: 0,
    id: 28,
    page: Math.floor(Math.random() * 10) + 1,
    mediaType: "movie",
  },
  {
    titulo: "Séries - Ação e Aventura",
    index: 1,
    id: 10759,
    page: Math.floor(Math.random() * 10) + 1,
    mediaType: "tv",
  },
  {
    titulo: "Filmes - Drama",
    index: 2,
    id: 18,
    page: Math.floor(Math.random() * 10) + 1,
    mediaType: "movie",
  },
  {
    titulo: "Séries - Drama",
    index: 3,
    id: 18,
    page: Math.floor(Math.random() * 10) + 1,
    mediaType: "tv",
  },
  {
    titulo: "Filmes - Comédia",
    index: 4,
    id: 35,
    page: Math.floor(Math.random() * 10) + 1,
    mediaType: "movie",
  },
  {
    titulo: "Séries - Comédia",
    index: 5,
    id: 35,
    page: Math.floor(Math.random() * 10) + 1,
    mediaType: "tv",
  },
  {
    titulo: "Filmes - Animação",
    index: 6,
    id: 16,
    page: 1,
    mediaType: "movie",
  },
  {
    titulo: "Séries - Animação",
    index: 7,
    id: 16,
    page: 1,
    mediaType: "tv",
  },
  {
    titulo: "Filmes - Animes",
    index: 8,
    id: 17,
    page: Math.floor(Math.random() * 10) + 1,
    mediaType: "movie",
  },
  {
    titulo: "Séries - Animes",
    index: 9,
    id: 17,
    page: Math.floor(Math.random() * 10) + 1,
    mediaType: "tv",
  },
  {
    titulo: "Filmes - Documentário",
    index: 10,
    id: 99,
    page: 1,
    mediaType: "movie",
  },
  {
    titulo: "Séries - Documentário",
    index: 11,
    id: 99,
    page: 1,
    mediaType: "tv",
  },
  {
    titulo: "Séries - Infantil",
    index: 12,
    id: 10762,
    page: 1,
    mediaType: "tv",
  },
  {
    titulo: "Filmes - Terror",
    index: 13,
    id: 27,
    page: Math.floor(Math.random() * 10) + 1,
    mediaType: "movie",
  },
  {
    titulo: "Séries - Mistério",
    index: 14,
    id: 9648,
    page: Math.floor(Math.random() * 10) + 1,
    mediaType: "tv",
  },
  {
    titulo: "Filmes - Romance",
    index: 15,
    id: 10749,
    page: Math.floor(Math.random() * 10) + 1,
    mediaType: "movie",
  },
  {
    titulo: "Séries - Fantasia",
    index: 16,
    id: 10765,
    page: Math.floor(Math.random() * 10) + 1,
    mediaType: "tv",
  },
  {
    titulo: "Filmes - Sci-Fi",
    index: 17,
    id: 878,
    page: Math.floor(Math.random() * 10) + 1,
    mediaType: "movie",
  },
  {
    titulo: "Séries - Reality Show",
    index: 18,
    id: 10764,
    page: Math.floor(Math.random() * 2) + 1,
    mediaType: "tv",
  },
  {
    titulo: "Filmes - Musical",
    index: 19,
    id: 10402,
    page: Math.floor(Math.random() * 10) + 1,
    mediaType: "movie",
  },
  {
    titulo: "Filmes - História",
    index: 20,
    id: 36,
    page: 1,
    mediaType: "movie",
  },
  {
    titulo: "Filmes - Suspense",
    index: 21,
    id: 53,
    page: Math.floor(Math.random() * 10) + 1,
    mediaType: "movie",
  },
];

export default function ContentCarousel({ type }: { type: number }) {
  const { genres, setGenres } = useMedia();

  const [fetchedCount, setFetchedCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const [visibleCount, setVisibleCount] = useState(0);
  const [viewportWidth, setViewportWidth] = useState(0);
  const [isSmallScreen, setIsSmallScreen] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  const { ref: loadMoreRef, inView } = useInView({ threshold: 0.1 });

  // 🔥 Filtra os conteúdos conforme o "type"
  const filteredContents = contents.filter((item) => {
    if (type === 0) return true; // Todos
    if (type === 1) return item.mediaType === "movie";
    if (type === 2) return item.mediaType === "tv";
    return false;
  });

  async function fetchGenres(
    genresToFetch: typeof contents,
  ): Promise<genreData[]> {
    const promises = genresToFetch.map(async (genre) => {
      try {
        const fetchData: fetchMediaProps = {
          page: genre.page,
          genreId: genre.id,
          mediaType: genre.mediaType,
        };
        const mediaData = await getMedias(fetchData);

        if (mediaData && mediaData.length > 0) {
          return {
            titulo: genre.titulo,
            index: genre.index,
            content: mediaData,
            page: genre.page,
            genreId: genre.id,
            mediaType: genre.mediaType,
          };
        }
      } catch (err) {
        console.warn(`Erro ao buscar ${genre.titulo}:`, err);
      }
      return null;
    });

    const results = await Promise.all(promises);
    return results.filter((data): data is genreData => data !== null);
  }

  // 🔹 Busca inicial
  useEffect(() => {
    if (fetchedCount > 0) return;

    async function fetchInitialData() {
      setLoading(true);
      const initialGenresToFetch = filteredContents.slice(0, 3);
      const initialData = await fetchGenres(initialGenresToFetch);

      setGenres(initialData);
      setFetchedCount(3);
      setLoading(false);
    }

    fetchInitialData();
  }, [fetchedCount, type]); // 👈 reexecuta se mudar o "type"

  // Responsividade
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new ResizeObserver(() => {
      const isCurrentlySmall = window.innerWidth < 768;
      setIsSmallScreen(isCurrentlySmall);

      const buttonWidthPx = isCurrentlySmall ? 40 : 48;
      const containerGapPx = isCurrentlySmall ? 8 : 16;
      const cardWidthPx = isCurrentlySmall ? 214 : 224;
      const cardGapPx = isCurrentlySmall ? 10 : 16;

      const totalAvailableWidth = container.offsetWidth;
      const spaceForCards =
        totalAvailableWidth - buttonWidthPx * 2 - containerGapPx * 2;
      const totalItemWidthPx = cardWidthPx + cardGapPx;

      const newVisibleCount = Math.floor(
        (spaceForCards + cardGapPx) / totalItemWidthPx,
      );
      setVisibleCount(Math.max(1, newVisibleCount));

      const newViewportWidth =
        Math.max(1, newVisibleCount) * cardWidthPx +
        Math.max(0, newVisibleCount - 1) * cardGapPx;
      setViewportWidth(newViewportWidth);
    });

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  // 🔹 Lazy load (carregar mais gêneros)
  useEffect(() => {
    if (inView && !loading && fetchedCount < filteredContents.length) {
      async function fetchMoreGenres() {
        setLoading(true);

        const nextIndex = fetchedCount;
        const newCount = Math.min(nextIndex + 2, filteredContents.length);

        const genresToFetch = filteredContents.slice(nextIndex, newCount);

        if (genresToFetch.length > 0) {
          const newData = await fetchGenres(genresToFetch);
          setGenres([...genres, ...newData]);
          setFetchedCount(newCount);
        }

        setLoading(false);
      }

      fetchMoreGenres();
    }
  }, [inView, loading, fetchedCount, type]); // 👈 depende também de "type"

  const stepWidthPx = (isSmallScreen ? 214 : 224) + (isSmallScreen ? 10 : 16);

  const updateGenreContent = (
    genreId: number,
    newContent: Media[],
    nextPage: number,
  ) => {
    setGenres(
      genres.map((g) =>
        g.genreId === genreId
          ? { ...g, content: newContent, page: nextPage }
          : g,
      ),
    );
  };

  return (
    <div
      ref={containerRef}
      className="relative flex min-h-[200px] w-full flex-col justify-center gap-12"
    >
      {/* Mostrar carregando centralizado se ainda não houver gêneros */}
      {loading && genres.length === 0 ? (
        <div className="absolute inset-0 top-1/2 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4 text-white">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-white border-t-transparent"></div>
            <span className="text-lg font-semibold">Carregando...</span>
          </div>
        </div>
      ) : (
        <>
          {genres.map((genre) => (
            <GenreCarousel
              key={genre.index}
              genre={genre}
              visibleCount={visibleCount}
              viewportWidth={viewportWidth}
              stepWidthPx={stepWidthPx}
              updateGenreContent={updateGenreContent}
            />
          ))}

          {!loading && fetchedCount < filteredContents.length && (
            <div ref={loadMoreRef} className="h-1" />
          )}
        </>
      )}
    </div>
  );
}
