import * as express from 'express';
import { createServer } from 'http';
import * as login from './login';
import * as geo from "./geo";
import * as post from "./post";
import * as telegramWebhook from "./telegram-weebhook";
import cookieSession = require('cookie-session');
import {BOT_API_TOKEN} from "./telegram-weebhook";

const app = express();
app.use(express.json());
const server = createServer(app);

server.listen(80, "localhost", () => {

    console.log("Сервер працює!");

});

app.use(cookieSession({

    name: "session",
    keys: ["rudolf steiner"]

}));

app.use("/", express.static("client"));

app.post("/signup", express.json(), login.signup);
app.get("/signup/verified", login.isVerifiedSignup);

app.post("/login", express.json(), login.login);
app.get("/login/verified", login.isVerifiedLogin);

app.post("/logout", express.json(), login.logout);

app.get("/cities", login.verify, geo.cities);
app.post("/post/create", express.json(), login.verify, post.create);
app.post("/post/update", express.json(), login.verify, post.update);

// webhook
app.post(`/telegram/update/${BOT_API_TOKEN.replace(/:/g, "_")}`, express.json(), telegramWebhook.receive);
