import mongoose from "mongoose";

const AutoIncrement = require("mongoose-sequence")(mongoose);

const CategoriaSchema = new mongoose.Schema({
  categoriaId: { type: Number, unique: true },
  nome: { type: String, required: true, unique: true },
});

CategoriaSchema.plugin(AutoIncrement, { inc_field: "categoriaId" });

const CategoriaModel = mongoose.model("Categoria", CategoriaSchema);

export default CategoriaModel;
