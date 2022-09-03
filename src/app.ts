import express, { json } from "express";
import cors from "cors";
import dotenv from "dotenv";
import "express-async-errors";
import router from "./routes/router";
import errorHandler from "./middlewares/errorMiddleware";

//CONFIGS
dotenv.config();
const app = express();
app.use([cors(), json()]);

app.use(router);
app.use(errorHandler);

//SERVER
app.listen(process.env.PORT || 4000, () =>
  console.log(`Server listening on port ${process.env.PORT}`)
);
