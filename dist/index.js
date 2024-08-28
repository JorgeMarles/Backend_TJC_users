"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
app.use((req, res, next) => {
    console.log("Middleware One");
    next();
});
app.use((req, res, next) => {
    console.log("Middleware Two");
    res.send("<h1>Response of the second middleware</h1>");
});
app.listen(3000, () => console.log("Listening in port 3000"));
