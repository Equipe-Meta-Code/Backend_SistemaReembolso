import { Request, Response } from "express";
import CategoriaModel from "../models/CategoriaModel";

export default class CategoriaController {

  async create(req: Request, res: Response) {
    const { nome } = req.body;

    if (!nome) {
      return res.status(400).json({ error: "O campo nome é obrigatório" });
    }

    try {
      const novaCategoria = await CategoriaModel.create({ nome });
      res.status(201).json(novaCategoria);
    } catch (error) {
      res.status(500).json({ error: "Erro ao criar categoria", details: error });
    }
  }

  async getAll(req: Request, res: Response) {
    try {
      const categorias = await CategoriaModel.find();
      res.status(200).json(categorias);
    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar categorias", details: error });
    }
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const deletedCategoria = await CategoriaModel.findByIdAndDelete(id);

      if (!deletedCategoria) {
        return res.status(404).json({ error: "Categoria não encontrada" });
      }

      res.status(200).json({ message: "Categoria deletada com sucesso", deletedCategoria });
    } catch (error) {
      res.status(500).json({ error: "Erro ao deletar categoria", details: error });
    }
  }

  async update(req: Request, res: Response) {
    const { id } = req.params;
    const { nome } = req.body;

    if (!nome) {
      return res.status(400).json({ error: "O campo nome é obrigatório" });
    }

    try {
      const updatedCategoria = await CategoriaModel.findByIdAndUpdate(id, { nome }, { new: true });

      if (!updatedCategoria) {
        return res.status(404).json({ error: "Categoria não encontrada" });
      }

      res.status(200).json({ message: "Categoria atualizada com sucesso", updatedCategoria });
    } catch (error) {
      res.status(500).json({ error: "Erro ao atualizar categoria", details: error });
    }
  }
  
}
