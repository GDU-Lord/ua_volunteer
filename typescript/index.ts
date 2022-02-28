import * as express from 'express';
import { createServer } from 'http';
import * as login from './login';
import * as telegram from './telegram';
import * as geo from "./geo";
import * as post from "./post";
import * as telegramWebhook from "./telegram-weebhook";
import cookieSession = require('cookie-session');
import {Telegraf, Telegram} from "telegraf";
import {BOT_API_TOKEN} from "./telegram-weebhook";

const app = express();
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
app.get("/isverifiedsignup", login.isVerifiedSignup);

app.post("/login", express.json(), login.login);
app.get("/isverifiedlogin", login.isVerifiedLogin);

app.post("/botaccept", express.json(), telegram.receive);

app.get("/cities", login.verify, geo.cities);

app.post("/post", login.verify, post.create);

// webhook
app.post(`/telegram/update/${BOT_API_TOKEN.replace(/:/g, "_")}`, telegramWebhook.receive);
