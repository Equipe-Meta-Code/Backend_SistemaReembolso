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


    await pool.query<ResultSetHeader>(
      'INSERT INTO images (foto, tipo, tipoId) VALUES (UNHEX(?), ?, ?)',
      [hex, tipo, tipoId]
    );
  }
}

export default ImageModel;
