import DespesaController from "../controllers/DespesaController";

const express = require('express')
const router = express.Router()

const controller = new DespesaController()

router.post("/despesa", controller.create);

export { router };