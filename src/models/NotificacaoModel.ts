import mongoose from "mongoose";
const AutoIncrement = require("mongoose-sequence")(mongoose);

export interface INotificacao extends mongoose.Document {
  notificacaoId: number;
  userId: number;
  title: string;
  body: string;
  date: Date;
  read: boolean;
  pacoteId: mongoose.Types.ObjectId;  
}

const NotificacaoSchema = new mongoose.Schema<INotificacao>({
  notificacaoId:    { type: Number, unique: true },
  userId:           { type: Number, required: true },
  title:            { type: String, required: true },
  body:             { type: String, required: true },
  date:             { type: Date,   default: Date.now },
  read:             { type: Boolean, default: false },
  pacoteId:         { type: mongoose.Schema.Types.ObjectId, ref: 'Pacote', required: true },
});

NotificacaoSchema.plugin(AutoIncrement, { inc_field: "notificacaoId" });

const NotificacaoModel = mongoose.model<INotificacao>("Notificacao", NotificacaoSchema);
export default NotificacaoModel;