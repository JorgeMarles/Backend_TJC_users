import express from 'express'
import { PORT } from './config'
import { AppDataSource } from './database';
import "reflect-metadata"

import { userRouter } from './routers/userRouter';

const app = express();

app.use((req, res, next) => {
    console.log("Middleware");
    next();
});

app.use("/user", userRouter);

const run = async () => {
    await AppDataSource.initialize()
    app.listen(PORT, () => console.log(`Listening in port ${PORT}`));
};

run();