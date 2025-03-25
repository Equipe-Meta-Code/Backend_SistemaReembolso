import app from "./app";
import Loaders from "./loaders";

Loaders.start();

app.listen(3333, () => {
    console.log("Server started on port 3333");
});