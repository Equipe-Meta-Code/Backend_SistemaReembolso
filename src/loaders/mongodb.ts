import mongoose from "mongoose";

async function startDb(){
    await mongoose.connect('mongodb+srv://equipemetacode:admin@cluster0.xyvuq.mongodb.net/');
}

export default startDb;