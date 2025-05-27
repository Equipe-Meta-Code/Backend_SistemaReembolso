import { Request, Response } from "express";
import PacoteModel from "../models/PacoteModel";
import DespesaModel from "../models/DespesaModel";
import NotificacaoModel from "../models/NotificacaoModel"; 

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

    //enviar pacote para aprovação
    async enviarPacote(req: Request, res: Response) {
        try {
            const pacoteId = Number(req.params.pacoteId);

            const pacote = await PacoteModel.findOne({
                pacoteId: pacoteId,
                //userId: userId, // garante que o pacote é do usuário logado
            });
            console.log(pacote);

            if (!pacote || pacote.status !== 'Rascunho') {
                return res.status(400).json({ erro: 'Pacote inválido ou já enviado'});
            }
        
            const despesas = await DespesaModel.find({
                despesaId: { $in: pacote.despesas },
            });              

            if (despesas.length === 0) {
                return res.status(400).json({ erro: 'Pacote sem despesas' });
            }

            pacote.status = 'Aguardando Aprovação';
            await pacote.save();

            /*await DespesaModel.updateMany(
                { pacoteId: pacote.pacoteId },
                { aprovacao: 'Pendente' }
            );*/

            res.json({ mensagem: 'Pacote enviado com sucesso', pacote });
        } catch (error) {
            res.status(500).json({ erro: 'Erro ao enviar pacote', detalhe: error });
        }
    }

    // buscar todos os pacotes
    async getAll(req: Request, res: Response) {
            try {
                const pacotes = await PacoteModel.find();
                res.status(200).json(pacotes);
            } catch (error) {
                res.status(500).json({ error: 'Erro ao buscar pacotes' });
            }
    }

    // buscar 1 pacote com despesas detalhadas
    async getPacoteComDespesas(req: Request, res: Response) {
        try {
            const pacoteId = Number(req.params.pacoteId);

            const pacote = await PacoteModel.findOne({ pacoteId });

            if (!pacote) {
                return res.status(404).json({ erro: 'Pacote não encontrado' });
            }

            const despesas = await DespesaModel.find({
                despesaId: { $in: pacote.despesas }
            }).select('despesaId aprovacao');

            const pacoteComDespesas = {
                ...pacote.toObject(),
                despesasDetalhadas: despesas
            };

            res.status(200).json(pacoteComDespesas);
        } catch (error) {
            res.status(500).json({ erro: 'Erro ao buscar pacote com despesas', detalhe: error });
        }
    }

    async updateStatus(req: Request, res: Response) {
        try {
            const pacoteIdParam = req.params.pacoteId;
            const novoStatus: string = req.body.status;

            const STATUS_PERMITIDOS = [
                "Aguardando Aprovação",
                "Aprovado",
                "Recusado",
                "Aprovado Parcialmente",
            ];
            if (!STATUS_PERMITIDOS.includes(novoStatus)) {
                return res.status(400).json({ erro: "Status inválido." });
            }

            const pacote = await PacoteModel.findOneAndUpdate(
                { pacoteId: Number(pacoteIdParam) },
                { status: novoStatus },
                { new: true }
            );
            if (!pacote) {
                return res.status(404).json({ erro: "Pacote não encontrado." });
            }

            const STATUS_NOTIFICAR = ["Aprovado", "Recusado", "Aprovado Parcialmente"];
            if (STATUS_NOTIFICAR.includes(pacote.status)) {
                const ProjetoModel = require("../models/ProjetoModel").default;
                const projeto = await ProjetoModel.findOne({ projetoId: pacote.projetoId });
                const nomeProjeto = projeto ? projeto.nome : "Projeto desconhecido";

                await NotificacaoModel.create({
                    userId: pacote.userId,
                    pacoteId: pacote._id,
                    title: `Status do pacote ${pacote.nome} atualizado!`,
                    body: `O pacote ${pacote.nome} do projeto ${nomeProjeto} foi ${pacote.status.toLowerCase()}.`,
                    date: new Date()
                });
            }

            return res.status(200).json(pacote);

        } catch (error) {
            console.error("Erro ao atualizar status do pacote:", error);
            return res
                .status(500)
                .json({ erro: "Erro interno ao atualizar status do pacote." });
        }
    }

    // excluir pacote 
    async delete(req: Request, res: Response) {
        try {
            const pacoteId = Number(req.params.pacoteId);

            const pacote = await PacoteModel.findOne({ pacoteId });

            if (!pacote) {
            return res.status(404).json({ erro: 'Pacote não encontrado' });
            }

            if (pacote.status !== 'Rascunho') {
            return res.status(400).json({ erro: 'Somente pacotes com status "Rascunho" podem ser excluídos' });
            }

            if (pacote.despesas && pacote.despesas.length > 0) {
                return res.status(400).json({ erro: 'Não é possível excluir um pacote que contém despesas.' });
            }

            await PacoteModel.deleteOne({ pacoteId });

            return res.status(200).json({ mensagem: 'Pacote excluído com sucesso' });
        } catch (error) {
            console.error("Erro ao excluir pacote:", error);
            return res.status(500).json({ erro: 'Erro ao excluir pacote', detalhe: error });
        }
    }

    // editar pacote
    async update(req: Request, res: Response) {
        try {
            const pacoteId = Number(req.params.pacoteId);
            const { nome } = req.body;

            if (!nome) {
                return res.status(400).json({ erro: 'Nome é obrigatório' });
            }

            console.log('Buscando pacoteId:', pacoteId);
            const pacote = await PacoteModel.findOne({ pacoteId });
            console.log('Pacote encontrado:', pacote);

            if (!pacote) {
                return res.status(404).json({ erro: 'Pacote não encontrado' });
            }

            pacote.nome = nome;
            await pacote.save();

            res.status(200).json({ mensagem: 'Nome atualizado com sucesso', pacote });
        } catch (error) {
            console.error("Erro ao atualizar nome do pacote:", error);
            res.status(500).json({ erro: 'Erro ao atualizar nome do pacote', detalhe: error });
        }
    }

}