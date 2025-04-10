import DespesaController from "../controllers/DespesaController";
import UserController from "../controllers/UserController"; 
import isAuthenticated from "../middlewares/isAuth"; 
import ProjetoController from "../controllers/ProjetoController";
import DepartamentoController from "../controllers/DepartamentoController";

const express = require('express')
const router = express.Router()

const despesaController = new DespesaController()
const projetoController = new ProjetoController();
const departamentoController = new DepartamentoController();

router.post("/despesa", despesaController.create);
router.get("/despesa", despesaController.getAll);
router.put("/despesa/:id", despesaController.aprovarDespesas);


router.post("/projeto", projetoController.create);
router.post("/departamentos", departamentoController.create);
// Rotas do Usuário
router.post("/register", UserController.register);
router.post("/login", UserController.login);
router.get("/profile", isAuthenticated, UserController.profile);
router.get("/userList", UserController.userList);

export { router };