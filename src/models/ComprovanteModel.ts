// src/models/ComprovanteModel.ts
import pool from '../config/database';
import { ResultSetHeader } from 'mysql2';

export default class ComprovanteModel {

static async create(
    foto: Buffer,
    tipo: string,
    tipoId: number,
    mimeType: string
  ) {
    const hex = foto.toString('hex');
    await pool.query<ResultSetHeader>(
      `INSERT INTO comprovantes (foto, tipo, tipoId, mimeType)
       VALUES (UNHEX(?), ?, ?, ?)`,
      [hex, tipo, tipoId, mimeType]
    );
  }
}
