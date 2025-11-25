import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getListById } from "../../../app/services/gets/getListById";
import { getMediaByListId } from "../../../app/services/gets/getMediaByListId";
import { getMediaDetails } from "../../../app/services/gets/getMediaDetails";
import { getUserById, type UserPublicProfile } from "../../../app/services/gets/getUserById"; // Import novo
import HeaderPage from "../../components/header";
import MediaContent from "../../components/mediaContent";
import type { Lista } from "../../../app/interfaces/list";
import type { Media } from "../../../app/interfaces/media";
import { User, Calendar, Film, Tv } from "lucide-react"; // Ícones para embelezar

export default function ListDetails() {
  const { id } = useParams<{ id: string }>();
  
  const [lista, setLista] = useState<Lista | null>(null);
  const [owner, setOwner] = useState<UserPublicProfile | null>(null); // Estado do dono
  const [movies, setMovies] = useState<Media[]>([]); // Estado separado
  const [series, setSeries] = useState<Media[]>([]); // Estado separado
  
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      try {
        // 1. Busca dados iniciais da lista e os IDs das mídias
        const [listData, mediaData] = await Promise.all([
          getListById(id),
          getMediaByListId(id),
        ]);

        setLista(listData);

        // 2. Com o ID do usuário da lista, buscamos os dados do dono
        if (listData.user_id) {
           try {
             const userData = await getUserById(listData.user_id);
             setOwner(userData);
           } catch (err) {
             console.error("Erro ao buscar dono da lista", err);
             // Não bloqueamos a tela se falhar o usuário, apenas não mostra
           }
        }

        // 3. Busca detalhes de cada mídia
        const detailedMedias = await Promise.all(
          mediaData.map(async (item: { media_id: string }) => { 
            const mediaId = item.media_id;
            // Tenta buscar como filme
            let details = await getMediaDetails(mediaId, "movie");
            if (details) return { ...details, type: "movie" };

            // Se não encontrar, tenta buscar como série
            details = await getMediaDetails(mediaId, "tv");
            if (details) return { ...details, type: "tv" };

            return null;
          }),
        );

        const validMedias = detailedMedias.filter((m): m is Media => m !== null);
        
        // 4. Separação por tipo
        setMovies(validMedias.filter((m) => m.type === "movie"));
        setSeries(validMedias.filter((m) => m.type === "tv"));

      } catch (error) {
        console.error(error);
        setErro("Não foi possível carregar os detalhes da lista.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#1f1f1f]">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-blue-500"></div>
      </div>
    );
  }

  if (erro || !lista) {
    return (
      <div className="flex h-screen flex-col bg-[#1f1f1f]">
        <HeaderPage />
        <div className="flex flex-1 items-center justify-center p-4">
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-center text-red-600">
            <p className="font-medium">Ops!</p>
            <p>{erro || "Lista não encontrada."}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full flex-col gap-2 bg-[#1f1f1f]">
      <HeaderPage />
      <div className="px-4 py-8 sm:px-6 lg:px-8">
        
        {/* Cabeçalho da Lista */}
        <div className="mb-8 border-b border-gray-700 pb-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-4xl font-bold text-white">{lista.name}</h2>
              
              <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-gray-400">
                {/* Status Pública/Privada */}
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    lista.isPublic
                      ? "bg-green-900/50 text-green-200"
                      : "bg-gray-700 text-gray-200"
                  }`}
                >
                  {lista.isPublic ? "Pública" : "Privada"}
                </span>

                {/* Data de Criação */}
                <div className="flex items-center gap-1.5">
                  <Calendar size={16} />
                  <span>
                    Criada em {new Date(lista.created_at).toLocaleDateString("pt-BR")}
                  </span>
                </div>

                {/* Informação do Usuário (Dono) */}
                {owner && (
                  <div className="flex items-center gap-1.5 border-l border-gray-600 pl-4 text-blue-400">
                    <User size={16} />
                    <span>Por: <span className="font-semibold text-blue-300">{owner.username}</span></span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Conteúdo Vazio */}
        {movies.length === 0 && series.length === 0 && (
          <div className="rounded-xl border-2 border-dashed border-gray-600 bg-gray-800 py-12 text-center">
            <p className="text-lg text-gray-400">Esta lista está vazia.</p>
          </div>
        )}

        {/* Seção de Filmes */}
        {movies.length > 0 && (
          <div className="mb-10">
            <div className="mb-4 flex items-center gap-2 text-2xl font-bold text-white">
              <Film className="text-blue-500" />
              <h3>Filmes</h3>
              <span className="ml-2 text-sm font-normal text-gray-500">({movies.length})</span>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              {movies.map((media) => (
                <div key={media.id} className="flex justify-center transition-transform hover:scale-105">
                  <MediaContent
                    id={media.id}
                    urlImage={media.poster_path}
                    type="movie"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Seção de Séries */}
        {series.length > 0 && (
          <div>
            <div className="mb-4 flex items-center gap-2 text-2xl font-bold text-white">
              <Tv className="text-purple-500" />
              <h3>Séries</h3>
              <span className="ml-2 text-sm font-normal text-gray-500">({series.length})</span>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              {series.map((media) => (
                <div key={media.id} className="flex justify-center transition-transform hover:scale-105">
                  <MediaContent
                    id={media.id}
                    urlImage={media.poster_path}
                    type="tv"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}