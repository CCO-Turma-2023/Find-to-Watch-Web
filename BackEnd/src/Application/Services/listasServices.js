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

        return listas
    }

    async getListasById(userId, listId) {
        const lista = await this.listasRepository.getListasById(listId);

        if (!lista) {
            throw new Error("Lista não encontrada");
        }

        if (!lista.ispublic && lista.user_id !== userId) {
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

        return await this.listasRepository.insertMedia(list_id, media_id);
    }

   async getMediaByListId(userId, listId) {
        const lista = await this.listasRepository.getListasById(listId);
        if (!lista) {
            throw new Error("Lista não encontrada");
        }

        if (!lista.ispublic && lista.user_id !== userId) {
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