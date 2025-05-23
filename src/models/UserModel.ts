import mongoose, { connection } from "mongoose";

const AutoIncrement = require('mongoose-sequence')(mongoose);

const userSchema = new mongoose.Schema(
    {   
        userId: {type: Number, unique: true},
        name: {type: String, required: true, unique: true},
        email: {type: String, required: true},
        password: {type: String, required: true},
        twoFactorEnabled: {
            type: Boolean,
            default: false,
        }
    },
    {
        timestamps: true, 
    }
);

userSchema.plugin(AutoIncrement, {inc_field: 'userId'});

const UserModel = mongoose.model('User', userSchema);

export default UserModel;