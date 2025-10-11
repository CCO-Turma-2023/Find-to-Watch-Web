import { useEffect, useState } from "react";
import ContentType from "../../components/contentType";
import HeaderPage from "../../components/header";
import ContentInfos from "../../components/contentInfos";
import { getMedias } from "../../../app/services/gets/getMedias";
import type { fetchMediaProps, Media } from "../../../app/interfaces/media";

export default function HomeLayout() {
  const [contentInfo, setContentInfo] = useState<Media | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRandomMedia = async () => {
      setIsLoading(true);

      const type = Math.random() < 0.5 ? "movie" : "tv";

      try {
        const data: fetchMediaProps = {
          page: Math.floor(Math.random() * 10) + 1,
          genreId: 0,
          mediaType: type,
        };
        const trending = await getMedias(data);
        if (trending && trending.length > 0) {
          const randomIndex = Math.floor(Math.random() * trending.length);
          setContentInfo(trending[randomIndex]);
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
    backgroundImage: contentInfo?.backdrop_path
      ? `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${contentInfo.backdrop_path})`
      : 'none',
    backgroundColor: '#000000',
  };

  return (
    <div
      className="relative h-screen w-full bg-cover bg-center transition-all duration-1000"
      style={backgroundStyle}
    >
      <div className="relative z-10 flex h-full flex-col">
        <HeaderPage />
        <div className="flex flex-grow items-center px-6 md:px-12 lg:px-24">
          <div className="flex w-full max-w-lg flex-col gap-4 rounded-lg p-4 md:max-w-xl">
            {!isLoading && contentInfo ? (
              <>
                <ContentType type={contentInfo.type === "movie" ? "Filme" : "Série"} />
                <h2 className="text-3xl font-bold text-white md:text-4xl">
                  {contentInfo.title}
                </h2>

                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-white text-opacity-80">
                  {contentInfo.year && (
                    <ContentInfos
                      info={contentInfo.year}
                      bool={!!contentInfo.runtime || (contentInfo.genres?.length ?? 0) > 0}
                    />
                  )}

                  {contentInfo.runtime && (
                    <ContentInfos
                      info={contentInfo.runtime}
                      bool={(contentInfo.genres?.length ?? 0) > 0}
                    />
                  )}

                  {contentInfo.genres?.map((genre, index) => (
                    <ContentInfos
                      key={genre}
                      info={genre}
                      bool={index < contentInfo.genres.length - 1}
                    />
                  ))}
                </div>

                <div>
                  <p className="text-gray-200 line-clamp-4">
                    {contentInfo.overview}
                  </p>
                </div>
              </>
            ) : (
              <h2 className="text-3xl font-bold text-white md:text-4xl">
                Carregando...
              </h2>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}