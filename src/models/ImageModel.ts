// src/models/ImageModel.ts
import pool from '../config/database';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

export interface ImageRecord {
  id: number;
  tipo: string;
  tipoId: number;
  createdAt: Date;
  updatedAt: Date;
}

class ImageModel {
  static async upsert(foto: Buffer, tipo: string, tipoId: number) {
    const hex = foto.toString('hex');

    const [upd]: any = await pool.query<ResultSetHeader>(
      'UPDATE images SET foto = UNHEX(?), updatedAt = NOW() WHERE tipo = ? AND tipoId = ?',
      [hex, tipo, tipoId]
    );
    
    if (upd.affectedRows > 0) {
      return;
    }

    await pool.query<ResultSetHeader>(
      'INSERT INTO images (foto, tipo, tipoId) VALUES (UNHEX(?), ?, ?)',
      [hex, tipo, tipoId]
    );
  }
}

export default ImageModel;
