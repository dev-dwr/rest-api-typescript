import { CreateUserInput } from './../schema/user.schema';
import { Request, Response } from "express";
import logger from "../utils/logger";
import {omit} from "lodash";
import {createUser} from "../service/user.service";

export const createUserHanlder = async (req: Request<{}, {}, CreateUserInput["body"]>, res: Response) => {
  try {
    const user = await createUser(req.body);
    return res.send(omit(user.toJSON(), "password"));
  } catch (e: any) {
    logger.error(e);
    return res.status(409).send(e.message); // 409 - conflict
  }
};

