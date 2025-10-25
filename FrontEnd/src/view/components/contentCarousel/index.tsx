import { useEffect, useState } from "react";
import { getMedias } from "../../../app/services/gets/getMedias";
import type { fetchMediaProps, Media } from "../../../app/interfaces/media";
import MediaContent from "../mediaContent";

const movies = [
  {
    titulo: "Ação",
    index: 0,
    id: 28,
    page: Math.floor(Math.random() * 20) + 1,
  },
];

const series = [
  {
    titulo: "Ação e Aventura",
    index: 0,
    id: 10759,
    page: Math.floor(Math.random() * 20) + 1,
  },
  {
    titulo: "Drama",
    index: 1,
    id: 18,
    page: Math.floor(Math.random() * 20) + 1,
  },
  {
    titulo: "Comédia",
    index: 2,
    id: 35,
    page: Math.floor(Math.random() * 20) + 1,
  },
  {
    titulo: "Animação",
    index: 3,
    id: 16,
    page: Math.floor(Math.random() * 20) + 1,
  },
  {
    titulo: "Animes",
    index: 4,
    id: 17,
    page: Math.floor(Math.random() * 20) + 1,
  },
  {
    titulo: "Documentário",
    index: 5,
    id: 99,
    page: Math.floor(Math.random() * 20) + 1,
  },
  {
    titulo: "Infantil",
    index: 6,
    id: 10762,
    page: Math.floor(Math.random() * 20) + 1,
  },
  {
    titulo: "Mistério",
    index: 7,
    id: 9648,
    page: Math.floor(Math.random() * 20) + 1,
  },
  {
    titulo: "Fantasia",
    index: 8,
    id: 10765,
    page: Math.floor(Math.random() * 20) + 1,
  },
  {
    titulo: "Reality Show",
    index: 9,
    id: 10764,
    page: Math.floor(Math.random() * 20) + 1,
  },
];

interface genreData {
  titulo: string;
  index: number;
  content: Media[];
}

interface ContentCarouselProps {
  type: "movie" | "tv";
  contents: genreData[];
}

export default function ContentCarousel() {
  const [contents, setContents] = useState<ContentCarouselProps[]>([]);

  useEffect(() => {
    async function fetchTvGenres() {
      movies.map(async (genre) => {
        const fetchData: fetchMediaProps = {
          page: genre.page,
          genreId: genre.id,
          mediaType: "movie",
        };

        const mediaData = await getMedias(fetchData);

        setContents((prevContents) => [
          ...prevContents,
          {
            type: "movie",
            contents: [
              {
                titulo: genre.titulo,
                index: genre.index,
                content: mediaData || [],
              },
            ],
          },
        ]);
        console.log(JSON.stringify(mediaData, null, 2));
      });
    }
    fetchTvGenres();
  }, []);

  return (
    <div className="flex w-full flex-1 flex-col items-center justify-center gap-2 p-2">
      {contents.map((contentGroup, groupIndex) => (
        <div key={groupIndex} className="w-full">
          {contentGroup.contents.map((genreData, genreIndex) => (
            <div key={genreIndex} className="mb-6">
              <h2 className="mb-2 text-xl font-bold text-white">
                {genreData.titulo}
              </h2>
              <div className="flex w-full gap-4 overflow-hidden py-4">
                {genreData.content.map((media) => (
                  <MediaContent
                    key={media.id}
                    urlImage={`https://image.tmdb.org/t/p/original/${media.backdrop_path}`}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
