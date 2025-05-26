import { Request, Response } from 'express';
import DespesaModel from '../models/DespesaModel';
import PacoteModel from '../models/PacoteModel';
import CategoriaModel from '../models/CategoriaModel';
  
export default class DespesaController {

    //criar despesa
    async create(req: Request, res: Response) {
        if (req.body.data == null || req.body.data === "") {
            return res.status(400).json({
                error: 'Campo data é obrigatório',
                alertType: 'error', // Alerta de erro
            });
        }

        try {
            const { pacoteId, projetoId, categoria, data, valor_gasto, descricao, aprovacao, userId } = req.body;

            //verifica se pacote pertence ao usuário e está em rascunho
            const pacoteOk = await PacoteModel.findOne({
                userId,
                status: 'Rascunho'
            });

            if (!pacoteOk) {
                return res.status(400).json({
                    erro: 'Pacote inválido ou já enviado',
                    alertType: 'error', // Alerta de erro
                });
            }

            //criar a despesa
            const despesa = await DespesaModel.create({
                projetoId,
                categoria,
                data,
                valor_gasto,
                descricao,
                aprovacao,
                userId,
            });

            await PacoteModel.updateOne(
                { pacoteId: pacoteId },
                { $push: { despesas: despesa.despesaId } }
            );
            
            res.status(201).json(despesa);
            
        } catch (error) {
            console.error("Erro ao criar despesa:", error);
            res.status(500).json({
                error: 'Erro ao criar despesa',
                detalhe: error,
                alertType: 'error', // Alerta de erro
            });
        }
    }

    // Buscar todas as despesas
    async getAll(req: Request, res: Response) {
        try {
            const despesas = await DespesaModel.find();
            res.status(200).json(despesas);
        } catch (error) {
            res.status(500).json({
                error: 'Erro ao buscar despesas',
                alertType: 'error', // Alerta de erro
            });
        }
    }

    // Aprovar despesas
    async aprovarDespesas(req: Request, res: Response) {
        const { id } = req.params;
        const { aprovacao } = req.body;
        
        if (!aprovacao) {
            return res.status(400).json({
                error: 'Campo aprovação é obrigatório',
                alertType: 'error', // Alerta de erro
            });
        }
        
        try {
            const despesaAtualizada = await DespesaModel.findByIdAndUpdate(
                id,
                { aprovacao },
                { new: true }
            );
            
            if (!despesaAtualizada) {
                return res.status(404).json({
                    error: 'Despesa não encontrada',
                    alertType: 'error', // Alerta de erro
                });
            }
            
            res.status(200).json(despesaAtualizada);
        } catch (error) {
            res.status(500).json({
                error: 'Erro ao atualizar aprovação da despesa',
                alertType: 'error', // Alerta de erro
            });
        }
    }

    //Busca despesas por uma lista de IDs e retorna com os nomes das categorias
    async getByIds(req: Request, res: Response) {
            try {
            const { ids } = req.body;
        
            if (!ids || !Array.isArray(ids)) {
                return res.status(400).json({ error: 'O corpo da requisição deve conter um array de IDs' });
            }
        
            // Busca despesas
            const despesas = await DespesaModel.find({ despesaId: { $in: ids } });
        

            const categoriaIds = Array.from(
                new Set(
                despesas
                    .map(d => d.categoria) //Extrai "categoria" de cada despesa
                    .filter((c): c is string => typeof c === 'string') 
                )
            );
            const categorias = await CategoriaModel.find({ 
                categoriaId: { $in: categoriaIds.map(id => parseInt(id)) } 
            }); //Busca no banco todas as categorias que estão com o id na lista
      
            const categoriaMap = categorias.reduce((acc, cat) => {
                if (cat.categoriaId != null) {
                    acc[cat.categoriaId] = cat.nome;
                }
                return acc;
            }, {} as Record<number, string>);
        
            const despesasComNomeCategoria = despesas.map(d => {
                const catId = parseInt(d.categoria); 
                return {
                    ...d.toObject(),
                    categoria: categoriaMap[catId] || d.categoria,
                };
            });
        
            res.status(200).json(despesasComNomeCategoria);
            } catch (error) {
                console.error('Erro ao buscar despesas por IDs:', error);
                res.status(500).json({ error: 'Erro ao buscar despesas por IDs' });
            }
        }
            
}