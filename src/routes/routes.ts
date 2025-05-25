import multer from 'multer';
import DespesaController from "../controllers/DespesaController";
import UserController from "../controllers/UserController"; 
import isAuthenticated from "../middlewares/isAuth"; 
import ProjetoController from "../controllers/ProjetoController";
import DepartamentoController from "../controllers/DepartamentoController";
import CategoriaController from "../controllers/CategoriaController";
import PacoteController from "../controllers/PacoteController";
import ImageController from "../controllers/ImageController";
import NotificacaoController from '../controllers/NotificacaoController';
import { RowDataPacket } from 'mysql2';
const express = require('express');
import { Request, Response } from 'express';
import ComprovanteController from '../controllers/ComprovanteController';

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // até 10MB
  fileFilter: (_req, file, cb) => {
    if (
      file.mimetype.startsWith('image/') ||
      file.mimetype === 'application/pdf'
    ) {
      cb(null, true);
    } else {
      cb(new Error('Somente imagens (jpeg/png) e PDF são permitidos'));
    }
  }
});

const despesaController = new DespesaController();
const projetoController = new ProjetoController();
const departamentoController = new DepartamentoController();
const categoriaController = new CategoriaController();
const pacoteController = new PacoteController();
const notificacaoController = new NotificacaoController();

interface ImageRow extends RowDataPacket {
    foto: Buffer;
}

router.post('/upload', upload.single('file'), ImageController.salvarImagem);

// Rotas de upload de imagem de perfil
router.post('/imagem', upload.single('profileImage'), ImageController.salvarImagem);
router.get('/imagens/:id', ImageController.buscarPorId);
router.get('/imagens/:tipo/:tipoId', ImageController.buscarPorTipoId);

// Rotas de upload de comprovantes
router.post('/uploadcomprovante', upload.single('receipt'), ComprovanteController.salvarComprovante);
router.get('/comprovantes/:tipo/:tipoId', ComprovanteController.buscarPorTipoId);
router.get('/comprovantes/:id(\\d+)', ComprovanteController.buscarPorId);

// Rotas de pacotes
router.post('/pacote', pacoteController.create);
router.get("/pacote", pacoteController.getAll);
router.post('/pacotes/:pacoteId/enviar', pacoteController.enviarPacote);
router.get('/pacotes/:pacoteId/detalhes', pacoteController.getPacoteComDespesas);
router.put('/pacote/:pacoteId/status', pacoteController.updateStatus);

// Rotas de Despesas
router.post("/despesa", despesaController.create);
router.get("/despesa", despesaController.getAll);
router.put("/despesa/:id", despesaController.aprovarDespesas);
router.post('/despesas/by-ids', despesaController.getByIds);

// Rotas de Projetos
router.post("/projeto", projetoController.create);
router.get("/projeto", projetoController.getAll);
router.get('/projeto/:projetoId', projetoController.getById);

// Rotas de departamentos
router.post("/departamentos", departamentoController.create);
router.get("/departamentos", departamentoController.getAll);
router.put('/departamentos/:id', departamentoController.update);
router.delete('/departamentos/:id', departamentoController.delete);

// Rotas de Categorias
router.post("/categorias", categoriaController.create);
router.get("/categorias", categoriaController.getAll);
router.put('/categorias/:id', categoriaController.update);
router.delete('/categorias/:id', categoriaController.delete);

// Rotas do Usuário
router.post("/register", UserController.register);
router.post("/login", UserController.login);
router.post("/verify-2fa", UserController.verify2FA);
router.post("/resend-code", UserController.resendCode);
router.get("/profile", isAuthenticated, UserController.profile);
router.get("/userList", UserController.userList);

// Rotas de Notificações
router.post('/notifications', notificacaoController.create);
router.get('/notifications', notificacaoController.getAll);
router.patch('/notifications/:id', notificacaoController.update);

export { router };