import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllLists } from "../../../app/services/gets/getAllLists";
import type { Lista } from "../../../app/interfaces/list";
import { deleteList } from "../../../app/services/deletes/deleteList";
import { updateList } from "../../../app/services/puts/updateList";
import UpdateListModal from "../../components/UpdateListModal/UpdateListModal";
import { Pencil, Trash2 } from "lucide-react";
import HeaderPage from "../../components/header";

export default function UserLists() {
  const navigate = useNavigate();
  const [listas, setListas] = useState<Lista[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const [selectedList, setSelectedList] = useState<Lista | null>(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

  useEffect(() => {
    const fetchListas = async () => {
      try {
        const data = await getAllLists();
        console.log(data);
        setListas(data);
      } catch {
        setErro("Não foi possível carregar suas listas.");
      } finally {
        setLoading(false);
      }
    };

    fetchListas();
  }, []);

  const handleListClick = (id: string | number) => {
    navigate(`/lists/${id}`);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleDelete = async (e: React.MouseEvent, id: string | number) => {
    e.stopPropagation();
    if (window.confirm("Tem certeza que deseja excluir esta lista?")) {
      try {
        await deleteList(id);
        setListas(listas.filter((lista) => lista.id !== id));
      } catch (error) {
        console.error("Erro ao deletar lista:", error);
        alert("Erro ao deletar lista. Tente novamente.");
      }
    }
  };

  const handleUpdateClick = (e: React.MouseEvent, lista: Lista) => {
    e.stopPropagation();
    setSelectedList(lista);
    setIsUpdateModalOpen(true);
  };

  const handleUpdate = async (
    id: string | number,
    name: string,
    isPublic: boolean,
  ) => {
    try {
      await updateList(id, { name, isPublic });
      setListas(
        listas.map((lista) =>
          lista.id === id ? { ...lista, name, isPublic } : lista,
        ),
      );
    } catch (error) {
      console.error("Erro ao atualizar lista:", error);
      alert("Erro ao atualizar lista. Tente novamente.");
      throw error;
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (erro) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-center text-red-600">
        <p className="font-medium">Ops!</p>
        <p>{erro}</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full flex-col gap-2 bg-[#1f1f1f]">
      <HeaderPage />
      <div className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 border-b border-gray-700 pb-4">
          <h2 className="text-3xl font-bold text-white">Minhas Listas</h2>
          <p className="mt-1 text-gray-300">Gerencie e acesse suas coleções</p>
        </div>

        {listas.length === 0 ? (
          <div className="rounded-xl border-2 border-dashed border-gray-600 bg-gray-800 py-12 text-center">
            <p className="text-lg text-gray-400">Nenhuma lista encontrada.</p>
            <button className="mt-4 rounded-md bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700">
              Criar nova lista
            </button>
          </div>
        ) : (
          <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {listas.map((lista) => (
              <li key={lista.id}>
                <button
                  onClick={() => handleListClick(lista.id)}
                  className="group w-full rounded-xl border border-gray-700 bg-gray-800 p-6 text-left shadow-lg transition-all duration-300 ease-in-out hover:-translate-y-1 hover:border-blue-400 hover:shadow-xl focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-[#1f1f1f] focus:outline-none"
                >
                  <div className="mb-4 flex items-start justify-between">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        lista.isPublic
                          ? "bg-green-700 text-green-100"
                          : "bg-gray-700 text-gray-100"
                      }`}
                    >
                      {lista.isPublic ? "Pública" : "Privada"}
                    </span>
                    <span className="font-mono text-xs text-gray-400">
                      #{lista.id}
                    </span>
                  </div>

                  <h3 className="mb-2 line-clamp-1 text-xl font-semibold text-gray-100 group-hover:text-blue-400">
                    {lista.name}
                  </h3>

                  <div className="flex space-x-2 opacity-0 transition-opacity group-hover:opacity-100">
                    <button
                      onClick={(e) => handleUpdateClick(e, lista)}
                      className="rounded p-1 text-gray-400 hover:bg-gray-700 hover:text-blue-400"
                      title="Editar lista"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={(e) => handleDelete(e, lista.id)}
                      className="rounded p-1 text-gray-400 hover:bg-gray-700 hover:text-red-400"
                      title="Excluir lista"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div className="mt-4 flex items-center border-t border-gray-700 pt-4 text-sm text-gray-400">
                    <svg
                      className="mr-1.5 h-4 w-4 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    {formatDate(lista.created_at)}
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}

        <UpdateListModal
          isOpen={isUpdateModalOpen}
          onClose={() => setIsUpdateModalOpen(false)}
          onUpdate={handleUpdate}
          lista={selectedList}
        />
      </div>
    </div>
  );
}
