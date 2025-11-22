const { ListasServices } = require("../../Application/Services/listasServices");
const listasRepository = require("../../Infrastructure/Repositories/listasRepository");

const listasServices = new ListasServices(listasRepository);

class ListasController {
    async createListas(req, res) {
        try {
            console.log("chegou aqui")
            const { name, isPublic } = req.body;
            const listas = await listasServices.createListas({ name, isPublic, user_id: req.userId });
            return res.status(201).json(listas);
        } catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }

    async getListasPublics(req, res) {
        try {
            const listas = await listasServices.getListasPublics();
            return res.status(200).json(listas);
        } catch (error) {
            return res.status(404).json({ message: error.message });
        }
    }

    async getListasById(req, res) {
        try {
            const listas = await listasServices.getListasById(req.params.id);
            return res.status(200).json(listas);
        } catch (error) {
            return res.status(404).json({ message: error.message });
        }
    }

    async getListasByUserId(req, res) {
        try {
            const listas = await listasServices.getListasByUserId(req.userId);
            return res.status(200).json(listas);
        } catch (error) {
            return res.status(404).json({ message: error.message });
        }
    }

    async updateListas(req, res) {
        try {
            const listas = await listasServices.updateListas(req.params.id, req.body);
            return res.status(200).json(listas);
        } catch (error) {
            return res.status(404).json({ message: error.message });
        }
    }

    async deleteListas(req, res) {
        try {
            await listasServices.deleteListas(req.params.id);
            return res.status(204).send();
        } catch (error) {
            return res.status(404).json({ message: error.message });
        }
    }
}

module.exports = new ListasController();
