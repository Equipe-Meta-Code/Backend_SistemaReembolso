import mongoose from "mongoose";

const AutoIncrement = require('mongoose-sequence')(mongoose);

const DepartamentoSchema = new mongoose.Schema({
    departamentoId: {type: Number, unique: true},
    nome: { type: String, required: true, unique: true },
});

DepartamentoSchema.plugin(AutoIncrement, {inc_field: 'departamentoId'});

const DepartamentoModel = mongoose.model("Departamento", DepartamentoSchema);

export default DepartamentoModel;
