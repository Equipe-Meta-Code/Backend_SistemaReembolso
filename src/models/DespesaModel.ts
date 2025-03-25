import mongoose from "mongoose";

const DespesaSchema = new mongoose.Schema({
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
  }
});

const DespesaModel = mongoose.model('Despesa', DespesaSchema);

export default DespesaModel;
