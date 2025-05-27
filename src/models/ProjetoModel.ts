import mongoose from "mongoose";

const AutoIncrement = require("mongoose-sequence")(mongoose);

const ProjetoSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  projetoId: { type: Number, unique: true },
  descricao: { type: String, required: true },

  categorias: [{
    categoriaId: { type: String, required: true },
    nome: { type: String, required: true },
    valor_maximo: { type: Number, required: true }
  }],

  departamentos: [{
    departamentoId: { type: String, required: true },
    nome: { type: String, required: true }
  }],

  funcionarios: [{
    userId: { type: Number, required: true },
    name: { type: String, required: true }
  }],

  status: {
    type: String,
    enum: ['ativo', 'encerrado'],
    default: 'ativo',
  },
  
}, { timestamps: true });

ProjetoSchema.plugin(AutoIncrement, { inc_field: "projetoId" });

const ProjetoModel = mongoose.model("Projeto", ProjetoSchema);
export default ProjetoModel;
