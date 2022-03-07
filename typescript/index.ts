import * as fs from "fs";

export const env = JSON.parse(fs.readFileSync(__dirname + "/" + (process.env.ENV_FILE || "prod") + ".json", "utf8"));

import * as express from 'express';
import { createServer } from 'http';
import * as login from './login';
import * as geo from "./geo";
import * as post from "./post";
import cookieSession = require('cookie-session');
import * as multer from "multer";

const upload = multer( { dest: "files/" } );

const app = express();
app.use(express.json());
// app.use(cors());
const server = createServer(app);

server.listen(env.port, env.ip, () => {

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
app.post("/post/remove", express.json(), login.verify, post.remove);
app.get("/post/me", login.verify, post.getMyPosts);

app.get("/ihelp", post.getIHelp);
app.get("/helpme", post.getHelpMe);

app.post("/image/upload", login.verify, upload.single("image"), post.upload);
app.get(/\/image\/.{0,}/, post.image);

app.get("/login/active", login.verify, login.getUser);

app.get("/bot/name", (req, res) => { res.send(env.botname) });
