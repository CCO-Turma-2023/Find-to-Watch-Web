import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllLists } from "../../../app/services/gets/getAllLists";
import type { Lista } from "../../../app/interfaces/list";

export default function UserLists() {
  const navigate = useNavigate();
  const [listas, setListas] = useState<Lista[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    const fetchListas = async () => {
      try {
        // Simulação de delay para ver o loading (pode remover em produção)
        // await new Promise(resolve => setTimeout(resolve, 800)); 
        const data = await getAllLists();
        console.log(data)
        setListas(data);
      } catch {
        setErro("Não foi possível carregar suas listas.");
      } finally {
        setLoading(false);
      }
    };

    fetchListas();
  }, []);

  // Função de navegação
  const handleListClick = (id: string | number) => {
    navigate(`/lists/${id}`);
  };

  // Formatação de data
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (erro) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg text-center">
        <p className="font-medium">Ops!</p>
        <p>{erro}</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 border-b border-gray-200 pb-4">
        <h2 className="text-3xl font-bold text-gray-900">Minhas Listas</h2>
        <p className="text-gray-500 mt-1">Gerencie e acesse suas coleções</p>
      </div>

      {listas.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
          <p className="text-gray-500 text-lg">Nenhuma lista encontrada.</p>
          <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
            Criar nova lista
          </button>
        </div>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {listas.map((lista) => (
            <li key={lista.id}>
              <button
                onClick={() => handleListClick(lista.id)}
                className="w-full text-left group bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md hover:border-blue-400 hover:-translate-y-1 transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <div className="flex justify-between items-start mb-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      lista.isPublic
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {lista.isPublic ? "Pública" : "Privada"}
                  </span>
                  <span className="text-xs text-gray-400 font-mono">
                    #{lista.id}
                  </span>
                </div>

                <h3 className="text-xl font-semibold text-gray-800 group-hover:text-blue-600 mb-2 line-clamp-1">
                  {lista.name}
                </h3>

                <div className="flex items-center text-sm text-gray-500 mt-4 pt-4 border-t border-gray-100">
                  <svg
                    className="w-4 h-4 mr-1.5 text-gray-400"
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
    </div>
  );
}