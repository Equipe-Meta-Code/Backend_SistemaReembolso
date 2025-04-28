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
  

  static async buscarPorId(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const [rows] = await pool.query<ImageRow[]>(
        'SELECT foto FROM images WHERE id = ?',
        [id]
      );

      if (rows.length === 0) {
        return res.status(404).send('Imagem não encontrada');
      }

      res
        .setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
        .setHeader('Pragma', 'no-cache')
        .setHeader('Expires', '0')
        .setHeader('Content-Type', 'image/jpeg');

      return res.send(rows[0].foto);
    } catch (err) {
      console.error('[BACK] Erro ao buscar imagem por id:', err);
      return res.status(500).send('Erro ao buscar imagem');
    }
  }


  static async buscarPorTipoId(req: Request, res: Response) {
    try {
      const { tipo, tipoId } = req.params;
      const [rows] = await pool.query<ImageRow[]>(
        'SELECT foto, updatedAt FROM images WHERE tipo = ? AND tipoId = ? LIMIT 1',
        [tipo, Number(tipoId)]
      );

      if (rows.length === 0) {
        return res.status(404).send('Imagem não encontrada');
      }

      const { foto, updatedAt } = rows[0];
      res
        .setHeader('Last-Modified', new Date(updatedAt!).toUTCString())
        .setHeader('Content-Type', 'image/jpeg');

      return res.send(foto);
    } catch (err) {
      console.error('[BACK] Erro ao buscar imagem por tipo/tipoId:', err);
      return res.status(500).send('Erro ao buscar imagem');
    }
  }
}
