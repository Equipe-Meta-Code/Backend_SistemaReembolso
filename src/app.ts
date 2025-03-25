import express from 'express';
import { router } from './routes/routes';
import cors from 'cors';

const app = express();

app.use(express.json());
app.use(router);
app.use(cors({
    origin: '*', // Aceita qualquer origem (não recomendado para produção)
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos permitidos
    allowedHeaders: ['Content-Type', 'Authorization'], // Cabeçalhos permitidos
  }));

export default app;
