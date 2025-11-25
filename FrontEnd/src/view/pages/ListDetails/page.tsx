import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { getListById } from "../../../app/services/gets/getListById";
import { getMediaByListId } from "../../../app/services/gets/getMediaByListId";
import { getMediaDetails } from "../../../app/services/gets/getMediaDetails";
import {
  getUserById,
  type UserPublicProfile,
} from "../../../app/services/gets/getUserById";
import { removeMediaFromList } from "../../../app/services/deletes/removeMediaFromList";
import { decodeToken } from "../../../app/services/api.service";
import { useToast } from "../../../app/contexts/contexts";
import HeaderPage from "../../components/header";
import MediaContent from "../../components/mediaContent";
import LeftArrow from "../../assets/icons/leftArrow";
import type { Lista } from "../../../app/interfaces/list";
import type { Media } from "../../../app/interfaces/media";
import { User, Calendar, Film, Tv, Trash2 } from "lucide-react";

export default function ListDetails() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [lista, setLista] = useState<Lista | null>(null);
  const [owner, setOwner] = useState<UserPublicProfile | null>(null);
  const [movies, setMovies] = useState<Media[]>([]);
  const [series, setSeries] = useState<Media[]>([]);

  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const { showToast } = useToast();
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    const token = decodeToken();
    if (token) {
      setCurrentUserId(token.id);
    }

    const fetchData = async () => {
      if (!id) return;
      try {
        const [listData, mediaData] = await Promise.all([
          getListById(id),
          getMediaByListId(id),
        ]);

        setLista(listData);

        if (listData.user_id) {
          try {
            const userData = await getUserById(listData.user_id);
            setOwner(userData);
          } catch (err) {
            console.error("Erro ao buscar dono da lista", err);
          }
        }

        const detailedMedias = await Promise.all(
          mediaData.map(async (item: { media_id: string }) => {
            const mediaId = item.media_id;
            let details = await getMediaDetails(mediaId, "movie");
            if (details) return { ...details, type: "movie" };

            details = await getMediaDetails(mediaId, "tv");
            if (details) return { ...details, type: "tv" };

            return null;
          }),
        );

        const validMedias = detailedMedias.filter(
          (m): m is Media => m !== null,
        );

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

  const handleRemoveMedia = async (mediaId: number) => {
    if (!id) return;
    if (!window.confirm("Tem certeza que deseja remover este item da lista?"))
      return;

    try {
      await removeMediaFromList(id, mediaId);

      setMovies((prev) => prev.filter((m) => m.id !== mediaId));
      setSeries((prev) => prev.filter((m) => m.id !== mediaId));

      showToast({
        severity: "success",
        summary: "Sucesso",
        detail: "Item removido da lista.",
      });
    } catch (error) {
      console.error("Erro ao remover item:", error);
      showToast({
        severity: "error",
        summary: "Erro",
        detail: "Não foi possível remover o item.",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0a0a0a]">
        <div className="h-12 w-12 animate-spin rounded-full border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (erro || !lista) {
    return (
      <div className="flex h-screen flex-col bg-[#0a0a0a]">
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

  const isOwner = currentUserId && lista.user_id === currentUserId;

  return (
    <div className="flex min-h-screen w-full flex-col gap-2 bg-[#0a0a0a]">
      <div className="bg-gradient-to-b from-black/90 to-transparent px-4 pt-4 pb-8 transition-all duration-300">
        <HeaderPage />
      </div>

      <motion.button
        className="relative top-4 left-4 z-30 flex h-10 w-10 flex-shrink-0 cursor-pointer items-center justify-center rounded-full bg-[#1B1B1BE5] md:h-12 md:w-12"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate("/lists")}
      >
        <LeftArrow />
      </motion.button>
      <div className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 border-b border-gray-700 pb-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-4xl font-bold text-white">{lista.name}</h2>

              <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-gray-400">
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    lista.isPublic
                      ? "bg-green-900/50 text-green-200"
                      : "bg-gray-700 text-gray-200"
                  }`}
                >
                  {lista.isPublic ? "Pública" : "Privada"}
                </span>

                <div className="flex items-center gap-1.5">
                  <Calendar size={16} />
                  <span>
                    Criada em{" "}
                    {new Date(lista.created_at).toLocaleDateString("pt-BR")}
                  </span>
                </div>

                {owner && (
                  <div className="flex items-center gap-1.5 border-l border-gray-600 pl-4 text-blue-400">
                    <User size={16} />
                    <span>
                      Por:{" "}
                      <span className="font-semibold text-blue-300">
                        {owner.username}
                      </span>
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {movies.length === 0 && series.length === 0 && (
          <div className="rounded-xl border-2 border-dashed border-gray-600 bg-gray-800 py-12 text-center">
            <p className="text-lg text-gray-400">Esta lista está vazia.</p>
          </div>
        )}

        {movies.length > 0 && (
          <div className="mb-10">
            <div className="mb-4 flex items-center gap-2 text-2xl font-bold text-white">
              <Film className="text-blue-500" />
              <h3>Filmes</h3>
              <span className="ml-2 text-sm font-normal text-gray-500">
                ({movies.length})
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              {movies.map((media) => (
                <div
                  key={media.id}
                  className="group relative flex justify-center transition-transform hover:scale-105"
                >
                  <MediaContent
                    id={media.id}
                    urlImage={media.poster_path}
                    type="movie"
                  />
                  {isOwner && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveMedia(media.id);
                      }}
                      className="absolute top-2 right-2 z-10 cursor-pointer rounded-full bg-red-600 p-1.5 text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100 hover:bg-red-700"
                      title="Remover da lista"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {series.length > 0 && (
          <div>
            <div className="mb-4 flex items-center gap-2 text-2xl font-bold text-white">
              <Tv className="text-purple-500" />
              <h3>Séries</h3>
              <span className="ml-2 text-sm font-normal text-gray-500">
                ({series.length})
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              {series.map((media) => (
                <div
                  key={media.id}
                  className="group relative flex justify-center transition-transform hover:scale-105"
                >
                  <MediaContent
                    id={media.id}
                    urlImage={media.poster_path}
                    type="tv"
                  />
                  {isOwner && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveMedia(media.id);
                      }}
                      className="absolute top-2 right-2 z-10 cursor-pointer rounded-full bg-red-600 p-1.5 text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100 hover:bg-red-700"
                      title="Remover da lista"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
