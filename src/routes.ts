import { createUserSchema } from './schema/user.schema';
import { Express, Request, Response } from "express";
import { createUserHanlder } from "./controller/user.controller";
import validateResource from "./middleware/validateResource";

const routes = (app: Express) => {
  app.get("/healthcheck", (req: Request, res: Response) => res.sendStatus(200));

  app.post("/api/users", validateResource(createUserSchema), createUserHanlder);
};

export default routes;
