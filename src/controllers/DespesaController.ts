import { Request, Response } from 'express';
import DespesaModel from '../models/DespesaModel';
import PacoteModel from '../models/PacoteModel';
  
export default class DespesaController {

    //criar despesa
    async create(req: Request, res: Response) {

        if (req.body.data == null || req.body.data === "") return res.status(400).json({error: 'campo data é obrigatório'})
        try {
            const { pacoteId, projetoId, categoria, data, valor_gasto, descricao, aprovacao, userId } = req.body;

            //verifica se pacote pertence ao usuário e está em rascunho
            const pacoteOk = await PacoteModel.findOne({
                userId,
                status: 'rascunho'
            });

            if (!pacoteOk) {
                return res.status(400).json({ erro: 'Pacote inválido ou já enviado'});
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

            res.status(201).json(despesa);
        } catch (error) {
            console.error("Erro ao criar despesa:", error);
            res.status(500).json({ error: 'Erro ao criar despesa', detalhe: error });

        }
    }

    async getAll(req: Request, res: Response) {
        try {
            const despesas = await DespesaModel.find();
            res.status(200).json(despesas);
        } catch (error) {
            res.status(500).json({ error: 'Erro ao buscar despesas' });
        }
    }

    async aprovarDespesas(req: Request, res: Response) {
        const { id } = req.params;
        const { aprovacao } = req.body;
        
        if (!aprovacao) {
            return res.status(400).json({ error: 'Campo aprovação é obrigatório' });
        }
        
        try {
            const despesaAtualizada = await DespesaModel.findByIdAndUpdate(
                id,
                { aprovacao },
                { new: true }
            );
            
            if (!despesaAtualizada) {
                return res.status(404).json({ error: 'Despesa não encontrada' });
            }
            
            res.status(200).json(despesaAtualizada);
        } catch (error) {
            res.status(500).json({ error: 'Erro ao atualizar aprovação da despesa' });
        }
    }
}