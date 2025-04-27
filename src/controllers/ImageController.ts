import { Request, Response } from 'express';
import pool from '../config/database';
import { RowDataPacket } from 'mysql2';
import ImageModel from '../models/ImageModel';

interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

interface ImageRow extends RowDataPacket {
  foto: Buffer;
  updatedAt?: Date;
}

export default class ImageController {
  static async salvarImagem(req: MulterRequest, res: Response) {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Sem arquivo.' });
    }
    const { tipo, tipoId } = req.body;
    if (!tipo || !tipoId) {
      return res.status(400).json({ success: false, message: 'Dados incompletos.' });
    }

    try {
      await ImageModel.upsert(req.file.buffer, tipo, Number(tipoId));
      return res.json({
        success: true,
        imagemUrl: `http://localhost:3333/imagens/${encodeURIComponent(tipo)}/${tipoId}`
      });
    } catch (err) {
      console.error('[BACK] Erro no banco:', err);
      return res.status(500).json({ success: false, message: 'Erro interno.' });
    }
  }
  
}
