import express, { Request, Response } from "express";
import deserializeUser from "../middleware/deserializeUser";
import routes from "../routes";
import cors from "cors";
import config from "config";
import cookieParser from "cookie-parser";
import { startMetricsServer, restResponseTimeHistogram } from "./metrics";
import responseTime from "response-time";

const createServer = () => {
  const app = express();
  app.use(express.json());
  app.use(cookieParser());
  app.use(cors({ origin: config.get("origin"), credentials: true }));
  app.use(deserializeUser);

  app.use(
    responseTime((req: Request, res: Response, time: number) => {
      if (req?.route?.path) {
        restResponseTimeHistogram.observe(
          {
            method: req.method,
            route: req.route.path,
            status_code: res.statusCode,
          },
          time * 1000
        ); //seconds
      }
    })
  );
  routes(app);
  startMetricsServer();
  return app;
};

export default createServer;
