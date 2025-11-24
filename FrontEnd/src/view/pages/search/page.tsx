import { useEffect, useState, useRef } from "react";
import HeaderSearch from "../../components/headerSearch";
import { searchMedia } from "../../../app/services/gets/searchMedia";
import type { Media, genreData } from "../../../app/interfaces/media";
import GenreCarousel from "../../components/genreCarousel";

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Media[]>([]);
  const [loading, setLoading] = useState(false);
  const [visibleCount, setVisibleCount] = useState(0);
  const [viewportWidth, setViewportWidth] = useState(0);
  const [isSmallScreen, setIsSmallScreen] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  const [genreFilter, setGenreFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  useEffect(() => {
    const fetchResults = async () => {
      if (!searchQuery.trim()) {
        setSearchResults([]);
        return;
      }

      setLoading(true);
      const results = await searchMedia(searchQuery);
      if (results) {
        setSearchResults(results);
      }
      setLoading(false);
    };

    const timeoutId = setTimeout(() => {
      fetchResults();
    }, 500); // Debounce

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // Responsividade (Copiado do ContentCarousel para manter consistência)
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

  const stepWidthPx = (isSmallScreen ? 214 : 224) + (isSmallScreen ? 10 : 16);

  const filteredResults = searchResults.filter((item) => {
    const matchesType =
      typeFilter === "all" ||
      (typeFilter === "movie" && item.type === "movie") ||
      (typeFilter === "tv" && item.type === "tv");

    const matchesGenre =
      genreFilter === "all" ||
      (item.genres && item.genres.includes(genreFilter));

    return matchesType && matchesGenre;
  });

  // Adapter para usar o GenreCarousel
  const searchGenreData: genreData = {
    titulo: "Resultados da Pesquisa",
    index: 0,
    content: filteredResults,
    page: 1,
    genreId: 0,
    mediaType: "multi",
  };

  return (
    <div className="flex min-h-screen w-full flex-col items-center bg-[#1f1f1f] p-12">
      <HeaderSearch
        onSearch={setSearchQuery}
        value={searchQuery}
        onFilterType={setTypeFilter}
        onFilterGenre={setGenreFilter}
      />

      <div ref={containerRef} className="mt-24 w-full max-w-[90vw] text-white">
        {loading ? (
          <div className="mt-10 flex justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-white border-t-transparent"></div>
          </div>
        ) : filteredResults.length > 0 ? (
          <GenreCarousel
            genre={searchGenreData}
            visibleCount={visibleCount}
            viewportWidth={viewportWidth}
            stepWidthPx={stepWidthPx}
          />
        ) : searchQuery.trim() ? (
          <div className="mt-10 text-center text-xl">
            Nenhum resultado encontrado.
          </div>
        ) : null}
      </div>
    </div>
  );
}

// 1f1f1f
