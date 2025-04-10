import { Request, Response } from "express";
import ProjetoModel from "../models/ProjetoModel";
import CategoriaModel from "../models/CategoriaModel";
import DepartamentoModel from "../models/DepartamentoModel";

export default class ProjetoController {
  async create(req: Request, res: Response) {
    try {
      const { nome, descricao, categorias, departamentos, funcionarios } = req.body;

      if (!nome || !descricao || !categorias?.length || !departamentos?.length || !funcionarios?.length) {
        return res.status(400).json({ error: "Todos os campos são obrigatórios." });
      }

      const categoriasDetalhadas = await Promise.all(
        categorias.map(async (cat: { categoriaId: string; valor_maximo: number }) => {
          const categoriaDb = await CategoriaModel.findOne({ categoriaId: cat.categoriaId });
          if (!categoriaDb) {
            throw new Error(`Categoria com ID ${cat.categoriaId} não encontrada.`);
          }
          return {
            categoriaId: cat.categoriaId,
            nome: categoriaDb.nome,
            valor_maximo: cat.valor_maximo,
          };
        })
      );

      const departamentosDetalhados = await Promise.all(
        departamentos.map(async (dep: any) => {

          if (typeof dep === "object" && dep.departamentoId) {

            if (!dep.nome || dep.nome === "Desconhecido") {
              const depNum = Number(dep.departamentoId);
              if (isNaN(depNum)) {
                throw new Error(`Departamento inválido: ${dep}`);
              }
              const departamentoDb = await DepartamentoModel.findOne({ departamentoId: depNum });
              if (!departamentoDb) {
                throw new Error(`Departamento com ID ${dep.departamentoId} não encontrado.`);
              }
              return {
                departamentoId: String(departamentoDb.departamentoId),
                nome: departamentoDb.nome,
              };
            }
            return dep;
          } else if (typeof dep === "string") {
            const depNum = Number(dep);
            if (isNaN(depNum)) {
              throw new Error(`Departamento inválido: ${dep}`);
            }
            const departamentoDb = await DepartamentoModel.findOne({ departamentoId: depNum });
            if (!departamentoDb || !departamentoDb.nome || departamentoDb.nome === "Desconhecido") {
              throw new Error(`Departamento com ID ${dep} não encontrado ou sem nome válido.`);
            }
            return {
              departamentoId: String(departamentoDb.departamentoId),
              nome: departamentoDb.nome,
            };
          } else {
            throw new Error(`Formato inesperado para o departamento: ${dep}`);
          }
        })
      );

      const projeto = await ProjetoModel.create({
        nome,
        descricao,
        categorias: categoriasDetalhadas,
        departamentos: departamentosDetalhados,
        funcionarios,
      });

      res.status(201).json(projeto);
    } catch (error) {
      console.error("Erro ao criar projeto:", error);
      res.status(500).json({
        error: "Erro ao criar projeto.",
        details: (error as Error).message,
      });
    }
  }

