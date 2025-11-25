import { useEffect, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import HeaderPage from "../../components/header";
import ContentType from "../../components/contentType";
import ContentInfos from "../../components/contentInfos";
import { getMedias } from "../../../app/services/gets/getMedias";
import type { fetchMediaProps, Media } from "../../../app/interfaces/media";
import PlayIcon from "../../assets/icons/playIcon";
import MarkerIcon from "../../assets/icons/marker";
import ContentCarousel from "../../components/contentCarousel";
import TrailerModal from "../../components/trailerModal";
import ActionButton from "../../components/actionButton";
import NavigationButton from "../../components/navigationButton";
import ListModal from "../../components/listModal";
import { isTokenValid } from "../../../app/services/api.service";
import { useToast } from "../../../app/contexts/contexts";
import MediaContent from "../../components/mediaContent";

// Importações das Logos
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

const platformFilters = [
  { name: "Netflix", logo: netflix, color: "#E50914" },
  { name: "Amazon Prime Video", logo: prime, color: "#00A8E1" },
  { name: "Disney Plus", logo: disney, color: "#113CCF" },
  { name: "Max", logo: max, color: "#002BE7" },
  { name: "Apple TV Plus", logo: apple, color: "#A6A6A6" },
  { name: "Paramount Plus", logo: paramount, color: "#0064FF" },
  { name: "Claro video", logo: claro, color: "#EF3829" },
  { name: "Claro TV+", logo: claroplus, color: "#EF3829" },
  { name: "Globoplay", logo: globoplay, color: "#FB7C13" },
  { name: "Crunchyroll", logo: crunchyroll, color: "#F47521" },
];

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? "100%" : "-100%",
    opacity: 0,
    scale: 0.9, // Começa um pouco menor
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
    scale: 1,
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? "100%" : "-100%",
    opacity: 0,
    scale: 0.9, // Sai diminuindo
  }),
};

