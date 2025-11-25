class ListasServices {
  constructor(listasRepository) {
    this.listasRepository = listasRepository;
  }

  async createListas(listas) {
    return await this.listasRepository.createListas(listas);
  }

  async getAllLists(userId) {
    const listas = await this.listasRepository.getAllLists(userId);

    if (!listas) {
      throw new Error("Não há listas");
    }

    return listas;
  }

  async insertMedia(userId, list_id, media_id) {
    const lista = await this.listasRepository.getListasById(list_id);
    if (!lista) {
      throw new Error("Lista não encontrada");
    }

    if (lista.user_id !== userId) {
      throw new Error("Você não tem permissão para alterar esta lista");
    }

    const resp = await this.listasRepository.insertMedia(list_id, media_id);

    if (!resp) throw new Error("Não foi possível inserir na lista");

    return resp;
  }

  async getListasById(userId, listId) {
    const lista = await this.listasRepository.getListasById(listId);

    if (!lista) {
      throw new Error("Lista não encontrada");
    }

    // 1. Se a lista é pública, acesso liberado IMEDIATAMENTE.
    // Não importa se o usuário está logado ou não.
    if (lista.isPublic) {
      return lista;
    }

    // 2. Se a lista NÃO é pública (Privada):
    
    // Verifica se existe um usuário logado
    if (!userId) {
      const error = new Error("Esta lista é privada. Faça login para acessar.");
      error.statusCode = 401; // Unauthorized
      throw error;
    }

    // Verifica se o usuário logado é o dono da lista
    // Usar String() e trim() é boa prática para comparar IDs
    if (lista.user_id !== userId) {
      const error = new Error("Você não tem permissão para visualizar esta lista privada.");
      error.statusCode = 403; // Forbidden
      throw error;
    }

    return lista;
  }

  // Replique a mesma lógica para o getMediaByListId
  async getMediaByListId(userId, listId) {
    const lista = await this.listasRepository.getListasById(listId);
    
    if (!lista) {
      throw new Error("Lista não encontrada");
    }

    // Lógica de Permissão
    const isOwner = userId && lista.user_id === userId;
    
    // Se não for pública E não for o dono => Erro
    if (!lista.isPublic && !isOwner) {
       if (!userId) {
          const error = new Error("Autenticação necessária");
          error.statusCode = 401;
          throw error;
       } else {
          const error = new Error("Sem permissão");
          error.statusCode = 403;
          throw error;
       }
    }

    return await this.listasRepository.getMediaByListId(listId);
  }

  async updateListas(userId, listId, data) {
    const lista = await this.listasRepository.getListasById(listId);

    if (!lista) {
      throw new Error("Lista não encontrada");
    }

    if (lista.user_id !== userId) {
      throw new Error("Você não tem permissão para atualizar esta lista");
    }

    return await this.listasRepository.updateListas(listId, data);
  }

  async deleteListas(userId, listId) {
    const lista = await this.listasRepository.getListasById(listId);

    if (!lista) {
      throw new Error("Lista não encontrada");
    }

    if (lista.user_id !== userId) {
      throw new Error("Você não tem permissão para deletar esta lista");
    }

    return await this.listasRepository.deleteListas(listId);
  }
}

module.exports = { ListasServices };
