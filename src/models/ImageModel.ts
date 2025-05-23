// src/models/ImageModel.ts
import pool from '../config/database';
import { ResultSetHeader } from 'mysql2';

class ImageModel {
  static async upsert(foto: Buffer, tipo: string, tipoId: number, mimeType: string) {
    const hex = foto.toString('hex');

    // Tenta dar UPDATE
    const [upd]: any = await pool.query<ResultSetHeader>(
      `UPDATE images 
         SET foto = UNHEX(?), mimeType = ?, updatedAt = NOW() 
       WHERE tipo = ? AND tipoId = ?`,
      [hex, mimeType, tipo, tipoId]
    );

    if (upd.affectedRows > 0) return;

    // Senão, INSERT
    await pool.query<ResultSetHeader>(
      `INSERT INTO images (foto, tipo, tipoId, mimeType) 
       VALUES (UNHEX(?), ?, ?, ?)`,
      [hex, tipo, tipoId, mimeType]
    );
  }
}

export default ImageModel;
