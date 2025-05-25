import { Request, Response } from "express";
import NotificacaoModel, { INotificacao } from "../models/NotificacaoModel";

export default class NotificacaoController {
  async create(req: Request, res: Response) {
    const { userId, title, body, date, read = false, despesaId } = req.body;

    try {
      const notificacao = await NotificacaoModel.create({
        userId,
        title,
        body,
        date: date ? new Date(date) : undefined,
        read,
        despesaId,
      } as Partial<INotificacao>);
      return res.status(201).json({ message: "Notificação criada com sucesso", alertType: "success", notificacao });
    } catch (error) {
      return res.status(500).json({ error: "Erro ao criar notificação", details: error, alertType: "error" });
    }
  }

  async getAll(req: Request, res: Response) {
    try {
      const userId = Number(req.query.userId);
      const filter = isNaN(userId) ? {} : { userId };
      const notificacoes = await NotificacaoModel.find(filter).sort({ date: -1 });
      return res.status(200).json({ message: "Notificações carregadas com sucesso", alertType: "success", notificacoes });
    } catch (error) {
      return res.status(500).json({ error: "Erro ao buscar notificações", details: error, alertType: "error" });
    }
  }

  async update(req: Request, res: Response) {
    const { id } = req.params;
    const updates: Partial<INotificacao> = {};

    if (req.body.read !== undefined) updates.read = req.body.read;
    if (req.body.despesaId !== undefined) updates.despesaId = req.body.despesaId;

    try {
      const updated = await NotificacaoModel.findByIdAndUpdate(id, updates, { new: true });
      if (!updated) {
        return res.status(404).json({ error: "Notificação não encontrada", alertType: "error" });
      }
      return res.status(200).json({ message: "Notificação atualizada com sucesso", alertType: "success", updated });
    } catch (error) {
      return res.status(500).json({ error: "Erro ao atualizar notificação", details: error, alertType: "error" });
    }
  }
}