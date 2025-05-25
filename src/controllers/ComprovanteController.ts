import { Request, Response } from 'express';
import pool from '../config/database';
import { RowDataPacket } from 'mysql2';
import ComprovanteModel from '../models/ComprovanteModel';

interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

interface ComprovanteRow extends RowDataPacket {
  foto: Buffer;
  mimeType: string;
  updatedAt?: Date;
}

export default class ComprovanteController {

  static async salvarComprovante(req: MulterRequest, res: Response) {

    console.log('req.file=', req.file);
    console.log('req.body=', req.body);

    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Sem arquivo.' });
    }

    const { tipo, tipoId } = req.body;
    if (!tipo || !tipoId) {
      return res.status(400).json({ success: false, message: 'Dados incompletos.' });
    }

    try {
      await ComprovanteModel.create(
        req.file.buffer,
        tipo,
        Number(tipoId),
        req.file.mimetype
      );
      
      return res.json({
        success: true,
        imagemUrl: `http://localhost:3333/comprovantes/${encodeURIComponent(tipo)}/${tipoId}`
      });

    } catch (err) {
      console.error('[BACK] Erro no banco:', err);
      return res.status(500).json({ success: false, message: 'Erro interno.' });
    }
  }

  // controllers/ComprovanteController.ts
  static async buscarPorId(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const [rows] = await pool.query<ComprovanteRow[]>(
        'SELECT foto, mimeType, updatedAt FROM comprovantes WHERE id = ?',
        [id]
      );

      if (rows.length === 0) {
        return res.status(404).send('Arquivo não encontrado');
      }

      const { foto, mimeType, updatedAt } = rows[0];
      res
        .setHeader('Last-Modified', new Date(updatedAt!).toUTCString())
        .setHeader('Content-Type', mimeType);

      return res.send(foto);
    } catch (err) {
      console.error('[BACK] Erro ao buscar arquivo por id:', err);
      return res.status(500).send('Erro ao buscar arquivo');
    }
  }



  static async buscarPorTipoId(req: Request, res: Response) {
    try {
      const { tipo, tipoId } = req.params;
      const [rows] = await pool.query<ComprovanteRow[]>(
        'SELECT foto, mimeType, updatedAt FROM comprovantes WHERE tipo = ? AND tipoId = ? LIMIT 1',
        [tipo, Number(tipoId)]
      );

      if (rows.length === 0) {
        return res.status(404).send('Arquivo não encontrado');
      }

      const { foto, mimeType, updatedAt } = rows[0];
      res
        .setHeader('Last-Modified', new Date(updatedAt!).toUTCString())
        .setHeader('Content-Type', mimeType);

      return res.send(foto);
      
    } catch (err) {
      console.error('[BACK] Erro ao buscar arquivo:', err);
      return res.status(500).send('Erro ao buscar arquivo');
    }
  }
  

}
