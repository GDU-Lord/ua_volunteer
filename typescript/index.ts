import * as express from 'express';
import { createServer } from 'http';
import * as login from './login';
import * as geo from "./geo";
import * as post from "./post";
import * as telegramWebhook from "./telegram-weebhook";
import cookieSession = require('cookie-session');
import {BOT_API_TOKEN} from "./telegram-weebhook";
import * as multer from "multer";
import * as cors from "cors";

const upload = multer( { dest: "files/" } );

const app = express();
app.use(express.json());
app.use(cors());
const server = createServer(app);

server.listen(80, "localhost", () => {

    console.log("Сервер працює!");

});

app.use(cookieSession({

    name: "session",
    keys: ["glory to ukraine"]

}));

app.use("/", express.static("client"));

app.post("/signup", express.json(), login.signup);
app.get("/signup/verified", login.isVerifiedSignup);

app.post("/login", express.json(), login.login);
app.get("/login/verified", login.isVerifiedLogin);

app.post("/logout", express.json(), login.logout);

app.get("/cities", geo.cities);
app.post("/post/create", express.json(), login.verify, post.create);
app.post("/post/update", express.json(), login.verify, post.update);
app.get("/post/me", login.verify, post.getMyPosts);

app.get("/ihelp", post.getIHelp);
app.get("/helpme", post.getHelpMe);

app.post("/image/upload", login.verify, upload.single("image"), post.upload);
app.get(/\/image\/.{0,}/, post.image);

app.get("/login/active", login.verify, login.getUser);

// webhook
