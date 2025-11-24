import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getListById } from "../../../app/services/gets/getListById";
import { getMediaByListId } from "../../../app/services/gets/getMediaByListId";
import { getMediaDetails } from "../../../app/services/gets/getMediaDetails";
import HeaderPage from "../../components/header";
import MediaContent from "../../components/mediaContent";
import type { Lista } from "../../../app/interfaces/list";
import type { Media } from "../../../app/interfaces/media";

export default function ListDetails() {
  const { id } = useParams<{ id: string }>();
  const [lista, setLista] = useState<Lista | null>(null);
  const [medias, setMedias] = useState<Media[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      try {
        const [listData, mediaData] = await Promise.all([
          getListById(id),
          getMediaByListId(id),
        ]);

        const detailedMedias = await Promise.all(
          mediaData.map(async (item: any) => {
            const mediaId = item.media_id;
            // Tenta buscar como filme
            let details = await getMediaDetails(mediaId, "movie");
            if (details) return details;

            // Se não encontrar, tenta buscar como série
            details = await getMediaDetails(mediaId, "tv");
            if (details) return details;

            return null;
          }),
        );

        setLista(listData);
        setMedias(detailedMedias.filter((m): m is Media => m !== null));
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
        <div className="h-12 w-12 animate-spin rounded-full border-t-2 border-b-2 border-blue-500"></div>
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
    <div className="flex h-screen w-full flex-col gap-2 bg-[#1f1f1f]">
      <HeaderPage />
      <div className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 border-b border-gray-700 pb-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-white">{lista.name}</h2>
              <div className="mt-2 flex items-center space-x-2">
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    lista.isPublic
                      ? "bg-green-700 text-green-100"
                      : "bg-gray-700 text-gray-100"
                  }`}
                >
                  {lista.isPublic ? "Pública" : "Privada"}
                </span>
                <span className="text-sm text-gray-400">
                  Criada em
                  {new Date(lista.created_at).toLocaleDateString("pt-BR")}
                </span>
              </div>
            </div>
          </div>
        </div>

        {medias.length === 0 ? (
          <div className="rounded-xl border-2 border-dashed border-gray-600 bg-gray-800 py-12 text-center">
            <p className="text-lg text-gray-400">Esta lista está vazia.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {medias.map((media) => (
              <div key={media.id} className="flex justify-center">
                <MediaContent
                  id={media.id}
                  urlImage={media.poster_path}
                  type={media.type}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
