"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const fs = require("fs");
exports.env = JSON.parse(fs.readFileSync(__dirname + "/" + (process.env.ENV_FILE || "dev") + ".json", "utf8"));
console.log(process.env.ENV_FILE || "dev");
const express = require("express");
const http_1 = require("http");
const login = require("./login");
const geo = require("./geo");
const post = require("./post");
const cookieSession = require("cookie-session");
const multer = require("multer");
const upload = multer({ dest: "files/" });
const app = express();
app.use(express.json());
// app.use(cors());
const server = (0, http_1.createServer)(app);
server.listen(exports.env.port, exports.env.ip, () => {
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
app.get("/bot/name", (req, res) => { res.send(exports.env.botname); });
app.get("/admin", login.verify, login.isAdmin);
app.post("/post/admin/remove", express.json(), login.verify, login.verifyAdmin, login.remove);
app.post("/ban", express.json(), login.verify, login.verifyAdmin, login.ban);
