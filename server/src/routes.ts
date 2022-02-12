import { createProductHandler, updateProductHandler, getProductHandler, deleteProductHandler } from './controller/product.controller';
import { createProductSchema, updateProductSchema, getProductSchema, deleteProductSchema } from './schema/product.schema';
import { createSessionSchema } from "./schema/session.schema";
import {
  createUserSessionHandler,
  getUserSessionHandler,
  deleteSessionHandler,
} from "./controller/session.controller";
import { createUserSchema } from "./schema/user.schema";
import { Express, Request, Response } from "express";
import { createUserHandler, getCurrentUser } from "./controller/user.controller";
import validateResource from "./middleware/validateResource";
import requireUser from "./middleware/requireUser";

const routes = (app: Express) => {
  app.get("/healthcheck", (req: Request, res: Response) => res.sendStatus(200));
  
  app.get("/api/me", requireUser, getCurrentUser);

  app.post("/api/users", validateResource(createUserSchema), createUserHandler);

  app.post(
    "/api/sessions",
    validateResource(createSessionSchema),
    createUserSessionHandler
  );

  app.get("/api/sessions", requireUser, getUserSessionHandler);

  app.delete("/api/sessions", requireUser, deleteSessionHandler);

  app.post("/api/products", [requireUser, validateResource(createProductSchema)], createProductHandler);

  app.put("/api/products/:productId", [requireUser, validateResource(updateProductSchema)], updateProductHandler);

  app.get("/api/products/:productId", validateResource(getProductSchema), getProductHandler);

  app.delete("/api/products/:productId", [requireUser, validateResource(deleteProductSchema)], deleteProductHandler);
  
};

export default routes;
