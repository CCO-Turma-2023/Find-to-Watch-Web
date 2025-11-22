class ListasServices {
    constructor(listasRepository) {
        this.listasRepository = listasRepository;
    }

    async createListas(listas) {
        return await this.listasRepository.createListas(listas);
    }

    async getListasPublics() {
        return await this.listasRepository.getListasPublics();
    }

    async getListasById(id) {
        return await this.listasRepository.getListasById(id);
    }

    async getListasByUserId(userId) {
        return await this.listasRepository.getListasByUserId(userId);
    }

    async updateListas(id, listas) {
        return await this.listasRepository.updateListas(id, listas);
    }

    async deleteListas(id) {
        return await this.listasRepository.deleteListas(id);
    }
}

module.exports = { ListasServices };