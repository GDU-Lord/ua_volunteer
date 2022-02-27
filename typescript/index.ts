import * as express from 'express';
import { createServer } from 'http';

const app = express();
const server = createServer(app);

server.listen(80, "localhost", () => {

    console.log("Сервер працює!");

});

app.get("/", (req, res) => {

    res.send("<h1>Слава Україні!</h1>");

});