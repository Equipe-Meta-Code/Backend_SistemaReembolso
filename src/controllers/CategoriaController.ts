import { Request, Response } from "express";
import CategoriaModel from "../models/CategoriaModel";

export default class CategoriaController {

  async create(req: Request, res: Response) {
    const { nome } = req.body;

    if (!nome) {
      return res.status(400).json({ 
        error: "O campo nome é obrigatório", 
        alertType: "error" // Alerta de erro
      });
    }

    try {
      const novaCategoria = await CategoriaModel.create({ nome });
      res.status(201).json({
        message: "Categoria criada com sucesso",
        alertType: "success", // Alerta de sucesso
        novaCategoria
      });
    } catch (error) {
      res.status(500).json({
        error: "Erro ao criar categoria",
        details: error,
        alertType: "error" // Alerta de erro
      });
    }
  }

  async getAll(req: Request, res: Response) {
    try {
      const categorias = await CategoriaModel.find();
      res.status(200).json({
        message: "Categorias carregadas com sucesso",
        alertType: "success", // Alerta de sucesso
        categorias
      });
    } catch (error) {
      res.status(500).json({
        error: "Erro ao buscar categorias",
        details: error,
        alertType: "error" // Alerta de erro
      });
    }
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const deletedCategoria = await CategoriaModel.findByIdAndDelete(id);

      if (!deletedCategoria) {
        return res.status(404).json({
          error: "Categoria não encontrada",
          alertType: "error" // Alerta de erro
        });
      }

      res.status(200).json({
        message: "Categoria deletada com sucesso",
        alertType: "success", // Alerta de sucesso
        deletedCategoria
      });
    } catch (error) {
      res.status(500).json({
        error: "Erro ao deletar categoria",
        details: error,
        alertType: "error" // Alerta de erro
      });
    }
  }

  async update(req: Request, res: Response) {
    const { id } = req.params;
    const { nome } = req.body;

    if (!nome) {
      return res.status(400).json({
        error: "O campo nome é obrigatório",
        alertType: "error" // Alerta de erro
      });
    }

    try {
      const updatedCategoria = await CategoriaModel.findByIdAndUpdate(id, { nome }, { new: true });

      if (!updatedCategoria) {
        return res.status(404).json({
          error: "Categoria não encontrada",
          alertType: "error" // Alerta de erro
        });
      }

      res.status(200).json({
        message: "Categoria atualizada com sucesso",
        alertType: "success", // Alerta de sucesso
        updatedCategoria
      });
    } catch (error) {
      res.status(500).json({
        error: "Erro ao atualizar categoria",
        details: error,
        alertType: "error" // Alerta de erro
      });
    }
  }
  
}
