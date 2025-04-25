import DespesaController from "../controllers/DespesaController";
import UserController from "../controllers/UserController"; 
import isAuthenticated from "../middlewares/isAuth"; 
import ProjetoController from "../controllers/ProjetoController";
import DepartamentoController from "../controllers/DepartamentoController";
import CategoriaController from "../controllers/CategoriaController";
import PacoteController from "../controllers/PacoteController";

const express = require('express');
const router = express.Router();

const despesaController = new DespesaController();
const projetoController = new ProjetoController();
const departamentoController = new DepartamentoController();
const categoriaController = new CategoriaController();
const pacoteController = new PacoteController();

// Rotas de pacotes
router.post('/pacote', pacoteController.create);
router.post('/pacotes/:pacoteId/enviar', pacoteController.enviarPacote);
router.get("/pacote", pacoteController.getAll);

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
router.get("/profile", isAuthenticated, UserController.profile);
router.get("/userList", UserController.userList);

export { router };