import { Request, Response } from 'express';
import DespesaModel from '../models/DespesaModel';

export default class DespesaController {
    async create(req: Request, res: Response) {
        if (req.body.data == null || req.body.data === "") return res.status(400).json({error: 'campo data é obrigatório'})
        try {
            const createDespesa = await DespesaModel.create(req.body);
            res.status(201).json(createDespesa);
        } catch (error) {
            res.status(500).json({ error: 'Erro ao criar despesa' });
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