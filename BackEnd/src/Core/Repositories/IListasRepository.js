/**
 * Interface para o Repositório de Listas, definindo um contrato
 * para as operações de dados relacionadas a listas.
 */
class IListasRepository {
    /**
     * Cria uma nova lista.
     * @param {object} listas - O objeto de lista a ser criado.
     * @returns {Promise<Listas>} A lista recém-criada.
     */
    createListas(listas) {
        throw new Error("Método 'createListas' não implementado");
    }
    /**
     * Lista todas as listas públicas.
     * @returns {Promise<Listas[]>} Uma lista de listas públicas.
     */
    getListasPublics() {
        throw new Error("Método 'getListasPublics' não implementado");
    }
    /**
     * Lista uma lista pública pelo seu ID.
     * @param {string} id - O ID da lista pública.
     * @returns {Promise<Listas|null>} A lista pública encontrada ou nula.
     */
    getListasById(id) {
        throw new Error("Método 'getListasById' não implementado");
    }

    /**
     * Lista as listas de um usuário específico.
     * @param {string} userId - O ID do usuário.
     * @returns {Promise<Listas[]>} Uma lista de listas do usuário.
     */
    getListasByUserId(userId) {
        throw new Error("Método 'getListasByUserId' não implementado");
    }

    /**
     * Atualiza uma lista existente.
     * @param {string} id - O ID da lista a ser atualizada.
     * @param {object} listas - Os dados a serem atualizados.
     * @returns {Promise<Listas>} A lista atualizada.
     */
    updateListas(id, listas) {
        throw new Error("Método 'updateListas' não implementado");
    }
    /**
     * Deleta uma lista pelo seu ID.
     * @param {string} id - O ID da lista a ser deletada.
     * @returns {Promise<void>}
     */
    deleteListas(id) {
        throw new Error("Método 'deleteListas' não implementado");
    }
     
}

module.exports = IListasRepository;