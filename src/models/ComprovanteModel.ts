import pool from '../config/database';
import { ResultSetHeader } from 'mysql2';

class ComprovanteModel {
  static async upsert(foto: Buffer, tipo: string, tipoId: number, mimeType: string) {
    const hex = foto.toString('hex');


    const [upd]: any = await pool.query<ResultSetHeader>(
      `UPDATE comprovantes 
         SET foto = UNHEX(?), mimeType = ?, updatedAt = NOW() 
       WHERE tipo = ? AND tipoId = ?`,
      [hex, mimeType, tipo, tipoId]
    );

    if (upd.affectedRows > 0) return;


    await pool.query<ResultSetHeader>(
      `INSERT INTO comprovantes (foto, tipo, tipoId, mimeType) 
       VALUES (UNHEX(?), ?, ?, ?)`,
      [hex, tipo, tipoId, mimeType]
    );

  }
}

export default ComprovanteModel;
