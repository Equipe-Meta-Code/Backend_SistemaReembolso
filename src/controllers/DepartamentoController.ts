import { Request, Response } from "express";
import DepartamentoModel from "../models/DepartamentoModel";

export default class DepartamentoController {

  async create(req: Request, res: Response) {
    const { nome } = req.body;

    if (!nome) {
      return res.status(400).json({ 
        error: "O campo nome é obrigatório", 
        alertType: "error" // Alerta de erro
      });
    }

    try {
      const novoDepartamento = await DepartamentoModel.create({ nome });
      res.status(201).json({
        message: "Departamento criado com sucesso", 
        alertType: "success", // Alerta de sucesso
        novoDepartamento
      });
    } catch (error) {
      res.status(500).json({
        error: "Erro ao criar departamento", 
        details: error, 
        alertType: "error" // Alerta de erro
      });
    }
  }

  async getAll(req: Request, res: Response) {
    try {
      const departamentos = await DepartamentoModel.find();
      res.status(200).json({
        message: "Departamentos carregados com sucesso", 
        alertType: "success", // Alerta de sucesso
        departamentos
      });
    } catch (error) {
      res.status(500).json({
        error: "Erro ao buscar departamentos", 
        details: error, 
        alertType: "error" // Alerta de erro
      });
    }
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const deletedDepartamento = await DepartamentoModel.findByIdAndDelete(id);

      if (!deletedDepartamento) {
        return res.status(404).json({
          error: "Departamento não encontrado", 
          alertType: "error" // Alerta de erro
        });
      }

      res.status(200).json({
        message: "Departamento deletado com sucesso", 
        alertType: "success", // Alerta de sucesso
        deletedDepartamento
      });
    } catch (error) {
      res.status(500).json({
        error: "Erro ao deletar departamento", 
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
      const updatedDepartamento = await DepartamentoModel.findByIdAndUpdate(id, { nome }, { new: true });

      if (!updatedDepartamento) {
        return res.status(404).json({
          error: "Departamento não encontrado", 
          alertType: "error" // Alerta de erro
        });
      }

      res.status(200).json({
        message: "Departamento atualizado com sucesso", 
        alertType: "success", // Alerta de sucesso
        updatedDepartamento
      });
    } catch (error) {
      res.status(500).json({
        error: "Erro ao atualizar departamento", 
        details: error, 
        alertType: "error" // Alerta de erro
      });
    }
  }
  
}
