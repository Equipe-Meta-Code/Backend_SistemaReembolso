import mongoose, { connection } from "mongoose";

const AutoIncrement = require('mongoose-sequence')(mongoose);

const userSchema = new mongoose.Schema(
    {   
        userId: {type: Number, unique: true},
        name: {type: String, required: true, unique: true},
        email: {type: String, required: true},
        password: {type: String, required: true},
        role: {
            type: String,
            enum: ['usuario', 'gerente', 'admin'],
            default: 'usuario',
        },
    },
    {
        timestamps: true, 
    }
);

userSchema.plugin(AutoIncrement, {inc_field: 'userId'});

const UserModel = mongoose.model('User', userSchema);

export default UserModel;