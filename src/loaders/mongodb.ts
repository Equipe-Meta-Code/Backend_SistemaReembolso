import mongoose from "mongoose";

async function startDb(){
    await mongoose.connect('mongodb+srv://myAtlasDBUser:root@myatlasclusteredu.qsevg.mongodb.net/?retryWrites=true&w=majority&appName=myAtlasClusterEDU');
}

export default startDb;