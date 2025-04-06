"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require("reflect-metadata");
const config_1 = require("./config");
const database_1 = require("./database");
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const UserRouter_1 = require("./routers/UserRouter");
const SessionRouter_1 = require("./routers/SessionRouter");
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: config_1.URL_FRONTEND
}));
app.use(body_parser_1.default.json());
app.use((req, res, next) => {
    console.log("Middleware");
    next();
});
app.use("/user", UserRouter_1.userRouter);
app.use("/session", SessionRouter_1.sessionRouter);
const run = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield database_1.AppDataSource.initialize();
    }
    catch (e) {
        if (e instanceof Error) {
            console.log(e.message);
        }
        else
            console.log("Error during Data Source initialization");
    }
    app.listen(config_1.PORT, () => console.log(`Listening in port ${config_1.PORT}`));
});
run();
