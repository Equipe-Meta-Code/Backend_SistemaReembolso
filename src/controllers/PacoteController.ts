import { Request, Response } from "express";
import PacoteModel from "../models/PacoteModel";
import DespesaModel from "../models/DespesaModel";

export default class PacoteController {

    //criação de pacote
    async create(req: Request, res: Response) {
        try {
            const { nome, projetoId, status, despesas, userId } = req.body;

            /*const pacoteExistente = await PacoteModel.findOne({ nome, projetoId, userId: req.user });
              if (pacoteExistente) {
                return res.status(400).json({ erro: 'Já existe um pacote com esse nome nesse projeto' });
            }*/

            // Criar novo pacote
            const pacote = await PacoteModel.create({
                nome,
                projetoId,
                status,
                userId,
                despesas
              });

            res.status(201).json(pacote);
        } catch (error) {
            console.error("Erro ao criar pacote:", error);
            res.status(500).json({
                error: 'Erro ao criar pacote',
                detalhe: error,
                alertType: 'error', // Alerta de erro
            });
        }
    };

    async getAll(req: Request, res: Response) {
            try {
                const pacotes = await PacoteModel.find();
                res.status(200).json(pacotes);
            } catch (error) {
                res.status(500).json({ error: 'Erro ao buscar pacotes' });
            }
    }
}