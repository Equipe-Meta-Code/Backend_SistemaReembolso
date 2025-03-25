import startDb from "./mongodb";

class Loaders {
    start(){
        startDb();
    }
}

export default new Loaders();