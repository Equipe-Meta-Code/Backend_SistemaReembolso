import mongoose from "mongoose";
const AutoIncrement = require('mongoose-sequence')(mongoose);

const DespesaSchema = new mongoose.Schema({
  projetoId: {
    type: Number,
    required: true
  },
  userId: {
    type: Number,
    required: true
  },
  categoria: {
    type: String,
    required: true
  },
  data: {
    type: Date,
    required: true,
    default: Date.now
  },
  valor_gasto: {
    type: Number,
    required: true
  },
  descricao: {
    type: String,
    required: false
  },
  aprovacao: {
    type: String,
    required: true
  }
});

const DespesaModel = mongoose.model('Despesa', DespesaSchema);

export default DespesaModel;
