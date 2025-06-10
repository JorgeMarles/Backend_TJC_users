import express from "express";
import "reflect-metadata";
import { PORT, URL_FRONTEND } from "./config";
import { AppDataSource } from "./database";
import bodyParser from "body-parser";
import cors from "cors";
import { userRouter } from "./routers/UserRouter";
import { sessionRouter } from "./routers/SessionRouter";
import { connectRabbitMQ } from "./services/RabbitMQ";
import { registerService } from "./services/Consul";

const app = express();

app.use(
  cors({
    origin: URL_FRONTEND,
  })
);

app.use(bodyParser.json());

app.use((req, res, next) => {
  console.log("Middleware");
  next();
});

app.use("/user", userRouter);
app.use("/session", sessionRouter);

const run = async () => {
  try {
    await AppDataSource.initialize();
  } catch (e: unknown) {
    if (e instanceof Error) {
      console.log(e.message);
    } else console.log("Error during Data Source initialization");
  }

  try {
    await connectRabbitMQ();
  } catch (e: unknown) {
    if (e instanceof Error) {
      console.error(e.message);
    } else console.error("Error connecting to RabbitMQ");
  }

  app.get("/health", (req: express.Request, res: express.Response) => {
    res.status(200).send("OK");
  });

  app.listen(PORT, async () => {
    console.log(`Listening in port ${PORT}`);

    await registerService();
  });
};

run();
