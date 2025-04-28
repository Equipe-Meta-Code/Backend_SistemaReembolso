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

  async getAll(req: Request, res: Response) {
    try {
      const departamentos = await DepartamentoModel.find();
      res.status(200).json(departamentos);
    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar departamentos", details: error });
    }
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const deletedDepartamento = await DepartamentoModel.findByIdAndDelete(id);

      if (!deletedDepartamento) {
        return res.status(404).json({ error: "Departamento não encontrado" });
      }

      res.status(200).json({ message: "Departamento deletado com sucesso", deletedDepartamento });
    } catch (error) {
      res.status(500).json({ error: "Erro ao deletar departamento", details: error });
    }
  }

  async update(req: Request, res: Response) {
    const { id } = req.params;
    const { nome } = req.body;

    if (!nome) {
      return res.status(400).json({ error: "O campo nome é obrigatório" });
    }

    try {
      const updatedDepartamento = await DepartamentoModel.findByIdAndUpdate(id, { nome }, { new: true });

      if (!updatedDepartamento) {
        return res.status(404).json({ error: "Departamento não encontrado" });
      }

      res.status(200).json({ message: "Departamento atualizado com sucesso", updatedDepartamento });
    } catch (error) {
      res.status(500).json({ error: "Erro ao atualizar departamento", details: error });
    }
  }
  
}