export default function HomeLayout() {
  const [allMedia, setAllMedia] = useState<Media[]>([]);
  const [filteredMedia, setFilteredMedia] = useState<Media[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingLoadingMore] = useState(false); // Estado para loading do botão
  const [[page, direction], setPage] = useState([0, 0]);
  const [showTrailer, setShowTrailer] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);
  
  const { showToast } = useToast();

  const indexSelected = filteredMedia.length > 0 ? Math.abs(page % filteredMedia.length) : 0;
  const currentItem = filteredMedia[indexSelected];

  const paginate = useCallback(
    (newDirection: number) => {
      setPage([page + newDirection, newDirection]);
    },
    [page]
  );

  // Normalização
  const normalize = (str: any) => {
    if (typeof str !== 'string') return "";
    return str.toLowerCase().replace(/\+/g, "plus").replace(/\s+/g, "").trim();
  };

  // Lógica de Filtro
  const applyFilter = (mediaList: Media[], provider: string | null) => {
    if (!provider) return mediaList;
    const normalizedFilter = normalize(provider);
    
    return mediaList.filter((media) => {
      if (!media.providers || !Array.isArray(media.providers)) return false;
      return media.providers.some((p: any) => {
        const pName = typeof p === 'string' ? p : (p?.name || p?.provider_name || "");
        const normalizedP = normalize(pName);
        return normalizedP.includes(normalizedFilter) || normalizedFilter.includes(normalizedP);
      });
    });
  };

  const handleFilter = (providerName: string) => {
    if (selectedProvider === providerName) {
      setSelectedProvider(null);
      setFilteredMedia(allMedia);
    } else {
      setSelectedProvider(providerName);
      setFilteredMedia(applyFilter(allMedia, providerName));
    }
    setPage([0, 0]); 
  };

  // --- NOVO: Função para carregar mais itens quando filtrado ---
  const handleLoadMoreFiltered = async () => {
    if (!selectedProvider) return;
    setIsLoadingLoadingMore(true);
    
    try {
      // Busca páginas aleatórias novas
      const randomPage = Math.floor(Math.random() * 20) + 5; 
      const dataMovie: fetchMediaProps = { page: randomPage, genreId: 0, mediaType: "movie" };
      const dataTv: fetchMediaProps = { page: randomPage, genreId: 0, mediaType: "tv" };

      const [newMovies, newSeries] = await Promise.all([
        getMedias(dataMovie),
        getMedias(dataTv),
      ]);

      const newMixed: Media[] = [];
      // Adiciona os novos itens
      if (newMovies) newMixed.push(...newMovies);
      if (newSeries) newMixed.push(...newSeries);

      // Combina com os antigos
      const updatedAllMedia = [...allMedia, ...newMixed];
      
      // Remove duplicatas por ID
      const uniqueMedia = Array.from(new Map(updatedAllMedia.map(item => [item.id, item])).values());

      setAllMedia(uniqueMedia);
      // Reaplica o filtro na lista atualizada
      setFilteredMedia(applyFilter(uniqueMedia, selectedProvider));

    } catch (error) {
      console.error("Erro ao carregar mais itens:", error);
    } finally {
      setIsLoadingLoadingMore(false);
    }
  };

  const handleOpenTrailer = () => {
    if (currentItem?.trailer) setShowTrailer(true);
  };

  const handleListClick = () => {
    if (!isTokenValid()) {
      showToast({
        severity: "error",
        summary: "Acesso negado",
        detail: "Faça login para salvar na lista.",
      });
      return;
    }
    setShowModal(true);
  };

  useEffect(() => {
    const fetchRandomMedia = async () => {
      setIsLoading(true);
      try {
        const dataMovie: fetchMediaProps = { page: Math.floor(Math.random() * 5) + 1, genreId: 0, mediaType: "movie" };
        const dataTv: fetchMediaProps = { page: Math.floor(Math.random() * 5) + 1, genreId: 0, mediaType: "tv" };

        const [trending1, trending2] = await Promise.all([
          getMedias(dataMovie),
          getMedias(dataTv),
        ]);

        if (trending1?.length && trending2?.length) {
          const mixed: Media[] = [];
          const limit = 20; 
          for (let i = 0; i < limit; i++) {
            if (trending1[i]) mixed.push(trending1[i]);
            if (trending2[i]) mixed.push(trending2[i]);
          }
          setAllMedia(mixed);
          setFilteredMedia(mixed);
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
    if (filteredMedia.length === 0 || isLoading || showTrailer || showModal) return;
    const timer = setInterval(() => {
      paginate(1);
    }, 8000);
    return () => clearInterval(timer);
  }, [filteredMedia.length, isLoading, paginate, showTrailer, showModal]);

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-[#0a0a0a] text-white font-sans">
      
      {showModal && currentItem && (
        <ListModal
          filmName={currentItem.title}
          mediaId={currentItem.id}
          onClose={() => setShowModal(false)}
        />
      )}

      <div className="fixed top-0 right-0 left-0 z-50 bg-gradient-to-b from-black/90 to-transparent pb-8 pt-4 px-4 transition-all duration-300">
        <HeaderPage />
      </div>

      {/* --- HERO SECTION --- */}
      <div className="relative h-[95vh] w-full">
        
        <AnimatePresence initial={false} mode="wait">
          {filteredMedia.length > 0 && currentItem ? (
            <motion.div
              // CORREÇÃO DO BUG DE ANIMAÇÃO: Usar currentItem.id como key
              // garante que o React saiba exatamente qual elemento está saindo
              key={currentItem.id} 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="absolute inset-0 z-0"
            >
              <div className="absolute inset-0 bg-black/30 z-10" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/50 to-transparent z-10" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a]/90 via-[#0a0a0a]/20 to-transparent z-10" />
              
              <img
                src={currentItem.backdrop_path}
                alt="Background"
                className="h-full w-full object-cover object-top"
              />
            </motion.div>
          ) : (
            <div className="absolute inset-0 bg-[#0a0a0a] z-0" />
          )}
        </AnimatePresence>

        <div className="relative z-20 flex h-full flex-col justify-center px-4 sm:px-12 lg:px-20 pt-20">
          
          <div className="flex w-full items-center justify-between">
            <div className="hidden md:block">
              {filteredMedia.length > 1 && (
                 <NavigationButton direction="left" onClick={() => paginate(-1)} />
              )}
            </div>

            <div className="mx-4 flex w-full max-w-4xl flex-col items-start overflow-hidden min-h-[450px] justify-center">
              <AnimatePresence mode="popLayout" custom={direction}>
                {!isLoading && currentItem ? (
                  <motion.div
                    // CORREÇÃO CRÍTICA: Usar 'page' como key garante que cliques rápidos
                    // sejam tratados como novos eventos de animação distintos
                    key={page} 
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                      x: { type: "spring", stiffness: 300, damping: 30 },
                      opacity: { duration: 0.3 },
                    }}
                    className="flex w-full flex-col items-start"
                  >
                    <div className="mb-4">
                       <ContentType type={currentItem.type === "movie" ? "Filme" : "Série"} />
                    </div>

                    <h1 className="max-w-3xl text-4xl font-extrabold leading-tight tracking-tight text-white drop-shadow-2xl sm:text-5xl md:text-6xl lg:text-7xl">
                      {currentItem.title}
                    </h1>

                    <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm font-medium text-gray-200 sm:text-base">
                      {currentItem.year && (
                        <span className="text-green-400 font-bold tracking-wider shadow-black drop-shadow-md">{currentItem.year}</span>
                      )}
                      {currentItem.runtime && (
                        <>
                           <span className="hidden h-1.5 w-1.5 rounded-full bg-gray-400 sm:block" />
                           <ContentInfos info={currentItem.runtime} bool={false} />
                        </>
                      )}
                    </div>

                    <p className="mt-6 line-clamp-3 max-w-2xl text-base text-gray-300 drop-shadow-lg sm:text-lg md:line-clamp-4 leading-relaxed">
                      {currentItem.overview}
                    </p>

                    <div className="mt-8 flex flex-wrap gap-4">
                      <ActionButton
                        icon={<PlayIcon />}
                        label="Ver Trailer"
                        onClick={handleOpenTrailer}
                        variant="primary"
                      />
                      <ActionButton
                        icon={<MarkerIcon />}
                        label="Minha Lista"
                        onClick={handleListClick}
                        variant="secondary"
                      />
                    </div>
                  </motion.div>
                ) : (
                  <div className="flex w-full flex-col items-center justify-center gap-4 text-center">
                     {isLoading ? (
                        <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
                     ) : (
                        <div className="py-12">
                            <h3 className="text-2xl font-bold text-white">Nenhum título encontrado</h3>
                        </div>
                     )}
                  </div>
                )}
              </AnimatePresence>
            </div>

            <div className="hidden md:block">
              {filteredMedia.length > 1 && (
                 <NavigationButton direction="right" onClick={() => paginate(1)} />
              )}
            </div>
          </div>
          
          {filteredMedia.length > 0 && (
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-30 max-w-[90vw] overflow-hidden px-4">
              {filteredMedia.map((_, idx) => (
                  <button 
                    key={idx}
                    onClick={() => {
                      const diff = idx - indexSelected;
                      paginate(diff);
                    }}
                    className={`h-1.5 rounded-full transition-all duration-500 shadow-lg ${
                        idx === indexSelected 
                        ? "w-8 bg-blue-500 shadow-blue-500/50" 
                        : "w-2 bg-white/30 hover:bg-white/60"
                    }`}
                  />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* --- SEÇÃO INFERIOR --- */}
      <div className="relative z-20 -mt-16 bg-gradient-to-b from-transparent to-[#0a0a0a] pt-10 pb-10">
        <div className="px-4 sm:px-8 md:px-12">
           
           {/* Filtros */}
           <div className="mb-16 flex flex-col items-center gap-6">
              <div className="flex items-center gap-2 opacity-70">
                <div className="h-[1px] w-12 bg-gray-500"></div>
                <p className="text-xs uppercase tracking-[0.2em] text-gray-300 font-bold">
                   Escolha seu Streaming
                </p>
                <div className="h-[1px] w-12 bg-gray-500"></div>
              </div>
              
              <div className="flex flex-wrap justify-center gap-4 md:gap-5">
                 {platformFilters.map((p) => {
                    const isSelected = selectedProvider === p.name;
                    return (
                       <motion.button
                          key={p.name}
                          onClick={() => handleFilter(p.name)}
                          whileHover={{ scale: 1.1, y: -4 }}
                          whileTap={{ scale: 0.95 }}
                          className={`relative h-12 w-12 md:h-16 md:w-16 rounded-2xl p-2.5 transition-all duration-300 shadow-lg backdrop-blur-sm
                             ${isSelected 
                                ? "bg-white ring-4 ring-offset-4 ring-offset-[#0a0a0a]" 
                                : "bg-[#1a1a1a]/80 border border-white/5 hover:bg-[#2a2a2a] hover:border-white/20 grayscale hover:grayscale-0"
                             }
                          `}
                          style={{ "--ring-color": p.color } as React.CSSProperties} 
                       >
                          {isSelected && (
                             <motion.div 
                                layoutId="active-ring"
                                className="absolute inset-0 rounded-2xl ring-2 pointer-events-none" 
                                style={{ borderColor: p.color }} 
                             />
                          )}
                          <img src={p.logo} alt={p.name} className="h-full w-full object-contain drop-shadow-sm" />
                       </motion.button>
                    )
                 })}
              </div>
           </div>

           <div className="flex flex-col gap-8">
              <div className="flex items-center gap-4 pl-2 border-l-4 border-blue-500">
                 <h3 className="text-2xl md:text-3xl font-bold text-white">
                    {selectedProvider ? `Destaques no ${selectedProvider}` : "Populares Hoje"}
                 </h3>
              </div>
              
              <div className="relative min-h-[200px]">
                 {selectedProvider ? (
                    <div className="flex flex-col gap-8">
                        {filteredMedia.length > 0 ? (
                            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                                {filteredMedia.map((media) => (
                                    <div key={media.id} className="flex justify-center hover:scale-105 transition-transform duration-300">
                                        <MediaContent
                                            id={media.id}
                                            urlImage={media.poster_path}
                                            type={media.type || "movie"}
                                        />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-400 text-center py-10">Nenhum título encontrado para este filtro.</p>
                        )}

                        {/* BOTÃO CARREGAR MAIS (Aparece apenas no filtro) */}
                        <div className="flex justify-center pt-4">
                           <button 
                             onClick={handleLoadMoreFiltered}
                             disabled={isLoadingMore}
                             className="px-6 py-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-all disabled:opacity-50 flex items-center gap-2"
                           >
                             {isLoadingMore ? (
                               <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                             ) : null}
                             {isLoadingMore ? "Buscando..." : "Carregar mais títulos"}
                           </button>
                        </div>
                    </div>
                 ) : (
                    <ContentCarousel type={0} />
                 )}
              </div>
           </div>
        </div>
      </div>

      <AnimatePresence>
        {showTrailer && currentItem?.trailer && (
          <TrailerModal videoId={currentItem.trailer} onClose={() => setShowTrailer(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}