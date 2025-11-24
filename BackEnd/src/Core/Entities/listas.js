class listas {
    constructor({ id, name, user_id, ispublic, created_at, updated_at }) {
        this.id = id;
        this.name = name;
        this.user_id = user_id;
        this.isPublic = ispublic;
        this.created_at = created_at;
        this.updated_at = updated_at;
    }
}

module.exports = listas;
