import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getMyLists } from "../../../app/services/gets/getmyLists";
import { createList } from "../../../app/services/posts/createList";

interface ListOption {
  id: number;
  name: string;
  hasMedia?: boolean; // Simulating if the media is already in the list
}

interface ListModalProps {
  filmName: string;
  filmId: number;
  onClose: () => void;
}

export default function ListModal({
  filmName,
  filmId,
  onClose,
}: ListModalProps) {
  const [options, setOptions] = useState<ListOption[]>([
    { id: 1, name: "Assistir Mais Tarde", hasMedia: false },
    { id: 2, name: "Favoritos", hasMedia: true },
  ]);
  const [isCreating, setIsCreating] = useState(false);
  const [newListName, setNewListName] = useState("");
  const [isPublic, setIsPublic] = useState(true);

  useEffect(() => {
    const funGetLists = async () => {
      const response = await getMyLists();
      setOptions(response);
      console.log("teste", response);
    };
    funGetLists();
  }, []);

  const toggleList = (id: number) => {
    setOptions((prev) =>
      prev.map((opt) =>
        opt.id === id ? { ...opt, hasMedia: !opt.hasMedia } : opt,
      ),
    );
  };

  const handleCreateList = async () => {
    if (!newListName.trim()) return;
    await createList({ name: newListName, isPublic });
    const newList = { id: Date.now(), name: newListName, hasMedia: true };
    setOptions([...options, newList]);
    setNewListName("");
    setIsCreating(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="w-full max-w-md overflow-hidden rounded-2xl border border-gray-800 bg-[#1c1c1c] shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-800 p-4">
          <h2 className="text-lg font-semibold text-white">
            Você deseja salvar "{filmName}" em:
          </h2>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-gray-400 transition hover:bg-gray-800 hover:text-white"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Body */}
        {options.length > 0 && (
          <div className="custom-scrollbar max-h-[60vh] overflow-y-auto p-4">
            <div className="flex flex-col gap-1">
              {options.map((option) => (
                <label
                  key={option.id}
                  className="flex cursor-pointer items-center gap-3 rounded-lg p-3 transition hover:bg-gray-800"
                >
                  <div
                    className={`flex h-5 w-5 items-center justify-center rounded border ${option.hasMedia ? "border-blue-600 bg-blue-600" : "border-gray-500"}`}
                  >
                    {option.hasMedia && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-white"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    )}
                  </div>
                  <input
                    type="checkbox"
                    className="hidden"
                    checked={!!option.hasMedia}
                    onChange={() => toggleList(option.id)}
                  />
                  <span className="text-gray-200">{option.name}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="border-t border-gray-800 p-4">
          {!isCreating ? (
            <button
              onClick={() => setIsCreating(true)}
              className="flex w-full items-center gap-2 rounded-lg p-2 text-gray-300 transition hover:bg-gray-800"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              Criar nova lista
            </button>
          ) : (
            <div className="flex flex-col gap-3">
              <label className="text-xs font-medium text-gray-400 uppercase">
                Nome da lista
              </label>
              <input
                autoFocus
                type="text"
                placeholder="Ex: Filmes de Terror"
                className="w-full rounded-lg border border-gray-700 bg-gray-900 p-3 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleCreateList()}
              />
              <label className="text-xs font-medium text-gray-400 uppercase">
                Privacidade
              </label>
              <select
                value={String(isPublic)}
                onChange={(e) => setIsPublic(e.target.value === "true")}
                className="w-full rounded-lg border border-gray-700 bg-gray-900 p-3 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
              >
                <option value="true">Pública</option>
                <option value="false">Privada</option>
              </select>
              <div className="mt-1 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="rounded-lg px-4 py-2 text-sm font-medium text-gray-400 transition hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleCreateList}
                  disabled={newListName.trim().length === 0}
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Criar
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
