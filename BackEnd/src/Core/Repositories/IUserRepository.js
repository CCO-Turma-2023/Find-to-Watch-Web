
/**
 * @interface
 * Interface para o Repositório de Usuários, definindo um contrato
 * para as operações de dados relacionadas a usuários.
 */
class IUserRepository {
  /**
   * Retorna todos os usuários.
   * @returns {Promise<User[]>} Uma lista de usuários.
   */
  findAll() {
    throw new Error("Método 'findAll' não implementado");
  }

  /**
   * Encontra um usuário pelo seu email.
   * @param {string} email - O email do usuário.
   * @returns {Promise<User|null>} O usuário encontrado ou nulo.
   */
  findByEmail(email) {
    throw new Error("Método 'findByEmail' não implementado");
  }

  /**
   * Encontra um usuário pelo seu ID.
   * @param {string} id - O ID do usuário.
   * @returns {Promise<User|null>} O usuário encontrado ou nulo.
   */
  findById(id) {
    throw new Error("Método 'findById' não implementado");
  }

  /**
   * Cria um novo usuário no banco de dados.
   * @param {object} user - O objeto de usuário a ser criado.
   * @returns {Promise<User>} O usuário recém-criado.
   */
  create(user) {
    throw new Error("Método 'create' não implementado");
  }

  /**
   * Atualiza um usuário existente.
   * @param {string} id - O ID do usuário a ser atualizado.
   * @param {object} user - Os dados a serem atualizados.
   * @returns {Promise<User>} O usuário atualizado.
   */
  update(id, user) {
    throw new Error("Método 'update' não implementado");
  }

  /**
   * Deleta um usuário pelo seu ID.
   * @param {string} id - O ID do usuário a ser deletado.
   * @returns {Promise<void>}
   */
  delete(id) {
    throw new Error("Método 'delete' não implementado");
  }
}

module.exports = IUserRepository;