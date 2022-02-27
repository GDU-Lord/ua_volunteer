import * as express from 'express';
import { createServer } from 'http';
import * as login from './login';

const app = express();
const server = createServer(app);

server.listen(80, "localhost", () => {

    console.log("Сервер працює!");

});

app.use("/", express.static("client"));

app.post("/signup", express.json(), login.signup);
app.get("/isVerified", login.isVerified);