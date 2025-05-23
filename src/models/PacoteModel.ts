import mongoose from "mongoose";

const AutoIncrement = require('mongoose-sequence')(mongoose);

const PacoteSchema = new mongoose.Schema({

  pacoteId: { 
    type: Number, 
    unique: true 
  },
  nome: { 
    type: String, 
    required: true 
  },
  
  projetoId: { 
    type: Number, 
    required: true 
  },
  userId: {
    type: Number, 
    required: true
  },

  status: {
    type: String,
    enum: ['Rascunho', 'Aguardando Aprovação', 'Aprovado', 'Recusado', 'Aprovado Parcialmente'],
    default: 'Rascunho',
  },

  despesas: [{ 
    type: Number, 
    ref:'Despesa' 
  }]

  }, {
    timestamps: true,
  }
);

PacoteSchema.plugin(AutoIncrement, {inc_field: 'pacoteId'})

const PacoteModel = mongoose.model('Pacote', PacoteSchema);

export default PacoteModel;