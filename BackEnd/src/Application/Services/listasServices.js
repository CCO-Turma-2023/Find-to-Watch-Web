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

  async getListasById(userId, listId) {
    const lista = await this.listasRepository.getListasById(listId);

    if (!lista) {
      throw new Error("Lista não encontrada");
    }

    // Se a lista é pública, permite acesso para todos
    if (lista.isPublic) {
      return lista;
    }

    // Se a lista é privada, verifica autenticação e permissão
    if (!userId) {
      const error = new Error(
        "Autenticação necessária para acessar esta lista"
      );
      error.statusCode = 401;
      throw error;
    }

    if (String(lista.user_id).trim() !== String(userId).trim()) {
      throw new Error("Você não tem permissão para visualizar esta lista");
    }

    return lista;
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

  async getMediaByListId(userId, listId) {
    const lista = await this.listasRepository.getListasById(listId);
    if (!lista) {
      throw new Error("Lista não encontrada");
    }

    console.log("lista", lista);

    // Se a lista é pública, permite acesso para todos
    if (lista.isPublic) {
      return await this.listasRepository.getMediaByListId(listId);
    }

    // Se a lista é privada, verifica autenticação e permissão
    if (!userId) {
      const error = new Error(
        "Autenticação necessária para acessar esta lista"
      );
      error.statusCode = 401;
      throw error;
    }

    if (String(lista.user_id).trim() !== String(userId).trim()) {
      throw new Error("Você não tem permissão para visualizar esta lista");
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
