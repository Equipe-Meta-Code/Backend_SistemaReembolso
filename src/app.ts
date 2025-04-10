import express from 'express';
import { router } from './routes/routes';
import cors from 'cors';
import errorHandler from './middlewares/errorHandler';

const app = express();

app.use(express.json());

app.use(cors({
    origin: '*', // Aceita qualquer origem (não recomendado para produção)
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos permitidos
    allowedHeaders: ['Content-Type', 'Authorization'], // Cabeçalhos permitidos
}));

app.use(router);

//Error Handler
app.use(errorHandler);

export default app;
