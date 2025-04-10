import { Request, Response } from "express";
import DepartamentoModel from "../models/DepartamentoModel";

export default class DepartamentoController {

  async create(req: Request, res: Response) {
    const { nome } = req.body;

    if (!nome) {
      return res.status(400).json({ error: "O campo nome é obrigatório" });
    }

    try {
      const novoDepartamento = await DepartamentoModel.create({ nome });
      res.status(201).json(novoDepartamento);
    } catch (error) {
      res.status(500).json({ error: "Erro ao criar departamento", details: error });
    }
  }

}
