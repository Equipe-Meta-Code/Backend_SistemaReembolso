import { Request, Response } from "express";
import ProjetoModel from "../models/ProjetoModel";
import CategoriaModel from "../models/CategoriaModel";
import DepartamentoModel from "../models/DepartamentoModel";
import UserModel from "../models/UserModel";

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
        status: 'ativo',
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

  async getAll(req: Request, res: Response) {
    try {
      const projetos = await ProjetoModel.find();
      res.status(200).json(projetos);
    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar projetos." });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const { projetoId } = req.params;
  
      const projeto = await ProjetoModel.findOne({ projetoId: projetoId });
      if (!projeto) {
        return res.status(404).json({ error: "Projeto não encontrado." });
      }
  
      res.status(200).json(projeto);
    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar projeto." });
    }
  }

  async encerrar(req: Request, res: Response) {
    try {
      console.log('Encerrar projeto - id:', req.params.id);
      const { id } = req.params;
      const projetoIdNum = Number(id);
      
      if (isNaN(projetoIdNum)) {
        return res.status(400).json({ error: 'ID do projeto inválido.' });
      }

      const projeto = await ProjetoModel.findOneAndUpdate(
        { projetoId: projetoIdNum },
        { status: 'encerrado' },
        { new: true }
      );


      if (!projeto) {
        return res.status(404).json({ error: 'Projeto não encontrado.' });
      }

      res.status(200).json({ message: 'Projeto encerrado com sucesso.', projeto });
    } catch (error) {
      console.error('Erro ao encerrar projeto:', error);
      res.status(500).json({ error: 'Erro ao encerrar projeto.' });
    }
  }

  async adicionarFuncionario(req: Request, res: Response) {
    try {
      const { projetoId } = req.params;
      const { funcionarioId } = req.body;

      if (!funcionarioId) {
        return res.status(400).json({ error: 'ID do funcionário é obrigatório.' });
      }

      const projeto = await ProjetoModel.findOne({ projetoId });
      if (!projeto) {
        return res.status(404).json({ error: 'Projeto não encontrado.' });
      }

      const funcionario = await UserModel.findOne({ _id: funcionarioId });
      if (!funcionario) {
        return res.status(404).json({ error: 'Funcionário não encontrado.' });
      }

      if (projeto.funcionarios.some(f => f.userId === funcionario.userId)) {
        return res.status(400).json({ error: 'Funcionário já está no projeto.' });
      }


      projeto.funcionarios.push({
        _id: funcionario._id,
        name: funcionario.name,
        userId: funcionario.userId,
      });

      await projeto.save();
      return res.status(200).json(projeto);
    } catch (err) {
      console.error('Erro ao adicionar funcionário:', err);
      return res.status(500).json({ error: 'Erro ao adicionar funcionário.' });
    }
  }
  
}
