import * as express from 'express';
import { createServer } from 'http';
import * as login from './login';
import * as telegram from './telegram';

const app = express();
const server = createServer(app);

server.listen(80, "localhost", () => {

    console.log("Сервер працює!");

});

app.use("/", express.static("client"));

app.post("/signup", express.json(), login.signup);
app.post("/botAccept", express.json(), telegram.receive);
app.get("/isVerifiedSignup", login.isVerifiedSignup);

app.post("/login", express.json(), login.login);
app.get("/isVerifiedLogin", login.isVerifiedLogin);