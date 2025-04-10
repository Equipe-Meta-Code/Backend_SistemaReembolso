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

  }
}
