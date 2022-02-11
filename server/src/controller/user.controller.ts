import { CreateUserInput } from '../schema/user.schema';
import { Request, Response } from "express";
import logger from "../utils/logger";
import {createUser} from "../service/user.service";

export const createUserHandler = async (req: Request<{}, {}, CreateUserInput["body"]>, res: Response) => {
  try {
    const user = await createUser(req.body);
    return res.send(user);
  } catch (e: any) {
    logger.error(e);
    return res.status(409).send(e.message); // 409 - conflict
  }
};

