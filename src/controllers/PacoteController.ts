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

            const pacote = await PacoteModel.create({
                nome,
                projetoId,
                status,
                userId,
                despesas
              });

            res.status(201).json(pacote);
        } catch (error) {
            res.status(500).json({ erro: 'Erro ao criar pacote', detalhe: error });
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
          const { id } = req.params;
          const { status } = req.body;
      
          if (!['Aprovado', 'Recusado'].includes(status)) {
            return res.status(400).json({ erro: 'Status inválido' });
          }
      
          const pacote = await PacoteModel.findOneAndUpdate(
            { pacoteId: Number(id) },
            { status },
            { new: true }
          );
      
          if (!pacote) {
            return res.status(404).json({ erro: 'Pacote não encontrado' });
          }
      
          res.status(200).json(pacote);
        } catch (error) {
          res
            .status(500)
            .json({ erro: 'Erro ao atualizar status do pacote', detalhe: error });
        }
    }

}